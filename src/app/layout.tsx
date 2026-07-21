import type { Metadata } from "next";
import { Outfit, Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { getContent } from "@/actions/contentActions";
import { ContentProvider } from "@/contexts/ContentContext";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
  weight: ["800", "900"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "pimix.ai",
  description: "Elite marketing platform for a cutting-edge generative AI & autonomous agents agency.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const initialContent = await getContent();

  return (
    <html
      lang="en"
      className={`${outfit.variable} ${inter.variable} h-full antialiased dark`}
    >
      <body className="min-h-full flex flex-col text-[var(--foreground)] font-sans selection:bg-[var(--primary)]/30 selection:text-white bg-[#efe6dd]">
        <ContentProvider initialContent={initialContent}>
          <Navbar />
          <main className="flex-grow w-full flex flex-col relative z-10 bg-[var(--background)]">
            {children}
          </main>
          <Footer />
        </ContentProvider>
      </body>
    </html>
  );
}
