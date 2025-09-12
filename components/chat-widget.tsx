"use client";

import React, { useEffect, useRef, useState } from "react";
import { MessageSquare, X, Send } from "lucide-react";
import { Button } from "@/components/ui/button";

type ChatMsg = { role: "bot" | "user"; text: string };

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [msgs, setMsgs] = useState<ChatMsg[]>([
    { role: "bot", text: "Hi! How can I help you with your pet today?" },
  ]);
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (boxRef.current) {
      boxRef.current.scrollTop = boxRef.current.scrollHeight;
    }
  }, [msgs, open]);

  function send() {
    if (!input.trim()) return;
    const q = input.trim();
    setMsgs((prev) => [...prev, { role: "user", text: q }]);
    setInput("");
    // Simple rule-based hints (placeholder for future backend)
    const lower = q.toLowerCase();
    let a = "Thanks! I'll pass that to our team.";
    if (
      lower.includes("vaccine") ||
      lower.includes("tiem") ||
      lower.includes("vaccination")
    ) {
      a = "For vaccinations, open E‑PetBook to track shots and set reminders.";
    } else if (
      lower.includes("lost") ||
      lower.includes("qr") ||
      lower.includes("pet id")
    ) {
      a = "Use Pet ID QR in your dashboard and share the public link.";
    } else if (lower.includes("adopt")) {
      a = "Try Adoption Matching to find a suitable pet for your lifestyle.";
    }
    setTimeout(
      () => setMsgs((prev) => [...prev, { role: "bot", text: a }]),
      400
    );
  }

  return (
    <div className="fixed bottom-20 sm:bottom-6 right-4 z-50">
      {open && (
        <div className="mb-3 w-[92vw] max-w-sm bg-card border rounded-xl shadow-xl overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-3 py-2 border-b bg-card/80">
            <div className="font-semibold">FurEver Care Assistant</div>
            <button
              onClick={() => setOpen(false)}
              className="p-1 rounded hover:bg-muted"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div
            ref={boxRef}
            className="px-3 py-3 space-y-2 max-h-80 overflow-auto bg-background"
          >
            {msgs.map((m, i) => (
              <div
                key={i}
                className={`text-sm ${
                  m.role === "user" ? "text-right" : "text-left"
                }`}
              >
                <span
                  className={`inline-block px-3 py-2 rounded-lg ${
                    m.role === "user"
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted"
                  }`}
                >
                  {m.text}
                </span>
              </div>
            ))}
          </div>
          <div className="p-2 border-t flex items-center gap-2">
            <input
              className="flex-1 rounded-md border px-3 py-2 text-sm bg-background"
              placeholder="Ask about pet care..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send()}
            />
            <Button size="sm" onClick={send} className="px-2">
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-12 h-12 rounded-full shadow-lg bg-primary text-primary-foreground flex items-center justify-center hover:brightness-110"
        aria-label="Open chat"
      >
        <MessageSquare className="h-5 w-5" />
      </button>
    </div>
  );
}
