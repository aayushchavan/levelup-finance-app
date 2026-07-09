import { NextResponse } from "next/server";
import { getSettings } from "@/lib/services/googleSheets";
import { DEFAULT_SETTINGS } from "@/lib/types/settings";

export async function GET() {
  try {
    const googleServiceKey = process.env.GOOGLE_SERVICE_KEY;
    const sheetId = process.env.SHEET_ID;

    if (!googleServiceKey || !sheetId) {
      return NextResponse.json({ settings: DEFAULT_SETTINGS });
    }

    const settings = await getSettings({ serviceAccountKey: googleServiceKey, sheetId });
    return NextResponse.json({ settings });
  } catch {
    return NextResponse.json({ settings: DEFAULT_SETTINGS });
  }
}
