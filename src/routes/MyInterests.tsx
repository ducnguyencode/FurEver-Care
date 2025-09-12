import React, { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Interest = { id: string; name: string; when: string };

export default function MyInterests() {
  const interests = useMemo<Interest[]>(() => {
    try {
      const raw = localStorage.getItem("adoption-interests");
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }, []);

  return (
    <div className="max-w-[900px] mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">My Interests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {interests.map((i) => (
            <div
              key={i.id}
              className="p-3 border rounded-md flex items-center justify-between text-sm"
            >
              <span className="font-medium text-primary">{i.name}</span>
              <span className="text-muted-foreground">
                {new Date(i.when).toLocaleString()}
              </span>
            </div>
          ))}
          {interests.length === 0 && (
            <p className="text-sm text-muted-foreground">No interests yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
