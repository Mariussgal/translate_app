"use client"

import { useState } from 'react';
import Footer from '../footer';
import FileUpload from '@/components/FileUpload';
import DictionaryManagement from '@/components/DictionaryManagement';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState<'dictionary' | 'import'>('dictionary');

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 flex flex-col p-4 sm:p-6 md:p-8 max-w-6xl mx-auto w-full space-y-6">
        <div className="flex flex-col space-y-4">
          <h1 className="text-3xl font-bold ">Admin Dashboard</h1>
          <p className="text-foreground/60">
            Manage your translation dictionary and import new words.
          </p>
        </div>
        
        <div className="border-b border-foreground/10">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('dictionary')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'dictionary'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-foreground/60 hover:text-foreground/80 hover:border-foreground/30'
              }`}
            >
              Dictionary Management
            </button>
            <button
              onClick={() => setActiveTab('import')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'import'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-foreground/60 hover:text-foreground/80 hover:border-foreground/30'
              }`}
            >
              Import Translations
            </button>
          </nav>
        </div>
        
        <div className="py-4">
          {activeTab === 'dictionary' ? (
            <DictionaryManagement />
          ) : (
            <FileUpload />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}