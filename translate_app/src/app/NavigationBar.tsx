"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
export default function Navbar() {
  const pathname = usePathname();

  return (
    <nav className="navbar sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center transition-transform hover:scale-105">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="m5 8 6 6" />
                <path d="m4 14 6-6 2-3" />
                <path d="M2 5h12" />
                <path d="M7 2h1" />
                <path d="m22 22-5-10-5 10" />
                <path d="M14 18h6" />
              </svg>
              <span className="ml-2 text-xl font-bold gradient-text">TranslationApp</span>
            </Link>
            <div className="ml-6 flex space-x-4 md:space-x-8">
              <Link
                href="/"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/' 
                    ? 'border-primary text-foreground' 
                    : 'border-transparent text-foreground-tertiary hover:border-foreground-tertiary/20 hover:text-foreground-secondary'
                }`}
              >
                Translator
              </Link>
              <Link
                href="/dashboard"
                className={`inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium ${
                  pathname === '/dashboard' 
                    ? 'border-primary text-foreground' 
                    : 'border-transparent text-foreground-tertiary hover:border-foreground-tertiary/20 hover:text-foreground-secondary'
                }`}
              >
                Dashboard
              </Link>
            </div>
          </div>

        </div>
      </div>
    </nav>
  );
}