import React, { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Coffee, Dog, Hotel, TreePine, ArrowLeft } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";

type Place = {
  id: string;
  name: string;
  type: "cafe" | "park" | "hotel" | "other";
  address: string;
  radiusRules: { hasSeparateArea: boolean; leashRequired: boolean };
};

const seedPlaces: Place[] = [
  {
    id: "p1",
    name: "Paws & Beans Cafe",
    type: "cafe",
    address: "12 Bark Street",
    radiusRules: { hasSeparateArea: true, leashRequired: false },
  },
  {
    id: "p2",
    name: "Green Meadow Park",
    type: "park",
    address: "45 Meadow Ave",
    radiusRules: { hasSeparateArea: false, leashRequired: true },
  },
  {
    id: "p3",
    name: "TailWag Hotel",
    type: "hotel",
    address: "77 Petway Blvd",
    radiusRules: { hasSeparateArea: true, leashRequired: true },
  },
];

export default function CommunityMap() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [type, setType] = useState<string>("all");
  const [hasSeparateArea, setHasSeparateArea] = useState<string>("any");
  const [leashRequired, setLeashRequired] = useState<string>("any");
  const [checkins, setCheckins] = useState<Record<string, number>>({});
  const [suggest, setSuggest] = useState<{ open: boolean; place?: Place }>({
    open: false,
  });

  // load persisted check-ins
  useEffect(() => {
    const raw = localStorage.getItem("map-checkins");
    if (raw) setCheckins(JSON.parse(raw));
  }, []);

  // persist on change
  useEffect(() => {
    localStorage.setItem("map-checkins", JSON.stringify(checkins));
  }, [checkins]);

  const filtered = useMemo(() => {
    return seedPlaces.filter((p) => {
      if (type !== "all" && p.type !== type) return false;
      if (
        hasSeparateArea !== "any" &&
        p.radiusRules.hasSeparateArea !== (hasSeparateArea === "true")
      )
        return false;
      if (
        leashRequired !== "any" &&
        p.radiusRules.leashRequired !== (leashRequired === "true")
      )
        return false;
      if (
        query &&
        !`${p.name} ${p.address}`.toLowerCase().includes(query.toLowerCase())
      )
        return false;
      return true;
    });
  }, [query, type, hasSeparateArea, leashRequired]);

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
          <CardTitle className="text-primary">Pet-Friendly Places Map</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
            <Input
              placeholder="Search by name or address..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Select value={type} onValueChange={setType}>
              <SelectTrigger>
                <SelectValue placeholder="Type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All</SelectItem>
                <SelectItem value="cafe">Cafe</SelectItem>
                <SelectItem value="park">Park</SelectItem>
                <SelectItem value="hotel">Hotel</SelectItem>
              </SelectContent>
            </Select>
            <Select value={hasSeparateArea} onValueChange={setHasSeparateArea}>
              <SelectTrigger>
                <SelectValue placeholder="Separate Area" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Area</SelectItem>
                <SelectItem value="true">Has Separate Area</SelectItem>
                <SelectItem value="false">No Separate Area</SelectItem>
              </SelectContent>
            </Select>
            <Select value={leashRequired} onValueChange={setLeashRequired}>
              <SelectTrigger>
                <SelectValue placeholder="Leash" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="any">Any Leash Policy</SelectItem>
                <SelectItem value="true">Leash Required</SelectItem>
                <SelectItem value="false">Off-leash Allowed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filtered.map((p) => (
              <Card key={p.id} className="overflow-hidden">
                <CardContent className="p-4 space-y-2">
                  <div className="flex items-center gap-2">
                    {p.type === "cafe" && (
                      <Coffee className="h-4 w-4 text-primary" />
                    )}
                    {p.type === "park" && (
                      <TreePine className="h-4 w-4 text-primary" />
                    )}
                    {p.type === "hotel" && (
                      <Hotel className="h-4 w-4 text-primary" />
                    )}
                    {p.type === "other" && (
                      <Dog className="h-4 w-4 text-primary" />
                    )}
                    <span className="font-semibold text-primary">{p.name}</span>
                  </div>
                  <p className="text-sm text-muted-foreground flex items-center gap-2">
                    <MapPin className="h-4 w-4" /> {p.address}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">
                      {p.radiusRules.hasSeparateArea
                        ? "Separate area"
                        : "Shared area"}
                    </Badge>
                    <Badge variant="secondary">
                      {p.radiusRules.leashRequired
                        ? "Leash required"
                        : "Off-leash allowed"}
                    </Badge>
                  </div>
                  <div className="flex gap-2 pt-2 items-center">
                    <Button
                      size="sm"
                      className="font-medium"
                      onClick={() =>
                        setCheckins((prev) => ({
                          ...prev,
                          [p.id]: (prev[p.id] || 0) + 1,
                        }))
                      }
                    >
                      Check in
                    </Button>
                    <span className="text-xs text-muted-foreground">
                      {checkins[p.id] || 0} check-ins
                    </span>
                    <Button
                      size="sm"
                      variant="outline"
                      className="font-medium"
                      onClick={() => setSuggest({ open: true, place: p })}
                    >
                      Suggest Edit
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
      <Dialog open={suggest.open} onOpenChange={(v) => setSuggest({ open: v })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Suggest an edit</DialogTitle>
            <DialogDescription>
              {suggest.place ? `for ${suggest.place.name}` : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="text-sm text-muted-foreground">
            Thanks! Your suggestion has been recorded. We will review it soon.
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
