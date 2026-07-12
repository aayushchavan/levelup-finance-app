"use client";

import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  const handleNavClick = (id: string) => {
    if (pathname === "/") {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    } else {
      router.push(`/#${id}`);
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Image 
            src="/logo.svg" 
            alt="LevelUp Finance Institute Logo" 
            width={32} 
            height={32}
            className="h-10 w-10"
          />
          
          
          
          <div className="flex flex-col">
            <span className="text-lg font-bold text-foreground">LevelUp</span>
            <span className="text-xs text-muted-foreground">Finance Institute</span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <button
            onClick={() => handleNavClick("home")}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Home
          </button>
          <button
            onClick={() => handleNavClick("about")}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            About
          </button>
          <button
            onClick={() => handleNavClick("mentors")}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Mentors
          </button>
          <button
            onClick={() => handleNavClick("why-us")}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Why Us
          </button>
          <button
            onClick={() => handleNavClick("demo-lectures")}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Demo
          </button>
          <button
            onClick={() => handleNavClick("location")}
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            Location
          </button>
          <Button onClick={() => handleNavClick("contact")}>
            Enroll Now
          </Button>
        </nav>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>
      </div>

      {/* Mobile Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container flex flex-col gap-4 py-4">
            <button
              onClick={() => handleNavClick("home")}
              className="text-sm font-medium text-left"
            >
              Home
            </button>
            <button
              onClick={() => handleNavClick("about")}
              className="text-sm font-medium text-left"
            >
              About
            </button>
            <button
              onClick={() => handleNavClick("mentors")}
              className="text-sm font-medium text-left"
            >
              Mentors
            </button>
            <button
              onClick={() => handleNavClick("why-us")}
              className="text-sm font-medium text-left"
            >
              Why Us
            </button>
            <button
              onClick={() => handleNavClick("demo-lectures")}
              className="text-sm font-medium text-left"
            >
              Demo
            </button>
            <button
              onClick={() => handleNavClick("location")}
              className="text-sm font-medium text-left"
            >
              Location
            </button>
            <Button onClick={() => handleNavClick("contact")}>
              Enroll Now
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
}
