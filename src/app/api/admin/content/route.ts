import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { getSettings, updateSetting } from "@/lib/services/googleSheets";

function getConfig() {
  const googleServiceKey = process.env.GOOGLE_SERVICE_KEY;
  const sheetId = process.env.SHEET_ID;
  if (!googleServiceKey || !sheetId) throw new Error("Missing env vars");
  return { serviceAccountKey: googleServiceKey, sheetId };
}

export async function GET() {
  try {
    const settings = await getSettings(getConfig());
    return NextResponse.json({ settings });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch settings" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { settings } = await request.json();
    const config = getConfig();

    // Run sequentially to avoid race conditions (parallel writes create conflict sheets)
    for (const [key, value] of Object.entries(settings)) {
      await updateSetting(key, value as string, config);
    }

    // Immediately bust the landing page cache so changes go live
    revalidatePath("/", "layout"); // revalidates layout (footer, banner, whatsapp) + page

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update settings" }, { status: 500 });
  }
}
