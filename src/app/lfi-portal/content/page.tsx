"use client";

import { useEffect, useState } from "react";
import { SiteSettings, DEFAULT_SETTINGS } from "@/lib/types/settings";
import {
  Save, RefreshCw, Calendar, Play, MapPin, DollarSign, CheckCircle,
  Phone, Mail, MessageCircle, Clock, Monitor, Megaphone, ToggleLeft,
  Users, Instagram, Youtube, Globe,
} from "lucide-react";

type SettingField = {
  key: keyof SiteSettings;
  label: string;
  description: string;
  placeholder: string;
  icon: React.ElementType;
  type?: "text" | "toggle" | "textarea";
  group: string;
};

const FIELDS: SettingField[] = [
  // ── BATCH INFO ──────────────────────────────────────────────────────
  {
    key: "batch_start_date",
    label: "Batch Start Date",
    description: "Shown on the hero section & batch info card",
    placeholder: "e.g. 3rd January 2026",
    icon: Calendar,
    group: "Batch Info",
  },
  {
    key: "target_exams",
    label: "Target Exams",
    description: "CFA exam dates shown on hero & batch info",
    placeholder: "e.g. Nov 2026 & Feb 2027",
    icon: Calendar,
    group: "Batch Info",
  },
  {
    key: "class_schedule",
    label: "Class Schedule / Timings",
    description: "Shown in the batch info card",
    placeholder: "e.g. Mon–Sat, 7:00 PM – 9:00 PM",
    icon: Clock,
    group: "Batch Info",
  },
  {
    key: "class_mode",
    label: "Class Mode",
    description: "Offline / Online / Hybrid — shown in batch info",
    placeholder: "e.g. Offline",
    icon: Monitor,
    group: "Batch Info",
  },
  {
    key: "fees",
    label: "Course Fees",
    description: "Shown in the batch info card (leave blank to hide)",
    placeholder: "e.g. ₹15,000 for CFA Level 1",
    icon: DollarSign,
    group: "Batch Info",
  },

  // ── ENROLLMENT ───────────────────────────────────────────────────────
  {
    key: "enrollment_open",
    label: "Enrollment Status",
    description: '"true" = Enrolling Now (green badge). "false" = Closed (red badge)',
    placeholder: "true",
    icon: ToggleLeft,
    group: "Enrollment",
  },
  {
    key: "seats_left",
    label: "Seats Left",
    description: 'Shows an urgency chip on the hero (e.g. "12"). Leave blank to hide',
    placeholder: "e.g. 12",
    icon: Users,
    group: "Enrollment",
  },

  // ── ANNOUNCEMENT ─────────────────────────────────────────────────────
  {
    key: "announcement",
    label: "Announcement Banner",
    description: "Shows a pinned banner at the top of the site. Leave blank to hide",
    placeholder: "e.g. 🎉 Early bird discount — ₹2,000 off till 31st May!",
    icon: Megaphone,
    group: "Announcement",
  },

  // ── MEDIA ─────────────────────────────────────────────────────────────
  {
    key: "youtube_url",
    label: "Demo Lecture YouTube URL",
    description: "Embed URL for the demo lecture video",
    placeholder: "https://www.youtube.com/embed/...",
    icon: Play,
    group: "Media",
  },

  // ── CONTACT & LOCATION ──────────────────────────────────────────────
  {
    key: "location",
    label: "Location",
    description: "Shown in hero, location section, and footer",
    placeholder: "e.g. Kalyan (West), Mumbai",
    icon: MapPin,
    group: "Contact & Location",
  },
  {
    key: "phone",
    label: "Phone Number(s)",
    description: "Shown in footer and location section",
    placeholder: "e.g. +91 88792 29508 / +91 84509 17541",
    icon: Phone,
    group: "Contact & Location",
  },
  {
    key: "email",
    label: "Email Address",
    description: "Shown in footer and location section",
    placeholder: "e.g. levelupfinanceinstitute@gmail.com",
    icon: Mail,
    group: "Contact & Location",
  },
  {
    key: "whatsapp",
    label: "WhatsApp Number",
    description: "Number for the floating WhatsApp button (digits only, with country code)",
    placeholder: "e.g. 918879229508",
    icon: MessageCircle,
    group: "Contact & Location",
  },
  {
    key: "maps_url",
    label: "Google Maps Embed URL",
    description: "Paste the src URL from Google Maps → Share → Embed (leave blank to hide map)",
    placeholder: "https://www.google.com/maps/embed?pb=...",
    icon: Globe,
    group: "Contact & Location",
  },

  // ── SOCIAL ───────────────────────────────────────────────────────────
  {
    key: "instagram_url",
    label: "Instagram Profile URL",
    description: "Shown as a social link in the footer (leave blank to hide)",
    placeholder: "https://instagram.com/levelupfinanceinstitute",
    icon: Instagram,
    group: "Social",
  },
  {
    key: "youtube_channel_url",
    label: "YouTube Channel URL",
    description: "Shown as a social link in the footer (leave blank to hide)",
    placeholder: "https://youtube.com/@levelupfinanceinstitute",
    icon: Youtube,
    group: "Social",
  },
];

