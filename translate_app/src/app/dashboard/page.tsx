"use client"

import { useState } from 'react';
import Footer from '../footer';
import { translationApi } from '@/lib/api';

interface TranslationResult {
  translations: string[];
  success?: boolean;
  message?: string;
  wordCount?: number;
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'dictionary' | 'import'>('dictionary');
  
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full space-y-8">
        <div className="flex flex-col space-y-4">
          <h1 className="text-4xl font-bold gradient-text">
            Admin Dashboard
          </h1>
          <p className="text-foreground/60 text-lg">
            Manage your translation dictionary and import new words.
          </p>
        </div>
        
        <div className="border-b border-foreground/10">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dictionary')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'dictionary'
                  ? 'border-blue-500 text-blue-600 font-semibold'
                  : 'border-transparent text-foreground/60 hover:text-foreground/80 hover:border-foreground/30'
              }`}
            >
              Dictionary Management
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-all duration-200 ${
                activeTab === 'import'
                  ? 'border-blue-500 text-blue-600 font-semibold'
                  : 'border-transparent text-foreground/60 hover:text-foreground/80 hover:border-foreground/30'
              }`}
            >
              Import Translations
            </button>
          </nav>
        </div>
        
        <div className="py-4">
          {activeTab === 'dictionary' ? (
            <DictionaryManagementUI />
          ) : (
            <FileUploadUI />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}


function DictionaryManagementUI() {
  const [fromLang, setFromLang] = useState<'english' | 'french'>('english');
  const [word, setWord] = useState('');
  const [translation, setTranslation] = useState('');
  const [status, setStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  

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
    <div className="w-full max-w-4xl mx-auto p-8 bg-white/40 dark:bg-black/30 backdrop-blur-sm rounded-xl shadow-lg border border-foreground/5">
      <h2 className="text-3xl font-bold mb-8 text-center gradient-text">
        Dictionary Management
      </h2>
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 text-foreground/90">Language Direction</h3>
        <div className="flex items-center space-x-8 p-4 bg-black/5 dark:bg-white/5 rounded-lg">
          <label className="flex items-center cursor-pointer group">
            <div className="relative">
              <input
                type="radio"
                className="peer sr-only"
                name="language"
                checked={fromLang === 'english'}
                onChange={() => setFromLang('english')}
              />
              <div className="w-5 h-5 border-2 border-foreground/30 rounded-full peer-checked:border-blue-500"></div>
              <div className="absolute w-3 h-3 top-1 left-1 rounded-full bg-blue-500 scale-0 peer-checked:scale-100 transition-transform"></div>
            </div>
            <span className="ml-3 group-hover:text-blue-500 transition-colors">English to French</span>
          </label>
          
          <label className="flex items-center cursor-pointer group">
            <div className="relative">
              <input
                type="radio"
                className="peer sr-only"
                name="language"
                checked={fromLang === 'french'}
                onChange={() => setFromLang('french')}
              />
              <div className="w-5 h-5 border-2 border-foreground/30 rounded-full peer-checked:border-blue-500"></div>
              <div className="absolute w-3 h-3 top-1 left-1 rounded-full bg-blue-500 scale-0 peer-checked:scale-100 transition-transform"></div>
            </div>
            <span className="ml-3 group-hover:text-blue-500 transition-colors">French to English</span>
          </label>
        </div>
      </div>
      
      <div className="grid grid-cols-1 gap-8">
        <div className="bg-black/5 dark:bg-white/5 p-6 rounded-lg border border-foreground/10">
          <h3 className="text-xl font-semibold mb-6 flex items-center">

            Word Management
          </h3>
          
          <div className="space-y-6">
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-foreground/80">
                {fromLang === 'english' ? 'English' : 'French'} Word
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder={`Enter ${fromLang === 'english' ? 'English' : 'French'} word...`}
                value={word}
                onChange={(e) => setWord(e.target.value)}
              />
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2 text-foreground/80">
                {fromLang === 'english' ? 'French' : 'English'} Translation
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 bg-white/50 dark:bg-black/20 border border-foreground/20 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                placeholder={`Enter ${fromLang === 'english' ? 'French' : 'English'} translation...`}
                value={translation}
                onChange={(e) => setTranslation(e.target.value)}
              />
            </div>
          </div>
          
          <div className="flex space-x-4 mt-8">
            <button
              onClick={handleAddModify}
              disabled={isLoading || !word.trim() || !translation.trim()}
              className={`flex-1 px-6 py-3 rounded-md font-medium transition-all ${
                isLoading || !word.trim() || !translation.trim()
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-blue-600 to-blue-500 text-white hover:shadow-md hover:from-blue-700 hover:to-blue-600 active:scale-95'
              }`}
            >
              {isLoading ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                  </svg>
                  Add/Modify
                </span>
              )}
            </button>
            <button
              onClick={handleDelete}
              disabled={isLoading || !word.trim()}
              className={`flex-1 px-6 py-3 rounded-md font-medium transition-all ${
                isLoading || !word.trim()
                  ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                  : 'bg-gradient-to-r from-red-500 to-red-400 text-white hover:shadow-md hover:from-red-600 hover:to-red-500 active:scale-95'
              }`}
            >
              <span className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                Delete
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {status && (
        <div className={`mt-8 p-4 rounded-lg ${
          status.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30' 
            : 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/30'
        }`}>
          <div className="flex items-center">
            {status.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {status.message}
          </div>
        </div>
      )}
    </div>
  );
}

function FileUploadUI() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<{type: 'success' | 'error', message: string} | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      const fileExt = selectedFile.name.split('.').pop()?.toLowerCase();
      if (['xlsx', 'xls', 'csv', 'txt'].includes(fileExt || '')) {
        setFile(selectedFile);
        setUploadStatus(null);
      } else {
        setFile(null);
        setUploadStatus({
          type: 'error',
          message: 'Please select a valid file (Excel, CSV, or TXT)'
        });
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setUploadStatus({
        type: 'error',
        message: 'Please select a file first'
      });
      return;
    }

    setIsUploading(true);
    setUploadStatus(null);

    try {
      const result = await translationApi.uploadFile(file) as TranslationResult;
      if (result.success) {
        setUploadStatus({
          type: 'success',
          message: `File uploaded successfully! ${result.wordCount || 'Multiple'} words imported.`
        });
        setFile(null);
        if (document.getElementById('file-input')) {
          (document.getElementById('file-input') as HTMLInputElement).value = '';
        }
      } else {
        setUploadStatus({
          type: 'error',
          message: 'Error uploading file: ' + (result.message || 'Unknown error')
        });
      }
    } catch (err) {
      console.error("Upload error:", err);
      setUploadStatus({
        type: 'error',
        message: 'Error uploading file. Please try again.'
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-8 bg-white/40 dark:bg-black/30 backdrop-blur-sm rounded-xl shadow-lg border border-foreground/5">
      <h2 className="text-3xl font-bold mb-8 text-center gradient-text">
        Import Translation Dictionary
      </h2>
      
      <div className="mb-8">
        <label className="block text-lg font-medium mb-4 text-foreground/90">Select File</label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed rounded-lg cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 transition-colors border-foreground/20 group">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-14 h-14 mb-4 text-foreground/40 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <p className="mb-2 text-base text-foreground/80 group-hover:text-foreground transition-colors">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-sm text-foreground/60 group-hover:text-foreground/80 transition-colors">
                Excel (.xlsx, .xls), CSV (.csv), or Text (.txt)
              </p>
            </div>
            <input 
              id="file-input"
              type="file" 
              className="hidden" 
              accept=".xlsx,.xls,.csv,.txt" 
              onChange={handleFileChange}
            />
          </label>
        </div>
      </div>
      
      {file && (
        <div className="mb-6 p-6 bg-black/5 dark:bg-white/5 rounded-lg border border-foreground/10">
          <div className="flex items-center">
            <div className="mr-4 text-blue-500">
              {file.name.endsWith('.xlsx') || file.name.endsWith('.xls') ? (
                <svg className="w-10 h-10" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6.5L14.5 2z"/>
                  <polyline points="14 2 14 6 18 6"/>
                  <path d="M8 13h2v4H8zm4-5h2v9h-2zm4 3h2v6h-2z"/>
                </svg>
              ) : file.name.endsWith('.csv') ? (
                <svg className="w-10 h-10" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6.5L14.5 2z"/>
                  <polyline points="14 2 14 6 18 6"/>
                  <path d="M8 12h8m-8 4h4"/>
                </svg>
              ) : (
                <svg className="w-10 h-10" fill="currentColor" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V6.5L14.5 2z"/>
                  <polyline points="14 2 14 6 18 6"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                  <line x1="8" y1="16" x2="16" y2="16"/>
                  <line x1="8" y1="8" x2="10" y2="8"/>
                </svg>
              )}
            </div>
            <div className="flex-1 truncate">
              <p className="font-medium text-lg truncate">{file.name}</p>
              <p className="text-sm text-foreground/60">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button 
              onClick={() => setFile(null)}
              className="p-2 rounded-full hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-colors"
              aria-label="Remove file"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
        </div>
      )}
      
      <button
        onClick={handleUpload}
        disabled={isUploading || !file}
        className={`w-full px-6 py-4 rounded-lg font-medium text-lg transition-all ${
          isUploading || !file
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:from-blue-700 hover:to-purple-700 active:scale-98'
        }`}
      >
        {isUploading ? (
          <span className="flex items-center justify-center">
            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Uploading...
          </span>
        ) : (
          <span className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
            </svg>
            Upload Dictionary
          </span>
        )}
      </button>
      
      {uploadStatus && (
        <div className={`mt-6 p-4 rounded-lg ${
          uploadStatus.type === 'success' 
            ? 'bg-green-100 text-green-800 border border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800/30' 
            : 'bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/20 dark:text-red-300 dark:border-red-800/30'
        }`}>
          <div className="flex items-center">
            {uploadStatus.type === 'success' ? (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            )}
            {uploadStatus.message}
          </div>
        </div>
      )}
      
      <div className="mt-10 pt-6 border-t border-foreground/10">
        <h3 className="text-xl font-semibold mb-4 text-foreground/90">Supported Formats</h3>
        <ul className="space-y-4 text-sm">
          <li className="flex items-start p-3 bg-black/5 dark:bg-white/5 rounded-lg">
            <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <div>
              <strong className="text-foreground/90">Excel (.xlsx, .xls)</strong>
              <p className="mt-1">Spreadsheet with English words in column A and French translations in column B.</p>
            </div>
          </li>
          <li className="flex items-start p-3 bg-black/5 dark:bg-white/5 rounded-lg">
            <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <div>
              <strong className="text-foreground/90">CSV (.csv)</strong>
              <p className="mt-1">Comma-separated values with English word, followed by French translation.</p>
            </div>
          </li>
          <li className="flex items-start p-3 bg-black/5 dark:bg-white/5 rounded-lg">
            <svg className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <div>
              <strong className="text-foreground/90">Text (.txt)</strong>
              <p className="mt-1">One pair per line in format "english_word=french_word".</p>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
}