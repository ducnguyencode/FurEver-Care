import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type Pet = {
  id: string;
  name: string;
  type: string;
  energy: "low" | "medium" | "high";
  goodWithKids: boolean;
  spaceNeed: "small" | "medium" | "large";
  image: string;
};

const seedPets: Pet[] = [
  {
    id: "a1",
    name: "Buddy",
    type: "dog",
    energy: "high",
    goodWithKids: true,
    spaceNeed: "large",
    image: "/adoptable-golden-retriever-buddy.jpg",
  },
  {
    id: "a2",
    name: "Bella",
    type: "dog",
    energy: "medium",
    goodWithKids: true,
    spaceNeed: "medium",
    image: "/adoptable-labrador-mix-bella.jpg",
  },
  {
    id: "a3",
    name: "Whiskers",
    type: "cat",
    energy: "low",
    goodWithKids: false,
    spaceNeed: "small",
    image: "/adoptable-maine-coon-whiskers.jpg",
  },
];

export default function AdoptionMatching() {
  const { toast } = useToast();
  const [workHours, setWorkHours] = useState(8);
  const [hasKids, setHasKids] = useState(false);
  const [homeSpace, setHomeSpace] = useState<"small" | "medium" | "large">(
    "medium"
  );
  const [preferredEnergy, setPreferredEnergy] = useState<
    "low" | "medium" | "high"
  >("medium");
  const [showInterestModal, setShowInterestModal] = useState(false);
  const [selectedPet, setSelectedPet] = useState<Pet | null>(null);

  const matches = useMemo(() => {
    return seedPets.filter((p) => {
      if (hasKids && !p.goodWithKids) return false;
      if (homeSpace === "small" && p.spaceNeed === "large") return false;
      if (preferredEnergy !== p.energy && preferredEnergy !== "medium")
        return false;
      if (workHours > 10 && p.energy === "high") return false;
      return true;
    });
  }, [workHours, hasKids, homeSpace, preferredEnergy]);

  function handleInterestClick(pet: Pet) {
    setSelectedPet(pet);
    setShowInterestModal(true);
  }

  function confirmInterest() {
    if (!selectedPet) return;
    
    const list = JSON.parse(localStorage.getItem("adoption-interests") || "[]");
    const updated = [
      { id: selectedPet.id, name: selectedPet.name, when: new Date().toISOString() },
      ...list,
    ].slice(0, 50);
    localStorage.setItem("adoption-interests", JSON.stringify(updated));
    
    setShowInterestModal(false);
    setSelectedPet(null);
    
    toast({
      title: "✅ Interest Saved",
      description: `We've saved your interest in ${selectedPet.name}. We'll contact you soon!`,
    });
  }

  return (
    <div className="max-w-[1100px] mx-auto px-4 py-8 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-primary">Adoption Matching</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-4 gap-3">
          <div>
            <label className="text-sm font-medium">Daily Work Hours</label>
            <Input
              type="number"
              min={0}
              max={16}
              value={workHours}
              onChange={(e) => setWorkHours(Number(e.target.value))}
            />
          </div>
          <div>
            <label className="text-sm font-medium">Kids at Home</label>
            <select
              className="border rounded-md px-3 py-2 w-full"
              value={hasKids ? "yes" : "no"}
              onChange={(e) => setHasKids(e.target.value === "yes")}
            >
              <option value="no">No</option>
              <option value="yes">Yes</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Home Space</label>
            <select
              className="border rounded-md px-3 py-2 w-full"
              value={homeSpace}
              onChange={(e) => setHomeSpace(e.target.value as any)}
            >
              <option value="small">Small</option>
              <option value="medium">Medium</option>
              <option value="large">Large</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium">Preferred Energy</label>
            <select
              className="border rounded-md px-3 py-2 w-full"
              value={preferredEnergy}
              onChange={(e) => setPreferredEnergy(e.target.value as any)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {matches.map((p) => (
          <Card key={p.id} className="overflow-hidden">
            <img
              src={p.image}
              alt={p.name}
              className="w-full aspect-square object-cover"
            />
            <CardContent className="p-4 space-y-2">
              <div className="font-semibold text-primary">{p.name}</div>
              <div className="flex gap-2">
                <Badge variant="outline" className="capitalize">
                  {p.type}
                </Badge>
                <Badge variant="secondary" className="capitalize">
                  {p.energy} energy
                </Badge>
                <Badge variant="outline" className="capitalize">
                  {p.spaceNeed} space
                </Badge>
              </div>
              <Button
                className="w-full font-medium"
                onClick={() => handleInterestClick(p)}
              >
                I'm Interested
              </Button>
            </CardContent>
          </Card>
        ))}
        {matches.length === 0 && (
          <p className="text-sm text-muted-foreground">
            No matches yet. Adjust your lifestyle preferences.
          </p>
        )}
      </div>

      <Dialog open={showInterestModal} onOpenChange={setShowInterestModal}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Express Interest</DialogTitle>
            <DialogDescription>
              Are you interested in adopting {selectedPet?.name}? We'll save this pet to your interests.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setShowInterestModal(false)}>
              Cancel
            </Button>
            <Button onClick={confirmInterest}>
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
