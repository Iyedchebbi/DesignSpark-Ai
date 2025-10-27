import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { Page, Theme, Language, BehanceContent } from './types';
import { analyzeDesign, generateImage, modifyImage, generateBehanceContent, fileToBase64 } from './services/geminiService';
import { Card, Button, Spinner, ImageUpload, Icons } from './components/ui';

// --- TRANSLATIONS ---
const translations = {
  ar: {
    'Design Spark AI': 'ديزاين سبارك AI',
    'Your AI partner for creative design.': 'شريكك الذكي للتصميم الإبداعي.',
    'Developed by Iyed CHEBBI': 'تطوير إياد الشابي',
    'Design Analysis': 'تحليل التصميم',
    'Image Generation': 'توليد الصور',
    'Inspiration Board': 'لوحة الإلهام',
    'Behance Publisher': 'النشر على Behance',
    'Upload your design': 'ارفع تصميمك',
    'Analyze Design': 'حلّل التصميم',
    'Enter a prompt to generate an image...': 'ادخل وصف لتوليد صورة...',
    'Generate Image': 'ولّد الصورة',
    'Upload an image to modify': 'ارفع صورة لتعديلها',
    'Enter a prompt to modify the image...': 'ادخل وصف لتعديل الصورة...',
    'Modify Image': 'عدّل الصورة',
    'Upload your final design': 'ارفع تصميمك النهائي',
    'Generate Behance Content': 'ولّد محتوى لـ Behance',
    'Analysis Results': 'نتائج التحليل',
    'Generated Content': 'المحتوى المُولّد',
    'Title': 'العنوان',
    'Description': 'الوصف',
    'Keywords': 'الكلمات المفتاحية',
    'Hashtags': 'الهاشتاجات',
    'Copy': 'نسخ',
    'Copied!': 'تم النسخ!',
    'Design Analysis & Refinement': 'تحليل وتصحيح التصميم',
    'AI Image Generation & Modification': 'توليد وتعديل الصور بالذكاء الاصطناعي',
    'Professional Behance Publishing': 'النشر الاحترافي على Behance',
    'Get expert feedback on your designs to elevate your work.': 'احصل على تقييم احترافي لتصاميمك لتحسين عملك.',
    'Create stunning visuals from text or modify existing images.': 'أنشئ صورًا مذهلة من النصوص أو قم بتعديل صورك الحالية.',
    'Generate professional titles, descriptions, and keywords for Behance.': 'أنشئ عناوين وأوصاف وكلمات مفتاحية احترافية لمنصة Behance.',
    'Light': 'فاتح',
    'Dark': 'داكن',
    'System': 'النظام',
    'Update the design': 'تحديث التصميم',
    'Updated Design': 'التصميم المحدث',
    'Download Updated Image': 'تحميل الصورة المحدثة',
    'Start Over': 'ابدأ من جديد',
    'Undo': 'تراجع',
    'Share to Behance': 'انشر على Behance',
    'Content Copied! Opening Behance...': 'تم نسخ المحتوى! يتم فتح Behance...',
    'Copies description & hashtags, then opens Behance.': 'ينسخ الوصف والهاشتاجات، ثم يفتح Behance.',
    'Download Image': 'تحميل الصورة',
    'Generate Board': 'إنشاء لوحة',
    'Enter a theme for your inspiration board...': 'أدخل موضوعًا للوحة الإلهام الخاصة بك...',
    'Kickstart your creativity with an AI-generated mood board.': 'ابدأ إبداعك بلوحة إلهام من صنع الذكاء الاصطناعي.',
    'Style Presets': 'أنماط جاهزة',
    'No Style': 'بدون نمط',
    'Photorealistic': 'واقعي',
    'Vector Art': 'فن فيكتور',
    'Watercolor': 'ألوان مائية',
    'Concept Sketch': 'رسم مبدئي',
    'Error': 'خطأ',
    'An error occurred': 'حدث خطأ',
  },
  en: {
    'Design Spark AI': 'Design Spark AI',
    'Your AI partner for creative design.': 'Your AI partner for creative design.',
    'Developed by Iyed CHEBBI': 'Developed by Iyed CHEBBI',
    'Design Analysis': 'Design Analysis',
    'Image Generation': 'Image Generation',
    'Inspiration Board': 'Inspiration Board',
    'Behance Publisher': 'Behance Publisher',
    'Upload your design': 'Upload your design',
    'Analyze Design': 'Analyze Design',
    'Enter a prompt to generate an image...': 'Enter a prompt to generate an image...',
    'Generate Image': 'Generate Image',
    'Upload an image to modify': 'Upload an image to modify',
    'Enter a prompt to modify the image...': 'Enter a prompt to modify the image...',
    'Modify Image': 'Modify Image',
    'Upload your final design': 'Upload your final design',
    'Generate Behance Content': 'Generate Behance Content',
    'Analysis Results': 'Analysis Results',
    'Generated Content': 'Generated Content',
    'Title': 'Title',
    'Description': 'Description',
    'Keywords': 'Keywords',
    'Hashtags': 'Hashtags',
    'Copy': 'Copy',
    'Copied!': 'Copied!',
    'Design Analysis & Refinement': 'Design Analysis & Refinement',
    'AI Image Generation & Modification': 'AI Image Generation & Modification',
    'Professional Behance Publishing': 'Professional Behance Publishing',
    'Get expert feedback on your designs to elevate your work.': 'Get expert feedback on your designs to elevate your work.',
    'Create stunning visuals from text or modify existing images.': 'Create stunning visuals from text or modify existing images.',
    'Generate professional titles, descriptions, and keywords for Behance.': 'Generate professional titles, descriptions, and keywords for Behance.',
    'Light': 'Light',
    'Dark': 'Dark',
    'System': 'System',
    'Update the design': 'Update the design',
    'Updated Design': 'Updated Design',
    'Download Updated Image': 'Download Updated Image',
    'Start Over': 'Start Over',
    'Undo': 'Undo',
    'Share to Behance': 'Share to Behance',
    'Content Copied! Opening Behance...': 'Content Copied! Opening Behance...',
    'Copies description & hashtags, then opens Behance.': 'Copies description & hashtags, then opens Behance.',
    'Download Image': 'Download Image',
    'Generate Board': 'Generate Board',
    'Enter a theme for your inspiration board...': 'Enter a theme for your inspiration board...',
    'Kickstart your creativity with an AI-generated mood board.': 'Kickstart your creativity with an AI-generated mood board.',
    'Style Presets': 'Style Presets',
    'No Style': 'No Style',
    'Photorealistic': 'Photorealistic',
    'Vector Art': 'Vector Art',
    'Watercolor': 'Watercolor',
    'Concept Sketch': 'Concept Sketch',
    'Error': 'Error',
    'An error occurred': 'An error occurred',
  },
  fr: {
    'Design Spark AI': 'Design Spark IA',
    'Your AI partner for creative design.': 'Votre partenaire IA pour le design créatif.',
    'Developed by Iyed CHEBBI': 'Développé par Iyed CHEBBI',
    'Design Analysis': 'Analyse de Design',
    'Image Generation': 'Génération d\'Images',
    'Inspiration Board': 'Tableau d\'Inspiration',
    'Behance Publisher': 'Publication Behance',
    'Upload your design': 'Téléchargez votre design',
    'Analyze Design': 'Analyser le Design',
    'Enter a prompt to generate an image...': 'Entrez une description pour générer une image...',
    'Generate Image': 'Générer l\'Image',
    'Upload an image to modify': 'Téléchargez une image à modifier',
    'Enter a prompt to modify the image...': 'Entrez une description pour modifier l\'image...',
    'Modify Image': 'Modifier l\'Image',
    'Upload your final design': 'Téléchargez votre design final',
    'Generate Behance Content': 'Générer le contenu Behance',
    'Analysis Results': 'Résultats de l\'Analyse',
    'Generated Content': 'Contenu Généré',
    'Title': 'Titre',
    'Description': 'Description',
    'Keywords': 'Mots-clés',
    'Hashtags': 'Hashtags',
    'Copy': 'Copier',
    'Copied!': 'Copié !',
    'Design Analysis & Refinement': 'Analyse et Affinement de Design',
    'AI Image Generation & Modification': 'Génération et Modification d\'Images par IA',
    'Professional Behance Publishing': 'Publication Professionnelle sur Behance',
    'Get expert feedback on your designs to elevate your work.': 'Obtenez des commentaires experts sur vos designs pour améliorer votre travail.',
    'Create stunning visuals from text or modify existing images.': 'Créez des visuels époustouflants à partir de texte ou modifiez des images existantes.',
    'Generate professional titles, descriptions, and keywords for Behance.': 'Générez des titres, des descriptions et des mots-clés professionnels pour Behance.',
    'Light': 'Clair',
    'Dark': 'Sombre',
    'System': 'Système',
    'Update the design': 'Mettre à jour le design',
    'Updated Design': 'Design Mis à Jour',
    'Download Updated Image': 'Télécharger l\'Image Mise à Jour',
    'Start Over': 'Recommencer',
    'Undo': 'Annuler',
    'Share to Behance': 'Partager sur Behance',
    'Content Copied! Opening Behance...': 'Contenu copié ! Ouverture de Behance...',
    'Copies description & hashtags, then opens Behance.': 'Copie la description et les hashtags, puis ouvre Behance.',
    'Download Image': 'Télécharger l\'image',
    'Generate Board': 'Générer le Tableau',
    'Enter a theme for your inspiration board...': 'Entrez un thème pour votre tableau d\'inspiration...',
    'Kickstart your creativity with an AI-generated mood board.': 'Lancez votre créativité avec un mood board généré par IA.',
    'Style Presets': 'Styles Prédéfinis',
    'No Style': 'Aucun Style',
    'Photorealistic': 'Photoréaliste',
    'Vector Art': 'Art Vectoriel',
    'Watercolor': 'Aquarelle',
    'Concept Sketch': 'Croquis Conceptuel',
    'Error': 'Erreur',
    'An error occurred': 'Une erreur est survenue',
  },
};

