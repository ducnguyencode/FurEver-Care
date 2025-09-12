import React, { useEffect, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Memory = {
  id: string;
  date: string;
  title: string;
  description?: string;
  media?: string;
};

export default function MemoriesTimeline() {
  const [items, setItems] = useState<Memory[]>(() => {
    const raw = localStorage.getItem("memories-items");
    return raw ? JSON.parse(raw) : [];
  });
  useEffect(() => {
    localStorage.setItem("memories-items", JSON.stringify(items));
  }, [items]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [desc, setDesc] = useState("");
  const fileRef = useRef<HTMLInputElement>(null);

  function addMemory(file?: File) {
    const id = `m${items.length + 1}`;
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setItems((prev) => [
          {
            id,
            date,
            title,
            description: desc,
            media: e.target?.result as string,
          },
          ...prev,
        ]);
      };
      reader.readAsDataURL(file);
    } else {
      setItems((prev) => [{ id, date, title, description: desc }, ...prev]);
    }
    setTitle("");
    setDate("");
    setDesc("");
  }

  return (
    <div className="max-w-[900px] mx-auto px-4 py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Memories & Milestones</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Input
            placeholder="Date (YYYY-MM-DD)"
            value={date}
            onChange={(e) => setDate(e.target.value)}
          />
          <Input
            placeholder="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <div className="flex gap-2">
            <input
              ref={fileRef}
              type="file"
              accept="image/*,video/*"
              className="hidden"
              onChange={(e) => addMemory(e.target.files?.[0] || undefined)}
            />
            <Button
              onClick={() => fileRef.current?.click()}
              className="font-medium"
            >
              Add Media
            </Button>
            <Button
              variant="outline"
              onClick={() => addMemory(undefined)}
              className="font-medium"
            >
              Add Text
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {items.map((m) => (
          <div key={m.id} className="relative pl-6">
            <div className="absolute left-0 top-2 w-3 h-3 rounded-full bg-primary" />
            <Card>
              <CardContent className="p-4 space-y-2">
                <div className="text-sm text-muted-foreground">{m.date}</div>
                <div className="font-semibold text-primary">{m.title}</div>
                {m.description && <p className="text-sm">{m.description}</p>}
                {m.media && (
                  <img
                    src={m.media}
                    alt={m.title}
                    className="w-full max-h-[360px] object-cover rounded"
                  />
                )}
              </CardContent>
            </Card>
          </div>
        ))}
        {items.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No memories yet. Add your first milestone.
          </p>
        )}
      </div>
    </div>
  );
}
