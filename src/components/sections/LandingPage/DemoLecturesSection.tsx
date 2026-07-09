"use client";

import { Play, BookOpen, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface DemoLecturesSectionProps {
  youtubeUrl?: string;
}

export function DemoLecturesSection({
  youtubeUrl = "https://www.youtube.com/embed/97QoYhUFxsA",
}: DemoLecturesSectionProps) {
  return (
    <section id="demo-lectures" className="py-20">
      <div className="container">
        <div className="mx-auto max-w-3xl text-center space-y-4 mb-16">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl md:text-5xl">
            Experience Our <span className="text-primary">Teaching Style</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            See how we make complex finance concepts simple and engaging
          </p>
        </div>

        <div className="max-w-4xl mx-auto space-y-8">
          {/* Video Embed */}
          <Card className="overflow-hidden border-2 border-primary/20">
            <CardContent className="p-0">
              <div className="aspect-video w-full">
                <iframe
                  className="w-full h-full"
                  src={youtubeUrl}
                  title="LevelUp Finance Institute Demo Lecture"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
            </CardContent>
          </Card>

          {/* Benefits Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <Play className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Clear Explanations</h3>
                <p className="text-sm text-muted-foreground">
                  Watch how we break down tough topics step by step
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <BookOpen className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Practical Approach</h3>
                <p className="text-sm text-muted-foreground">
                  Real-world examples that make learning meaningful
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6 text-center space-y-3">
                <div className="mx-auto w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <TrendingUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-semibold">Engaging Sessions</h3>
                <p className="text-sm text-muted-foreground">
                  Interactive teaching that keeps you focused
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Bottom CTA */}
          <div className="text-center">
            <div className="rounded-lg border-2 border-primary/20 bg-primary/5 p-6">
              <p className="text-base font-medium text-foreground">
                This is just a glimpse of how we teach. Join us to experience the complete learning journey!
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
