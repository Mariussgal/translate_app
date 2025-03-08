// src/app/layout.tsx
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./NavigationBar";
import Image from 'next/image';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Translation Tool",
  description: "English-French translation tool",

};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >

      <div className="w-full bg-gray-800 flex justify-center items-center py-2">
          <Image 
            src="../public/preview_banner.png" 
            alt="Preview Version" 
            width={1000} 
            height={50} 
            className="h-auto max-h-12 w-auto"
            priority
          />
        </div>


        <Navbar />
        {children}
      </body>
    </html>
  );
}