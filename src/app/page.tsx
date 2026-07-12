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
import { getSettings } from "@/lib/services/googleSheets";
import { unstable_noStore as noStore } from "next/cache";

export const dynamic = "force-dynamic";
export const revalidate = 0;

async function fetchSettings(): Promise<SiteSettings> {
  noStore();
  const googleServiceKey = process.env.GOOGLE_SERVICE_KEY;
  const sheetId = process.env.SHEET_ID;

  if (!googleServiceKey || !sheetId) {
    return DEFAULT_SETTINGS;
  }

  try {
    return await getSettings({ serviceAccountKey: googleServiceKey, sheetId });
  } catch (error) {
    console.error("Error loading settings from Google Sheets:", error);
    return DEFAULT_SETTINGS;
  }
}

export default async function Home() {
  const settings = await fetchSettings();
  console.log("Homepage settings:", settings);
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
