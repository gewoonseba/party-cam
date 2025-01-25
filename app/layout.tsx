import { Analytics } from "@vercel/analytics/react";
import { Inter } from "next/font/google";
import localFont from "next/font/local";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

const picNic = localFont({
  src: "./fonts/PicNic.woff",
  display: "swap",
  variable: "--font-picnic",
});

export const metadata = {
  title: "Thirty - Party Cam",
  description: "Share your party moments",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`dark ${inter.variable} ${picNic.variable}`}>
      <body className="font-sans bg-black min-h-screen">
        {children}
        <Analytics />
      </body>
    </html>
  );
}
