import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";

type Answer = {
  id: string;
  author: string;
  content: string;
  upvotes: number;
  accepted?: boolean;
};
type Thread = {
  id: string;
  title: string;
  topic: string;
  createdBy: string;
  answers: Answer[];
};

const seedThreads: Thread[] = [
  {
    id: "t1",
    title: "Puppy diarrhea for 2 days, what to do?",
    topic: "health",
    createdBy: "Alice",
    answers: [
      {
        id: "a1",
        author: "Dr. John",
        content:
          "Ensure hydration, bland diet. If persists >24h or lethargy, visit a clinic.",
        upvotes: 12,
        accepted: true,
      },
      {
        id: "a2",
        author: "Trainer Mia",
        content: "Check for sudden diet changes.",
        upvotes: 5,
      },
    ],
  },
];

export default function QnA() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  const [topic, setTopic] = useState("all");
  const [threads, setThreads] = useState<Thread[]>(() => {
    const raw = localStorage.getItem("qna-threads");
    return raw ? JSON.parse(raw) : seedThreads;
  });

  useEffect(() => {
    localStorage.setItem("qna-threads", JSON.stringify(threads));
  }, [threads]);

  const filtered = useMemo(
    () =>
      threads.filter(
        (t) =>
          (topic === "all" || t.topic === topic) &&
          (!q || t.title.toLowerCase().includes(q.toLowerCase()))
      ),
    [q, topic, threads]
  );

  function addThread() {
    if (!q.trim()) return;
    setThreads((prev) => [
      {
        id: `t${prev.length + 1}`,
        title: q.trim(),
        topic: topic === "all" ? "general" : topic,
        createdBy: "You",
        answers: [],
      },
      ...prev,
    ]);
    setQ("");
  }

  function upvote(tid: string, aid: string) {
    setThreads((prev) =>
      prev.map((t) =>
        t.id !== tid
          ? t
          : {
              ...t,
              answers: t.answers.map((a) =>
                a.id !== aid ? a : { ...a, upvotes: a.upvotes + 1 }
              ),
            }
      )
    );
  }

  function accept(tid: string, aid: string) {
    setThreads((prev) =>
      prev.map((t) =>
        t.id !== tid
          ? t
          : {
              ...t,
              answers: t.answers.map((a) => ({ ...a, accepted: a.id === aid })),
            }
      )
    );
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8 space-y-6">
      <div className="flex items-center gap-4 mb-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Q&A Community</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input
              placeholder="Ask a question..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
            <select
              className="border rounded-md px-3 py-2"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            >
              <option value="all">All Topics</option>
              <option value="health">Health</option>
              <option value="training">Training</option>
              <option value="nutrition">Nutrition</option>
              <option value="general">General</option>
            </select>
            <Button onClick={addThread} className="font-medium">
              Post
            </Button>
          </div>
        </CardContent>
      </Card>

      {filtered.map((t) => (
        <Card key={t.id} className="overflow-hidden">
          <CardHeader>
            <CardTitle className="text-base sm:text-lg flex items-center gap-2">
              {t.title}
              <Badge variant="outline" className="capitalize">
                {t.topic}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {t.answers.map((a) => (
              <div key={a.id} className="p-3 border rounded-md">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-primary">{a.author}</span>
                  {a.accepted && (
                    <Badge className="bg-primary text-primary-foreground">
                      Accepted
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-foreground mt-2">{a.content}</p>
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => upvote(t.id, a.id)}
                  >
                    Upvote ({a.upvotes})
                  </Button>
                  <Button size="sm" onClick={() => accept(t.id, a.id)}>
                    Accept
                  </Button>
                </div>
              </div>
            ))}
            {t.answers.length === 0 && (
              <p className="text-sm text-muted-foreground">
                No answers yet. Experts reply within 24–48 hours.
              </p>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
