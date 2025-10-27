import React from 'react';
import { Palette, Image, Send, FileUp, Languages, Sun, Moon, Monitor, BrainCircuit, BotMessageSquare, Sparkles, Copy, Check, Download, Share2, Wand2, RefreshCw, RotateCcw, View } from 'lucide-react';

export const Icons = {
  Design: Palette,
  ImageGen: Image,
  Behance: Send,
  Upload: FileUp,
  Language: Languages,
  Sun,
  Moon,
  System: Monitor,
  Analyze: BrainCircuit,
  Generate: BotMessageSquare,
  Publish: Sparkles,
  Copy,
  Check,
  Download,
  Share: Share2,
  Wand: Wand2,
  Refresh: RefreshCw,
  Undo: RotateCcw,
  Inspiration: View,
};

interface CardProps {
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({ children, className = '' }) => {
  return (
    <div className={`bg-white/70 dark:bg-slate-800/50 backdrop-blur-lg rounded-xl shadow-lg border border-white/20 dark:border-slate-700/50 overflow-hidden transition-colors duration-300 ${className}`}>
      {children}
    </div>
  );
};

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ children, variant = 'primary', isLoading = false, disabled, className = '', ...props }, ref) => {
    const baseClasses = "inline-flex items-center justify-center rounded-lg text-sm font-medium transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:pointer-events-none transform active:scale-95";
    const variantClasses = variant === 'primary'
      ? "bg-primary-600 text-white hover:bg-primary-500 shadow-md hover:shadow-lg focus:ring-primary-500"
      : "bg-slate-200 text-slate-800 hover:bg-slate-300 dark:bg-slate-700 dark:text-slate-100 dark:hover:bg-slate-600 focus:ring-slate-500";
    
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={`${baseClasses} ${variantClasses} ${className}`}
        {...props}
      >
        {isLoading && <Spinner className="mr-2" />}
        {children}
      </button>
    );
  }
);

export const Spinner: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <svg
      className={`animate-spin h-5 w-5 text-current ${className}`}
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  previewUrl: string | null;
  text: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({ onImageSelect, previewUrl, text }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      onImageSelect(file);
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className="relative w-full h-64 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg flex items-center justify-center text-center cursor-pointer hover:border-primary-500 dark:hover:border-primary-400 transition-all duration-300 group bg-slate-500/10 hover:bg-slate-500/20"
      onClick={handleClick}
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
        accept="image/png, image/jpeg, image/webp"
      />
      {previewUrl ? (
        <img src={previewUrl} alt="Preview" className="object-contain w-full h-full rounded-lg p-2" />
      ) : (
        <div className="text-slate-500 dark:text-slate-400 p-4">
          <Icons.Upload className="mx-auto h-12 w-12 text-slate-400 group-hover:text-primary-500 transition-colors" />
          <p className="mt-2">{text}</p>
        </div>
      )}
    </div>
  );
};