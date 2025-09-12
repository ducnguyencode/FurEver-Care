"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
import Footer from "@/components/footer";

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
      "https://www.google.com/maps/place/Furever+Vets+Central+Urgent+Care+%26+Pet+Resort/@34.7463452,-114.9136755,4z/data=!4m7!3m6!1s0x88e43583a45b275b:0x2aff3959248699d2!8m2!3d30.2149278!4d-81.5156677!15sCgxmdXJldmVyIGNhcmVaDiIMZnVyZXZlciBjYXJlkgEeZW1lcmdlbmN5X3ZldGVyaW5hcmlhbl9zZXJ2aWNlqgFTCg0vZy8xMXdobDJxdGdxCg0vZy8xMXhzMnQxY2hqEAEyHxABIhtdmVpYf2dhJg4VU0UnJ4hvqVXouwgd48JmTzYyEBACIgxmdXJldmVyIGNhcmXgAQA!16s%2Fg%2F11jzhnst4k?entry=tts&g_ep=EgoyMDI1MDkwOS4wIPu8ASoASAFQAw%3D%3D&skid=c4d79328-29eb-4d7d-9e31-58ff80e87085",
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
                className="flex-shrink-0"
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
              <button
                onClick={() => setTabValue("wishlist")}
                className="flex items-center gap-1 flex-shrink-0 hover:bg-primary/10 px-2 py-1 rounded-md transition-colors cursor-pointer"
              >
                <Heart className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span className="whitespace-nowrap">
                  {wishlist.length} wishlist
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

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
                      : tabValue === "wishlist"
                      ? `Wishlist (${wishlist.length})`
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
                  <button
                    className="w-full text-left p-2 rounded hover:bg-muted"
                    onClick={() => {
                      setTabValue("wishlist");
                      setIsMenuOpen(false);
                    }}
                  >
                    Wishlist ({wishlist.length})
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
              <TabsTrigger
                value="wishlist"
                className="text-xs sm:text-sm font-medium px-3 sm:px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
              >
                Wishlist ({wishlist.length})
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="gallery">
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 lg:gap-6">
                <div className="flex items-stretch gap-3 sm:ml-auto">
                  <Input
                    placeholder="Search pets..."
                    className="w-full sm:max-w-xs lg:max-w-sm"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <Select
                    value={selectedFilter}
                    onValueChange={setSelectedFilter}
                  >
                    <SelectTrigger className="w-[160px] sm:w-[180px]">
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="dog">Dogs</SelectItem>
                      <SelectItem value="cat">Cats</SelectItem>
                      <SelectItem value="rabbit">Rabbits</SelectItem>
                    </SelectContent>
                  </Select>
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
                        variant={
                          wishlist.includes(pet.id) ? "secondary" : "default"
                        }
                        className="w-full font-semibold py-2 mt-auto text-xs sm:text-sm"
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
                    className="mt-4 font-medium"
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
                            className="w-full font-medium text-xs sm:text-sm"
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
                            className="font-semibold text-xs sm:text-sm"
                          >
                            Register
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleLearnMore(event.title)}
                            className="font-medium text-xs sm:text-sm"
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
                  <div className="rounded-lg overflow-hidden shadow-lg">
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26856383.012892164!2d-114.91367553556066!3d34.74634516141766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88e43583a45b275b%3A0x2aff3959248699d2!2sFurever%20Vets%20Central%20Urgent%20Care%20%26%20Pet%20Resort!5e0!3m2!1svi!2s!4v1757651885222!5m2!1svi!2s"
                      width="100%"
                      height="450"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      className="w-full h-[350px] rounded-lg"
                    ></iframe>
                  </div>
                  <div className="mt-4 text-center">
                    <Button
                      variant="outline"
                      onClick={handleGetDirections}
                      className="font-medium text-xs sm:text-sm"
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
                        className="font-medium text-xs sm:text-sm"
                      >
                        <Phone className="h-3 w-3 sm:h-4 sm:w-4 mr-1" />
                        Call Us
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEmailUs}
                        className="font-medium text-xs sm:text-sm"
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

          <TabsContent value="wishlist">
            <div className="space-y-6">
              <h2 className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
                <Heart className="h-5 w-5 sm:h-6 sm:w-6" />
                Your Wishlist ({wishlist.length})
              </h2>

              {wishlist.length === 0 ? (
                <Card>
                  <CardContent className="p-6 sm:p-8 text-center">
                    <Heart className="h-12 w-12 sm:h-16 sm:w-16 mx-auto text-muted-foreground mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold text-muted-foreground mb-2">
                      Your wishlist is empty
                    </h3>
                    <p className="text-sm sm:text-base text-muted-foreground mb-4">
                      Browse our pets and add your favorites to your wishlist!
                    </p>
                    <Button
                      onClick={() => setTabValue("gallery")}
                      className="font-semibold"
                    >
                      Browse Pets
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
                  {pets
                    .filter((pet) => wishlist.includes(pet.id))
                    .map((pet) => (
                      <Card key={pet.id} className="overflow-hidden">
                        <div className="aspect-square relative">
                          <img
                            src={pet.image}
                            alt={pet.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <CardContent className="p-3 sm:p-4">
                          <div className="flex items-center justify-between mb-2">
                            <h3 className="font-bold text-sm sm:text-base text-primary">
                              {pet.name}
                            </h3>
                            <Badge
                              variant="secondary"
                              className="text-xs bg-secondary text-secondary-foreground"
                            >
                              {pet.type}
                            </Badge>
                          </div>

                          <div className="space-y-1 mb-3 text-xs sm:text-sm">
                            <p>
                              <span className="font-medium">Breed:</span>{" "}
                              {pet.breed}
                            </p>
                            <p>
                              <span className="font-medium">Age:</span>{" "}
                              {pet.age}
                            </p>
                            <p>
                              <span className="font-medium">Gender:</span>{" "}
                              {pet.gender}
                            </p>
                          </div>

                          <p className="text-xs sm:text-sm text-muted-foreground mb-4 line-clamp-2">
                            {pet.description}
                          </p>

                          <Button
                            variant="secondary"
                            className="w-full font-semibold py-2 text-xs sm:text-sm"
                            onClick={() => handleAdoptClick(pet.id, pet.name)}
                          >
                            <Heart className="h-3 w-3 sm:h-4 sm:w-4 mr-2 fill-current" />
                            Remove {pet.name}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <Footer userRole="shelter" />
    </div>
  );
}
