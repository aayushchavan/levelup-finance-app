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
import { headers } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";

async function fetchSettings(): Promise<{ settings: SiteSettings; debug: string }> {
  await headers(); // Forces dynamic rendering at request time, bypassing CDN/Full Route cache
  noStore();
  
  const commitSha = process.env.VERCEL_GIT_COMMIT_SHA || "local";
  const sheetId = process.env.SHEET_ID || "not_set";
  const googleServiceKey = process.env.GOOGLE_SERVICE_KEY;

  let debugStatus = "unknown";
  let isDefault = false;
  let settings: SiteSettings;

  if (!googleServiceKey || !sheetId) {
    debugStatus = "missing_env_vars";
    isDefault = true;
    settings = DEFAULT_SETTINGS;
  } else {
    try {
      settings = await getSettings({ serviceAccountKey: googleServiceKey, sheetId });
      debugStatus = "success";
      isDefault = false;
    } catch (error) {
      console.error("Error loading settings from Google Sheets:", error);
      debugStatus = `failed: ${error instanceof Error ? error.message : String(error)}`;
      isDefault = true;
      settings = DEFAULT_SETTINGS;
    }
  }

  const debug = `COMMIT_SHA: ${commitSha} | SHEET_ID: ${sheetId} | BATCH_START: ${settings.batch_start_date} | EXAMS: ${settings.target_exams} | DEFAULT_SETTINGS: ${isDefault} | STATUS: ${debugStatus}`;

  return { settings, debug };
}

export default async function Home() {
  const { settings, debug } = await fetchSettings();
  console.log("Homepage settings:", settings);
  const enrollmentOpen = settings.enrollment_open !== "false";

  return (
    <main className="min-h-screen">
      {/* Diagnostics log rendered as a hidden element to inspect production values */}
      <span style={{ display: "none" }} id="prod-debug-log">{debug}</span>
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
