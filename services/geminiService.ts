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

    const systemInstruction = `You are a world-class design mentor and critic. Your feedback must be structured, insightful, and actionable.
    Analyze the provided design and generate a detailed critique in valid HTML format.
    The response should be organized under the following <h4> headings:
    1.  **Layout & Composition:** Discuss alignment, balance, hierarchy, and whitespace.
    2.  **Color Palette:** Analyze color harmony, contrast, and emotional impact. Suggest improvements.
    3.  **Typography:** Critique font choices, pairing, readability, and hierarchy.
    4.  **Suggested Effects & Styles:** Propose specific, impactful effects like shadows, gradients, textures, or filters to enhance the design.
    5.  **Actionable Summary:** Conclude with the 3 most critical improvements the designer should focus on.
    
    Use ordered lists (<ol><li>...</li></ol>) or unordered lists (<ul><li>...</li></ul>) within each section for clarity.
    Keep the tone professional, encouraging, and helpful. The entire response must be in ${targetLanguage}.`;


    const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                { text: `Here is the design to analyze:` },
                { inlineData: { data: imageBase64, mimeType } }
            ]
        },
         config: {
            systemInstruction: systemInstruction,
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing design:", error);
    const errorMessage = error instanceof Error ? error.message : "An error occurred while analyzing the design.";
    throw new Error(errorMessage);
  }
};

export const deconstructDesign = async (imageBase64: string, mimeType: string): Promise<string> => {
    try {
        const aiClient = getAiClient();
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: {
                parts: [
                    { text: "You are a prompt engineering expert for AI image generators. Analyze this reference design in meticulous detail. Deconstruct its visual elements to create a comprehensive, single-paragraph text prompt that could be used to generate a similar image. Cover the following aspects: subject, composition, artistic style (e.g., photorealism, vector illustration, abstract), color palette and mood, lighting, textures, and any specific notable effects. The output must be only the prompt text, without any introductory phrases like 'Here is the prompt:'." },
                    { inlineData: { data: imageBase64, mimeType } }
                ]
            }
        });
        return response.text.trim();
    } catch (error) {
        console.error("Error deconstructing design:", error);
        throw new Error("Failed to deconstruct design.");
    }
};

export const applyStyle = async (userImageBase64: string, userMimeType: string, refImageBase64: string, refMimeType: string): Promise<string> => {
    try {
        const aiClient = getAiClient();
        const response = await aiClient.models.generateContent({
            model: 'gemini-2.5-flash-image',
            contents: {
                parts: [
                    { text: "Take the core subject and composition from the first image. Now, completely transform its visual style to match the style of the second image. This includes applying the color palette, lighting, textures, and overall artistic mood from the second image onto the first one. The final output should be the modified first image." },
                    { inlineData: { data: userImageBase64, mimeType: userMimeType } }, // User's image
                    { inlineData: { data: refImageBase64, mimeType: refMimeType } }    // Reference image
                ]
            },
            config: {
                responseModalities: [Modality.IMAGE],
            },
        });

        if (response.promptFeedback?.blockReason) {
             throw new Error(`Request blocked: ${response.promptFeedback.blockReason}.`);
        }

        const imagePart = response.candidates?.[0]?.content?.parts?.find(part => part.inlineData);
        if (imagePart && imagePart.inlineData) {
            return imagePart.inlineData.data;
        }

        throw new Error("No image data found in style transfer response.");
    } catch (error) {
        console.error("Error applying style:", error);
        throw new Error(`Failed to apply style. ${error instanceof Error ? error.message : ''}`);
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