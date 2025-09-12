import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Step = { id: string; title: string; done: boolean };

export default function AdoptionProcess() {
  const [steps, setSteps] = useState<Step[]>([
    { id: "s1", title: "Fees reviewed", done: false },
    { id: "s2", title: "Vaccination verified", done: false },
    { id: "s3", title: "Spay/Neuter confirmed", done: false },
    { id: "s4", title: "Contract signed", done: false },
  ]);

  const [followups, setFollowups] = useState([
    { day: 7, scheduled: false },
    { day: 30, scheduled: false },
    { day: 90, scheduled: false },
  ]);

  function toggle(id: string) {
    setSteps((prev) =>
      prev.map((s) => (s.id !== id ? s : { ...s, done: !s.done }))
    );
  }

  function schedule(day: number) {
    setFollowups((prev) =>
      prev.map((f) => (f.day !== day ? f : { ...f, scheduled: true }))
    );
  }

  return (
    <div className="max-w-[800px] mx-auto px-4 py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            Transparent Adoption Process
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {steps.map((s) => (
            <div
              key={s.id}
              className="flex items-center justify-between p-3 border rounded-md"
            >
              <span className="text-sm">{s.title}</span>
              <Button
                size="sm"
                variant={s.done ? "secondary" : "outline"}
                onClick={() => toggle(s.id)}
              >
                {s.done ? "Completed" : "Mark complete"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Follow-up Schedule</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {followups.map((f) => (
            <div key={f.day} className="p-3 border rounded-md text-center">
              <div className="font-semibold">Day {f.day}</div>
              <Button
                size="sm"
                className="mt-2"
                variant={f.scheduled ? "secondary" : "outline"}
                onClick={() => schedule(f.day)}
              >
                {f.scheduled ? "Scheduled" : "Schedule"}
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
