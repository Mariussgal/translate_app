"use client"

import { useState } from "react";
import Header from "./header";

import { translationApi } from "@/lib/api";

interface TranslationResult {
  translations: string[];
  success?: boolean;
  message?: string;
}

export default function Home() {
  const [sourceLanguage, setSourceLanguage] = useState("Français");
  const [targetLanguage, setTargetLanguage] = useState("English");
  const [sourceText, setSourceText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const copyTranslatedText = () => {
    navigator.clipboard.writeText(translatedText);
    setCopied(true);
    
    
    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  const swapLanguages = () => {
    setSourceLanguage(targetLanguage);
    setTargetLanguage(sourceLanguage);
    setSourceText(translatedText);
    setTranslatedText(sourceText);
  };


const translateText = async () => {
  if (!sourceText.trim()) {
    return;
  }

  setIsTranslating(true);
  setError("");
  
  try {
    const fromLang = sourceLanguage === "Français" ? "french" : "english";
    
    if (!sourceText.includes(" ")) {
      const result = await translationApi.translate(sourceText.trim(), fromLang) as TranslationResult;        
      if (result.translations && result.translations.length > 0) {
        setTranslatedText(result.translations.join(", "));
      } else {
        setTranslatedText("");
        setError("No translation found for this word.");
      }
    } else {
    
      const words = sourceText.split(/\s+/).filter(word => word.trim() !== ""); 
      const translations = await Promise.all(
        words.map(async (word) => {
          if (!word.trim()) return ""; 
          try {
            const result = await translationApi.translate(word.trim(), fromLang) as TranslationResult;
            return result.translations && result.translations.length > 0 
              ? result.translations[0] 
              : word;
          } catch (e) {
            console.error(`Error translating word "${word}":`, e);
            return word; 
          }
        })
      );
      setTranslatedText(translations.join(" "));
    }
  } catch (err) {
    console.error("Translation error:", err);
    setError("Failed to translate. Please try again.");
  } finally {
    setIsTranslating(false);
  }
};

  const languages = [
    "Français", "English", 
  ];


  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <main className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 max-w-5xl mx-auto w-full space-y-6">
        
        <div className="flex flex-col sm:flex-row gap-4 items-center p-2 bg-background-secondary rounded-lg shadow-sm">
          <div className="flex flex-1 items-center">
            <div className="relative w-full">
              <select 
                className="appearance-none w-full bg-input-background py-3 pl-4 pr-10 rounded-md border border-input-border focus:border-input-focus-border focus:outline-none focus:ring-2 focus:ring-primary-light cursor-pointer transition-all"
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-foreground-tertiary">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <button 
            onClick={swapLanguages}
            className="p-2.5 rounded-full bg-background-tertiary hover:bg-primary-light text-foreground-secondary hover:text-primary transition-all transform-gpu hover:rotate-180 duration-300 self-center"
            aria-label="Swap languages"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M7 16V4m0 0L3 8m4-4l4 4" />
              <path d="M17 8v12m0 0l4-4m-4 4l-4-4" />
            </svg>
          </button>

          <div className="flex flex-1 items-center">
            <div className="relative w-full">
              <select 
                className="appearance-none w-full bg-input-background py-3 pl-4 pr-10 rounded-md border border-input-border focus:border-input-focus-border focus:outline-none focus:ring-2 focus:ring-primary-light cursor-pointer transition-all"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-foreground-tertiary">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 flex-1 min-h-[350px] md:min-h-[450px]">
          <div className="flex-1 flex flex-col rounded-xl overflow-hidden shadow-card card">
            <div className="p-4 flex justify-between items-center border-b border-card-border bg-background-secondary" >
              <span className="font-medium text-foreground-secondary">Source text</span>

              {sourceText && (
                <button 
                  onClick={() => setSourceText('')}
                  className="text-sm text-foreground-tertiary hover:text-foreground-secondary transition-colors"
                >
                  Clear
                </button>
              )}
            </div>
            <textarea
              className="flex-1 p-4 resize-none w-full bg-card-background outline-none transition-all focus:ring-2 focus:ring-primary-light/50 rounded-b-xl"
              placeholder="Enter your text here..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
            ></textarea>
            <div className="p-2 flex justify-between items-center border-t border-card-border bg-background-secondary">
              <span className="text-xs text-foreground-tertiary">{sourceText.length} characters</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col rounded-xl overflow-hidden shadow-card card">
            <div className="p-4 flex justify-between items-center border-b border-card-border bg-background-secondary">
              <span className="font-medium text-foreground-secondary">Translation</span>
              <div className="flex gap-2">
                {translatedText && (
                  <button 
                    onClick={copyTranslatedText}
                    className="p-1.5 rounded-full hover:bg-background-tertiary relative group"
                    title="Copy to clipboard"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`transition-opacity ${copied ? 'opacity-0' : 'opacity-100'}`}>
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                    </svg>
                    
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`absolute inset-0 m-auto text-success transition-opacity ${copied ? 'opacity-100' : 'opacity-0'}`}>
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                    
                    <span className="absolute left-1/2 -translate-x-1/2 -bottom-8 px-2 py-1 bg-background-tertiary text-foreground-secondary text-xs rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                      {copied ? 'Copied!' : 'Copy'}
                    </span>
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 p-4 resize-none w-full bg-card-background outline-none overflow-auto rounded-b-xl">
              {isTranslating ? (
                <div className="flex items-center justify-center h-full">
                  <div className="relative w-16 h-16">
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-primary-light rounded-full animate-ping opacity-75"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-4 border-t-primary border-primary-light/30 rounded-full animate-spin"></div>
                  </div>
                </div>
              ) : error ? (
                <div className="text-error flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              ) : translatedText ? (
                translatedText
              ) : (
                <span className="text-foreground-tertiary">Translation will appear here</span>
              )}
            </div>
            <div className="p-2 flex justify-between items-center border-t border-card-border bg-background-secondary">
              <span className="text-xs text-foreground-tertiary">{translatedText.length} characters</span>
            </div>
          </div>
        </div>
        
        <div className="mt-6 flex justify-center">
          <button 
              className={`relative overflow-hidden group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl shadow-md transition-all duration-normal`}
            onClick={translateText}
            disabled={isTranslating || !sourceText.trim()}
          >
            <div className="absolute inset-0 bg-gradient-primary transition-opacity duration-normal z-0"></div>
            <div className="absolute inset-0 bg-gradient-accent opacity-0 group-hover:opacity-100 transition-opacity duration-normal z-0"></div>
            
            <span className="relative z-10 flex items-center gap-2">
              {isTranslating ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Translating...
                </span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m5 8 6 6" />
                    <path d="m4 14 6-6 2-3" />
                    <path d="M2 5h12" />
                    <path d="M7 2h1" />
                    <path d="m22 22-5-10-5 10" />
                    <path d="M14 18h6" />
                  </svg>
                  Translate
                </>
              )}
            </span>
            <style jsx>{`
              @supports not (background-image: linear-gradient(to right, #2563eb, #9333ea)) { button {
                  background-color: #4f46e5 !important; 
      }
    }
  `}</style>
          </button>
        </div>
      </main>
    </div>
  );
}