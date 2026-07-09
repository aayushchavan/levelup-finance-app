"use client";

import { Mail, MapPin, Phone, Instagram, Youtube } from "lucide-react";
import Image from "next/image";

interface FooterProps {
  location?: string;
  phone?: string;
  email?: string;
  instagramUrl?: string;
  youtubeChannelUrl?: string;
}

export function Footer({
  location = "Kalyan (West), Mumbai",
  phone = "+91 88792 29508 / +91 84509 17541",
  email = "levelupfinanceinstitute@gmail.com",
  instagramUrl,
  youtubeChannelUrl,
}: FooterProps) {
  // Normalize social URLs — admin may enter just a handle or full URL
  const normalizedInstagram = instagramUrl
    ? instagramUrl.startsWith("http")
      ? instagramUrl
      : `https://instagram.com/${instagramUrl.replace(/^\//, "")}`
    : undefined;

  const normalizedYoutube = youtubeChannelUrl
    ? youtubeChannelUrl.startsWith("http")
      ? youtubeChannelUrl
      : `https://youtube.com/${youtubeChannelUrl.replace(/^\//, "")}`
    : undefined;
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12">
        <div className="grid gap-8 md:grid-cols-3">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Image
                src="/logo.svg"
                alt="LevelUp Finance Institute Logo"
                width={32}
                height={32}
                className="h-10 w-10"
              />
              <div className="flex flex-col">
                <span className="text-lg font-bold">LevelUp</span>
                <span className="text-xs text-muted-foreground">Finance Institute</span>
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Your First Step Toward a Global Finance Career!
            </p>

            {/* Social Links */}
            {(normalizedInstagram || normalizedYoutube) && (
              <div className="flex items-center gap-3 pt-1">
                {normalizedInstagram && (
                  <a
                    href={normalizedInstagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Instagram className="h-4 w-4" />
                  </a>
                )}
                {normalizedYoutube && (
                  <a
                    href={normalizedYoutube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-8 h-8 rounded-full bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-colors"
                  >
                    <Youtube className="h-4 w-4" />
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Contact Us</h3>
            <div className="space-y-3 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <span>{location}</span>
              </div>
              {email && (
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 flex-shrink-0" />
                  <a href={`mailto:${email}`} className="hover:text-primary transition-colors">{email}</a>
                </div>
              )}
              {phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 flex-shrink-0" />
                  <span>{phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>
                <a href="#about" className="hover:text-primary transition-colors">About Us</a>
              </li>
              <li>
                <a href="#mentors" className="hover:text-primary transition-colors">Our Mentors</a>
              </li>
              <li>
                <a href="#why-us" className="hover:text-primary transition-colors">Why Choose Us</a>
              </li>
              <li>
                <a href="#demo-lectures" className="hover:text-primary transition-colors">Demo Lectures</a>
              </li>
              <li>
                <a href="#contact" className="hover:text-primary transition-colors">Enroll Now</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-8 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>© {new Date().getFullYear()} LevelUp Finance Institute. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
