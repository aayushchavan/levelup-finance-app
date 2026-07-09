export interface Lead {
  rowIndex: number;
  timestamp: string;
  name: string;
  email: string;
  phone: string;
  message: string;
  status: "New" | "Contacted" | "Enrolled" | "Rejected";
}

export interface SiteSettings {
  // Batch Info
  batch_start_date: string;
  target_exams: string;
  fees: string;
  class_schedule: string;
  class_mode: string;

  // Enrollment
  enrollment_open: string; // "true" | "false" stored as string in sheets
  seats_left: string;      // e.g. "12" or "" to hide

  // Announcement Banner
  announcement: string;    // shown as a top banner; "" = hidden

  // Media
  youtube_url: string;

  // Contact & Location
  location: string;
  phone: string;
  email: string;
  whatsapp: string;
  maps_url: string;        // Google Maps embed src URL

  // Social
  instagram_url: string;
  youtube_channel_url: string;
}

export const DEFAULT_SETTINGS: SiteSettings = {
  batch_start_date: "3rd January 2026",
  target_exams: "Nov 2026 & Feb 2027",
  fees: "",
  class_schedule: "Mon–Sat, 7:00 PM – 9:00 PM",
  class_mode: "Offline",

  enrollment_open: "true",
  seats_left: "",

  announcement: "",

  youtube_url: "https://www.youtube.com/embed/97QoYhUFxsA",

  location: "Kalyan (West), Mumbai",
  phone: "+91 88792 29508 / +91 84509 17541",
  email: "levelupfinanceinstitute@gmail.com",
  whatsapp: "918879229508",
  maps_url: "",

  instagram_url: "",
  youtube_channel_url: "",
};
