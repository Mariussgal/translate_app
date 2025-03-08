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

  const copyTranslatedText = () => {
    navigator.clipboard.writeText(translatedText);
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
        
        <div className="flex flex-col sm:flex-row gap-4 items-center p-2 bg-black/5 dark:bg-white/5 rounded-lg">
          <div className="flex flex-1 items-center">
            <div className="relative w-full">
              <select 
                className="appearance-none w-full bg-transparent py-3 pl-4 pr-10 rounded-md border border-foreground/20 focus:border-blue-500 focus:outline-none cursor-pointer"
                value={sourceLanguage}
                onChange={(e) => setSourceLanguage(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>

          <button 
            onClick={swapLanguages}
            className="p-2 rounded-full hover:bg-black/5 dark:hover:bg-white/10 self-center"
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
                className="appearance-none w-full bg-transparent py-3 pl-4 pr-10 rounded-md border border-foreground/20 focus:border-blue-500 focus:outline-none cursor-pointer"
                value={targetLanguage}
                onChange={(e) => setTargetLanguage(e.target.value)}
              >
                {languages.map((lang) => (
                  <option key={lang} value={lang}>{lang}</option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2">
                <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 flex-1 min-h-[350px] md:min-h-[450px]">
          <div className="flex-1 flex flex-col border rounded-xl overflow-hidden shadow-md bg-white/50 dark:bg-black/20">
            <div className="p-4 flex justify-between items-center border-b bg-black/5 dark:bg-white/5" >
              <span className="font-medium text-foreground/80">Source text</span>

                {sourceText && (
                <button 
                  onClick={() => setSourceText('')}
                  className="text-sm text-foreground/60 hover:text-foreground transition-colors"
                >
                  Clear
                </button>
              )}

            </div>
            <textarea
              className="flex-1 p-4 resize-none w-full bg-transparent outline-none"
              placeholder="Enter your text here..."
              value={sourceText}
              onChange={(e) => setSourceText(e.target.value)}
            ></textarea>
            <div className="p-2 flex justify-between items-center border-t bg-black/5 dark:bg-white/5">
              <span className="text-xs text-foreground/60">{sourceText.length} characters</span>
            </div>
          </div>

          <div className="flex-1 flex flex-col border rounded-lg overflow-hidden shadow-sm">
            <div className="p-4 flex justify-between items-center border-b bg-black/5 dark:bg-white/5">
              <span className="font-medium text-foreground/80">Translation</span>
              <div className="flex gap-2">
                {translatedText && (
                  <button 
                    onClick={copyTranslatedText}
                    className="p-1.5 rounded-full hover:bg-black/5 dark:hover:bg-white/10"
                    title="Copy to clipboard"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" />
                      <rect x="8" y="2" width="8" height="4" rx="1" ry="1" />
                    </svg>
                  </button>
                )}
              </div>
            </div>
            <div className="flex-1 p-4 resize-none w-full bg-transparent outline-none overflow-auto">
              {isTranslating ? (
                <div className="flex items-center justify-center h-full">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                </div>
              ) : error ? (
                <div className="text-red-500">{error}</div>
              ) : translatedText ? (
                translatedText
              ) : (
                <span className="text-foreground/50">Translation will appear here</span>
              )}
            </div>
            <div className="p-2 flex justify-between items-center border-t bg-black/5 dark:bg-white/5">
              <span className="text-xs text-foreground/60">{translatedText.length} characters</span>
            </div>
          </div>
        </div>

        <div className="mt-6 flex justify-center">
          <button 
            className={`group relative ${
              isTranslating ? 'bg-gray-400' : 'bg-gradient-to-r from-blue-600 to-purple-600'
            } text-white px-8 py-3 rounded-lg shadow-md transition-all hover:shadow-lg ${
              isTranslating ? '' : 'hover:scale-105 active:scale-95'
            }`}
            onClick={translateText}
            disabled={isTranslating || !sourceText.trim()}
          >
            <span className="flex items-center gap-2">
              {isTranslating ? (
                <span className="animate-pulse">Translating...</span>
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