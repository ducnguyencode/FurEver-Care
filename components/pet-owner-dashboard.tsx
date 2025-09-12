"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Clock,
  MapPin,
  ShoppingCart,
  Phone,
  MessageSquare,
  Users,
  Star,
  X,
  ChevronDown,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import Footer from "@/components/footer";

interface PetOwnerDashboardProps {
  userName: string;
  onBack: () => void;
}

interface Product {
  id: number;
  name: string;
  category: string;
  price: string;
  image: string;
  description: string;
  rating: number;
  inStock: boolean;
}

export default function PetOwnerDashboard({
  userName,
  onBack,
}: PetOwnerDashboardProps) {
  const [petName, setPetName] = useState("");
  const [petSpecies, setPetSpecies] = useState("");
  const [petBreed, setPetBreed] = useState("");
  const [petAge, setPetAge] = useState("");
  const [isPetRegistered, setIsPetRegistered] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [location, setLocation] = useState("Getting location...");
  const [visitorCount, setVisitorCount] = useState(1247);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [showModal, setShowModal] = useState(false);
  const { toast } = useToast();
  const [tabValue, setTabValue] = useState("care");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const savedFormData = localStorage.getItem("petOwnerFormData");
    if (savedFormData) {
      const formData = JSON.parse(savedFormData);
      setPetName(formData.petName || "");
      setPetSpecies(formData.petSpecies || "");
      setPetBreed(formData.petBreed || "");
      setPetAge(formData.petAge || "");
      setIsPetRegistered(formData.isPetRegistered || false);
    }
  }, []);

  useEffect(() => {
    const formData = {
      petName,
      petSpecies,
      petBreed,
      petAge,
      isPetRegistered,
    };
    localStorage.setItem("petOwnerFormData", JSON.stringify(formData));
  }, [petName, petSpecies, petBreed, petAge, isPetRegistered]);

  const handleBuyNow = (product: Product) => {
    setSelectedProduct(product);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedProduct(null);
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
    const loadProducts = async () => {
      try {
        const response = await fetch("/data/pet-products.json");
        const data = await response.json();
        setProducts(data.products);
        setFilteredProducts(data.products);
      } catch (error) {
        console.error("Failed to load products:", error);
      }
    };
    loadProducts();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setVisitorCount((prev) => prev + Math.floor(Math.random() * 3));
    }, 30000); // Update every 30 seconds
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    let filtered = products;

    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (product) => product.category === selectedCategory
      );
    }

    if (searchTerm) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          product.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredProducts(filtered);
  }, [products, searchTerm, selectedCategory]);

  const categories = [
    "all",
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const emergencyContacts = [
    {
      name: "24/7 Pet Emergency Clinic",
      phone: "(555) 123-4567",
      type: "Emergency",
    },
    {
      name: "Pet Poison Helpline",
      phone: "(855) 764-7661",
      type: "Poison Control",
    },
    {
      name: "Animal Control Services",
      phone: "(555) 987-6543",
      type: "Animal Control",
    },
    {
      name: "Local Veterinary Hospital",
      phone: "(555) 456-7890",
      type: "General Care",
    },
  ];

  const handlePetRegistration = () => {
    if (
      petName.trim() &&
      petSpecies.trim() &&
      petBreed.trim() &&
      petAge.trim()
    ) {
      setIsPetRegistered(true);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {showModal && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-primary">
                  {selectedProduct.name}
                </h2>
                <Button variant="ghost" size="sm" onClick={closeModal}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <img
                    src={selectedProduct.image || "/placeholder.svg"}
                    alt={selectedProduct.name}
                    className="w-full aspect-square object-cover rounded-lg"
                  />
                </div>

                <div className="space-y-4">
                  <Badge variant="outline">{selectedProduct.category}</Badge>

                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(selectedProduct.rating)
                              ? "text-yellow-400 fill-current"
                              : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      ({selectedProduct.rating})
                    </span>
                  </div>

                  <p className="text-muted-foreground">
                    {selectedProduct.description}
                  </p>

                  <div className="text-3xl font-bold text-secondary">
                    {selectedProduct.price}
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm">
                      <strong>Availability:</strong>{" "}
                      {selectedProduct.inStock ? "In Stock" : "Out of Stock"}
                    </p>
                    <p className="text-sm">
                      <strong>Category:</strong> {selectedProduct.category}
                    </p>
                    <p className="text-sm">
                      <strong>Product ID:</strong> #{selectedProduct.id}
                    </p>
                  </div>

                  <div className="flex gap-3">
                    <Button
                      className="flex-1 font-semibold px-6 py-3 rounded-lg bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-secondary-foreground shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                      disabled={!selectedProduct.inStock}
                      onClick={() => {
                        toast({
                          title: "Added to Cart! 🛒",
                          description: `${selectedProduct.name} has been added to your cart successfully.`,
                          variant: "default",
                        });
                        closeModal();
                      }}
                    >
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Add to Cart
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={closeModal}
                      className="px-6 py-3 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    >
                      Close
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <header className="bg-gradient-to-r from-card via-card/95 to-card border-b border-border/50 sticky top-0 z-40 backdrop-blur-md">
        <div className="max-w-[1350px] mx-auto px-4 py-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="font-medium flex-shrink-0 hover:bg-primary/10 border border-primary/20"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent truncate">
                  Welcome, {userName}!
                </h1>
                {isPetRegistered && (
                  <p className="text-xs sm:text-sm text-muted-foreground truncate flex items-center gap-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Pet: {petName}
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
              <div className="hidden sm:flex items-center gap-1 flex-shrink-0">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
                <span className="whitespace-nowrap">
                  {visitorCount.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-[1350px] mx-auto px-4 py-8">
        {!isPetRegistered ? (
          <Card className="max-w-2xl mx-auto shadow-xl border-0 bg-gradient-to-br from-card to-card/95">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl">🐾</span>
              </div>
              <CardTitle className="text-primary text-2xl font-bold">
                Register Your Pet
              </CardTitle>
              <p className="text-center text-muted-foreground text-lg">
                Please complete all fields to access your pet care dashboard
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="petName">Pet Name *</Label>
                  <Input
                    id="petName"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    placeholder="Enter your pet's name"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="petSpecies">Species *</Label>
                  <Input
                    id="petSpecies"
                    value={petSpecies}
                    onChange={(e) => setPetSpecies(e.target.value)}
                    placeholder="Dog, Cat, etc."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="petBreed">Breed *</Label>
                  <Input
                    id="petBreed"
                    value={petBreed}
                    onChange={(e) => setPetBreed(e.target.value)}
                    placeholder="Enter breed"
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="petAge">Age *</Label>
                  <Input
                    id="petAge"
                    value={petAge}
                    onChange={(e) => setPetAge(e.target.value)}
                    placeholder="Enter age"
                    className="mt-1"
                  />
                </div>
              </div>
              <Button
                className="mt-8 w-full font-bold py-4 text-base sm:text-lg bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 rounded-lg"
                onClick={handlePetRegistration}
                disabled={
                  !petName.trim() ||
                  !petSpecies.trim() ||
                  !petBreed.trim() ||
                  !petAge.trim()
                }
              >
                <span className="block sm:hidden flex items-center gap-2">
                  <span>🚀</span> Complete
                </span>
                <span className="hidden sm:flex items-center gap-2">
                  <span>🚀</span> Complete & Open Dashboard
                </span>
              </Button>
              <p className="text-sm text-muted-foreground mt-4 text-center">
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
            {/* Mobile: open drawer/menu to pick tab (prevents horizontal scrolling) */}
            <div className="block sm:hidden mb-3">
              <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
                <DialogTrigger asChild>
                  <Button className="w-full justify-between">
                    <span>
                      {tabValue === "about"
                        ? "About Us"
                        : tabValue === "care"
                        ? "Pet Care"
                        : tabValue === "products"
                        ? "Products"
                        : tabValue === "emergency"
                        ? "Emergency"
                        : tabValue === "feedback"
                        ? "Feedback"
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
                        setTabValue("about");
                        setIsMenuOpen(false);
                      }}
                    >
                      About Us
                    </button>
                    <button
                      className="w-full text-left p-2 rounded hover:bg-muted"
                      onClick={() => {
                        setTabValue("care");
                        setIsMenuOpen(false);
                      }}
                    >
                      Pet Care
                    </button>
                    <button
                      className="w-full text-left p-2 rounded hover:bg-muted"
                      onClick={() => {
                        setTabValue("products");
                        setIsMenuOpen(false);
                      }}
                    >
                      Products
                    </button>
                    <button
                      className="w-full text-left p-2 rounded hover:bg-muted"
                      onClick={() => {
                        setTabValue("emergency");
                        setIsMenuOpen(false);
                      }}
                    >
                      Emergency
                    </button>
                    <button
                      className="w-full text-left p-2 rounded hover:bg-muted"
                      onClick={() => {
                        setTabValue("feedback");
                        setIsMenuOpen(false);
                      }}
                    >
                      Feedback
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
                  value="about"
                  className="font-medium text-xs sm:text-sm px-2 sm:px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
                >
                  About Us
                </TabsTrigger>
                <TabsTrigger
                  value="care"
                  className="font-medium text-xs sm:text-sm px-2 sm:px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
                >
                  Pet Care
                </TabsTrigger>
                <TabsTrigger
                  value="products"
                  className="font-medium text-xs sm:text-sm px-2 sm:px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
                >
                  Products
                </TabsTrigger>
                <TabsTrigger
                  value="emergency"
                  className="font-medium text-xs sm:text-sm px-2 sm:px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
                >
                  Emergency
                </TabsTrigger>
                <TabsTrigger
                  value="feedback"
                  className="font-medium text-xs sm:text-sm px-2 sm:px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
                >
                  Feedback
                </TabsTrigger>
                <TabsTrigger
                  value="contact"
                  className="font-medium text-xs sm:text-sm px-2 sm:px-4 py-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
                >
                  Contact
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="about">
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary">About Our Team</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-muted-foreground">
                      FurEver Care is dedicated to providing comprehensive pet
                      care solutions for loving pet owners. Our team of
                      experienced professionals is committed to ensuring your
                      furry friends receive the best care possible.
                    </p>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div className="text-center">
                        <img
                          src="/professional-veterinarian-portrait.jpg"
                          alt="Dr. Sarah Johnson"
                          className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
                        />
                        <h4 className="font-semibold text-primary">
                          Dr. Sarah Johnson
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Lead Veterinarian
                        </p>
                      </div>
                      <div className="text-center">
                        <img
                          src="/pet-care-specialist-portrait.jpg"
                          alt="Mike Chen"
                          className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
                        />
                        <h4 className="font-semibold text-primary">
                          Mike Chen
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Pet Care Specialist
                        </p>
                      </div>
                      <div className="text-center">
                        <img
                          src="/animal-nutritionist-portrait.jpg"
                          alt="Lisa Rodriguez"
                          className="w-24 h-24 rounded-full mx-auto mb-2 object-cover"
                        />
                        <h4 className="font-semibold text-primary">
                          Lisa Rodriguez
                        </h4>
                        <p className="text-sm text-muted-foreground">
                          Animal Nutritionist
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="care">
              <div className="grid gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-primary text-lg sm:text-xl">
                      Pet Profile - {petName}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm sm:text-base">
                          <strong>Species:</strong> {petSpecies}
                        </p>
                        <p className="text-sm sm:text-base">
                          <strong>Breed:</strong> {petBreed}
                        </p>
                        <p className="text-sm sm:text-base">
                          <strong>Age:</strong> {petAge}
                        </p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm sm:text-base">
                          <strong>Vaccination Status:</strong>{" "}
                          <Badge variant="secondary">Up to date</Badge>
                        </p>
                        <p className="text-sm sm:text-base">
                          <strong>Last Checkup:</strong> March 15, 2024
                        </p>
                        <p className="text-sm sm:text-base">
                          <strong>Next Appointment:</strong> June 15, 2024
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-primary">
                        Feeding Guide
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold">
                            Puppies (2-12 months)
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            3-4 meals per day, high-protein puppy food
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold">
                            Adult Dogs (1-7 years)
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            2 meals per day, balanced adult formula
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold">
                            Senior Dogs (7+ years)
                          </h4>
                          <p className="text-sm text-muted-foreground">
                            2 meals per day, senior-specific nutrition
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-primary">
                        Health Tips
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div>
                          <h4 className="font-semibold">Daily Exercise</h4>
                          <p className="text-sm text-muted-foreground">
                            30-60 minutes based on breed and age
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Dental Care</h4>
                          <p className="text-sm text-muted-foreground">
                            Brush teeth 2-3 times per week
                          </p>
                        </div>
                        <div>
                          <h4 className="font-semibold">Regular Checkups</h4>
                          <p className="text-sm text-muted-foreground">
                            Annual vet visits for preventive care
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-primary">
                      Training & Grooming Resources
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold mb-2">Training Tips</h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Start with basic commands: sit, stay, come</li>
                          <li>• Use positive reinforcement techniques</li>
                          <li>• Keep training sessions short (5-10 minutes)</li>
                          <li>• Be consistent with commands and rewards</li>
                        </ul>
                      </div>
                      <div>
                        <h4 className="font-semibold mb-2">
                          Grooming Schedule
                        </h4>
                        <ul className="space-y-1 text-sm text-muted-foreground">
                          <li>• Brushing: Daily for long-haired breeds</li>
                          <li>• Bathing: Monthly or as needed</li>
                          <li>• Nail trimming: Every 2-3 weeks</li>
                          <li>• Ear cleaning: Weekly inspection</li>
                        </ul>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="products">
              <div className="space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <h2 className="text-xl sm:text-2xl font-bold text-primary">
                    Pet Product Showcase
                  </h2>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4">
                    <Input
                      placeholder="Search products..."
                      className="w-full sm:max-w-xs"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="px-3 py-2 border border-border rounded-md bg-background text-sm"
                    >
                      {categories.map((category) => (
                        <option key={category} value={category}>
                          {category === "all" ? "All Categories" : category}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {filteredProducts.map((product) => (
                    <Card
                      key={product.id}
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-[1.02] border-0 shadow-md bg-gradient-to-br from-card to-card/95"
                    >
                      <div className="aspect-square overflow-hidden relative group">
                        <img
                          src={product.image || "/placeholder.svg"}
                          alt={product.name}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                      <CardContent className="p-5">
                        <div className="flex items-center justify-between mb-3">
                          <Badge
                            variant="secondary"
                            className="bg-primary/10 text-primary border-0 font-medium px-3 py-1"
                          >
                            {product.category}
                          </Badge>
                          {!product.inStock && (
                            <Badge
                              variant="destructive"
                              className="font-medium"
                            >
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                        <h3 className="font-bold text-primary mb-2 text-lg">
                          {product.name}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 line-clamp-2">
                          {product.description}
                        </p>
                        <div className="flex items-center gap-2 mb-4">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < Math.floor(product.rating)
                                    ? "text-yellow-400 fill-current"
                                    : "text-gray-300"
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground font-medium">
                            ({product.rating})
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-xl font-bold text-secondary">
                            {product.price}
                          </span>
                          <Button
                            className={`font-semibold px-6 py-2 rounded-lg transition-all duration-200 ${
                              product.inStock
                                ? "bg-gradient-to-r from-secondary to-secondary/90 hover:from-secondary/90 hover:to-secondary text-secondary-foreground shadow-lg hover:shadow-xl hover:scale-105"
                                : "bg-gray-400 text-gray-600 cursor-not-allowed"
                            }`}
                            disabled={!product.inStock}
                            onClick={() => handleBuyNow(product)}
                          >
                            <ShoppingCart className="h-4 w-4 mr-2" />
                            {product.inStock ? "Buy Now" : "Sold Out"}
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No products found matching your criteria.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="emergency">
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2">
                    <Phone className="h-5 w-5" />
                    Emergency & Vet Help
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {emergencyContacts.map((contact, index) => (
                      <div
                        key={index}
                        className="p-3 sm:p-4 border border-border rounded-lg"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
                          <h4 className="font-semibold text-primary text-sm sm:text-base">
                            {contact.name}
                          </h4>
                          <Badge
                            variant={
                              contact.type === "Emergency"
                                ? "destructive"
                                : "secondary"
                            }
                            className="self-start sm:self-center"
                          >
                            {contact.type}
                          </Badge>
                        </div>
                        <p className="text-base sm:text-lg font-mono text-secondary">
                          {contact.phone}
                        </p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 p-4 bg-card rounded-lg">
                    <h4 className="font-semibold text-primary mb-2 text-sm sm:text-base">
                      Emergency Tips
                    </h4>
                    <ul className="space-y-1 text-sm text-muted-foreground">
                      <li>• Keep these numbers easily accessible</li>
                      <li>• Know your pet's normal vital signs</li>
                      <li>• Have a pet first aid kit ready</li>
                      <li>
                        • Stay calm and provide clear information when calling
                      </li>
                    </ul>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="feedback">
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2">
                    <MessageSquare className="h-5 w-5" />
                    Feedback Form
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="feedbackName">Name</Label>
                      <Input
                        id="feedbackName"
                        placeholder="Your name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="feedbackEmail">Email</Label>
                      <Input
                        id="feedbackEmail"
                        type="email"
                        placeholder="your.email@example.com"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="feedbackMessage">Feedback</Label>
                      <textarea
                        id="feedbackMessage"
                        className="w-full min-h-[120px] p-3 border border-border rounded-md resize-none mt-1"
                        placeholder="Share your thoughts about our service..."
                      />
                    </div>
                    <Button className="w-full font-semibold py-2">
                      Submit Feedback
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="contact">
              <Card>
                <CardHeader>
                  <CardTitle className="text-primary flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Contact Us
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-semibold text-primary mb-4 text-sm sm:text-base">
                        Get in Touch
                      </h4>
                      <div className="space-y-3">
                        <div>
                          <p className="font-medium text-sm sm:text-base">
                            Address:
                          </p>
                          <p className="text-muted-foreground text-sm">
                            123 Pet Care Lane
                            <br />
                            Animal City, AC 12345
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-sm sm:text-base">
                            Phone:
                          </p>
                          <p className="text-muted-foreground text-sm">
                            (555) 123-PETS
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-sm sm:text-base">
                            Email:
                          </p>
                          <p className="text-muted-foreground text-sm">
                            info@furevercare.com
                          </p>
                        </div>
                        <div>
                          <p className="font-medium text-sm sm:text-base">
                            Hours:
                          </p>
                          <p className="text-muted-foreground text-sm">
                            Mon-Fri: 8AM-6PM
                            <br />
                            Sat-Sun: 9AM-4PM
                          </p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold text-primary mb-4 text-sm sm:text-base">
                        Location
                      </h4>
                      <div className="rounded-lg overflow-hidden shadow-lg">
                        <iframe
                          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d26856383.012892164!2d-114.91367553556066!3d34.74634516141766!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88e43583a45b275b%3A0x2aff3959248699d2!2sFurever%20Vets%20Central%20Urgent%20Care%20%26%20Pet%20Resort!5e0!3m2!1svi!2s!4v1757651885222!5m2!1svi!2s"
                          width="100%"
                          height="300"
                          style={{ border: 0 }}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          className="w-full h-[300px] rounded-lg"
                        ></iframe>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
      <Footer userRole="pet-owner" />
    </div>
  );
}
