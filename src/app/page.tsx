import {
  HeroSection,
  AboutSection,
  MentorsSection,
  WhyUsSection,
  DemoLecturesSection,
  LocationSection,
  ContactSection,
} from "@/components/sections/LandingPage";
import { DEFAULT_SETTINGS, SiteSettings } from "@/lib/types/settings";

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

export default async function Home() {
  const settings = await fetchSettings();
  const enrollmentOpen = settings.enrollment_open !== "false";

  return (
    <main className="min-h-screen">
      <HeroSection
        batchStartDate={settings.batch_start_date}
        targetExams={settings.target_exams}
        location={settings.location}
        enrollmentOpen={enrollmentOpen}
        seatsLeft={settings.seats_left}
      />
      <AboutSection />
      <MentorsSection />
      <WhyUsSection />
      <DemoLecturesSection youtubeUrl={settings.youtube_url} />
      <LocationSection
        location={settings.location}
        phone={settings.phone}
        email={settings.email}
        mapsUrl={settings.maps_url}
      />
      <ContactSection
        batchStartDate={settings.batch_start_date}
        targetExams={settings.target_exams}
        fees={settings.fees}
        classSchedule={settings.class_schedule}
        classMode={settings.class_mode}
      />
    </main>
  );
}
