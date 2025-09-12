"use client";

import {
  Heart,
  Mail,
  Phone,
  MapPin,
  Clock,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Sparkles,
  Star,
  Zap,
} from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useState, useEffect } from "react";

interface FooterProps {
  userRole?: "pet-owner" | "veterinarian" | "shelter" | null;
}

export default function Footer({ userRole }: FooterProps) {
  const { toast } = useToast();
  const currentYear = new Date().getFullYear();

  // Debug log to check userRole
  console.log("🎯 Footer Component - UserRole:", userRole);

  // Test toast on component mount
  useEffect(() => {
    if (userRole) {
      console.log("🧪 Testing toast functionality...");
      // Uncomment below to test toast
      // toast({
      //   title: "Footer Loaded",
      //   description: `Role: ${userRole}`,
      //   variant: "default",
      // });
    }
  }, [userRole, toast]);
  const [sparklePositions, setSparklePositions] = useState<
    Array<{ x: number; y: number; delay: number }>
  >([]);
  const [hoveredService, setHoveredService] = useState<string | null>(null);

  // Generate random sparkle positions for creative effect
  useEffect(() => {
    const sparkles = Array.from({ length: 8 }, (_, i) => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      delay: Math.random() * 2,
    }));
    setSparklePositions(sparkles);
  }, []);

  // Define role permissions for different services
  const rolePermissions = {
    "Veterinary Care": ["veterinarian"],
    "Emergency Services": ["veterinarian"],
    "Pet Training": ["pet-owner", "shelter"],
    Grooming: ["pet-owner", "shelter"],
    "Pet Adoption": ["pet-owner", "shelter"],
    "Pet Products": ["pet-owner"],
  };

  const handleLinkClick = (serviceName: string, href: string) => {
    console.log("🔍 Footer Link Clicked:", { serviceName, href, userRole });

    const requiredRoles =
      rolePermissions[serviceName as keyof typeof rolePermissions];

    console.log("🔐 Required Roles:", requiredRoles);

    if (requiredRoles && userRole && !requiredRoles.includes(userRole)) {
      console.log("❌ Access Denied - Showing toast");
      toast({
        title: "🚫 Access Restricted",
        description: `This feature is only available for ${requiredRoles.join(
          " and "
        )} users. Your current role: ${userRole.replace("-", " ")}`,
        variant: "destructive",
      });
      return;
    }

    console.log("✅ Access Granted or No Restrictions");
    // If no restrictions or user has permission, handle the link normally
    if (href !== "#") {
      window.location.href = href;
    } else {
      // For demo purposes, show success toast for allowed services
      toast({
        title: "🎉 Access Granted!",
        description: `Welcome to ${serviceName}! This feature is available for your role.`,
        variant: "default",
      });
    }
  };

  const quickLinks = [
    { name: "Home", href: "#" },
    { name: "About Us", href: "#" },
    { name: "Pet Care", href: "#" },
    { name: "Adoption", href: "#" },
    { name: "Emergency", href: "#" },
    { name: "Contact", href: "#" },
  ];

  const services = [
    { name: "Pet Adoption", href: "#" },
    { name: "Veterinary Care", href: "#" },
    { name: "Pet Products", href: "#" },
    { name: "Emergency Services", href: "#" },
    { name: "Pet Training", href: "#" },
    { name: "Grooming", href: "#" },
  ];

  const partners = [
    { name: "Partner 1", logo: "/Logo1.png", alt: "Partner 1 Logo" },
    { name: "Partner 2", logo: "/Logo2.png", alt: "Partner 2 Logo" },
    { name: "Partner 3", logo: "/Logo3.png", alt: "Partner 3 Logo" },
  ];

  const socialLinks = [
    {
      name: "Facebook",
      icon: Facebook,
      href: "#",
      color: "hover:text-blue-500",
    },
    { name: "Twitter", icon: Twitter, href: "#", color: "hover:text-sky-400" },
    {
      name: "Instagram",
      icon: Instagram,
      href: "#",
      color: "hover:text-pink-500",
    },
    { name: "YouTube", icon: Youtube, href: "#", color: "hover:text-red-500" },
  ];

  return (
    <footer className="bg-white border-t border-border/50 mt-16 relative overflow-hidden">
      {/* Creative Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Animated Sparkles */}
        {sparklePositions.map((sparkle, index) => (
          <div
            key={index}
            className="absolute animate-pulse"
            style={{
              left: `${sparkle.x}%`,
              top: `${sparkle.y}%`,
              animationDelay: `${sparkle.delay}s`,
            }}
          >
            <Sparkles className="h-3 w-3 text-primary/20" />
          </div>
        ))}

        {/* Gradient Orbs */}
        <div className="absolute top-10 left-10 w-32 h-32 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-full blur-xl animate-pulse"></div>
        <div
          className="absolute bottom-10 right-10 w-24 h-24 bg-gradient-to-r from-secondary/5 to-primary/5 rounded-full blur-xl animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
      </div>

      {/* Our Partners Section */}
      <div className="max-w-[1350px] mx-auto px-4 py-12 relative z-10">
        <div className="text-center mb-12">
          <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent mb-4">
            Our Trusted Partners
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            We collaborate with leading organizations to provide the best care
            and services for your beloved pets
          </p>
        </div>

        <div className="flex justify-center items-center gap-8 md:gap-12 lg:gap-16 mb-16">
          {partners.map((partner, index) => (
            <div
              key={index}
              className="group relative p-6 bg-gradient-to-br from-background to-background/80 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border border-border/50"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-secondary/5 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <img
                src={partner.logo}
                alt={partner.alt}
                className="h-16 w-auto mx-auto filter grayscale group-hover:grayscale-0 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="bg-gradient-to-r from-primary/5 via-background to-secondary/5 border-t border-border/30">
        <div className="max-w-[1350px] mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="lg:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-10 h-10 bg-gradient-to-r from-primary to-primary/80 rounded-full flex items-center justify-center">
                  <Heart className="h-6 w-6 text-primary-foreground" />
                </div>
                <h3 className="text-xl font-bold text-primary">FurEver Care</h3>
              </div>
              <p className="text-muted-foreground mb-6 leading-relaxed">
                Dedicated to finding forever homes for loving pets and providing
                comprehensive care services for all your furry family members.
              </p>

              {/* Social Links */}
              <div className="flex gap-4">
                {socialLinks.map((social) => {
                  const IconComponent = social.icon;
                  return (
                    <a
                      key={social.name}
                      href={social.href}
                      className={`w-10 h-10 bg-gradient-to-r from-muted to-muted/80 rounded-full flex items-center justify-center text-muted-foreground transition-all duration-300 hover:scale-110 ${social.color}`}
                      aria-label={social.name}
                    >
                      <IconComponent className="h-5 w-5" />
                    </a>
                  );
                })}
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h4 className="font-semibold text-primary mb-6 text-lg">
                Quick Links
              </h4>
              <ul className="space-y-3">
                {quickLinks.map((link) => (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className="text-muted-foreground hover:text-primary transition-colors duration-200 hover:translate-x-1 inline-block"
                    >
                      {link.name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold text-primary mb-6 text-lg flex items-center gap-2">
                <Zap className="h-5 w-5" />
                Our Services
              </h4>
              <ul className="space-y-3">
                {services.map((service) => {
                  const requiredRoles =
                    rolePermissions[
                      service.name as keyof typeof rolePermissions
                    ];
                  const hasAccess =
                    !requiredRoles ||
                    (userRole && requiredRoles.includes(userRole));

                  return (
                    <li key={service.name} className="relative">
                      <button
                        onClick={() =>
                          handleLinkClick(service.name, service.href)
                        }
                        onMouseEnter={() => setHoveredService(service.name)}
                        onMouseLeave={() => setHoveredService(null)}
                        className={`
                          text-left cursor-pointer bg-transparent border-none p-2 rounded-lg
                          transition-all duration-300 hover:translate-x-2 inline-flex items-center gap-2
                          group relative overflow-hidden
                          ${
                            hasAccess
                              ? "text-muted-foreground hover:text-primary hover:bg-primary/5"
                              : "text-muted-foreground/60 hover:text-destructive hover:bg-destructive/5"
                          }
                        `}
                      >
                        {/* Creative hover effect */}
                        <div
                          className={`
                          absolute inset-0 rounded-lg transition-all duration-300 opacity-0 group-hover:opacity-100
                          ${
                            hasAccess
                              ? "bg-gradient-to-r from-primary/10 to-transparent"
                              : "bg-gradient-to-r from-destructive/10 to-transparent"
                          }
                        `}
                        ></div>

                        {/* Service icon based on access */}
                        {hasAccess ? (
                          <Star className="h-4 w-4 text-primary/60 group-hover:text-primary transition-colors" />
                        ) : (
                          <Heart className="h-4 w-4 text-destructive/60 group-hover:text-destructive transition-colors" />
                        )}

                        <span className="relative z-10">{service.name}</span>

                        {/* Role indicator */}
                        {hoveredService === service.name && (
                          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 bg-black/80 text-white text-xs px-2 py-1 rounded whitespace-nowrap z-20">
                            {hasAccess
                              ? "✅ Available"
                              : `🔒 ${requiredRoles?.join(", ")} only`}
                          </div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Contact Info */}
            <div>
              <h4 className="font-semibold text-primary mb-6 text-lg">
                Contact Info
              </h4>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-muted-foreground">123 Pet Care Lane</p>
                    <p className="text-muted-foreground">
                      Animal City, AC 12345
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-secondary flex-shrink-0" />
                  <a
                    href="tel:+15551234567"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    (555) 123-PETS
                  </a>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-secondary flex-shrink-0" />
                  <a
                    href="mailto:info@furevercare.com"
                    className="text-muted-foreground hover:text-primary transition-colors"
                  >
                    info@furevercare.com
                  </a>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-muted-foreground">Mon-Fri: 8AM-6PM</p>
                    <p className="text-muted-foreground">Sat-Sun: 9AM-4PM</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="bg-gradient-to-r from-primary/10 via-background to-secondary/10 border-t border-border/30 relative overflow-hidden">
        {/* Creative floating elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-2 left-1/4 animate-bounce"
            style={{ animationDelay: "0.5s" }}
          >
            <Heart className="h-3 w-3 text-red-400/30" />
          </div>
          <div
            className="absolute top-4 right-1/3 animate-bounce"
            style={{ animationDelay: "1.2s" }}
          >
            <Star className="h-2 w-2 text-primary/30" />
          </div>
          <div
            className="absolute bottom-2 left-1/3 animate-bounce"
            style={{ animationDelay: "0.8s" }}
          >
            <Sparkles className="h-2 w-2 text-secondary/30" />
          </div>
        </div>

        <div className="max-w-[1350px] mx-auto px-4 py-6 relative z-10">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div className="animate-pulse">
                <Heart className="h-5 w-5 text-primary" />
              </div>
              <p className="text-muted-foreground text-sm">
                © {currentYear} FurEver Care. All rights reserved.
              </p>
            </div>
            <div className="flex items-center gap-6 text-sm">
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 relative group"
              >
                Privacy Policy
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></div>
              </a>
              <a
                href="#"
                className="text-muted-foreground hover:text-primary transition-all duration-300 hover:scale-105 relative group"
              >
                Terms of Service
                <div className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full"></div>
              </a>
              <div className="flex items-center gap-1 group">
                <span className="text-muted-foreground">Made with</span>
                <Heart className="h-4 w-4 text-red-500 animate-pulse group-hover:scale-125 transition-transform duration-300" />
                <span className="text-muted-foreground">for pets</span>
                {userRole && (
                  <div className="ml-2 px-2 py-1 bg-primary/10 rounded-full text-xs text-primary font-medium">
                    {userRole.replace("-", " ")} ✨
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
