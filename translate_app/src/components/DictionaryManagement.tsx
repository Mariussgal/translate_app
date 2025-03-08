"use client"

import { useState } from 'react';
import { translationApi } from '@/lib/api';

type WordPair = {
  word: string;
  translation: string;
};

interface TranslationResult {
    translations: string[];
    success?: boolean;
    message?: string;
    wordCount?: number;
  }
  

export default function DictionaryManagement() {
  const [fromLang, setFromLang] = useState<'english' | 'french'>('english');
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchResult, setSearchResult] = useState<string[]>([]);
  const [status, setStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [recentWords, setRecentWords] = useState<WordPair[]>([]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    
    setIsLoading(true);
    setStatus(null);
    
    try {
      const result = await translationApi.translate(searchTerm, fromLang) as TranslationResult;
      if (result.translations && result.translations.length > 0) {
        setSearchResult(result.translations);
        setStatus({
          type: 'success',
          message: 'Word found in dictionary!'
        });
      } else {
        setSearchResult([]);
        setStatus({
          type: 'error',
          message: 'Word not found in dictionary.'
        });
      }
    } catch (err) {
      console.error("Search error:", err);
      setStatus({
        type: 'error',
        message: 'Error searching for word. Please try again.'
      });
      setSearchResult([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddModify = async () => {
    if (!word.trim() || !translation.trim()) {
      setStatus({
        type: 'error',
        message: 'Both word and translation are required.'
      });
      return;
    }
    
    setIsLoading(true);
    setStatus(null);
    
    try {
      await translationApi.addModifyWord(word, translation, fromLang);
      setStatus({
        type: 'success',
        message: 'Word added/modified successfully!'
      });
      
      setRecentWords(prev => [
        { word, translation },
        ...prev.slice(0, 4) 
      ]);
      
      setWord('');
      setTranslation('');
    } catch (err) {
      console.error("Add/modify error:", err);
      setStatus({
        type: 'error',
        message: 'Error adding/modifying word. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!word.trim()) {
      setStatus({
        type: 'error',
        message: 'Please enter a word to delete.'
      });
      return;
    }
    
    if (!confirm(`Are you sure you want to delete "${word}" and all its translations?`)) {
      return;
    }
    
    setIsLoading(true);
    setStatus(null);
    
    try {
      await translationApi.deleteWord(word, fromLang);
      setStatus({
        type: 'success',
        message: 'Word deleted successfully!'
      });
      
      setWord('');
      setTranslation('');
    } catch (err) {
      console.error("Delete error:", err);
      setStatus({
        type: 'error',
        message: 'Error deleting word. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white dark:bg-black/20 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Dictionary Management
      </h2>
      
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <span className="mr-4 font-medium">Language Direction:</span>
          <div className="flex space-x-4">
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="language"
                checked={fromLang === 'english'}
                onChange={() => setFromLang('english')}
              />
              <span className="ml-2">English to French</span>
            </label>
            <label className="inline-flex items-center">
              <input
                type="radio"
                className="form-radio text-blue-600"
                name="language"
                checked={fromLang === 'french'}
                onChange={() => setFromLang('french')}
              />
              <span className="ml-2">French to English</span>
            </label>
          </div>
        </div>
      </div>
      
      <div className=" grid grid-cols-1 md:grid-cols-2 gap-8">

        
        <div className="bg-black/5 dark:bg-white/5 p-4 rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Add/Modify/Delete Words</h3>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              {fromLang === 'english' ? 'English' : 'French'} Word
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter ${fromLang === 'english' ? 'English' : 'French'} word...`}
              value={word}
              onChange={(e) => setWord(e.target.value)}
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              {fromLang === 'english' ? 'French' : 'English'} Translation
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder={`Enter ${fromLang === 'english' ? 'French' : 'English'} translation...`}
              value={translation}
              onChange={(e) => setTranslation(e.target.value)}
            />
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={handleAddModify}
              disabled={isLoading || !word.trim() || !translation.trim()}
              className={`flex-1 px-4 py-2 rounded-md ${
                isLoading || !word.trim() || !translation.trim()
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-green-600 text-white hover:bg-green-700'
              }`}
            >
              Add/Modify
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading || !word.trim()}
              className={`flex-1 px-4 py-2 rounded-md ${
                isLoading || !word.trim()
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      
      {status && (
        <div className={`mt-6 p-4 rounded-lg ${
          status.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {status.message}
        </div>
      )}
      

    </div>
  );
}