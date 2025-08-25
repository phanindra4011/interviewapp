import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { InterviewProvider } from "@/context/interview-provider";
import { SidebarProvider } from "@/components/ui/sidebar";
import { SidebarNav } from "@/components/layout/sidebar-nav";
import { Header } from "@/components/layout/header";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "AceInterview",
  description: "Your personal AI-powered interview coach",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        ></link>
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <InterviewProvider>
          <SidebarProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <div className="flex flex-1">
                <SidebarNav />
                <main className="flex-1 overflow-y-auto p-4 pt-16 md:p-8 md:pt-8">
                  {children}
                </main>
              </div>
            </div>
            <Toaster />
          </SidebarProvider>
        </InterviewProvider>
      </body>
    </html>
  );
}
