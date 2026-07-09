"use client";

import { useState } from "react";
import { X, Megaphone } from "lucide-react";

interface AnnouncementBannerProps {
  text: string;
}

export function AnnouncementBanner({ text }: AnnouncementBannerProps) {
  const [dismissed, setDismissed] = useState(false);

  if (!text || dismissed) return null;

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 via-primary to-blue-700 text-white text-sm font-medium py-2.5 px-4 flex items-center justify-center gap-3 relative">
      <Megaphone className="h-4 w-4 flex-shrink-0 animate-pulse" />
      <span className="text-center leading-snug">{text}</span>
      <button
        onClick={() => setDismissed(true)}
        aria-label="Dismiss announcement"
        className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/20 transition"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
