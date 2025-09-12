import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type Entry = { id: string; title: string; amount: number };

export default function MicroDonations() {
  const [ledger, setLedger] = useState<Entry[]>([]);

  function tip(amount: number) {
    setLedger((prev) => [
      { id: `t${prev.length + 1}`, title: "Tip", amount },
      ...prev,
    ]);
  }

  const total = useMemo(
    () => ledger.reduce((s, e) => s + e.amount, 0),
    [ledger]
  );

  return (
    <div className="max-w-[700px] mx-auto px-4 py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Micro-donations</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex gap-2">
            <Button onClick={() => tip(10000)}>Tip 10k</Button>
            <Button onClick={() => tip(20000)}>Tip 20k</Button>
            <Button onClick={() => tip(50000)}>Tip 50k</Button>
          </div>
          <div className="text-sm text-muted-foreground">
            Transparent ledger below (demo, no gateway connected).
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-primary">
            Ledger{" "}
            <Badge variant="secondary">
              Total {total.toLocaleString()} VND
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          {ledger.map((e) => (
            <div
              key={e.id}
              className="flex items-center justify-between p-2 border rounded-md text-sm"
            >
              <span>{e.title}</span>
              <span>{e.amount.toLocaleString()} VND</span>
            </div>
          ))}
          {ledger.length === 0 && (
            <p className="text-sm text-muted-foreground">No donations yet.</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
