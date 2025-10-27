export enum Page {
  DesignAnalysis = 'DesignAnalysis',
  ImageGeneration = 'ImageGeneration',
  BehancePublisher = 'BehancePublisher',
  Inspiration = 'Inspiration',
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