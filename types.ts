export enum Page {
  HomePage = 'HomePage',
  DesignAnalysis = 'DesignAnalysis',
  ImageGeneration = 'ImageGeneration',
  ImageEdition = 'ImageEdition',
  BrandKit = 'BrandKit',
  BehancePublisher = 'BehancePublisher',
}

export enum Theme {
  Light = 'light',
  Dark = 'dark',
  System = 'system',
}

export enum Language {
  AR = 'ar',
  EN = 'en',
  FR = 'fr',
}

export interface BehanceContent {
  title: string;
  description: string;
  keywords: string[];
  hashtags: string[];
}

export interface BrandKitContent {
  colors: {
    primary: string;
    secondary: string;

    accent: string;
  };
  typography: {
    headingFont: string;
    bodyFont: string;
    rationale: string;
  }
}