const GROUP_ORDER = ["Batch Info", "Enrollment", "Announcement", "Media", "Contact & Location", "Social"];

export default function ContentPage() {
  const [settings, setSettings] = useState<SiteSettings>(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/content");
      const data = await res.json();
      if (res.ok) setSettings({ ...DEFAULT_SETTINGS, ...data.settings });
    } catch {
      setError("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchSettings(); }, []);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await fetch("/api/admin/content", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ settings }),
      });
      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to save");
      }
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const grouped = GROUP_ORDER.reduce<Record<string, SettingField[]>>((acc, g) => {
    acc[g] = FIELDS.filter((f) => f.group === g);
    return acc;
  }, {});

  return (
    <div className="p-8 max-w-3xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-white">Content Settings</h1>
          <p className="text-slate-400 text-sm mt-1">Edit website content — changes reflect live on the site</p>
        </div>
        <div className="flex gap-3">
          <button
            onClick={fetchSettings}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-700/60 hover:bg-slate-700 text-slate-300 text-sm font-medium transition border border-slate-600/50"
          >
            <RefreshCw className="w-4 h-4" /> Reset
          </button>
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold transition shadow-lg shadow-blue-500/20 disabled:opacity-50"
          >
            {saved ? <CheckCircle className="w-4 h-4" /> : <Save className="w-4 h-4" />}
            {saving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 text-sm text-red-400 mb-6">
          {error}
          <p className="text-slate-500 text-xs mt-1">Make sure your .env.local is configured with GOOGLE_SERVICE_KEY and SHEET_ID</p>
        </div>
      )}

      {saved && (
        <div className="bg-green-500/10 border border-green-500/30 rounded-xl px-4 py-3 text-sm text-green-400 mb-6 flex items-center gap-2">
          <CheckCircle className="w-4 h-4" /> Settings saved! Changes are now live on the website.
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center h-48 text-slate-400">Loading settings...</div>
      ) : (
        <div className="space-y-8">
          {GROUP_ORDER.map((group) => (
            <div key={group}>
              {/* Group Header */}
              <div className="flex items-center gap-3 mb-3">
                <span className="text-xs font-bold uppercase tracking-widest text-blue-400">{group}</span>
                <div className="flex-1 h-px bg-slate-700/60" />
              </div>

              <div className="space-y-3">
                {grouped[group].map(({ key, label, description, placeholder, icon: Icon }) => (
                  <div key={key} className="bg-slate-800/60 border border-slate-700/50 rounded-2xl p-5">
                    <div className="flex items-start gap-4">
                      <div className="w-9 h-9 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Icon className="w-4 h-4 text-blue-400" />
                      </div>
                      <div className="flex-1 space-y-2">
                        <div>
                          <label className="text-sm font-semibold text-white">{label}</label>
                          <p className="text-xs text-slate-500 mt-0.5">{description}</p>
                        </div>
                        {/* Hide text input for enrollment_open — use toggle buttons instead */}
                        {key !== "enrollment_open" && (
                          <input
                            type="text"
                            value={settings[key]}
                            onChange={(e) => setSettings((prev) => ({ ...prev, [key]: e.target.value }))}
                            placeholder={placeholder}
                            className="w-full px-4 py-2.5 rounded-xl bg-slate-900/80 border border-slate-600 text-white placeholder-slate-600 text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition"
                          />
                        )}
                        {/* YouTube embed preview */}
                        {key === "youtube_url" && settings.youtube_url && (
                          <div className="mt-3 rounded-xl overflow-hidden border border-slate-700/50 aspect-video">
                            <iframe
                              src={settings.youtube_url}
                              className="w-full h-full"
                              title="Preview"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        )}
                        {/* Maps embed preview */}
                        {key === "maps_url" && settings.maps_url && (
                          <div className="mt-3 rounded-xl overflow-hidden border border-slate-700/50 h-48">
                            <iframe
                              src={settings.maps_url}
                              className="w-full h-full"
                              title="Map Preview"
                              loading="lazy"
                            />
                          </div>
                        )}
                        {/* Enrollment toggle buttons */}
                        {key === "enrollment_open" && (
                          <div className="flex gap-2 mt-1">
                            <button
                              onClick={() => setSettings((p) => ({ ...p, enrollment_open: "true" }))}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${settings.enrollment_open === "true" ? "bg-green-500 text-white" : "bg-slate-700 text-slate-400 hover:bg-slate-600"}`}
                            >
                              ✓ Enrolling Now
                            </button>
                            <button
                              onClick={() => setSettings((p) => ({ ...p, enrollment_open: "false" }))}
                              className={`px-3 py-1 rounded-lg text-xs font-semibold transition ${settings.enrollment_open === "false" ? "bg-red-500 text-white" : "bg-slate-700 text-slate-400 hover:bg-slate-600"}`}
                            >
                              ✗ Enrollment Closed
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
