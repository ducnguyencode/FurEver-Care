"use client";

import type React from "react";

import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
  Stethoscope,
  Calendar,
  FileText,
  User,
  Upload,
  Eye,
  ChevronDown,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface VeterinarianDashboardProps {
  userName: string;
  onBack: () => void;
}

export default function VeterinarianDashboard({
  userName,
  onBack,
}: VeterinarianDashboardProps) {
  const [vetName, setVetName] = useState("");
  const [specialization, setSpecialization] = useState("");
  const [contactInfo, setContactInfo] = useState("");
  const [isProfileComplete, setIsProfileComplete] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState("Getting location...");
  const [profilePhoto, setProfilePhoto] = useState(
    "/veterinarian-profile-photo.jpg"
  );
  const [isWeeklyScheduleOpen, setIsWeeklyScheduleOpen] = useState(false);
  const [isEmergencySlotOpen, setIsEmergencySlotOpen] = useState(false);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<any>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const [tabValue, setTabValue] = useState("profile");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const savedFormData = localStorage.getItem("veterinarianFormData");
    if (savedFormData) {
      const formData = JSON.parse(savedFormData);
      setVetName(formData.vetName || "");
      setSpecialization(formData.specialization || "");
      setContactInfo(formData.contactInfo || "");
      setIsProfileComplete(formData.isProfileComplete || false);
    }
  }, []);

  useEffect(() => {
    const formData = {
      vetName,
      specialization,
      contactInfo,
      isProfileComplete,
    };
    localStorage.setItem("veterinarianFormData", JSON.stringify(formData));
  }, [vetName, specialization, contactInfo, isProfileComplete]);

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
    const savedPhoto = localStorage.getItem("veterinarianProfilePhoto");
    if (savedPhoto) {
      setProfilePhoto(savedPhoto);
    }
  }, []);

  const handleProfileSubmit = () => {
    if (vetName.trim() && specialization.trim() && contactInfo.trim()) {
      setIsProfileComplete(true);
    }
  };

  const handlePhotoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setProfilePhoto(result);
        localStorage.setItem("veterinarianProfilePhoto", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleEmergencySlot = () => {
    toast({
      title: "Emergency Slot Created! 🚨",
      description:
        "Emergency slot has been created for 4:00 PM today. Patient will be notified.",
      variant: "default",
    });
    setIsEmergencySlotOpen(false);
  };

  const handleWeeklySchedule = () => {
    toast({
      title: "Weekly Schedule Opened 📅",
      description:
        "Weekly schedule view opened. You can see appointments for the entire week here.",
      variant: "default",
    });
    setIsWeeklyScheduleOpen(false);
  };

  const timeSlots = [
    { time: "9:00 AM", status: "available", patient: null },
    { time: "9:30 AM", status: "booked", patient: "Max (Golden Retriever)" },
    { time: "10:00 AM", status: "booked", patient: "Luna (Persian Cat)" },
    { time: "10:30 AM", status: "available", patient: null },
    { time: "11:00 AM", status: "booked", patient: "Charlie (Beagle)" },
    { time: "11:30 AM", status: "available", patient: null },
    { time: "2:00 PM", status: "booked", patient: "Bella (Labrador)" },
    { time: "2:30 PM", status: "available", patient: null },
    { time: "3:00 PM", status: "booked", patient: "Milo (Maine Coon)" },
    { time: "3:30 PM", status: "available", patient: null },
  ];

  const caseStudies = [
    {
      id: 1,
      petName: "Rocky",
      breed: "German Shepherd",
      age: "5 years",
      condition: "Hip Dysplasia",
      treatment: "Physical therapy and pain management",
      outcome: "Significant improvement in mobility",
      date: "March 2024",
      image: "/german-shepherd-medical-case.jpg",
    },
    {
      id: 2,
      petName: "Whiskers",
      breed: "Siamese Cat",
      age: "8 years",
      condition: "Chronic Kidney Disease",
      treatment: "Dietary management and medication",
      outcome: "Stable condition with regular monitoring",
      date: "February 2024",
      image: "/siamese-cat-medical-case.jpg",
    },
    {
      id: 3,
      petName: "Buddy",
      breed: "Golden Retriever",
      age: "3 years",
      condition: "Allergic Dermatitis",
      treatment: "Allergy testing and immunotherapy",
      outcome: "Complete resolution of symptoms",
      date: "January 2024",
      image: "/golden-retriever-medical-case.jpg",
    },
    {
      id: 4,
      petName: "Princess",
      breed: "Persian Cat",
      age: "6 years",
      condition: "Dental Disease",
      treatment: "Professional cleaning and extractions",
      outcome: "Improved oral health and comfort",
      date: "December 2023",
      image: "/persian-cat-dental-case.jpg",
    },
  ];

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
                  Dr. {userName}
                </h1>
                {isProfileComplete && (
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Veterinarian Portal
                  </p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm overflow-hidden w-full sm:w-auto">
              <div className="flex items-center gap-1 flex-shrink-0">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4 text-secondary" />
                <span className="hidden sm:inline">
                  {currentTime.toLocaleTimeString()}
                </span>
                <span className="sm:hidden">
                  {currentTime.toLocaleTimeString().slice(0, 5)}
                </span>
              </div>
              <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
                <MapPin className="h-3 w-3 sm:h-4 sm:w-4 text-secondary" />
                <span className="whitespace-nowrap">{location}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="bg-secondary text-secondary-foreground py-2 overflow-hidden">
        <div className="animate-scroll whitespace-nowrap">
          <span className="mx-8">
            🏥 Veterinarian Portal - Managing pet health with excellence
          </span>
        </div>
      </div>

      <div className="max-w-[1350px] mx-auto px-4 py-8">
        {!isProfileComplete ? (
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-primary flex items-center gap-2 justify-center">
                <Stethoscope className="h-5 w-5" />
                Vet Profile
              </CardTitle>
              <p className="text-center text-muted-foreground">
                Please complete all fields to access your veterinarian dashboard
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="vetName">Full Name *</Label>
                  <Input
                    id="vetName"
                    value={vetName}
                    onChange={(e) => setVetName(e.target.value)}
                    placeholder="Dr. John Smith"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="specialization">Specialization *</Label>
                  <Input
                    id="specialization"
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    placeholder="Small Animal Medicine, Surgery, etc."
                    className="mt-1"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="contactInfo">Contact Information *</Label>
                  <Input
                    id="contactInfo"
                    value={contactInfo}
                    onChange={(e) => setContactInfo(e.target.value)}
                    placeholder="Phone: (555) 123-4567, Email: doctor@clinic.com"
                    className="mt-1"
                  />
                </div>
              </div>
              <Button
                className="mt-6 w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold py-3 text-base sm:text-lg shadow-lg hover:shadow-xl transition-all"
                onClick={handleProfileSubmit}
                disabled={
                  !vetName.trim() ||
                  !specialization.trim() ||
                  !contactInfo.trim()
                }
              >
                <span className="block sm:hidden">Complete</span>
                <span className="hidden sm:block">
                  Complete & Open Dashboard
                </span>
              </Button>
              <p className="text-sm text-muted-foreground mt-2 text-center">
                * All fields are required
              </p>
            </CardContent>
          </Card>
        ) : (
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
                      {tabValue === "profile"
                        ? "Profile"
                        : tabValue === "appointments"
                        ? "Time Slots"
                        : "Case Studies"}
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
                        setTabValue("profile");
                        setIsMenuOpen(false);
                      }}
                    >
                      Profile
                    </button>
                    <button
                      className="w-full text-left p-2 rounded hover:bg-muted"
                      onClick={() => {
                        setTabValue("appointments");
                        setIsMenuOpen(false);
                      }}
                    >
                      Time Slots
                    </button>
                    <button
                      className="w-full text-left p-2 rounded hover:bg-muted"
                      onClick={() => {
                        setTabValue("cases");
                        setIsMenuOpen(false);
                      }}
                    >
                      Case Studies
                    </button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
            <div className="w-full">
              <TabsList className="hidden sm:flex gap-2 w-full bg-card border-2 border-border">
                <TabsTrigger
                  value="profile"
                  className="font-medium text-xs sm:text-sm px-3 sm:px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
                >
                  Profile
                </TabsTrigger>
                <TabsTrigger
                  value="appointments"
                  className="font-medium text-xs sm:text-sm px-3 sm:px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
                >
                  Time Slots
                </TabsTrigger>
                <TabsTrigger
                  value="cases"
                  className="font-medium text-xs sm:text-sm px-3 sm:px-6 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
                >
                  Case Studies
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="profile">
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2">
                    <User className="h-5 w-5" />
                    Veterinarian Profile
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="text-center lg:col-span-1">
                      <img
                        src={profilePhoto || "/placeholder.svg"}
                        alt="Veterinarian Profile"
                        className="w-24 h-24 sm:w-32 sm:h-32 rounded-full mx-auto mb-4 border-4 border-primary object-cover"
                      />
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handlePhotoUpload}
                        accept="image/*"
                        className="hidden"
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                        className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium bg-transparent"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Update Photo
                      </Button>
                    </div>
                    <div className="lg:col-span-2 space-y-4">
                      <div>
                        <h3 className="text-lg sm:text-xl font-bold text-primary">
                          Dr. {vetName}
                        </h3>
                        <p className="text-muted-foreground text-sm sm:text-base">
                          {specialization}
                        </p>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-semibold text-primary mb-2 text-sm sm:text-base">
                            Professional Details
                          </h4>
                          <div className="space-y-2 text-xs sm:text-sm">
                            <p>
                              <strong>License:</strong> DVM-12345
                            </p>
                            <p>
                              <strong>Years of Experience:</strong> 8 years
                            </p>
                            <p>
                              <strong>Education:</strong> DVM, State University
                            </p>
                            <p>
                              <strong>Certifications:</strong> ACVIM, Fear Free
                              Certified
                            </p>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold text-primary mb-2 text-sm sm:text-base">
                            Contact Information
                          </h4>
                          <div className="space-y-2 text-xs sm:text-sm">
                            <p>
                              <strong>Phone:</strong>{" "}
                              {contactInfo.split(",")[0]}
                            </p>
                            <p>
                              <strong>Email:</strong> dr.
                              {userName.toLowerCase()}@furevercare.com
                            </p>
                            <p>
                              <strong>Clinic:</strong> FurEver Care Animal
                              Hospital
                            </p>
                            <p>
                              <strong>Address:</strong> 123 Pet Care Lane,
                              Animal City
                            </p>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h4 className="font-semibold text-primary mb-2 text-sm sm:text-base">
                          Specializations
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="secondary" className="text-xs">
                            Internal Medicine
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Surgery
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Emergency Care
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Preventive Medicine
                          </Badge>
                          <Badge variant="secondary" className="text-xs">
                            Dental Care
                          </Badge>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="appointments">
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2 text-lg sm:text-xl">
                    <Calendar className="h-5 w-5" />
                    Today's Appointment Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <h4 className="font-semibold text-sm sm:text-base">
                        {currentTime.toLocaleDateString("en-US", {
                          weekday: "long",
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </h4>
                      <div className="flex gap-2">
                        <Badge variant="outline" className="text-xs">
                          {
                            timeSlots.filter(
                              (slot) => slot.status === "available"
                            ).length
                          }{" "}
                          Available
                        </Badge>
                        <Badge variant="secondary" className="text-xs">
                          {
                            timeSlots.filter((slot) => slot.status === "booked")
                              .length
                          }{" "}
                          Booked
                        </Badge>
                      </div>
                    </div>

                    <div className="grid gap-3">
                      {timeSlots.map((slot, index) => (
                        <div
                          key={index}
                          className={`p-3 sm:p-4 rounded-lg border-2 ${
                            slot.status === "available"
                              ? "border-primary bg-primary/5"
                              : "border-secondary bg-secondary/5"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                            <div className="flex items-center gap-3">
                              <div className="text-base sm:text-lg font-semibold">
                                {slot.time}
                              </div>
                              <Badge
                                variant={
                                  slot.status === "available"
                                    ? "outline"
                                    : "secondary"
                                }
                                className="font-medium text-xs"
                              >
                                {slot.status === "available"
                                  ? "Available"
                                  : "Booked"}
                              </Badge>
                            </div>
                            {slot.patient && (
                              <div className="text-left sm:text-right">
                                <p className="font-medium text-primary text-sm sm:text-base">
                                  {slot.patient}
                                </p>
                                <p className="text-xs sm:text-sm text-muted-foreground">
                                  Regular Checkup
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="mt-6 p-4 bg-card rounded-lg border-2 border-border">
                      <h4 className="font-semibold text-primary mb-2 text-sm sm:text-base">
                        Appointment Management
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 text-xs sm:text-sm">
                        <div>
                          <h5 className="font-medium mb-1">
                            Today's Statistics
                          </h5>
                          <ul className="space-y-1 text-muted-foreground">
                            <li>• Total appointments: {timeSlots.length}</li>
                            <li>
                              • Booked slots:{" "}
                              {
                                timeSlots.filter(
                                  (slot) => slot.status === "booked"
                                ).length
                              }
                            </li>
                            <li>
                              • Available slots:{" "}
                              {
                                timeSlots.filter(
                                  (slot) => slot.status === "available"
                                ).length
                              }
                            </li>
                            <li>
                              • Next available:{" "}
                              {timeSlots.find(
                                (slot) => slot.status === "available"
                              )?.time || "None"}
                            </li>
                          </ul>
                        </div>
                        <div>
                          <h5 className="font-medium mb-1">Quick Actions</h5>
                          <div className="space-y-2">
                            <Dialog
                              open={isWeeklyScheduleOpen}
                              onOpenChange={setIsWeeklyScheduleOpen}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium bg-transparent text-xs sm:text-sm"
                                >
                                  View Weekly Schedule
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Weekly Schedule</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p>Here's your complete weekly schedule:</p>
                                  <div className="grid gap-2 text-sm">
                                    <div className="p-2 bg-muted rounded">
                                      Monday: 9:00 AM - 5:00 PM (8 appointments)
                                    </div>
                                    <div className="p-2 bg-muted rounded">
                                      Tuesday: 9:00 AM - 5:00 PM (6
                                      appointments)
                                    </div>
                                    <div className="p-2 bg-muted rounded">
                                      Wednesday: 9:00 AM - 5:00 PM (10
                                      appointments)
                                    </div>
                                    <div className="p-2 bg-muted rounded">
                                      Thursday: 9:00 AM - 5:00 PM (7
                                      appointments)
                                    </div>
                                    <div className="p-2 bg-muted rounded">
                                      Friday: 9:00 AM - 5:00 PM (9 appointments)
                                    </div>
                                  </div>
                                  <Button
                                    onClick={() =>
                                      setIsWeeklyScheduleOpen(false)
                                    }
                                    className="w-full"
                                  >
                                    Close
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>

                            <Dialog
                              open={isEmergencySlotOpen}
                              onOpenChange={setIsEmergencySlotOpen}
                            >
                              <DialogTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="w-full border-2 border-secondary text-secondary hover:bg-secondary hover:text-secondary-foreground font-medium bg-transparent text-xs sm:text-sm"
                                >
                                  Emergency Slot
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>
                                    Create Emergency Slot
                                  </DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <p>
                                    Create an emergency appointment slot for
                                    urgent cases?
                                  </p>
                                  <div className="p-4 bg-muted rounded-lg">
                                    <p className="font-medium">
                                      Emergency Slot Details:
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Time: 4:00 PM Today
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Duration: 30 minutes
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                      Priority: High
                                    </p>
                                  </div>
                                  <div className="flex gap-2">
                                    <Button
                                      onClick={handleEmergencySlot}
                                      className="flex-1"
                                    >
                                      Create Emergency Slot
                                    </Button>
                                    <Button
                                      variant="outline"
                                      onClick={() =>
                                        setIsEmergencySlotOpen(false)
                                      }
                                      className="flex-1"
                                    >
                                      Cancel
                                    </Button>
                                  </div>
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="cases">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-primary flex items-center gap-2">
                    <FileText className="h-5 w-5 sm:h-6 sm:w-6" />
                    Medical Case Studies
                  </h2>
                  <Input
                    placeholder="Search cases..."
                    className="w-full sm:max-w-xs"
                  />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {caseStudies.map((caseStudy) => (
                    <Card
                      key={caseStudy.id}
                      className="overflow-hidden hover:shadow-lg transition-shadow"
                    >
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={caseStudy.image || "/placeholder.svg"}
                          alt={`${caseStudy.petName} case study`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between mb-3">
                          <h3 className="text-base sm:text-lg font-bold text-primary">
                            {caseStudy.petName}
                          </h3>
                          <Badge variant="outline" className="text-xs">
                            {caseStudy.date}
                          </Badge>
                        </div>

                        <div className="space-y-2 text-xs sm:text-sm">
                          <div className="grid grid-cols-2 gap-2">
                            <p>
                              <strong>Breed:</strong> {caseStudy.breed}
                            </p>
                            <p>
                              <strong>Age:</strong> {caseStudy.age}
                            </p>
                          </div>

                          <div>
                            <p className="font-semibold text-secondary">
                              Condition:
                            </p>
                            <p className="text-muted-foreground">
                              {caseStudy.condition}
                            </p>
                          </div>

                          <div>
                            <p className="font-semibold text-secondary">
                              Treatment:
                            </p>
                            <p className="text-muted-foreground">
                              {caseStudy.treatment}
                            </p>
                          </div>

                          <div>
                            <p className="font-semibold text-primary">
                              Outcome:
                            </p>
                            <p className="text-muted-foreground">
                              {caseStudy.outcome}
                            </p>
                          </div>
                        </div>

                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="w-full mt-4 border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground font-medium bg-transparent text-xs sm:text-sm"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              View Full Case Details
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl">
                            <DialogHeader>
                              <DialogTitle>
                                Case Study: {caseStudy.petName}
                              </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <img
                                src={caseStudy.image || "/placeholder.svg"}
                                alt={caseStudy.petName}
                                className="w-full h-48 object-cover rounded-lg"
                              />
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                <div>
                                  <p>
                                    <strong>Patient:</strong>{" "}
                                    {caseStudy.petName}
                                  </p>
                                  <p>
                                    <strong>Breed:</strong> {caseStudy.breed}
                                  </p>
                                  <p>
                                    <strong>Age:</strong> {caseStudy.age}
                                  </p>
                                  <p>
                                    <strong>Date:</strong> {caseStudy.date}
                                  </p>
                                </div>
                                <div>
                                  <p>
                                    <strong>Condition:</strong>{" "}
                                    {caseStudy.condition}
                                  </p>
                                  <p>
                                    <strong>Treatment:</strong>{" "}
                                    {caseStudy.treatment}
                                  </p>
                                  <p>
                                    <strong>Outcome:</strong>{" "}
                                    {caseStudy.outcome}
                                  </p>
                                </div>
                              </div>
                              <div className="p-4 bg-muted rounded-lg">
                                <h4 className="font-semibold mb-2">
                                  Detailed Notes:
                                </h4>
                                <p className="text-sm">
                                  This case demonstrates the importance of early
                                  intervention and comprehensive treatment
                                  planning. The patient responded well to the
                                  prescribed treatment protocol and showed
                                  significant improvement within the expected
                                  timeframe. Regular follow-ups were scheduled
                                  to monitor progress.
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
                      Case Study Summary
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                      <div>
                        <div className="text-xl sm:text-2xl font-bold text-primary">
                          {caseStudies.length}
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Total Cases
                        </p>
                      </div>
                      <div>
                        <div className="text-xl sm:text-2xl font-bold text-secondary">
                          95%
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Success Rate
                        </p>
                      </div>
                      <div>
                        <div className="text-xl sm:text-2xl font-bold text-primary">
                          12
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          This Month
                        </p>
                      </div>
                      <div>
                        <div className="text-xl sm:text-2xl font-bold text-secondary">
                          4.9
                        </div>
                        <p className="text-xs sm:text-sm text-muted-foreground">
                          Avg Rating
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
