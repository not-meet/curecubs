import React from "react";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import VerticalNavbar from "@/components/NavBar";
import Footer from "./(root)/_components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MILO",
  description: "Medical Insights & Lifestyle Organiser",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased m-4 overflow-scroll`}>
          {/* Layout with Navbar & Content */}
          <div className="flex flex-col min-h-screen">
            {/* Main content area with sidebar */}
            <div className="flex flex-1">
              {/* Navbar */}
              <div className="absolute ml-10 z-10">
                <VerticalNavbar />
              </div>

              {/* Page Content */}
              <main className="flex-1 overflow-auto">{children}</main>
            </div>

            {/* Footer - outside the flex container */}
            <Footer />
          </div>
        </body>
      </html>
    </ClerkProvider>
  );
}
