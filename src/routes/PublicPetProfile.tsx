import React, { useMemo } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Phone, MessageSquareText, MapPin } from "lucide-react";

export default function PublicPetProfile() {
  const { petHandle } = useParams();

  // Demo read model from localStorage (owner can share link/QR). In production, fetch by handle.
  const petData = useMemo(() => {
    const raw = localStorage.getItem(`pet-public-${petHandle}`);
    if (raw) return JSON.parse(raw);
    return null;
  }, [petHandle]);

  const ownerPhone = petData?.ownerPhone || "+84xxxxxxxxx";
  const ownerZalo = petData?.ownerZalo || ownerPhone;

  return (
    <div className="max-w-[720px] mx-auto px-4 py-10">
      <Card className="overflow-hidden border-0 shadow-xl bg-gradient-to-br from-card to-card/95">
        <CardHeader>
          <CardTitle className="text-primary text-2xl sm:text-3xl">
            {petData?.name || "Pet"} · Public Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <img
              src={petData?.image || "/placeholder.jpg"}
              alt={petData?.name || "Pet"}
              className="w-full aspect-square object-cover rounded-lg"
            />
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {petData?.type && (
                  <Badge variant="secondary" className="capitalize">
                    {petData.type}
                  </Badge>
                )}
                {petData?.breed && (
                  <Badge variant="outline">{petData.breed}</Badge>
                )}
                {petData?.color && (
                  <Badge variant="outline">{petData.color}</Badge>
                )}
              </div>
              {petData?.lastSeen && (
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <MapPin className="h-4 w-4" /> Last seen: {petData.lastSeen}
                </p>
              )}
              {petData?.notes && (
                <p className="text-sm text-muted-foreground">{petData.notes}</p>
              )}
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-3">
            <Button asChild className="w-full">
              <a href={`tel:${ownerPhone}`}>
                <Phone className="h-4 w-4 mr-2" /> Call Owner
              </a>
            </Button>
            <Button variant="outline" asChild className="w-full">
              <a
                href={`https://zalo.me/${ownerZalo}`}
                target="_blank"
                rel="noreferrer"
              >
                <MessageSquareText className="h-4 w-4 mr-2" /> Message on Zalo
              </a>
            </Button>
          </div>

          <div className="p-4 bg-primary/5 rounded-lg border border-primary/20 text-sm">
            If you found this pet, please keep them safe and contact the owner
            immediately.
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
