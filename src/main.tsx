import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "../app/layout";
import HomePage from "../app/page";
import PublicPetProfile from "./routes/PublicPetProfile";
import CommunityMap from "./routes/CommunityMap";
import QnA from "./routes/QnA";
import PhotoContest from "./routes/PhotoContest";
import MemoriesTimeline from "./routes/MemoriesTimeline";
import AdoptionMatching from "./routes/AdoptionMatching";
import AdoptionProcess from "./routes/AdoptionProcess";
import MicroDonations from "./routes/MicroDonations";
import LegalPrivacy from "./routes/LegalPrivacy";
import LegalTerms from "./routes/LegalTerms";
import MyInterests from "./routes/MyInterests";

import "./styles/globals.css";

function Root() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path=":petHandle" element={<PublicPetProfile />} />
          <Route path="/map" element={<CommunityMap />} />
          <Route path="/qna" element={<QnA />} />
          <Route path="/contest" element={<PhotoContest />} />
          <Route path="/memories" element={<MemoriesTimeline />} />
          <Route path="/adoption/matching" element={<AdoptionMatching />} />
          <Route path="/adoption/process" element={<AdoptionProcess />} />
          <Route path="/donate" element={<MicroDonations />} />
          <Route path="/privacy" element={<LegalPrivacy />} />
          <Route path="/terms" element={<LegalTerms />} />
          <Route path="/interests" element={<MyInterests />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(<Root />);
