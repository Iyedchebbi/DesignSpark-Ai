import { GoogleGenAI, Modality, Type, GenerateContentResponse } from "@google/genai";
import { BehanceContent } from '../types';

// Lazily initialize the AI client to prevent app crash on start if API key is missing.
let ai: GoogleGenAI | null = null;

const getAiClient = (): GoogleGenAI => {
    if (!process.env.API_KEY) {
        throw new Error("API Key is missing. Please ensure the API_KEY environment variable is set for the application to function.");
    }
    if (!ai) {
        ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    }
    return ai;
};


export const fileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve((reader.result as string).split(',')[1]);
    reader.onerror = (error) => reject(error);
  });
};

export const analyzeDesign = async (imageBase64: string, mimeType: string, language: string): Promise<string> => {
  try {
    const aiClient = getAiClient();
    const languageMap: { [key: string]: string } = {
      en: 'English',
      fr: 'French',
      ar: 'Arabic',
    };
    const targetLanguage = languageMap[language] || 'English';

    const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { text: `You are an expert design critic. Your feedback must be concise, clear, and easy to read. Provide a numbered list of the 3 most important, actionable suggestions for improvement. Keep each point brief. Do not use long paragraphs. Format the response as a valid HTML ordered list (<ol> and <li> tags). The entire response must be in ${targetLanguage}. Here is the design to analyze:` },
                { inlineData: { data: imageBase64, mimeType } }
            ]
        },
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing design:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred while analyzing the design.";
    throw new Error(errorMessage);
  }
};

export const generateImage = async (prompt: string, style?: string): Promise<string> => {
  try {
    const aiClient = getAiClient();
    const fullPrompt = style ? `${style} style, ${prompt}` : prompt;
    const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: fullPrompt }] },
        config: {
            responseModalities: [Modality.IMAGE],
        },
    });

    if (response.promptFeedback?.blockReason) {
        throw new Error(`Request blocked: ${response.promptFeedback.blockReason}. Please adjust your prompt.`);
    }

    const imagePart = response.candidates?.[0]?.content?.parts?.find(p => p.inlineData);
    if (imagePart && imagePart.inlineData) {
        return imagePart.inlineData.data;
    }
    
    throw new Error("No image data found in response.");
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error(`Failed to generate image. ${error instanceof Error ? error.message : ''}`);
  }
};


export const modifyImage = async (prompt: string, imageBase64: string, mimeType: string): Promise<string> => {
    try {
        const aiClient = getAiClient();
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { inlineData: { data: imageBase64, mimeType } },
                    { text: prompt },
                ]
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        if (response.promptFeedback?.blockReason) {
            const blockReason = response.promptFeedback.blockReason;
            console.error(`Image modification blocked due to ${blockReason}`);
            throw new Error(`Request blocked: ${blockReason}. Please adjust your image or prompt.`);
        }

        const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);

        if (imagePart && imagePart.inlineData) {
            return imagePart.inlineData.data;
        }

        const textPart = response.candidates?.[0]?.content?.parts?.find(part => part.text);
        if(textPart && textPart.text) {
            console.error("API returned a text response instead of an image:", textPart.text);
            throw new Error(`Failed to modify image. The model responded with: ${textPart.text}`);
        }

        console.error("No image data found in response. Full response:", JSON.stringify(response, null, 2));
        throw new Error("No image data found in response.");
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : String(error);
        console.error("Error modifying image:", errorMessage);
        throw new Error(`Failed to modify image. ${errorMessage}`);
    }
};

export const generateBehanceContent = async (imageBase64: string, mimeType: string): Promise<BehanceContent> => {
    try {
        const aiClient = getAiClient();
        const response: GenerateContentResponse = await aiClient.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    { text: "Analyze this design image for a Behance post. Generate a compelling project title, a short and impactful description (maximum 3 sentences), a list of 10 relevant keywords, and a list of 5-7 relevant hashtags (without the # symbol)." },
                    { inlineData: { data: imageBase64, mimeType } }
                ]
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        title: { type: Type.STRING, description: 'A catchy and descriptive title for the design project.' },
                        description: { type: Type.STRING, description: 'A short, professional project description (max 3 sentences).' },
                        keywords: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: 'A list of 10 relevant SEO-friendly keywords.'
                        },
                        hashtags: {
                            type: Type.ARRAY,
                            items: { type: Type.STRING },
                            description: 'A list of 5-7 relevant hashtags (without the #).'
                        }
                    },
                    required: ['title', 'description', 'keywords', 'hashtags']
                },
            },
        });

        const jsonString = response.text.trim();
        const parsedContent = JSON.parse(jsonString) as BehanceContent;
        if(parsedContent.hashtags) {
          parsedContent.hashtags = parsedContent.hashtags.map(h => h.replace(/^#/, ''));
        }
        return parsedContent;
    } catch (error) {
        console.error("Error generating Behance content:", error);
        throw new Error("Failed to generate Behance content.");
    }
};