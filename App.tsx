
import React, { createContext, useContext, useState, useEffect, useCallback, useRef, useLayoutEffect } from 'react';
import { Page, Theme, Language, BehanceContent, BrandKitContent } from './types';
import { analyzeDesign, generateImage, modifyImage, generateBehanceContent, fileToBase64, deconstructDesign, applyStyle, extractBrandKit } from './services/geminiService';
import { Card, Button, Spinner, ImageUpload, Icons, Dropdown } from './components/ui';

// --- TRANSLATIONS ---
const translations = {
  ar: {
    'Design Spark AI': 'ديزاين سبارك AI',
    'Your AI partner for creative design.': 'شريكك الذكي للتصميم الإبداعي.',
    'Developed by Iyed CHEBBI': 'تطوير إياد الشابي',
    'Home': 'الرئيسية',
    'Design Analysis': 'تحليل التصميم',
    'Image Generation': 'توليد الصور',
    'Image Edition': 'تعديل الصور',
    'Brand Kit': 'عدة العلامة التجارية',
    'Behance Publisher': 'النشر على Behance',
    'Upload your design': 'ارفع تصميمك',
    'Analyze Design': 'حلّل التصميم',
    'Enter a prompt to generate an image...': 'ادخل وصف لتوليد صورة...',
    'Generate Image': 'ولّد الصورة',
    'Upload an image to modify': 'ارفع صورة لتعديلها',
    'Upload an image to edit': 'ارفع صورة لتعديلها',
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
    'Welcome to Design Spark AI': 'أهلاً بك في ديزاين سبارك AI',
    'Select a tool to get started': 'اختر أداة للبدء',
    'Design Analysis & Refinement': 'تحليل وتحسين التصميم',
    'AI Image Generation & Modification': 'توليد وتعديل الصور بالذكاء الاصطناعي',
    'AI-Powered Image Editing': 'تعديل الصور بالذكاء الاصطناعي',
    'AI Brand Kit Generator': 'مولد عدة العلامة التجارية',
    'Professional Behance Publishing': 'النشر الاحترافي على Behance',
    'Get expert feedback on your designs to elevate your work.': 'احصل على تقييم احترافي لتصاميمك لتحسين عملك.',
    'Create stunning visuals from text or modify existing images.': 'أنشئ صورًا مذهلة من النصوص أو قم بتعديل صورك الحالية.',
    'Use text prompts to edit your images, remove backgrounds, or change aspect ratios.': 'استخدم الأوصاف النصية لتعديل صورك، إزالة الخلفيات، أو تغيير الأبعاد.',
    'Instantly generate a full brand identity from just a logo.': 'أنشئ هوية علامة تجارية كاملة فورًا من مجرد شعار.',
    'Generate professional titles, descriptions, and keywords for Behance.': 'أنشئ عناوين وأوصاف وكلمات مفتاحية احترافية لمنصة Behance.',
    'Light': 'فاتح', 'Dark': 'داكن', 'System': 'النظام',
    'Update the design': 'تحديث التصميم', 'Updated Design': 'التصميم المحدث',
    'Download Updated Image': 'تحميل الصورة المحدثة', 'Download Edited Image': 'تحميل الصورة المعدلة',
    'Download Result': 'تحميل النتيجة', 'Start Over': 'ابدأ من جديد', 'Undo': 'تراجع',
    'Share to Behance': 'انشر على Behance', 'Content Copied! Opening Behance...': 'تم نسخ المحتوى! يتم فتح Behance...',
    'Copies description & hashtags, then opens Behance.': 'ينسخ الوصف والهاشتاجات، ثم يفتح Behance.',
    'Download Image': 'تحميل الصورة', 'Style Presets': 'أنماط جاهزة', 'No Style': 'بدون نمط',
    'Photorealistic': 'واقعي', 'Vector Art': 'فن فيكتور', 'Watercolor': 'ألوان مائية', 'Concept Sketch': 'رسم مبدئي',
    'Minimalist': 'بسيط', '3D Render': 'تصيير ثلاثي الأبعاد', 'Retro': 'ريترو', 'Abstract': 'تجريدي', 'Line Art': 'فن الخط', 'Isometric': 'إيزومتري',
    'Error': 'خطأ', 'An error occurred': 'حدث خطأ',
    'Critique & Refine': 'النقد والتحسين', 'Deconstruct & Apply Style': 'تفكيك وتطبيق النمط',
    'Upload Your Design': 'ارفع تصميمك', 'Upload Reference Design': 'ارفع التصميم المرجعي',
    'Deconstruct Reference': 'فكك المرجع', 'Apply Style to My Design': 'طبق النمط على تصميمي',
    'Deconstructed Prompt': 'الوصف المُفَكَّك', 'Style-Applied Design': 'التصميم بالنمط المطبق',
    'Get detailed feedback and AI-driven refinements for your design.': 'احصل على تقييم مفصل وتحسينات مدفوعة بالذكاء الاصطناعي لتصميمك.',
    'Extract a creative prompt from a reference design or apply its style to yours.': 'استخرج وصفًا إبداعيًا من تصميم مرجعي أو طبّق أسلوبه على تصميمك.',
    'Your deconstructed prompt will appear here.': 'سيظهر هنا الوصف المستخرج من التصميم المرجعي.',
    'Remove Background': 'إزالة الخلفية', 'Aspect Ratio': 'نسبة الأبعاد',
    'Original': 'الأصلي', 'Edited Result': 'النتيجة المعدلة', 'Your edited image will appear here.': 'ستظهر صورتك المعدلة هنا.',
    'Help & Support': 'المساعدة والدعم', 'Contact Me': 'تواصل معي',
    'Upload your logo': 'ارفع شعارك', 'Extract Brand Identity': 'استخرج هوية العلامة التجارية',
    'Brand Kit Results': 'نتائج عدة العلامة التجارية', 'Color Palette': 'لوحة الألوان', 'Typography': 'الخطوط',
    'Primary': 'أساسي', 'Secondary': 'ثانوي', 'Accent': 'إضافي',
    'Heading Font': 'خط العناوين', 'Body Font': 'خط النصوص', 'Rationale': 'السبب',
    'Theme': 'المظهر', 'Language': 'اللغة',
    'Text-based Editing': 'التعديل بالنص',
    'Enter a prompt to edit your image...': 'أدخل وصفًا لتعديل صورتك...',
    'Apply Edit': 'تطبيق التعديل',
  },
  en: {
    'Design Spark AI': 'Design Spark AI', 'Your AI partner for creative design.': 'Your AI partner for creative design.',
    'Developed by Iyed CHEBBI': 'Developed by Iyed CHEBBI', 'Home': 'Home', 'Design Analysis': 'Design Analysis',
    'Image Generation': 'Image Generation', 'Image Edition': 'Image Edition', 'Brand Kit': 'Brand Kit',
    'Behance Publisher': 'Behance Publisher', 'Upload your design': 'Upload your design',
    'Analyze Design': 'Analyze Design', 'Enter a prompt to generate an image...': 'Enter a prompt to generate an image...',
    'Generate Image': 'Generate Image', 'Upload an image to modify': 'Upload an image to modify',
    'Upload an image to edit': 'Upload an image to edit', 'Enter a prompt to modify the image...': 'Enter a prompt to modify the image...',
    'Modify Image': 'Modify Image', 'Upload your final design': 'Upload your final design',
    'Generate Behance Content': 'Generate Behance Content', 'Analysis Results': 'Analysis Results',
    'Generated Content': 'Generated Content', 'Title': 'Title', 'Description': 'Description',
    'Keywords': 'Keywords', 'Hashtags': 'Hashtags', 'Copy': 'Copy', 'Copied!': 'Copied!',
    'Welcome to Design Spark AI': 'Welcome to Design Spark AI', 'Select a tool to get started': 'Select a tool to get started',
    'Design Analysis & Refinement': 'Design Analysis & Refinement',
    'AI Image Generation & Modification': 'AI Image Generation & Modification',
    'AI-Powered Image Editing': 'AI-Powered Image Editing', 'AI Brand Kit Generator': 'AI Brand Kit Generator',
    'Professional Behance Publishing': 'Professional Behance Publishing',
    'Get expert feedback on your designs to elevate your work.': 'Get expert feedback on your designs to elevate your work.',
    'Create stunning visuals from text or modify existing images.': 'Create stunning visuals from text or modify existing images.',
    'Use text prompts to edit your images, remove backgrounds, or change aspect ratios.': 'Use text prompts to edit your images, remove backgrounds, or change aspect ratios.',
    'Instantly generate a full brand identity from just a logo.': 'Instantly generate a full brand identity from just a logo.',
    'Generate professional titles, descriptions, and keywords for Behance.': 'Generate professional titles, descriptions, and keywords for Behance.',
    'Light': 'Light', 'Dark': 'Dark', 'System': 'System',
    'Update the design': 'Update the design', 'Updated Design': 'Updated Design',
    'Download Updated Image': 'Download Updated Image', 'Download Edited Image': 'Download Edited Image',
    'Download Result': 'Download Result', 'Start Over': 'Start Over', 'Undo': 'Undo',
    'Share to Behance': 'Share to Behance', 'Content Copied! Opening Behance...': 'Content Copied! Opening Behance...',
    'Copies description & hashtags, then opens Behance.': 'Copies description & hashtags, then opens Behance.',
    'Download Image': 'Download Image', 'Style Presets': 'Style Presets', 'No Style': 'No Style',
    'Photorealistic': 'Photorealistic', 'Vector Art': 'Vector Art', 'Watercolor': 'Watercolor', 'Concept Sketch': 'Concept Sketch',
    'Minimalist': 'Minimalist', '3D Render': '3D Render', 'Retro': 'Retro', 'Abstract': 'Abstract', 'Line Art': 'Line Art', 'Isometric': 'Isometric',
    'Error': 'Error', 'An error occurred': 'An error occurred',
    'Critique & Refine': 'Critique & Refine', 'Deconstruct & Apply Style': 'Deconstruct & Apply Style',
    'Upload Your Design': 'Upload Your Design', 'Upload Reference Design': 'Upload Reference Design',
    'Deconstruct Reference': 'Deconstruct Reference', 'Apply Style to My Design': 'Apply Style to My Design',
    'Deconstructed Prompt': 'Deconstructed Prompt', 'Style-Applied Design': 'Style-Applied Design',
    'Get detailed feedback and AI-driven refinements for your design.': 'Get detailed feedback and AI-driven refinements for your design.',
    'Extract a creative prompt from a reference design or apply its style to yours.': 'Extract a creative prompt from a reference design or apply its style to yours.',
    'Your deconstructed prompt will appear here.': 'Your deconstructed prompt will appear here.',
    'Remove Background': 'Remove Background', 'Aspect Ratio': 'Aspect Ratio',
    'Original': 'Original', 'Edited Result': 'Edited Result', 'Your edited image will appear here.': 'Your edited image will appear here.',
    'Help & Support': 'Help & Support', 'Contact Me': 'Contact Me',
    'Upload your logo': 'Upload your logo', 'Extract Brand Identity': 'Extract Brand Identity',
    'Brand Kit Results': 'Brand Kit Results', 'Color Palette': 'Color Palette', 'Typography': 'Typography',
    'Primary': 'Primary', 'Secondary': 'Secondary', 'Accent': 'Accent',
    'Heading Font': 'Heading Font', 'Body Font': 'Body Font', 'Rationale': 'Rationale',
    'Theme': 'Theme', 'Language': 'Language',
    'Text-based Editing': 'Text-based Editing',
    'Enter a prompt to edit your image...': 'Enter a prompt to edit your image...',
    'Apply Edit': 'Apply Edit',
  },
  fr: {
    'Design Spark AI': 'Design Spark IA', 'Your AI partner for creative design.': 'Votre partenaire IA pour le design créatif.',
    'Developed by Iyed CHEBBI': 'Développé par Iyed CHEBBI', 'Home': 'Accueil', 'Design Analysis': 'Analyse de Design',
    'Image Generation': 'Génération d\'Images', 'Image Edition': 'Édition d\'Image', 'Brand Kit': 'Kit de Marque',
    'Behance Publisher': 'Publication Behance', 'Upload your design': 'Téléchargez votre design',
    'Analyze Design': 'Analyser le Design', 'Enter a prompt to generate an image...': 'Entrez une description pour générer une image...',
    'Generate Image': 'Générer l\'Image', 'Upload an image to modify': 'Téléchargez une image à modifier',
    'Upload an image to edit': 'Téléchargez une image pour la modifier', 'Enter a prompt to modify the image...': 'Entrez une description pour modifier l\'image...',
    'Modify Image': 'Modifier l\'Image', 'Upload your final design': 'Téléchargez votre design final',
    'Generate Behance Content': 'Générer le contenu Behance', 'Analysis Results': 'Résultats de l\'Analyse',
    'Generated Content': 'Contenu Généré', 'Title': 'Titre', 'Description': 'Description', 'Keywords': 'Mots-clés', 'Hashtags': 'Hashtags',
    'Copy': 'Copier', 'Copied!': 'Copié !',
    'Welcome to Design Spark AI': 'Bienvenue sur Design Spark IA', 'Select a tool to get started': 'Sélectionnez un outil pour commencer',
    'Design Analysis & Refinement': 'Analyse et Raffinement de Design',
    'AI Image Generation & Modification': 'Génération et Modification d\'Images par IA',
    'AI-Powered Image Editing': 'Édition d\'Images par IA', 'AI Brand Kit Generator': 'Générateur de Kit de Marque IA',
    'Professional Behance Publishing': 'Publication Professionnelle sur Behance',
    'Get expert feedback on your designs to elevate your work.': 'Obtenez des commentaires experts sur vos designs pour améliorer votre travail.',
    'Create stunning visuals from text or modify existing images.': 'Créez des visuels époustouflants à partir de texte ou modifiez des images existantes.',
    'Use text prompts to edit your images, remove backgrounds, or change aspect ratios.': 'Utilisez des prompts textuels pour modifier vos images, supprimer les arrière-plans ou changer les formats.',
    'Instantly generate a full brand identity from just a logo.': 'Générez instantanément une identité de marque complète à partir d\'un simple logo.',
    'Generate professional titles, descriptions, and keywords for Behance.': 'Générez des titres, des descriptions et des mots-clés professionnels pour Behance.',
    'Light': 'Clair', 'Dark': 'Sombre', 'System': 'Système',
    'Update the design': 'Mettre à jour le design', 'Updated Design': 'Design Mis à Jour',
    'Download Updated Image': 'Télécharger l\'Image Mise à Jour', 'Download Edited Image': 'Télécharger l\'Image Modifiée',
    'Download Result': 'Télécharger le Résultat', 'Recommencer': 'Recommencer', 'Undo': 'Annuler',
    'Share to Behance': 'Partager sur Behance', 'Content Copied! Opening Behance...': 'Contenu copié ! Ouverture de Behance...',
    'Copies description & hashtags, then opens Behance.': 'Copie la description et les hashtags, puis ouvre Behance.',
    'Download Image': 'Télécharger l\'image', 'Style Presets': 'Styles Prédéfinis', 'No Style': 'Aucun Style',
    'Photorealistic': 'Photoréaliste', 'Vector Art': 'Art Vectoriel', 'Watercolor': 'Aquarelle', 'Concept Sketch': 'Croquis Conceptuel',
    'Minimalist': 'Minimaliste', '3D Render': 'Rendu 3D', 'Retro': 'Rétro', 'Abstract': 'Abstrait', 'Line Art': 'Art au Trait', 'Isometric': 'Isométrique',
    'Error': 'Erreur', 'Une erreur est survenue': 'Une erreur est survenue',
    'Critique & Refine': 'Critique & Raffinement', 'Deconstruct & Apply Style': 'Déconstruire & Appliquer le Style',
    'Upload Your Design': 'Téléchargez Votre Design', 'Upload Reference Design': 'Téléchargez le Design de Référence',
    'Deconstruct Reference': 'Déconstruire la Référence', 'Apply Style to My Design': 'Appliquer le Style à Mon Design',
    'Deconstructed Prompt': 'Prompt Déconstruit', 'Style-Applied Design': 'Design avec Style Appliqué',
    'Get detailed feedback and AI-driven refinements for your design.': 'Obtenez des commentaires détaillés et des améliorations basées sur l\'IA pour votre design.',
    'Extract a creative prompt from a reference design or apply its style to yours.': 'Extrayez un prompt créatif d\'un design de référence ou appliquez son style au vôtre.',
    'Your deconstructed prompt will appear here.': 'Votre prompt déconstruit apparaîtra ici.',
    'Remove Background': 'Supprimer l\'Arrière-plan', 'Aspect Ratio': 'Format d\'Image',
    'Original': 'Original', 'Edited Result': 'Résultat Modifié', 'Your edited image will appear here.': 'Votre image modifiée apparaîtra ici.',
    'Help & Support': 'Aide & Support', 'Me Contacter': 'Me Contacter',
    'Upload your logo': 'Téléchargez votre logo', 'Extract Brand Identity': 'Extraire l\'Identité de Marque',
    'Brand Kit Results': 'Résultats du Kit de Marque', 'Color Palette': 'Palette de Couleurs', 'Typography': 'Typographie',
    'Primary': 'Primaire', 'Secondary': 'Secondaire', 'Accent': 'Accentuation',
    'Heading Font': 'Police des Titres', 'Body Font': 'Police du Corps', 'Rationale': 'Justification',
    'Theme': 'Thème', 'Language': 'Langue',
    'Text-based Editing': 'Édition par Texte',
    'Enter a prompt to edit your image...': 'Entrez un prompt pour modifier votre image...',
    'Apply Edit': 'Appliquer la Modification',
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
    <div className="absolute left-full ml-4 px-2 py-1 bg-slate-800 text-white text-xs rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-50">
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

const HomePage: React.FC = () => {
    const { t, setPage } = useAppContext();
    const tools = [
        { page: Page.ImageGeneration, icon: Icons.ImageGen, title: 'Image Generation', description: 'Create stunning visuals from text or modify existing images.' },
        { page: Page.ImageEdition, icon: Icons.Crop, title: 'Image Edition', description: 'Use text prompts to edit your images, remove backgrounds, or change aspect ratios.' },
        { page: Page.BrandKit, icon: Icons.BrandKit, title: 'Brand Kit', description: 'Instantly generate a full brand identity from just a logo.' },
        { page: Page.DesignAnalysis, icon: Icons.Analyze, title: 'Design Analysis', description: 'Get expert feedback on your designs to elevate your work.' },
        { page: Page.BehancePublisher, icon: Icons.Behance, title: 'Behance Publisher', description: 'Generate professional titles, descriptions, and keywords for Behance.' },
    ];

    return (
        <div className="space-y-8 animate-fade-in-up">
            <div className="text-center">
                <h1 className="text-5xl font-extrabold text-slate-800 dark:text-white tracking-tight">{t('Welcome to Design Spark AI')}</h1>
                <p className="text-slate-600 dark:text-slate-300 mt-4 text-lg max-w-2xl mx-auto">{t('Your AI partner for creative design.')} {t('Select a tool to get started')}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {tools.map((tool) => (
                    <div key={tool.page} onClick={() => setPage(tool.page)} className="cursor-pointer group">
                        <Card className="p-6 text-center h-full">
                            <div className="flex justify-center items-center mb-4">
                                <div className="p-3 bg-primary-100 dark:bg-primary-900/50 rounded-full group-hover:scale-110 transition-transform">
                                    <tool.icon className="w-8 h-8 text-primary-600 dark:text-primary-300" />
                                </div>
                            </div>
                            <h2 className="text-xl font-bold text-slate-800 dark:text-white">{t(tool.title as keyof typeof translations.en)}</h2>
                            <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm">{t(tool.description as keyof typeof translations.en)}</p>
                        </Card>
                    </div>
                ))}
            </div>
        </div>
    );
};


const CritiqueAndRefineTab: React.FC = () => {
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
      <Card className="p-6 relative mt-6">
        <div className="absolute top-4 right-4 flex space-x-2 z-10">
          {undoState && <button onClick={handleUndo} className="p-2 rounded-full bg-white/50 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title={t('Undo')}><Icons.Undo className="w-5 h-5" /></button>}
          {imageFile && <button onClick={handleReset} className="p-2 rounded-full bg-white/50 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title={t('Start Over')}><Icons.Refresh className="w-5 h-5" /></button>}
        </div>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
            <div className="space-y-4">
              <ImageUpload onImageSelect={handleImageSelect} previewUrl={previewUrl} text={t('Upload your design')} />
              <Button onClick={handleAnalyze} disabled={!imageFile || isLoading} isLoading={isLoading} className="w-full h-12 text-base">
                <Icons.Analyze className="w-5 h-5 mr-2" /> {t('Analyze Design')}
              </Button>
            </div>
            <div className="space-y-4">
              <h2 className="text-xl font-semibold text-slate-700 dark:text-slate-200">{t('Analysis Results')}</h2>
              <Card className="p-4 bg-slate-50 dark:bg-slate-900/50 min-h-[16rem] h-full max-h-[50vh] md:max-h-[calc(100%-2.5rem)] overflow-y-auto custom-scrollbar">
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
  );
};

const DeconstructAndApplyStyleTab: React.FC = () => {
    const { t } = useAppContext();
    const [userFile, setUserFile] = useState<File | null>(null);
    const [userPreview, setUserPreview] = useState<string | null>(null);
    const [refFile, setRefFile] = useState<File | null>(null);
    const [refPreview, setRefPreview] = useState<string | null>(null);

    const [isLoading, setIsLoading] = useState<'deconstruct' | 'apply' | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const [prompt, setPrompt] = useState<string>('');
    const [styledImage, setStyledImage] = useState<string | null>(null);

    const handleReset = () => {
        setUserFile(null); setUserPreview(null);
        setRefFile(null); setRefPreview(null);
        setIsLoading(null); setError(null);
        setPrompt(''); setStyledImage(null);
    };

    const handleDeconstruct = async () => {
        if (!refFile) return;
        setIsLoading('deconstruct'); setError(null); setPrompt(''); setStyledImage(null);
        try {
            const base64 = await fileToBase64(refFile);
            const result = await deconstructDesign(base64, refFile.type);
            setPrompt(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : t('An error occurred'));
        } finally {
            setIsLoading(null);
        }
    };

    const handleApplyStyle = async () => {
        if (!userFile || !refFile) return;
        setIsLoading('apply'); setError(null); setPrompt(''); setStyledImage(null);
        try {
            const userBase64 = await fileToBase64(userFile);
            const refBase64 = await fileToBase64(refFile);
            const result = await applyStyle(userBase64, userFile.type, refBase64, refFile.type);
            setStyledImage(`data:image/png;base64,${result}`);
        } catch (err) {
            setError(err instanceof Error ? err.message : t('An error occurred'));
        } finally {
            setIsLoading(null);
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
        <Card className="p-6 relative mt-6">
            {(userFile || refFile) && <button onClick={handleReset} className="absolute top-4 right-4 p-2 rounded-full bg-white/50 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors z-10" title={t('Start Over')}><Icons.Refresh className="w-5 h-5" /></button>}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <ImageUpload onImageSelect={(f) => { setUserFile(f); setUserPreview(URL.createObjectURL(f));}} previewUrl={userPreview} text={t('Upload Your Design')} />
                <ImageUpload onImageSelect={(f) => { setRefFile(f); setRefPreview(URL.createObjectURL(f));}} previewUrl={refPreview} text={t('Upload Reference Design')} />
            </div>
            <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-6">
                <Button onClick={handleDeconstruct} disabled={!refFile || !!isLoading} isLoading={isLoading === 'deconstruct'} className="w-full sm:w-auto h-12 text-base px-6">
                    <Icons.Deconstruct className="w-5 h-5 mr-2" />{t('Deconstruct Reference')}
                </Button>
                <Button onClick={handleApplyStyle} disabled={!userFile || !refFile || !!isLoading} isLoading={isLoading === 'apply'} className="w-full sm:w-auto h-12 text-base px-6">
                    <Icons.ApplyStyle className="w-5 h-5 mr-2" />{t('Apply Style to My Design')}
                </Button>
            </div>
            {error && <div className="mt-4"><ErrorDisplay message={error} onDismiss={() => setError(null)} /></div>}
            
            {(isLoading === 'deconstruct' || prompt) && (
                 <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
                    <h2 className="text-2xl font-semibold text-center mb-4 text-slate-700 dark:text-slate-200">{t('Deconstructed Prompt')}</h2>
                    <Card className="p-4 bg-slate-50 dark:bg-slate-900/50 min-h-[8rem] relative">
                        {isLoading === 'deconstruct' ? <div className="flex items-center justify-center h-full"><Spinner /></div> : <p className="text-sm">{prompt}</p>}
                         {prompt && <CopyButton textToCopy={prompt} />}
                    </Card>
                 </div>
            )}

            {(isLoading === 'apply' || styledImage) && (
                <div className="border-t border-slate-200 dark:border-slate-700 pt-6 mt-6">
                    <h2 className="text-2xl font-semibold text-center mb-4 text-slate-700 dark:text-slate-200">{t('Style-Applied Design')}</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
                        <div className="text-center">
                            <h3 className="font-semibold mb-2">Original</h3>
                            <img src={userPreview!} alt="Original design" className="object-contain w-full rounded-lg shadow-md bg-slate-500/10"/>
                        </div>
                        <div className="text-center">
                            <h3 className="font-semibold mb-2">Updated</h3>
                            {isLoading === 'apply' ? <Card className="bg-slate-50 dark:bg-slate-900/50 w-full aspect-square flex items-center justify-center"><Spinner /></Card>
                            : styledImage &&
                                <div className="space-y-2">
                                <img src={styledImage} alt="Style-applied design" className="object-contain w-full rounded-lg shadow-md bg-slate-500/10" />
                                <Button onClick={() => handleDownload(styledImage, 'style-applied-design.png')} className="w-full h-12"><Icons.Download className="w-5 h-5 mr-2" />{t('Download Updated Image')}</Button>
                                </div>
                            }
                        </div>
                    </div>
                </div>
            )}
        </Card>
    );
};


const DesignAnalysisPage: React.FC = () => {
  const { t } = useAppContext();
  const [activeTab, setActiveTab] = useState<'critique' | 'deconstruct'>('critique');

  return (
    <div className="space-y-6 animate-fade-in-up">
      <div className="text-center md:text-left">
        <h1 className="text-4xl font-bold text-slate-800 dark:text-white">{t('Design Analysis & Refinement')}</h1>
        <p className="text-slate-600 dark:text-slate-300 mt-2">
          {activeTab === 'critique' 
            ? t('Get detailed feedback and AI-driven refinements for your design.')
            : t('Extract a creative prompt from a reference design or apply its style to yours.')
          }
        </p>
      </div>

      <div className="flex justify-center">
        <div className="flex space-x-2 bg-slate-200 dark:bg-slate-800 p-1 rounded-lg">
          <button onClick={() => setActiveTab('critique')} className={`w-40 py-2 rounded-md transition text-sm font-medium ${activeTab === 'critique' ? 'bg-white dark:bg-slate-700 shadow' : ''}`}>{t('Critique & Refine')}</button>
          <button onClick={() => setActiveTab('deconstruct')} className={`w-40 py-2 rounded-md transition text-sm font-medium ${activeTab === 'deconstruct' ? 'bg-white dark:bg-slate-700 shadow' : ''}`}>{t('Deconstruct & Apply Style')}</button>
        </div>
      </div>

      {activeTab === 'critique' ? <CritiqueAndRefineTab /> : <DeconstructAndApplyStyleTab />}
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
      { id: 'Minimalist', name: t('Minimalist') },
      { id: '3D Render', name: t('3D Render') },
      { id: 'Retro', name: t('Retro') },
      { id: 'Abstract', name: t('Abstract') },
      { id: 'Line Art', name: t('Line Art') },
      { id: 'Isometric', name: t('Isometric') },
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

const ImageEditionPage: React.FC = () => {
    const { t } = useAppContext();
    const [originalFile, setOriginalFile] = useState<File | null>(null);
    const [originalPreviewUrl, setOriginalPreviewUrl] = useState<string | null>(null);
    const [editedImageUrl, setEditedImageUrl] = useState<string | null>(null);
    const [previousEditedImageUrl, setPreviousEditedImageUrl] = useState<string | null>(null);
    const [prompt, setPrompt] = useState('');
    const [loadingAction, setLoadingAction] = useState<'edit' | 'removeBg' | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [activeRatio, setActiveRatio] = useState<string>('Original');

    const imageRef = useRef<HTMLImageElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [cropOverlayStyle, setCropOverlayStyle] = useState<React.CSSProperties>({ display: 'none' });

    const displayImageUrl = editedImageUrl || originalPreviewUrl;
    const isLoading = loadingAction !== null;

    useEffect(() => {
        if (!originalFile) {
            setOriginalPreviewUrl(null);
            return;
        }
        const objectUrl = URL.createObjectURL(originalFile);
        setOriginalPreviewUrl(objectUrl);
        return () => URL.revokeObjectURL(objectUrl);
    }, [originalFile]);
    
    useLayoutEffect(() => {
        const calculateAndSetCropStyle = () => {
            if (activeRatio === 'Original' || !imageRef.current || !containerRef.current) {
                setCropOverlayStyle({ display: 'none' });
                return;
            }

            const img = imageRef.current;
            const container = containerRef.current;
            
            if (img.naturalWidth === 0) return;

            const containerW = container.clientWidth;
            const containerH = container.clientHeight;
            const imgRatio = img.naturalWidth / img.naturalHeight;
            const containerRatio = containerW / containerH;

            let renderedW, renderedH;
            if (imgRatio > containerRatio) {
                renderedW = containerW;
                renderedH = containerW / imgRatio;
            } else {
                renderedH = containerH;
                renderedW = containerH * imgRatio;
            }
            
            const [targetW, targetH] = activeRatio.split(':').map(Number);
            const targetRatio = targetW / targetH;
            const renderedRatio = renderedW / renderedH;

            let cropW = renderedW;
            let cropH = renderedH;
            
            const topOffset = (containerH - renderedH) / 2;
            const leftOffset = (containerW - renderedW) / 2;

            if (targetRatio > renderedRatio) {
                cropH = renderedW / targetRatio;
            } else {
                cropW = renderedH * targetRatio;
            }

            const cropTop = topOffset + (renderedH - cropH) / 2;
            const cropLeft = leftOffset + (renderedW - cropW) / 2;

            setCropOverlayStyle({
                position: 'absolute',
                top: `${cropTop}px`,
                left: `${cropLeft}px`,
                width: `${cropW}px`,
                height: `${cropH}px`,
                boxShadow: '0 0 0 9999px rgba(0, 0, 0, 0.5)',
                border: '1px dashed rgba(255, 255, 255, 0.7)',
                transition: 'all 0.3s ease',
            });
        };

        const imgElement = imageRef.current;
        if (imgElement) {
            imgElement.addEventListener('load', calculateAndSetCropStyle);
            if (imgElement.complete) calculateAndSetCropStyle();
        }
        
        window.addEventListener('resize', calculateAndSetCropStyle);

        return () => {
            if (imgElement) imgElement.removeEventListener('load', calculateAndSetCropStyle);
            window.removeEventListener('resize', calculateAndSetCropStyle);
        };
    }, [activeRatio, displayImageUrl]);

    const aspectRatios = [
        { id: 'Original', name: t('Original') },
        { id: '1:1', name: '1:1 (Square)' },
        { id: '16:9', name: '16:9 (Widescreen)' },
        { id: '4:3', name: '4:3 (Standard)' },
        { id: '9:16', name: '9:16 (Story)' },
    ];

    const handleImageSelect = (file: File) => {
        setOriginalFile(file);
        setEditedImageUrl(null);
        setPreviousEditedImageUrl(null);
        setPrompt('');
        setLoadingAction(null);
        setError(null);
        setActiveRatio('Original');
    };

    const handleReset = () => {
        setOriginalFile(null);
        setEditedImageUrl(null);
        setPreviousEditedImageUrl(null);
        setPrompt('');
        setLoadingAction(null);
        setError(null);
        setActiveRatio('Original');
    };

    const handleModify = async (editPrompt: string, action: 'edit' | 'removeBg') => {
        if (!originalFile) return;
        setLoadingAction(action);
        setError(null);
        if (editedImageUrl) {
            setPreviousEditedImageUrl(editedImageUrl);
        } else {
            setPreviousEditedImageUrl(originalPreviewUrl);
        }

        try {
            const imageToEditUrl = editedImageUrl || originalPreviewUrl;
            if (!imageToEditUrl) throw new Error("No image to edit.");

            // To get the latest edited state, fetch the blob and convert to base64
            const response = await fetch(imageToEditUrl);
            const blob = await response.blob();
            const fileReader = new FileReader();
            fileReader.readAsDataURL(blob);
            fileReader.onloadend = async () => {
                const imageBase64 = (fileReader.result as string).split(',')[1];
                const result = await modifyImage(editPrompt, imageBase64, blob.type);
                setEditedImageUrl(`data:image/png;base64,${result}`);
                if (action === 'edit') setPrompt('');
                setLoadingAction(null);
            };
            fileReader.onerror = () => {
                throw new Error("Failed to read image for editing.");
            }
        } catch (err) {
            setError(err instanceof Error ? err.message : t('An error occurred'));
            setLoadingAction(null);
        }
    };
    
    const handleRemoveBackground = () => {
        handleModify("Remove the background of this image, making it transparent. The main subject should be perfectly isolated.", 'removeBg');
    };

    const handleUndo = () => {
        if (previousEditedImageUrl) {
            setEditedImageUrl(previousEditedImageUrl === originalPreviewUrl ? null : previousEditedImageUrl);
            setPreviousEditedImageUrl(null);
        }
    };

    const handleDownload = () => {
        if (!displayImageUrl) return;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = displayImageUrl;
        img.onload = () => {
            if (activeRatio === 'Original') {
                const link = document.createElement('a');
                link.href = displayImageUrl;
                link.download = 'edited-image.png';
                link.click();
                return;
            }

            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            if (!ctx) return;

            const [ratioW, ratioH] = activeRatio.split(':').map(Number);
            const targetRatio = ratioW / ratioH;

            let srcX = 0, srcY = 0, srcWidth = img.naturalWidth, srcHeight = img.naturalHeight;
            const sourceRatio = srcWidth / srcHeight;

            if (targetRatio > sourceRatio) { // Target is wider than source
                srcHeight = srcWidth / targetRatio;
                srcY = (img.naturalHeight - srcHeight) / 2;
            } else { // Target is taller or same ratio as source
                srcWidth = srcHeight * targetRatio;
                srcX = (img.naturalWidth - srcWidth) / 2;
            }

            canvas.width = srcWidth;
            canvas.height = srcHeight;
            ctx.drawImage(img, srcX, srcY, srcWidth, srcHeight, 0, 0, srcWidth, srcHeight);

            const link = document.createElement('a');
            link.href = canvas.toDataURL('image/png');
            link.download = `edited-image-${activeRatio.replace(':', 'x')}.png`;
            link.click();
        };
        img.onerror = () => setError('Could not load image for processing.');
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold text-slate-800 dark:text-white">{t('AI-Powered Image Editing')}</h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2">{t('Use text prompts to edit your images, remove backgrounds, or change aspect ratios.')}</p>
            </div>
            <Card className="p-6 relative">
                 <div className="absolute top-4 right-4 flex space-x-2 z-10">
                    {previousEditedImageUrl && <button onClick={handleUndo} className="p-2 rounded-full bg-white/50 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title={t('Undo')}><Icons.Undo className="w-5 h-5" /></button>}
                    {originalFile && <button onClick={handleReset} className="p-2 rounded-full bg-white/50 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title={t('Start Over')}><Icons.Refresh className="w-5 h-5" /></button>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="space-y-4">
                        <ImageUpload onImageSelect={handleImageSelect} previewUrl={originalPreviewUrl} text={t('Upload an image to edit')} />
                        
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('Text-based Editing')}</label>
                            <textarea
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder={t('Enter a prompt to edit your image...')}
                                className="w-full p-3 h-24 border border-slate-300 rounded-lg bg-slate-50 dark:bg-slate-900/50 dark:border-slate-600 focus:ring-2 focus:ring-primary-500 focus:outline-none transition"
                                disabled={!originalFile || isLoading}
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <Button onClick={() => handleModify(prompt, 'edit')} disabled={!originalFile || !prompt || isLoading} isLoading={loadingAction === 'edit'} className="h-12 text-base">
                                    <Icons.Wand className="w-5 h-5 mr-2" /> {t('Apply Edit')}
                                </Button>
                                <Button onClick={handleRemoveBackground} disabled={!originalFile || isLoading} isLoading={loadingAction === 'removeBg'} variant="secondary" className="h-12 text-base">
                                    <Icons.RemoveBg className="w-5 h-5 mr-2" /> {t('Remove Background')}
                                </Button>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-slate-500 dark:text-slate-400">{t('Aspect Ratio')}</label>
                            <div className="grid grid-cols-2 gap-2">
                                {aspectRatios.map(ratio => (
                                    <Button key={ratio.id} onClick={() => setActiveRatio(ratio.id)} disabled={!originalFile} variant={activeRatio === ratio.id ? 'primary' : 'secondary'} className="h-12 text-base">
                                        <Icons.Crop className="w-5 h-5 mr-2" /> {ratio.name}
                                    </Button>
                                ))}
                            </div>
                        </div>
                    </div>
                    <div className="min-h-[20rem] flex flex-col">
                        <h3 className="font-semibold mb-2 text-center">{t('Edited Result')}</h3>
                        <Card ref={containerRef} className="bg-slate-800/20 dark:bg-slate-900/50 w-full flex items-center justify-center overflow-hidden transition-all relative p-0" style={{aspectRatio: '16 / 9'}}>
                             {isLoading ? <Spinner /> : displayImageUrl ? (
                                <>
                                    <img ref={imageRef} src={displayImageUrl} alt="Edited result" className="max-w-full max-h-full object-contain" />
                                    <div style={cropOverlayStyle} />
                                </>
                             ) : <div className="text-slate-400 text-center p-4">{t('Your edited image will appear here.')}</div>}
                        </Card>
                        {displayImageUrl && !isLoading && <Button onClick={handleDownload} className="w-full mt-4 h-12 text-base"><Icons.Download className="w-5 h-5 mr-2" /> {t('Download Result')}</Button>}
                    </div>
                </div>
                {error && <div className="mt-4"><ErrorDisplay message={error} onDismiss={() => setError(null)} /></div>}
            </Card>
        </div>
    );
};

const BrandKitPage: React.FC = () => {
    const { t } = useAppContext();
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [brandKit, setBrandKit] = useState<BrandKitContent | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleImageSelect = (file: File) => {
        setImageFile(file);
        setPreviewUrl(URL.createObjectURL(file));
        setBrandKit(null);
        setError(null);
    };

    const handleExtract = async () => {
        if (!imageFile) return;
        setIsLoading(true);
        setError(null);
        setBrandKit(null);
        try {
            const base64 = await fileToBase64(imageFile);
            const result = await extractBrandKit(base64, imageFile.type);
            setBrandKit(result);
        } catch (err) {
            setError(err instanceof Error ? err.message : t('An error occurred'));
        } finally {
            setIsLoading(false);
        }
    };
    
    const handleReset = () => {
      setImageFile(null);
      setPreviewUrl(null);
      setBrandKit(null);
      setIsLoading(false);
      setError(null);
    }

    const ColorSwatch: React.FC<{ name: string; color: string }> = ({ name, color }) => {
        const { copied, copy } = useCopy();
        return (
            <div className="text-center">
                <div 
                    className="w-24 h-24 rounded-full mx-auto shadow-lg border-4 border-white/50 dark:border-slate-700/50 cursor-pointer transform hover:scale-105 transition-transform"
                    style={{ backgroundColor: color }}
                    onClick={() => copy(color)}
                />
                <h4 className="font-semibold mt-2">{name}</h4>
                <p className="text-sm text-slate-500 dark:text-slate-400">{copied ? t('Copied!') : color}</p>
            </div>
        );
    };

    return (
        <div className="space-y-6 animate-fade-in-up">
            <div className="text-center md:text-left">
                <h1 className="text-4xl font-bold text-slate-800 dark:text-white">{t('AI Brand Kit Generator')}</h1>
                <p className="text-slate-600 dark:text-slate-300 mt-2">{t('Instantly generate a full brand identity from just a logo.')}</p>
            </div>
             <Card className="p-6 relative">
                {imageFile && <button onClick={handleReset} className="absolute top-4 right-4 p-2 rounded-full bg-white/50 dark:bg-slate-900/50 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors z-10" title={t('Start Over')}><Icons.Refresh className="w-5 h-5" /></button>}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
                    <div className="space-y-4">
                        <ImageUpload onImageSelect={handleImageSelect} previewUrl={previewUrl} text={t('Upload your logo')} />
                        <Button onClick={handleExtract} disabled={!imageFile || isLoading} isLoading={isLoading} className="w-full h-12 text-base">
                            <Icons.BrandKit className="w-5 h-5 mr-2" /> {t('Extract Brand Identity')}
                        </Button>
                    </div>
                    <div className="min-h-[20rem] mt-6 md:mt-0">
                        <h2 className="text-xl font-semibold mb-3 text-slate-700 dark:text-slate-200">{t('Brand Kit Results')}</h2>
                         <div className="space-y-4">
                            {isLoading ? <Card className="p-4 bg-slate-50 dark:bg-slate-900/50 min-h-[24rem] flex items-center justify-center"><Spinner /></Card>
                            : brandKit ? (
                                <div className="space-y-6">
                                    <div >
                                        <h3 className="text-lg font-semibold mb-4 text-slate-600 dark:text-slate-300 flex items-center"><Icons.Design className="w-5 h-5 mr-2"/>{t('Color Palette')}</h3>
                                        <div className="flex justify-around items-center bg-slate-100 dark:bg-slate-800/70 p-6 rounded-lg">
                                            <ColorSwatch name={t('Primary')} color={brandKit.colors.primary} />
                                            <ColorSwatch name={t('Secondary')} color={brandKit.colors.secondary} />
                                            <ColorSwatch name={t('Accent')} color={brandKit.colors.accent} />
                                        </div>
                                    </div>
                                     <div>
                                        <h3 className="text-lg font-semibold mb-4 text-slate-600 dark:text-slate-300 flex items-center"><Icons.Typography className="w-5 h-5 mr-2"/>{t('Typography')}</h3>
                                        <div className="space-y-4 bg-slate-100 dark:bg-slate-800/70 p-6 rounded-lg">
                                            <div>
                                                <label className="text-sm font-medium">{t('Heading Font')}</label>
                                                <p className="text-2xl" style={{fontFamily: brandKit.typography.headingFont}}>Aa - {brandKit.typography.headingFont}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">{t('Body Font')}</label>
                                                <p className="text-base" style={{fontFamily: brandKit.typography.bodyFont}}>Aa - {brandKit.typography.bodyFont}</p>
                                            </div>
                                            <div>
                                                <label className="text-sm font-medium">{t('Rationale')}</label>
                                                <p className="text-xs italic text-slate-500 dark:text-slate-400">{brandKit.typography.rationale}</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <Card className="p-4 bg-slate-50 dark:bg-slate-900/50 min-h-[24rem] flex items-center justify-center text-slate-500 dark:text-slate-400">
                                    Your generated brand kit will appear here.
                                </Card>
                            )}
                        </div>
                    </div>
                </div>
                 {error && <div className="mt-4"><ErrorDisplay message={error} onDismiss={() => setError(null)} /></div>}
            </Card>
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
                <span className="ml-4 font-semibold text-sm overflow-hidden whitespace-nowrap transition-all duration-300 w-0 group-hover:w-36 lg:w-36">{label}</span>
            </button>
        </Tooltip>
    );
};

const Sidebar: React.FC = () => {
    const { t } = useAppContext();
    return (
        <div className="hidden lg:flex flex-col w-20 hover:w-64 lg:w-64 p-4 space-y-2 bg-white/50 dark:bg-slate-800/30 backdrop-blur-xl border-r border-slate-200 dark:border-slate-700/50 transition-all duration-300 group">
            <div>
              <div className="flex items-center space-x-2 px-2 h-16">
                  <Icons.Design className="w-8 h-8 text-primary-500 flex-shrink-0" />
                  <span className="text-xl font-bold text-slate-800 dark:text-white overflow-hidden whitespace-nowrap w-full">{t('Design Spark AI')}</span>
              </div>
            </div>
            <nav className="flex-1 space-y-2 pt-4">
                <NavItem page={Page.HomePage} icon={Icons.Home} label={t('Home')} />
                <NavItem page={Page.ImageGeneration} icon={Icons.ImageGen} label={t('Image Generation')} />
                <NavItem page={Page.ImageEdition} icon={Icons.Crop} label={t('Image Edition')} />
                <NavItem page={Page.BrandKit} icon={Icons.BrandKit} label={t('Brand Kit')} />
                <NavItem page={Page.DesignAnalysis} icon={Icons.Analyze} label={t('Design Analysis')} />
                <NavItem page={Page.BehancePublisher} icon={Icons.Behance} label={t('Behance Publisher')} />
            </nav>
            <div className="pt-2 text-center">
                <p className="text-xs text-slate-500 dark:text-slate-400 overflow-hidden whitespace-nowrap w-full">{t('Developed by Iyed CHEBBI')}</p>
            </div>
        </div>
    );
};

const BottomNav: React.FC = () => {
    const { t, page: currentPage, setPage } = useAppContext();
    const navItems = [
      { page: Page.HomePage, icon: Icons.Home, label: t('Home') },
      { page: Page.ImageGeneration, icon: Icons.ImageGen, label: t('Image Generation') },
      { page: Page.ImageEdition, icon: Icons.Crop, label: t('Image Edition') },
      { page: Page.BrandKit, icon: Icons.BrandKit, label: t('Brand Kit') },
      { page: Page.DesignAnalysis, icon: Icons.Analyze, label: t('Design Analysis') },
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
                    <span className="text-xs text-center">{item.label}</span>
                </button>
            ))}
        </div>
    );
};

const Header: React.FC = () => {
    const { t, page } = useAppContext();
    
    const pageTitles: { [key in Page]: keyof typeof translations.en } = {
        [Page.HomePage]: 'Home',
        [Page.DesignAnalysis]: 'Design Analysis',
        [Page.ImageGeneration]: 'Image Generation',
        [Page.ImageEdition]: 'Image Edition',
        [Page.BrandKit]: 'Brand Kit',
        [Page.BehancePublisher]: 'Behance Publisher',
    };

    return (
        <header className="sticky top-0 z-40 bg-white/50 dark:bg-slate-800/30 backdrop-blur-lg border-b border-slate-200 dark:border-slate-700/50 mb-6 -mx-4 sm:-mx-6 lg:-mx-8 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
                <h1 className="text-2xl font-bold text-slate-800 dark:text-white">{t(pageTitles[page])}</h1>
                <div className="flex items-center space-x-4">
                    <UserMenu />
                </div>
            </div>
        </header>
    );
};

const UserMenu: React.FC = () => {
    const { t } = useAppContext();
    return (
        <Dropdown trigger={
            <button className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
                <Icons.User className="w-6 h-6" />
            </button>
        }>
            <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-600">
                <p className="text-sm font-medium">{t('Theme')}</p>
                <div className="mt-2"><ThemeToggle /></div>
            </div>
            <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-600">
                <p className="text-sm font-medium">{t('Language')}</p>
                 <div className="mt-2"><LanguageToggle /></div>
            </div>
            <a href="#" className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                <Icons.HelpCircle className="w-5 h-5 mr-2" /> {t('Help & Support')}
            </a>
            <a href="https://www.linkedin.com/in/iyedchebbi/" target="_blank" rel="noopener noreferrer" className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700">
                <Icons.User className="w-5 h-5 mr-2" /> {t('Contact Me')}
            </a>
        </Dropdown>
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
  const [page, setPage] = useState<Page>(Page.HomePage);

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
            case Page.HomePage: return <HomePage />;
            case Page.DesignAnalysis: return <DesignAnalysisPage />;
            case Page.ImageGeneration: return <ImageGenerationPage />;
            case Page.ImageEdition: return <ImageEditionPage />;
            case Page.BrandKit: return <BrandKitPage />;
            case Page.BehancePublisher: return <BehancePublisherPage />;
            default: return <HomePage />;
        }
    };
    
    return (
        <div className="flex h-screen bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 transition-colors duration-300">
            <Sidebar />
            <main className="flex-1 flex flex-col p-4 sm:p-6 lg:p-8 overflow-y-auto pb-24 lg:pb-8 custom-scrollbar">
                <Header />
                <div className="flex-grow">
                    {renderPage()}
                </div>
            </main>
            <BottomNav />
        </div>
    );
}