// --- APP CONTEXT ---
interface AppContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  language: Language;
  setLanguage: (language: Language) => void;
  page: Page;
  setPage: (page: Page) => void;
  t: (key: keyof typeof translations.en) => string;
}

const AppContext = createContext<AppContextType | null>(null);
const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within an AppProvider');
  return context;
};

// --- HELPER HOOKS & COMPONENTS ---
const useCopy = () => {
  const [copied, setCopied] = useState(false);
  const copy = useCallback((text: string) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }, []);
  return { copied, copy };
};

const Tooltip: React.FC<{ content: string; children: React.ReactNode }> = ({ content, children }) => (
  <div className="relative group flex items-center">
    {children}
    <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
      {content}
    </div>
  </div>
);

const CopyButton: React.FC<{ textToCopy: string }> = ({ textToCopy }) => {
    const { copied, copy } = useCopy();
    const { t } = useAppContext();
    return (
        <Button variant="secondary" onClick={() => copy(textToCopy)} className="absolute top-2 right-2 px-2 py-1 h-auto text-xs">
            {copied ? <Icons.Check className="w-4 h-4 mr-1" /> : <Icons.Copy className="w-4 h-4 mr-1" />}
            {copied ? t('Copied!') : t('Copy')}
        </Button>
    );
};

