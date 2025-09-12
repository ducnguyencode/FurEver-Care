import React, { Suspense } from "react";
import { Toaster } from "@/components/ui/toaster";
import "../app/globals.css";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="font-sans antialiased">
      <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
      <Toaster />
    </div>
  );
}
