import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "./NavigationBar";

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

  openGraph: {
    title: "Translation Tool",
    description: "English-French translation tool",
    images: [
      {
        url: "/preview_banner.png",
        width: 1200,
        height: 630,
        alt: "Translation Tool Preview",
      },
    ],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Translation Tool",
    description: "English-French translation tool",
    images: [
      {
        url: "/preview_banner.png", 
        width: 1200,
        height: 630,
        alt: "Translation Tool Preview",
      },
    ],
  },
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
        <Navbar />
        {children}
      </body>
    </html>
  );
}