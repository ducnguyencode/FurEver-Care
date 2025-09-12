"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  Clock,
  MapPin,
  Heart,
  Calendar,
  Users,
  Phone,
  Mail,
  ExternalLink,
  ChevronDown,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ShelterDashboardProps {
  userName: string;
  onBack: () => void;
}

interface Pet {
  id: number;
  name: string;
  type: string;
  breed: string;
  age: string;
  gender: string;
  description: string;
  image: string;
  status: string;
  vaccinated: boolean;
  spayedNeutered: boolean;
  goodWithKids: boolean;
  goodWithPets: boolean;
}

export default function ShelterDashboard({
  userName,
  onBack,
}: ShelterDashboardProps) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState("Getting location...");
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [pets, setPets] = useState<Pet[]>([]);
  const [filteredPets, setFilteredPets] = useState<Pet[]>([]);
  const [wishlist, setWishlist] = useState<number[]>([]);
  const [selectedStory, setSelectedStory] = useState<any>(null);
  const { toast } = useToast();
  const [tabValue, setTabValue] = useState("gallery");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const savedWishlist = localStorage.getItem("petWishlist");
    if (savedWishlist) {
      setWishlist(JSON.parse(savedWishlist));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("petWishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const handleAdoptClick = (petId: number, petName: string) => {
    if (wishlist.includes(petId)) {
      setWishlist((prev) => prev.filter((id) => id !== petId));
      toast({
        title: "Removed from Wishlist",
        description: `${petName} has been removed from your wishlist.`,
        variant: "default",
      });
    } else {
      setWishlist((prev) => [...prev, petId]);
      toast({
        title: "Added to Wishlist",
        description: `${petName} has been added to your wishlist! ❤️`,
        variant: "default",
      });
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(
            `${position.coords.latitude.toFixed(
              2
            )}, ${position.coords.longitude.toFixed(2)}`
          );
        },
        () => {
          setLocation("Location unavailable");
        }
      );
    }
  }, []);

  useEffect(() => {
    const loadPets = async () => {
      try {
        const response = await fetch("/data/adoptable-pets.json");
        const data = await response.json();
        setPets(data.pets);
        setFilteredPets(data.pets);
      } catch (error) {
        console.error("Failed to load pets:", error);
      }
    };
    loadPets();
  }, []);

  useEffect(() => {
    let filtered = pets;

    if (selectedFilter !== "all") {
      filtered = filtered.filter((pet) => pet.type === selectedFilter);
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (pet) =>
          pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
          pet.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredPets(filtered);
  }, [pets, searchTerm, selectedFilter]);

  const successStories = [
    {
      id: 1,
      petName: "Charlie",
      adoptedBy: "The Johnson Family",
      story:
        "Charlie was a shy rescue who found his forever home with a loving family. He now enjoys daily walks and has become the perfect companion for their children.",
      image: "/success-story-charlie-johnson.jpg",
      adoptionDate: "February 2024",
    },
    {
      id: 2,
      petName: "Mittens",
      adoptedBy: "Sarah Thompson",
      story:
        "Mittens was found as a stray kitten and nursed back to health. She now lives happily with Sarah and has become a social media star with her playful antics.",
      image: "/success-story-mittens-sarah.jpg",
      adoptionDate: "January 2024",
    },
    {
      id: 3,
      petName: "Duke",
      adoptedBy: "The Martinez Family",
      story:
        "Duke was a senior dog who everyone thought would never find a home. The Martinez family saw his gentle soul and gave him the loving retirement he deserved.",
      image: "/success-story-duke-martinez.jpg",
      adoptionDate: "March 2024",
    },
  ];

  const upcomingEvents = [
    {
      id: 1,
      title: "Weekend Adoption Drive",
      date: "April 20-21, 2024",
      time: "10:00 AM - 4:00 PM",
      location: "Central Park Pavilion",
      description:
        "Meet our adorable pets looking for forever homes. Free adoption consultations available.",
    },
    {
      id: 2,
      title: "Free Vaccination Camp",
      date: "April 27, 2024",
      time: "9:00 AM - 2:00 PM",
      location: "FurEver Care Shelter",
      description:
        "Free vaccinations for pets in need. Bring your furry friends for essential health care.",
    },
    {
      id: 3,
      title: "Pet Training Workshop",
      date: "May 4, 2024",
      time: "2:00 PM - 5:00 PM",
      location: "Community Center",
      description:
        "Learn basic training techniques and behavior management for your pets.",
    },
  ];

  const handleGetDirections = () => {
    window.open(
      "https://maps.google.com/?q=456+Rescue+Road,+Pet+Haven,+PH+67890",
      "_blank"
    );
  };

  const handleCallUs = () => {
    window.location.href = "tel:+15559876543";
  };

  const handleEmailUs = () => {
    window.location.href = "mailto:adopt@furevercare.com";
  };

  const handleRegister = (eventTitle: string) => {
    toast({
      title: "Registration Successful! 🎉",
      description: `You've successfully registered for "${eventTitle}". You will receive a confirmation email shortly.`,
      variant: "default",
    });
  };

  const handleLearnMore = (eventTitle: string) => {
    toast({
      title: "Event Information",
      description: `"${eventTitle}" is designed to help our community and pets in need. Contact us for detailed information.`,
      variant: "default",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card border-b border-border sticky top-0 z-50">
        <div className="max-w-[1350px] mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Button
                variant="outline"
                size="sm"
                onClick={onBack}
                className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium bg-transparent flex-shrink-0"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-primary truncate">
                  Welcome, {userName}!
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground">
                  Animal Shelter Portal
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm overflow-x-auto w-full sm:w-auto">
              <div className="flex items-center gap-1 flex-shrink-0">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-secondary" />
                <span className="whitespace-nowrap">
                  {currentTime.toLocaleTimeString()}
                </span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-secondary" />
                <span className="whitespace-nowrap truncate max-w-[100px] sm:max-w-none">
                  {location}
                </span>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span className="whitespace-nowrap">
                  {wishlist.length} wishlist
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-secondary text-secondary-foreground py-2 overflow-hidden">
        <div className="animate-scroll whitespace-nowrap">
          <span className="mx-8">
            🏠 Animal Shelter - Finding forever homes for loving pets
          </span>
          <span className="mx-8">📍 Location: {location}</span>
          <span className="mx-8">
            ⏰ Current Time: {currentTime.toLocaleString()}
          </span>
          <span className="mx-8">
            💝 {pets.length} pets currently available for adoption
          </span>
        </div>
      </div>

      <div className="max-w-[1350px] mx-auto px-4 py-8">
        <Tabs
          value={tabValue}
          onValueChange={setTabValue}
          className="space-y-6"
        >
          <div className="block sm:hidden mb-3">
            <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <DialogTrigger asChild>
                <Button className="w-full justify-between">
                  <span>
                    {tabValue === "gallery"
                      ? "Gallery"
                      : tabValue === "success"
                      ? "Success"
                      : tabValue === "events"
                      ? "Events"
                      : "Contact"}
                  </span>
                  <ChevronDown className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-sm">
                <DialogTitle className="sr-only">Select section</DialogTitle>
                <DialogDescription className="sr-only">
                  Choose a section to view
                </DialogDescription>
                <div className="space-y-2">
                  <button
                    className="w-full text-left p-2 rounded hover:bg-muted"
                    onClick={() => {
                      setTabValue("gallery");
                      setIsMenuOpen(false);
                    }}
                  >
                    Gallery
                  </button>
                  <button
                    className="w-full text-left p-2 rounded hover:bg-muted"
                    onClick={() => {
                      setTabValue("success");
                      setIsMenuOpen(false);
                    }}
                  >
                    Success
                  </button>
                  <button
                    className="w-full text-left p-2 rounded hover:bg-muted"
                    onClick={() => {
                      setTabValue("events");
                      setIsMenuOpen(false);
                    }}
                  >
                    Events
                  </button>
                  <button
                    className="w-full text-left p-2 rounded hover:bg-muted"
                    onClick={() => {
                      setTabValue("contact");
                      setIsMenuOpen(false);
                    }}
                  >
                    Contact
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="w-full">
            <TabsList className="hidden sm:flex gap-2 w-full bg-card border-2 border-border">
              <TabsTrigger
                value="gallery"
                className="text-xs sm:text-sm font-medium px-3 sm:px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
              >
                Gallery
              </TabsTrigger>
              <TabsTrigger
                value="success"
                className="text-xs sm:text-sm font-medium px-3 sm:px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
              >
                Success
              </TabsTrigger>
              <TabsTrigger
                value="events"
                className="text-xs sm:text-sm font-medium px-3 sm:px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
              >
                Events
              </TabsTrigger>
              <TabsTrigger
                value="contact"
                className="text-xs sm:text-sm font-medium px-3 sm:px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
              >
                Contact
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="gallery">
            <div className="space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <h2 className="text-xl sm:text-2xl font-bold text-primary">
                  Adoptable Pets
                </h2>
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
                  <Input
                    placeholder="Search pets..."
                    className="w-full sm:max-w-xs"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
                    <Button
                      variant={selectedFilter === "all" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedFilter("all")}
                      className={`whitespace-nowrap font-medium text-xs sm:text-sm ${
                        selectedFilter === "all"
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                          : "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      }`}
                    >
                      All
                    </Button>
                    <Button
                      variant={selectedFilter === "dog" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedFilter("dog")}
                      className={`whitespace-nowrap font-medium text-xs sm:text-sm ${
                        selectedFilter === "dog"
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                          : "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      }`}
                    >
                      Dogs
                    </Button>
                    <Button
                      variant={selectedFilter === "cat" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedFilter("cat")}
                      className={`whitespace-nowrap font-medium text-xs sm:text-sm ${
                        selectedFilter === "cat"
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                          : "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      }`}
                    >
                      Cats
                    </Button>
                    <Button
                      variant={
                        selectedFilter === "rabbit" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setSelectedFilter("rabbit")}
                      className={`whitespace-nowrap font-medium text-xs sm:text-sm ${
                        selectedFilter === "rabbit"
                          ? "bg-primary hover:bg-primary/90 text-primary-foreground"
                          : "border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                      }`}
                    >
                      Rabbits
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                {filteredPets.map((pet) => (
                  <Card
                    key={pet.id}
                    className="overflow-hidden hover:shadow-lg transition-shadow flex flex-col"
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={pet.image || "/placeholder.svg"}
                        alt={pet.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-3 sm:p-4 flex-1 flex flex-col">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="text-base sm:text-lg font-bold text-primary truncate">
                          {pet.name}
                        </h3>
                        <Badge
                          variant="secondary"
                          className="capitalize text-xs"
                        >
                          {pet.type}
                        </Badge>
                      </div>

                      <div className="space-y-1 text-xs sm:text-sm mb-3">
                        <p>
                          <strong>Breed:</strong>{" "}
                          <span className="truncate">{pet.breed}</span>
                        </p>
                        <p>
                          <strong>Age:</strong> {pet.age}
                        </p>
                        <p>
                          <strong>Gender:</strong> {pet.gender}
                        </p>
                      </div>

                      <div className="flex flex-wrap gap-1 mb-3">
                        {pet.vaccinated && (
                          <Badge variant="outline" className="text-xs">
                            Vaccinated
                          </Badge>
                        )}
                        {pet.spayedNeutered && (
                          <Badge variant="outline" className="text-xs">
                            Spayed/Neutered
                          </Badge>
                        )}
                        {pet.goodWithKids && (
                          <Badge variant="outline" className="text-xs">
                            Good with Kids
                          </Badge>
                        )}
                        {pet.goodWithPets && (
                          <Badge variant="outline" className="text-xs">
                            Good with Pets
                          </Badge>
                        )}
                      </div>

                      <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-3 flex-1">
                        {pet.description}
                      </p>

                      <Button
                        className={`w-full font-semibold py-2 shadow-lg hover:shadow-xl transition-all mt-auto text-xs sm:text-sm ${
                          wishlist.includes(pet.id)
                            ? "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                            : "bg-primary hover:bg-primary/90 text-primary-foreground"
                        }`}
                        onClick={() => handleAdoptClick(pet.id, pet.name)}
                      >
                        <Heart
                          className={`h-3 w-3 sm:h-4 sm:w-4 mr-2 ${
                            wishlist.includes(pet.id) ? "fill-current" : ""
                          }`}
                        />
                        {wishlist.includes(pet.id)
                          ? `Remove ${pet.name}`
                          : `Adopt ${pet.name}`}
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {filteredPets.length === 0 && (
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No pets found matching your criteria.
                  </p>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setSearchTerm("");
                      setSelectedFilter("all");
                    }}
                    className="mt-4 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium"
                  >
                    Clear Filters
                  </Button>
                </div>
              )}

              <Card>
                <CardHeader>
                  <CardTitle className="text-primary text-lg sm:text-xl">
                    Adoption Statistics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-primary">
                        {pets.length}
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Available Pets
                      </p>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-secondary">
                        127
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Adopted This Year
                      </p>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-primary">
                        15
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Adopted This Month
                      </p>
                    </div>
                    <div>
                      <div className="text-xl sm:text-2xl font-bold text-secondary">
                        98%
                      </div>
                      <p className="text-xs sm:text-sm text-muted-foreground">
                        Success Rate
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="success">
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-primary">
                Success Stories
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {successStories.map((story) => (
                  <Card key={story.id} className="overflow-hidden">
                    <div className="aspect-video overflow-hidden">
                      <img
                        src={story.image || "/placeholder.svg"}
                        alt={`${story.petName} success story`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <CardContent className="p-3 sm:p-4">
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base sm:text-lg font-bold text-primary">
                          {story.petName}
                        </h3>
                        <Badge variant="outline" className="text-xs">
                          {story.adoptionDate}
                        </Badge>
                      </div>

                      <p className="text-xs sm:text-sm font-medium text-secondary mb-2">
                        Adopted by: {story.adoptedBy}
                      </p>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-4">
                        {story.story}
                      </p>

                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium bg-transparent text-xs sm:text-sm"
                          >
                            Read Full Story
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle>
                              {story.petName}'s Success Story
                            </DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <img
                              src={story.image || "/placeholder.svg"}
                              alt={`${story.petName} success story`}
                              className="w-full h-48 object-cover rounded-lg"
                            />
                            <div className="space-y-2">
                              <p>
                                <strong>Pet:</strong> {story.petName}
                              </p>
                              <p>
                                <strong>Adopted by:</strong> {story.adoptedBy}
                              </p>
                              <p>
                                <strong>Adoption Date:</strong>{" "}
                                {story.adoptionDate}
                              </p>
                            </div>
                            <div className="p-4 bg-muted rounded-lg">
                              <h4 className="font-semibold mb-2">
                                Full Story:
                              </h4>
                              <p className="text-sm leading-relaxed">
                                {story.story}
                              </p>
                            </div>
                            <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                              <p className="text-sm text-primary font-medium">
                                💝 Every adoption story fills our hearts with
                                joy and reminds us why we do this important
                                work. Thank you to all the families who open
                                their hearts and homes to pets in need!
                              </p>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-primary text-lg sm:text-xl">
                    Happy Endings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center space-y-4">
                    <p className="text-muted-foreground text-sm sm:text-base">
                      Every pet deserves a loving home, and every adoption story
                      fills our hearts with joy. These success stories represent
                      the incredible bond between pets and their new families.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4 sm:gap-8">
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-primary">
                          500+
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Happy Adoptions
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-secondary">
                          5 Years
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Serving Community
                        </p>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-primary">
                          100%
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Love Guaranteed
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="events">
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
                <Calendar className="h-5 w-5 sm:h-6 sm:w-6" />
                Upcoming Events
              </h2>

              <div className="grid gap-4 sm:gap-6">
                {upcomingEvents.map((event) => (
                  <Card key={event.id}>
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                        <div className="flex-1">
                          <h3 className="text-lg sm:text-xl font-bold text-primary mb-2">
                            {event.title}
                          </h3>
                          <p className="text-muted-foreground mb-3 text-sm sm:text-base">
                            {event.description}
                          </p>
                          <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3 sm:h-4 sm:w-4 text-secondary" />
                              <span>{event.date}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-secondary" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-secondary" />
                              <span>{event.location}</span>
                            </div>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                          <Button
                            onClick={() => handleRegister(event.title)}
                            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold shadow-lg hover:shadow-xl transition-all text-xs sm:text-sm"
                          >
                            Register
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLearnMore(event.title)}
                            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium bg-transparent text-xs sm:text-sm"
                          >
                            Learn More
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="text-primary text-lg sm:text-xl">
                    Community Involvement
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-primary mb-3 text-sm sm:text-base">
                        How You Can Help
                      </h4>
                      <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                        <li>• Volunteer at adoption events</li>
                        <li>• Foster pets in need of temporary homes</li>
                        <li>• Donate supplies and food</li>
                        <li>• Spread awareness on social media</li>
                        <li>• Participate in fundraising events</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-3 text-sm sm:text-base">
                        Volunteer Opportunities
                      </h4>
                      <ul className="space-y-2 text-xs sm:text-sm text-muted-foreground">
                        <li>• Dog walking and socialization</li>
                        <li>• Cat care and enrichment</li>
                        <li>• Administrative support</li>
                        <li>• Event coordination</li>
                        <li>• Photography for adoption profiles</li>
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="contact">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2 text-lg sm:text-xl">
                    <Users className="h-4 w-4 sm:h-5 sm:w-5" />
                    Shelter Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-semibold text-primary mb-2 text-sm sm:text-base">
                      FurEver Care Animal Shelter
                    </h4>
                    <div className="space-y-2 text-xs sm:text-sm">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-secondary mt-0.5 flex-shrink-0" />
                        <span>456 Rescue Road, Pet Haven, PH 67890</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="h-3 w-3 sm:h-4 sm:w-4 text-secondary" />
                        <span>(555) 987-6543</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4 text-secondary" />
                        <span>adopt@furevercare.com</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-primary mb-2 text-sm sm:text-base">
                      Visiting Hours
                    </h4>
                    <div className="space-y-1 text-xs sm:text-sm text-muted-foreground">
                      <p>Monday - Friday: 10:00 AM - 6:00 PM</p>
                      <p>Saturday: 9:00 AM - 5:00 PM</p>
                      <p>Sunday: 11:00 AM - 4:00 PM</p>
                      <p className="text-secondary font-medium">
                        Closed on major holidays
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-primary mb-2 text-sm sm:text-base">
                      Adoption Process
                    </h4>
                    <ol className="space-y-1 text-xs sm:text-sm text-muted-foreground list-decimal list-inside">
                      <li>Visit our shelter and meet the pets</li>
                      <li>Fill out an adoption application</li>
                      <li>Meet with our adoption counselor</li>
                      <li>Home visit (if required)</li>
                      <li>Finalize adoption and take your pet home</li>
                    </ol>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-primary text-lg sm:text-xl">
                    Location Map
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="bg-muted rounded-lg p-6 sm:p-8 lg:p-12 text-center">
                    <MapPin className="h-8 w-8 sm:h-12 sm:w-12 lg:h-16 lg:w-16 text-secondary mx-auto mb-4" />
                    <h4 className="font-semibold text-primary mb-2 text-sm sm:text-base">
                      Interactive Map
                    </h4>
                    <p className="text-muted-foreground mb-4 text-xs sm:text-sm lg:text-base">
                      Google Maps integration would be displayed here showing
                      our shelter location and directions.
                    </p>
                    <Button
                      variant="outline"
                      onClick={handleGetDirections}
                      className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium bg-transparent text-xs sm:text-sm"
                    >
                      <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                      Get Directions
                    </Button>
                  </div>

                  <div className="mt-6 space-y-3">
                    <h4 className="font-semibold text-primary text-sm sm:text-base">
                      Quick Contact
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleCallUs}
                        className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium bg-transparent text-xs sm:text-sm"
                      >
                        <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Call Us
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEmailUs}
                        className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium bg-transparent text-xs sm:text-sm"
                      >
                        <Mail className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Email Us
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
