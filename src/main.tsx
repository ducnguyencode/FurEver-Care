import React from "react";
import { createRoot } from "react-dom/client";
import AppShell from "../app/layout";
import HomePage from "../app/page";

import "./styles/globals.css";

function Root() {
  return (
    <AppShell>
      <HomePage />
    </AppShell>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(<Root />);
