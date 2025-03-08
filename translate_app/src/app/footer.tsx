"use client"

export default function Footer(){
    return(
    <footer className="bg-black/5 dark:bg-white/5 py-4 px-6">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-wrap justify-center sm:justify-start gap-4">
            <a href="#" className="text-sm hover:underline">About</a>
            <a href="#" className="text-sm hover:underline">Help</a>
          </div>
        </div>
      </footer>

    );

}