import React, { Suspense } from "react";
import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from "@/components/mode-toggle";
import { PawPrint } from "lucide-react";
import { Toaster } from "@/components/ui/toaster";
import { Button } from "@/components/ui/button";
import ChatWidget from "@/components/chat-widget";
import "../app/globals.css";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <div className="min-h-screen bg-background text-foreground font-sans antialiased flex flex-col app-bg">
        <header className="sticky top-0 z-40 w-full border-b bg-card/80 backdrop-blur">
          <div className="max-w-[1350px] mx-auto px-4 py-3 flex items-center justify-between">
            <a href="/" className="flex items-center gap-2">
              <img
                src="/LogoFurEver Care.png"
                alt="FurEver Care"
                className="h-6 w-auto hidden sm:block"
              />
              <PawPrint className="h-6 w-6 text-primary sm:hidden" />
              <span className="text-lg font-bold tracking-tight">
                FurEver Care
              </span>
            </a>
            <div className="flex items-center gap-3">
              <a
                href="/map"
                className="text-sm text-muted-foreground hover:text-primary hidden sm:inline-block"
              >
                Map
              </a>
              <a
                href="/qna"
                className="text-sm text-muted-foreground hover:text-primary hidden sm:inline-block"
              >
                Q&A
              </a>
              <a
                href="/contest"
                className="text-sm text-muted-foreground hover:text-primary hidden sm:inline-block"
              >
                Contest
              </a>
              <a
                href="/adoption/matching"
                className="text-sm text-muted-foreground hover:text-primary hidden lg:inline-block"
              >
                Matching
              </a>
              <a
                href="/interests"
                className="text-sm text-muted-foreground hover:text-primary hidden sm:inline-block"
              >
                My Interests
              </a>
              <a
                href="/"
                onClick={(e) => {
                  try {
                    localStorage.removeItem("homepageFormData");
                  } catch {}
                }}
                className="hidden sm:inline-block"
              >
                <Button variant="outline" size="sm" className="h-8 px-3">
                  Switch User
                </Button>
              </a>
              <ModeToggle />
            </div>
          </div>
        </header>

        <main className="flex-1">
          <Suspense fallback={<div className="p-6">Loading...</div>}>
            {children}
          </Suspense>
        </main>

        {/* Page-level components (dashboards) will render their own footer when needed */}

        <Toaster />
        <ChatWidget />
      </div>
    </ThemeProvider>
  );
}
