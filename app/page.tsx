import React, { useState, useEffect } from "react";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../components/ui/card";
import { RadioGroup, RadioGroupItem } from "../components/ui/radio-group";
import { Label } from "../components/ui/label";
import { Heart, PawPrint, Stethoscope, Home } from "lucide-react";
import PetOwnerDashboard from "../components/pet-owner-dashboard";
import VeterinarianDashboard from "../components/veterinarian-dashboard";
import ShelterDashboard from "../components/shelter-dashboard";

export default function HomePage() {
  const [userName, setUserName] = useState("");
  const [userType, setUserType] = useState("");
  const [currentView, setCurrentView] = useState("landing");

  useEffect(() => {
    const savedFormData = localStorage.getItem("homepageFormData");
    if (savedFormData) {
      const formData = JSON.parse(savedFormData);
      setUserName(formData.userName || "");
      setUserType(formData.userType || "");
    }
  }, []);

  useEffect(() => {
    const formData = {
      userName,
      userType,
    };
    localStorage.setItem("homepageFormData", JSON.stringify(formData));
  }, [userName, userType]);

  const handleSubmit = () => {
    if (userName && userType) {
      setCurrentView(userType);
    }
  };

  const handleBackToHome = () => {
    setCurrentView("landing");
    setUserName("");
    setUserType("");
  };

  if (currentView === "pet-owner") {
    return <PetOwnerDashboard userName={userName} onBack={handleBackToHome} />;
  }

  if (currentView === "veterinarian") {
    return (
      <VeterinarianDashboard userName={userName} onBack={handleBackToHome} />
    );
  }

  if (currentView === "shelter") {
    return <ShelterDashboard userName={userName} onBack={handleBackToHome} />;
  }

  return (
    <div className="min-h-screen">
      <section className="py-10 sm:py-16">
        <div className="max-w-[1350px] mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center">
              <div className="text-center order-2 md:order-1">
                <img
                  src="/cute-cat-and-dog-sitting-together-with-food-bowl.jpg"
                  alt="Cute pets with food bowl"
                  className="mx-auto rounded-xl shadow-2xl mb-4 sm:mb-6 w-full max-w-[220px] sm:max-w-sm"
                />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-primary mb-3 sm:mb-4 text-balance max-w-[18ch] mx-auto drop-shadow">
                  Welcome to FurEver Care
                </h2>
                <p className="text-base sm:text-lg text-muted-foreground mb-3 sm:mb-4 text-pretty">
                  Your Trusted Companion for All Things Pet Care
                </p>
                <p className="text-lg sm:text-xl font-semibold text-secondary">
                  They Deserve Forever Love
                </p>
              </div>

              <Card className="w-full order-1 md:order-2 max-w-md mx-auto card-premium">
                <CardHeader className="pb-4 sm:pb-6">
                  <CardTitle className="text-center text-primary text-xl sm:text-2xl font-bold">
                    Get Started
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 sm:space-y-6">
                  <div>
                    <Label
                      htmlFor="name"
                      className="text-sm font-medium text-foreground"
                    >
                      Enter Your Name:
                    </Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Your first name"
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label className="text-sm font-medium text-foreground mb-3 sm:mb-4 block">
                      Select the user category you belong to:
                    </Label>
                    <RadioGroup
                      value={userType}
                      onValueChange={setUserType}
                      className="space-y-3 sm:space-y-3"
                    >
                      <div className="flex items-center space-x-4 p-4 sm:p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-card transition-all cursor-pointer min-h-[64px] sm:min-h-[auto]">
                        <RadioGroupItem
                          value="pet-owner"
                          id="pet-owner"
                          className="flex-shrink-0"
                        />
                        <Label
                          htmlFor="pet-owner"
                          className="flex items-center gap-3 cursor-pointer flex-1 font-medium text-base sm:text-base leading-relaxed"
                        >
                          <Heart className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="break-words">Pet Owner</span>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-4 p-4 sm:p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-card transition-all cursor-pointer min-h-[64px] sm:min-h-[auto]">
                        <RadioGroupItem
                          value="veterinarian"
                          id="veterinarian"
                          className="flex-shrink-0"
                        />
                        <Label
                          htmlFor="veterinarian"
                          className="flex items-center gap-3 cursor-pointer flex-1 font-medium text-base sm:text-base leading-relaxed"
                        >
                          <Stethoscope className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="break-words">Veterinarian</span>
                        </Label>
                      </div>

                      <div className="flex items-center space-x-4 p-4 sm:p-4 rounded-lg border-2 border-border hover:border-primary hover:bg-card transition-all cursor-pointer min-h-[64px] sm:min-h-[auto]">
                        <RadioGroupItem
                          value="shelter"
                          id="shelter"
                          className="flex-shrink-0"
                        />
                        <Label
                          htmlFor="shelter"
                          className="flex items-center gap-3 cursor-pointer flex-1 font-medium text-base sm:text-base leading-relaxed"
                        >
                          <Home className="h-5 w-5 text-primary flex-shrink-0" />
                          <span className="break-words">
                            <span className="block sm:inline">
                              Animal Shelter
                            </span>
                            <span className="block sm:inline">
                              {" "}
                              / Rescue Volunteer
                            </span>
                          </span>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  <Button
                    onClick={handleSubmit}
                    disabled={!userName || !userType}
                    className="w-full btn-gradient-primary text-primary-foreground font-semibold py-3 text-sm sm:text-base lg:text-lg"
                  >
                    <span className="block sm:hidden">Complete</span>
                    <span className="hidden sm:block">
                      Complete & Open Dashboard
                    </span>
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