const ErrorDisplay: React.FC<{ message: string, onDismiss: () => void }> = ({ message, onDismiss }) => {
  const { t } = useAppContext();
  return (
    <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-md my-4 dark:bg-red-900/50 dark:text-red-300 dark:border-red-600" role="alert">
      <div className="flex">
        <div className="py-1"><svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zM11.414 10l2.829-2.829a1 1 0 0 0-1.414-1.414L10 8.586 7.172 5.757a1 1 0 0 0-1.414 1.414L8.586 10l-2.829 2.829a1 1 0 1 0 1.414 1.414L10 11.414l2.829 2.829a1 1 0 0 0 1.414-1.414L11.414 10z"/></svg></div>
        <div>
          <p className="font-bold">{t('Error')}</p>
          <p className="text-sm">{message}</p>
        </div>
        <button onClick={onDismiss} className="ml-auto text-red-500">&times;</button>
      </div>
    </div>
  )
};

// --- PAGE COMPONENTS ---
const DesignAnalysisPage: React.FC = () => {
  const { t, language } = useAppContext();
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analysis, setAnalysis] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [updatedImage, setUpdatedImage] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [undoState, setUndoState] = useState<{ analysis: string; updatedImage: string | null } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleImageSelect = (file: File) => {
    setImageFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setAnalysis(''); setUpdatedImage(null); setUndoState(null); setError(null);
  };

  const handleAnalyze = async () => {
    if (!imageFile) return;
    setIsLoading(true); setError(null);
    setUndoState({ analysis, updatedImage });
    setAnalysis(''); setUpdatedImage(null);
    try {
      const base64 = await fileToBase64(imageFile);
      const result = await analyzeDesign(base64, imageFile.type, language);
      setAnalysis(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : t('An error occurred'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDesign = async () => {
    if (!imageFile || !analysis) return;
    setIsUpdating(true); setError(null);
    setUndoState({ analysis, updatedImage });
    setUpdatedImage(null);
    try {
        const base64 = await fileToBase64(imageFile);
        const textPrompt = analysis.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
        const modificationPrompt = `Apply these design suggestions to the image: ${textPrompt}`;
        const result = await modifyImage(modificationPrompt, base64, imageFile.type);
        setUpdatedImage(`data:image/png;base64,${result}`);
    } catch (err) {
        setError(err instanceof Error ? err.message : t('An error occurred'));
    } finally {
        setIsUpdating(false);
    }
  };
  
  const handleReset = () => {
    setImageFile(null); setPreviewUrl(null); setAnalysis(''); setUpdatedImage(null);
    setIsLoading(false); setIsUpdating(false); setUndoState(null); setError(null);
  };

  const handleUndo = () => {
    if (undoState) {
      setAnalysis(undoState.analysis); setUpdatedImage(undoState.updatedImage); setUndoState(null);
    }
  };

  const handleDownload = (imageUrl: string, fileName: string) => {
    if (!imageUrl) return;
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white">{t('Design Analysis & Refinement')}</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2">{t('Get expert feedback on your designs to elevate your work.')}</p>
      </div>
      <Card className="p-6 relative">
        <div className="absolute top-4 right-4 flex space-x-2 z-10">
          {undoState && <button onClick={handleUndo} className="p-2 rounded-full bg-white/50 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title={t('Undo')}><Icons.Undo className="w-5 h-5" /></button>}
          {imageFile && <button onClick={handleReset} className="p-2 rounded-full bg-white/50 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title={t('Start Over')}><Icons.Refresh className="w-5 h-5" /></button>}
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
            <div className="space-y-4">
              <ImageUpload onImageSelect={handleImageSelect} previewUrl={previewUrl} text={t('Upload your design')} />
              <Button onClick={handleAnalyze} disabled={!imageFile || isLoading} isLoading={isLoading} className="w-full h-12 text-base">
                <Icons.Analyze className="w-5 h-5 mr-2" /> {t('Analyze Design')}
              </Button>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">{t('Analysis Results')}</h2>
              <Card className="p-4 bg-slate-50 dark:bg-slate-900/50 min-h-[16rem] h-full max-h-[50vh] overflow-y-auto custom-scrollbar">
                {isLoading ? <div className="flex items-center justify-center h-full"><Spinner /></div> : analysis ? <div className="prose prose-sm dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: analysis }}></div> : <div className="flex items-center justify-center h-full text-slate-500 dark:text-slate-400">Your analysis will appear here.</div>}
              </Card>
            </div>
          </div>
          {error && <ErrorDisplay message={error} onDismiss={() => setError(null)} />}
          {analysis && !isLoading && !updatedImage && (
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6 flex justify-center">
              <Button onClick={handleUpdateDesign} disabled={isUpdating} isLoading={isUpdating} className="h-12 text-base px-8">
                <Icons.Wand className="w-5 h-5 mr-2" /> {t('Update the design')}
              </Button>
            </div>
          )}
          {(isUpdating || updatedImage) && (
            <div className="border-t border-slate-200 dark:border-slate-700 pt-6">
              <h2 className="text-2xl font-semibold text-center mb-4 text-slate-700 dark:text-slate-200">{t('Updated Design')}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                  <div className="text-center">
                      <h3 className="font-semibold mb-2">Original</h3>
                      <img src={previewUrl!} alt="Original design" className="object-contain w-full rounded-lg shadow-md bg-slate-500/10"/>
                  </div>
                  <div className="text-center">
                      <h3 className="font-semibold mb-2">Updated</h3>
                      {isUpdating ? <Card className="bg-slate-50 dark:bg-slate-900/50 w-full aspect-square flex items-center justify-center"><Spinner /></Card>
                      : updatedImage &&
                        <div className="space-y-2">
                           <img src={updatedImage} alt="Updated design" className="object-contain w-full rounded-lg shadow-md bg-slate-500/10" />
                           <Button onClick={() => handleDownload(updatedImage, 'updated-design.png')} className="w-full h-12"><Icons.Download className="w-5 h-5 mr-2" />{t('Download Updated Image')}</Button>
                        </div>
                      }
                  </div>
              </div>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

const ImageGenerationPage: React.FC = () => {
    const { t } = useAppContext();
    const [prompt, setPrompt] = useState('');
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [resultImage, setResultImage] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [mode, setMode] = useState<'generate' | 'modify'>('generate');
    const [previousResultImage, setPreviousResultImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [style, setStyle] = useState('');

    const canReset = prompt || imageFile || resultImage;
    const stylePresets = [
      { id: '', name: t('No Style') },
      { id: 'Photorealistic', name: t('Photorealistic') },
      { id: 'Vector Art', name: t('Vector Art') },
      { id: 'Watercolor', name: t('Watercolor') },
      { id: 'Concept Sketch', name: t('Concept Sketch') },
    ];

    const handleImageSelect = (file: File) => { setImageFile(file); setPreviewUrl(URL.createObjectURL(file)); setResultImage(null); setPreviousResultImage(null); };
    const handleReset = () => { setPrompt(''); setImageFile(null); setPreviewUrl(null); setResultImage(null); setIsLoading(false); setPreviousResultImage(null); setError(null); };
    const handleUndo = () => { if (previousResultImage) { setResultImage(previousResultImage); setPreviousResultImage(null); } };
    const handleDownload = () => { if (!resultImage) return; const link = document.createElement('a'); link.href = resultImage; link.download = 'ai-generated-design.png'; document.body.appendChild(link); link.click(); document.body.removeChild(link); };

    const handleSubmit = async () => {
        if (!prompt) return;
        setIsLoading(true); setError(null);
        if (resultImage) { setPreviousResultImage(resultImage); }
        setResultImage(null);
        try {
            let base64Result: string;
            if (mode === 'generate') {
                base64Result = await generateImage(prompt, style);
            } else {
                if (!imageFile) throw new Error("Image required for modification.");
                const imageBase64 = await fileToBase64(imageFile);
                base64Result = await modifyImage(prompt, imageBase64, imageFile.type);
            }
            setResultImage(`data:image/png;base64,${base64Result}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : t('An error occurred'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-slate-800 dark:text-white">{t('AI Image Generation & Modification')}</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2">{t('Create stunning visuals from text or modify existing images.')}</p>
            </div>
            <div className="flex justify-center">
                <div className="flex space-x-2 bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
                    <button onClick={() => setMode('generate')} className={`w-32 py-2 rounded-md transition ${mode === 'generate' ? 'bg-white dark:bg-slate-700 shadow' : ''}`}>{t('Generate Image')}</button>
                    <button onClick={() => setMode('modify')} className={`w-32 py-2 rounded-md transition ${mode === 'modify' ? 'bg-white dark:bg-slate-700 shadow' : ''}`}>{t('Modify Image')}</button>
                </div>
            </div>
            <Card className="p-6 relative">
                 <div className="absolute top-4 right-4 flex space-x-2 z-10">
                    {previousResultImage && !isLoading && <button onClick={handleUndo} className="p-2 rounded-full bg-white/50 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title={t('Undo')}><Icons.Undo className="w-5 h-5" /></button>}
                    {canReset && <button onClick={handleReset} className="p-2 rounded-full bg-white/50 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title={t('Start Over')}><Icons.Refresh className="w-5 h-5" /></button>}
                 </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="space-y-4">
                        {mode === 'modify' && <ImageUpload onImageSelect={handleImageSelect} previewUrl={previewUrl} text={t('Upload an image to modify')} />}
                        {mode === 'generate' && (
                          <div>
                            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('Style Presets')}</label>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {stylePresets.map(p => <button key={p.id} onClick={() => setStyle(p.id)} className={`px-3 py-1 text-sm rounded-full transition ${style === p.id ? 'bg-primary-600 text-white' : 'bg-slate-200 dark:bg-slate-700'}`}>{p.name}</button>)}
                            </div>
                          </div>
                        )}
                        <textarea value={prompt} onChange={(e) => setPrompt(e.target.value)} placeholder={mode === 'generate' ? t('Enter a prompt to generate an image...') : t('Enter a prompt to modify the image...')}
                            className="w-full p-3 h-28 border border-slate-300 rounded-lg bg-slate-50 dark:bg-slate-900/50 dark:border-slate-600 focus:ring-2 focus:ring-primary-500 focus:outline-none transition" />
                        <Button onClick={handleSubmit} disabled={!prompt || isLoading || (mode === 'modify' && !imageFile)} isLoading={isLoading} className="w-full h-12 text-base">
                            <Icons.Generate className="w-5 h-5 mr-2" /> {mode === 'generate' ? t('Generate Image') : t('Modify Image')}
                        </Button>
                    </div>
                    <div className="min-h-[20rem] flex flex-col">
                         <Card className="bg-slate-50 dark:bg-slate-900/50 w-full aspect-square flex items-center justify-center overflow-hidden">
                            {isLoading ? <Spinner /> : resultImage ? <img src={resultImage} alt="Generated result" className="object-contain w-full h-full" /> : <Icons.ImageGen className="w-16 h-16 text-slate-300 dark:text-slate-600" />}
                        </Card>
                        {resultImage && !isLoading && <Button onClick={handleDownload} className="w-full mt-4 h-12 text-base"><Icons.Download className="w-5 h-5 mr-2" /> {t('Download Image')}</Button>}
                    </div>
                </div>
                 {error && <div className="mt-4"><ErrorDisplay message={error} onDismiss={() => setError(null)} /></div>}
            </Card>
        </div>
    );
};

const InspirationBoardPage: React.FC = () => {
    const { t } = useAppContext();
    const [theme, setTheme] = useState('');
    const [images, setImages] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleGenerate = async () => {
        if (!theme) return;
        setIsLoading(true);
        setError(null);
        setImages([]);
        try {
            const prompts = [
                `A mood board element representing ${theme}, focusing on color palette.`,
                `An abstract texture related to ${theme}.`,
                `A key object or icon for the theme ${theme}.`,
                `An inspiring landscape or scene for ${theme}.`
            ];
            const imagePromises = prompts.map(p => generateImage(p, 'Photorealistic'));
            const results = await Promise.all(imagePromises);
            setImages(results.map(base64 => `data:image/png;base64,${base64}`));
        } catch (err) {
            setError(err instanceof Error ? err.message : t('An error occurred'));
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold text-slate-800 dark:text-white">{t('Inspiration Board')}</h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2">{t('Kickstart your creativity with an AI-generated mood board.')}</p>
            </div>
            <Card className="p-6">
                <div className="flex flex-col md:flex-row gap-4">
                    <input
                        type="text"
                        value={theme}
                        onChange={e => setTheme(e.target.value)}
                        placeholder={t('Enter a theme for your inspiration board...')}
                        className="flex-grow p-3 border border-slate-300 rounded-lg bg-slate-50 dark:bg-slate-900/50 dark:border-slate-600 focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
                    />
                    <Button onClick={handleGenerate} disabled={!theme || isLoading} isLoading={isLoading} className="h-12 px-6 text-base">
                        <Icons.Inspiration className="w-5 h-5 mr-2" /> {t('Generate Board')}
                    </Button>
                </div>
                 {error && <div className="mt-4"><ErrorDisplay message={error} onDismiss={() => setError(null)} /></div>}
            </Card>

            {isLoading && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {[...Array(4)].map((_, i) => <Card key={i} className="aspect-square flex items-center justify-center bg-slate-500/10"><Spinner /></Card>)}
                </div>
            )}
            {images.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                    {images.map((img, i) => (
                        <Card key={i} className="aspect-square overflow-hidden group">
                           <img src={img} alt={`Inspiration for ${theme} ${i+1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}

const BehancePublisherPage: React.FC = () => {
    const { t } = useAppContext();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [content, setContent] = useState<BehanceContent | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [shareState, setShareState] = useState<'idle' | 'copied'>('idle');
    const [error, setError] = useState<string | null>(null);

    const handleImageSelect = (file: File) => { setImageFile(file); setPreviewUrl(URL.createObjectURL(file)); setContent(null); };
    const handleReset = () => { setImageFile(null); setPreviewUrl(null); setContent(null); setIsLoading(false); setError(null); };

    const handleGenerate = async () => {
        if (!imageFile) return;
        setIsLoading(true); setContent(null); setError(null);
        try {
            const base64 = await fileToBase64(imageFile);
            const result = await generateBehanceContent(base64, imageFile.type);
            setContent(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : t('An error occurred'));
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleShare = () => {
      if (!content) return;
      const mainBodyContent = `${content.description}\n\n${content.hashtags.map(h => `#${h}`).join(' ')}`;
      navigator.clipboard.writeText(mainBodyContent).then(() => {
          window.open('https://www.behance.net/portfolio/editor', '_blank');
          setShareState('copied');
          setTimeout(() => setShareState('idle'), 3000);
      });
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="text-center md:text-left">
              <h1 className="text-4xl font-bold text-slate-800 dark:text-white">{t('Professional Behance Publishing')}</h1>
              <p className="text-slate-600 dark:text-slate-300 mt-2">{t('Generate professional titles, descriptions, and keywords for Behance.')}</p>
            </div>
            <Card className="p-6 relative">
                {imageFile && <button onClick={handleReset} className="absolute top-4 right-4 p-2 rounded-full bg-white/50 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors z-10" title={t('Start Over')}><Icons.Refresh className="w-5 h-5" /></button>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="space-y-4">
                        <ImageUpload onImageSelect={handleImageSelect} previewUrl={previewUrl} text={t('Upload your final design')} />
                        <Button onClick={handleGenerate} disabled={!imageFile || isLoading} isLoading={isLoading} className="w-full h-12 text-base">
                            <Icons.Publish className="w-5 h-5 mr-2" /> {t('Generate Behance Content')}
                        </Button>
                         {error && <ErrorDisplay message={error} onDismiss={() => setError(null)} />}
                    </div>
                    <div className="min-h-[20rem] mt-6 md:mt-0">
                        <h2 className="text-xl font-semibold mb-3 text-slate-700 dark:text-slate-200">{t('Generated Content')}</h2>
                         <div className="space-y-4">
                            {isLoading ? <Card className="p-4 bg-slate-50 dark:bg-slate-900/50 min-h-[24rem] flex items-center justify-center"><Spinner /></Card>
                            : content ? (
                                <>
                                  {['title', 'description', 'keywords', 'hashtags'].map(key => (
                                    <div className="relative" key={key}>
                                        <label className="text-sm font-medium text-slate-500 dark:text-slate-400">{t(key.charAt(0).toUpperCase() + key.slice(1) as any)}</label>
                                        <div className="p-3 bg-slate-100 dark:bg-slate-800/70 rounded-md mt-1 min-h-[2.5rem]">
                                          {key === 'keywords' ? (
                                            <div className="flex flex-wrap gap-2">{content.keywords.map(k => <span key={k} className="bg-primary-100 text-primary-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-primary-900 dark:text-primary-300">{k}</span>)}</div>
                                          ) : key === 'hashtags' ? (
                                            <div className="flex flex-wrap gap-2">{content.hashtags.map(h => <span key={h} className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">#{h}</span>)}</div>
                                          ) : <p>{content[key as keyof BehanceContent] as string}</p>}
                                        </div>
                                        <CopyButton textToCopy={
                                          key === 'keywords' ? content.keywords.join(', ') : 
                                          key === 'hashtags' ? content.hashtags.map(h => `#${h}`).join(' ') : 
                                          content[key as keyof BehanceContent] as string
                                        } />
                                    </div>
                                  ))}
                                    <Button onClick={handleShare} className="w-full h-12 text-base mt-4">
                                      <Icons.Share className="w-5 h-5 mr-2" /> 
                                      {shareState === 'copied' ? t('Content Copied! Opening Behance...') : t('Share to Behance')}
                                    </Button>
                                    <p className="text-xs text-center text-slate-500 -mt-2">{t('Copies description & hashtags, then opens Behance.')}</p>
                                </>
                            ) : (
                                <Card className="p-4 bg-slate-50 dark:bg-slate-900/50 min-h-[24rem] flex items-center justify-center text-slate-500 dark:text-slate-400">
                                    Your generated content will appear here.
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
            </Card>
        </div>
    );
};

// --- LAYOUT COMPONENTS ---
const NavItem: React.FC<{ page: Page; icon: React.ElementType; label: string; }> = ({ page, icon: Icon, label }) => {
    const { page: currentPage, setPage } = useAppContext();
    const isActive = currentPage === page;
    return (
        <Tooltip content={label}>
            <button
                onClick={() => setPage(page)}
                className={`flex items-center w-full p-3 rounded-lg transition-colors duration-200 group ${
                    isActive 
                    ? 'bg-primary-500 text-white shadow-lg' 
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
            >
                <Icon className="w-6 h-6" />
                <span className="ml-4 font-semibold text-sm overflow-hidden whitespace-nowrap transition-all duration-300 w-0 group-hover:w-32 lg:w-32">{label}</span>
            </button>
        </Tooltip>
    );
};

const Sidebar: React.FC = () => {
    const { t } = useAppContext();
    return (
        <div className="hidden lg:flex flex-col w-20 hover:w-64 lg:w-64 p-4 space-y-2 bg-white/50 dark:bg-slate-800/30 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700/50 transition-all duration-300">
            <div>
              <div className="flex items-center space-x-2 px-2 h-12 group">
                  <Icons.Design className="w-8 h-8 text-primary-500 flex-shrink-0" />
                  <span className="text-xl font-bold text-slate-800 dark:text-white overflow-hidden whitespace-nowrap transition-all duration-300 w-0 group-hover:w-40 lg:w-40">{t('Design Spark AI')}</span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400 px-3 -mt-2 overflow-hidden whitespace-nowrap transition-all duration-300 w-0 group-hover:w-full lg:w-full">{t('Your AI partner for creative design.')}</p>
            </div>
            <nav className="flex-1 space-y-2 pt-4">
                <NavItem page={Page.DesignAnalysis} icon={Icons.Design} label={t('Design Analysis')} />
                <NavItem page={Page.ImageGeneration} icon={Icons.ImageGen} label={t('Image Generation')} />
                <NavItem page={Page.Inspiration} icon={Icons.Inspiration} label={t('Inspiration Board')} />
                <NavItem page={Page.BehancePublisher} icon={Icons.Behance} label={t('Behance Publisher')} />
            </nav>
            <div className="space-y-2">
                <ThemeToggle />
                <LanguageToggle />
            </div>
            <div className="pt-2 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 overflow-hidden whitespace-nowrap transition-all duration-300 w-0 group-hover:w-full lg:w-full">{t('Developed by Iyed CHEBBI')}</p>
            </div>
        </div>
    );
};

const BottomNav: React.FC = () => {
    const { t, page: currentPage, setPage } = useAppContext();
    const navItems = [
      { page: Page.DesignAnalysis, icon: Icons.Design, label: t('Design Analysis') },
      { page: Page.ImageGeneration, icon: Icons.ImageGen, label: t('Image Generation') },
      { page: Page.Inspiration, icon: Icons.Inspiration, label: t('Inspiration Board') },
      { page: Page.BehancePublisher, icon: Icons.Behance, label: t('Behance Publisher') },
    ];
    return (
        <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-lg border-t border-slate-200 dark:border-slate-700 flex justify-around">
            {navItems.map(item => (
                <button
                    key={item.page}
                    onClick={() => setPage(item.page)}
                    className={`flex flex-col items-center justify-center p-2 w-full transition-colors ${
                        currentPage === item.page ? 'text-primary-500' : 'text-slate-500 dark:text-slate-400'
                    }`}
                >
                    <item.icon className="w-6 h-6 mb-1" />
                    <span className="text-xs">{item.label}</span>
                </button>
            ))}
        </div>
    );
};

const ThemeToggle = () => {
    const { theme, setTheme } = useAppContext();
    return (
        <div className="flex bg-slate-200 dark:bg-slate-900 rounded-lg p-1">
            {[Theme.Light, Theme.Dark, Theme.System].map(t => (
                <button
                    key={t}
                    onClick={() => setTheme(t)}
                    className={`flex-1 flex items-center justify-center p-2 rounded-md text-sm transition-all ${
                        theme === t ? 'bg-white dark:bg-slate-700 shadow' : 'text-slate-500'
                    }`}
                    title={t.charAt(0).toUpperCase() + t.slice(1)}
                >
                    {t === 'light' ? <Icons.Sun className="w-5 h-5" /> : t === 'dark' ? <Icons.Moon className="w-5 h-5" /> : <Icons.System className="w-5 h-5" />}
                </button>
            ))}
        </div>
    );
}

const LanguageToggle = () => {
    const { language, setLanguage } = useAppContext();
    return (
        <div className="flex bg-slate-200 dark:bg-slate-900 rounded-lg p-1">
            {[Language.EN, Language.AR, Language.FR].map(l => (
                <button
                    key={l}
                    onClick={() => setLanguage(l)}
                    className={`flex-1 p-2 rounded-md text-sm transition-all ${
                        language === l ? 'bg-white dark:bg-slate-700 shadow' : 'text-slate-500'
                    }`}
                >
                    {l.toUpperCase()}
                </button>
            ))}
        </div>
    );
}

// --- MAIN APP ---
const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || Theme.System);
  const [language, setLanguage] = useState<Language>(() => (localStorage.getItem('language') as Language) || Language.EN);
  const [page, setPage] = useState<Page>(Page.DesignAnalysis);

  useEffect(() => {
    const root = window.document.documentElement;
    const isDark = theme === Theme.Dark || (theme === Theme.System && window.matchMedia('(prefers-color-scheme: dark)').matches);
    root.classList.toggle('dark', isDark);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'ar' ? 'rtl' : 'ltr';
    localStorage.setItem('language', language);
  }, [language]);
  
  const setTheme = (newTheme: Theme) => setThemeState(newTheme);

  const t = useCallback((key: keyof typeof translations.en) => {
    return translations[language][key] || translations.en[key];
  }, [language]);

  return (
    <AppContext.Provider value={{ theme, setTheme, language, setLanguage, page, setPage, t }}>
      {children}
    </AppContext.Provider>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}

function MainApp() {
    const { page } = useAppContext();
    const prevPage = useRef(page);

    useEffect(() => {
        prevPage.current = page;
    }, [page]);

    const renderPage = () => {
        switch (page) {
            case Page.DesignAnalysis: return <DesignAnalysisPage />;
            case Page.ImageGeneration: return <ImageGenerationPage />;
            case Page.Inspiration: return <InspirationBoardPage />;
            case Page.BehancePublisher: return <BehancePublisherPage />;
            default: return <DesignAnalysisPage />;
        }
    };
    
    return (
        <div className="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <Sidebar />
            <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 lg:pb-8 custom-scrollbar">
                {renderPage()}
            </main>
            <BottomNav />
        </div>
    );
}