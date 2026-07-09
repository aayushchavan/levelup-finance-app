import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { AnnouncementBanner } from "@/components/layout/AnnouncementBanner";
import { WhatsAppButton } from "@/components/layout/WhatsAppButton";
import { DEFAULT_SETTINGS, SiteSettings } from "@/lib/types/settings";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "LevelUp Finance Institute - CFA Coaching in Kalyan",
  description:
    "Your First Step Toward a Global Finance Career! CFA Level 1 & 2 classes in Kalyan (West). Expert mentorship, practical insights, and personal attention.",
  keywords: ["CFA", "CFA coaching", "Kalyan", "Finance Institute", "CFA Level 1", "CFA Level 2", "Finance career"],
  icons: {
    icon: "/favicon.ico",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    userScalable: true,
  },
};

async function fetchSettings(): Promise<SiteSettings> {
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"}/api/settings`,
      { cache: "no-store" }
    );
    if (!res.ok) return DEFAULT_SETTINGS;
    const data = await res.json();
    return { ...DEFAULT_SETTINGS, ...(data.settings ?? {}) };
  } catch {
    return DEFAULT_SETTINGS;
  }
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const settings = await fetchSettings();

  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AnnouncementBanner text={settings.announcement} />
        <Header />
        {children}
        <Footer
          location={settings.location}
          phone={settings.phone}
          email={settings.email}
          instagramUrl={settings.instagram_url}
          youtubeChannelUrl={settings.youtube_channel_url}
        />
        <WhatsAppButton whatsapp={settings.whatsapp} />
      </body>
    </html>
  );
}
