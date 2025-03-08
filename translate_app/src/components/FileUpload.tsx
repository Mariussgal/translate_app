// src/components/FileUpload.tsx
"use client"

import { useState } from 'react';
import { translationApi } from '@/lib/api';

interface TranslationResult {
    translations: string[];
    success?: boolean;
    message?: string;
    wordCount?: number;
  }
  

export default function FileUpload() {
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
    <div className="w-full max-w-lg mx-auto p-6 bg-white dark:bg-black/20 rounded-xl shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
        Import Translation Dictionary
      </h2>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Select File</label>
        <div className="flex items-center justify-center w-full">
          <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-lg cursor-pointer hover:bg-black/5 dark:hover:bg-white/5 border-foreground/20">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <svg className="w-10 h-10 mb-3 text-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
              </svg>
              <p className="mb-2 text-sm text-foreground/80">
                <span className="font-semibold">Click to upload</span> or drag and drop
              </p>
              <p className="text-xs text-foreground/60">
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
        <div className="mb-6 p-4 bg-black/5 dark:bg-white/5 rounded-lg">
          <div className="flex items-center">
            <div className="mr-4">
              <svg className="w-8 h-8 text-foreground/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <div className="flex-1 truncate">
              <p className="font-medium truncate">{file.name}</p>
              <p className="text-xs text-foreground/60">
                {(file.size / 1024).toFixed(2)} KB
              </p>
            </div>
            <button 
              onClick={() => setFile(null)}
              className="text-red-500 hover:text-red-700"
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
        className={`w-full px-4 py-3 rounded-lg ${
          isUploading || !file
            ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
            : 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
        } transition-all`}
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
          'Upload Dictionary'
        )}
      </button>
      
      {uploadStatus && (
        <div className={`mt-4 p-4 rounded-lg ${
          uploadStatus.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {uploadStatus.message}
        </div>
      )}
      
      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-3">Supported Formats</h3>
        <ul className="space-y-2 text-sm">
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span><strong>Excel (.xlsx, .xls)</strong>: Spreadsheet with English words in column A and French translations in column B.</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span><strong>CSV (.csv)</strong>: Comma-separated values with English word, followed by French translation.</span>
          </li>
          <li className="flex items-start">
            <svg className="w-5 h-5 text-green-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span><strong>Text (.txt)</strong>: One pair per line in format "english_word=french_word".</span>
          </li>
        </ul>
      </div>
    </div>
  );
}