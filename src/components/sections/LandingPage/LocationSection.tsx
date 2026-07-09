"use client";

import { MapPin, Train, Navigation, Phone, Mail } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface LocationSectionProps {
  location?: string;
  phone?: string;
  email?: string;
  mapsUrl?: string;
}

export function LocationSection({
  location = "Kalyan (West), Mumbai",
  phone,
  email,
  mapsUrl,
}: LocationSectionProps) {
  return (
    <section id="location" className="py-20">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Where <span className="text-primary">We Are</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Conveniently located in {location}
          </p>
        </div>

        <div className="max-w-4xl mx-auto grid gap-8 md:grid-cols-2">
          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Our Location</h3>
                  <p className="text-sm text-muted-foreground">{location}</p>
                </div>
              </div>

              {phone && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Phone</h3>
                    <a href={`tel:${phone.split("/")[0].trim()}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {phone}
                    </a>
                  </div>
                </div>
              )}

              {email && (
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Email</h3>
                    <a href={`mailto:${email}`} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {email}
                    </a>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-l-4 border-l-primary">
            <CardContent className="pt-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Train className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Easy to Reach</h3>
                  <p className="text-sm text-muted-foreground">
                    Nearby Kalyan Railway Station - convenient commute for students
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Google Maps Embed */}
        {mapsUrl && (
          <div className="mt-10 max-w-4xl mx-auto rounded-2xl overflow-hidden border border-border shadow-md">
            <iframe
              src={mapsUrl}
              className="w-full h-64 md:h-80"
              loading="lazy"
              title="LevelUp Finance Institute Location"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        )}

        <div className="mt-12 mx-auto max-w-3xl">
          <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <CardContent className="pt-6 text-center space-y-4">
              <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                <Navigation className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg">Visit Us</h3>
              <p className="text-sm text-muted-foreground max-w-xl mx-auto">
                Our classes are held in Kalyan (West), conveniently accessible for students from Kalyan to Karjat, Kalyan to Kasara, Dombivli, Thane, and surrounding areas.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
