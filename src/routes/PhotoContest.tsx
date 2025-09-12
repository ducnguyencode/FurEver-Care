import React, { useEffect, useMemo, useRef, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

type Entry = {
  id: string;
  author: string;
  hashtag: string;
  image: string;
  votes: number;
};

export default function PhotoContest() {
  const [entries, setEntries] = useState<Entry[]>(() => {
    const raw = localStorage.getItem("contest-entries");
    return raw ? JSON.parse(raw) : [];
  });
  const [hashtag, setHashtag] = useState("#HappyPaws");
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    localStorage.setItem("contest-entries", JSON.stringify(entries));
  }, [entries]);

  function submitEntry(file?: File) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      setEntries((prev) => [
        {
          id: `e${prev.length + 1}`,
          author: "You",
          hashtag,
          image: e.target?.result as string,
          votes: 0,
        },
        ...prev,
      ]);
    };
    reader.readAsDataURL(file);
  }

  function vote(id: string) {
    setEntries((prev) =>
      prev.map((e) => (e.id !== id ? e : { ...e, votes: e.votes + 1 }))
    );
  }

  const mostVoted = useMemo(
    () => [...entries].sort((a, b) => b.votes - a.votes).slice(0, 3),
    [entries]
  );

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Monthly Photo Contest</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <Input
              value={hashtag}
              onChange={(e) => setHashtag(e.target.value)}
            />
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => submitEntry(e.target.files?.[0] || undefined)}
            />
            <Button
              onClick={() => fileRef.current?.click()}
              className="font-medium"
            >
              Submit Entry
            </Button>
          </div>
          <p className="text-sm text-muted-foreground">
            Use a clear theme hashtag. Anti-spam: one vote per session (demo).
          </p>
        </CardContent>
      </Card>

      {mostVoted.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-primary">Top Voted</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mostVoted.map((e) => (
              <div key={e.id} className="rounded-lg overflow-hidden border">
                <img
                  src={e.image}
                  alt={e.hashtag}
                  className="w-full aspect-square object-cover"
                />
                <div className="p-3 text-sm flex items-center justify-between">
                  <span>{e.hashtag}</span>
                  <span>{e.votes} votes</span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {entries.map((e) => (
          <Card key={e.id} className="overflow-hidden">
            <img
              src={e.image}
              alt={e.hashtag}
              className="w-full aspect-square object-cover"
            />
            <CardContent className="p-3 flex items-center justify-between">
              <span className="text-sm">{e.hashtag}</span>
              <Button size="sm" onClick={() => vote(e.id)}>
                Vote ({e.votes})
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
