"use client";

import { MessageCircle } from "lucide-react";

interface WhatsAppButtonProps {
  whatsapp?: string;
}

export function WhatsAppButton({ whatsapp }: WhatsAppButtonProps) {
  if (!whatsapp) return null;

  const url = `https://wa.me/${whatsapp}?text=${encodeURIComponent("Hi! I'm interested in CFA coaching at LevelUp Finance Institute.")}`;

  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white rounded-full shadow-2xl shadow-green-500/40 transition-all duration-300 hover:scale-110 px-4 py-3 group"
    >
      <MessageCircle className="h-6 w-6 fill-white stroke-none" />
      <span className="text-sm font-semibold max-w-0 overflow-hidden group-hover:max-w-[8rem] transition-all duration-300 whitespace-nowrap">
        Chat with Us
      </span>
    </a>
  );
}
