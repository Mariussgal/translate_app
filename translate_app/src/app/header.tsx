"use client";

export default function Header() {
  return (
    <header className="flex-1 flex flex-col p-4 sm:p-6 md:p-6 max-w-5xl mx-auto w-full">
      <div className="max-w-6xl mx-auto flex items-center justify-between">

        <div className="text-center space-y-4 mb-8">
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold gradient-text">
        Instantaneous translation
          </h1>
          <p className="text-foreground/60 max-w-xl mx-auto">
            Translate your sentences between french and english within few seconds 
          </p>
          <div className="flex justify-center gap-4 text-sm text-foreground/60">
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              Fast
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4 ml-2"  fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
              Secure
            </span>
            <span className="flex items-center gap-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
              </svg>
              Free
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}