import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import { Providers } from "@/components/providers/Providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "KidsCode - Learn Web Development",
  description: "An interactive platform for kids to learn web development through block-based programming and real code.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <div className="min-h-screen flex flex-col">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="bg-gray-100 py-6">
              <div className="container mx-auto px-4">
                <div className="flex justify-between items-center">
                  <p className="text-gray-600">© 2024 KidsCode. All rights reserved.</p>
                  <div className="space-x-4">
                    <a href="/about" className="text-gray-600 hover:text-gray-900">About</a>
                    <a href="/contact" className="text-gray-600 hover:text-gray-900">Contact</a>
                    <a href="/privacy" className="text-gray-600 hover:text-gray-900">Privacy</a>
                  </div>
                </div>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
