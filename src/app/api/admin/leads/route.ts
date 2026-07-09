import { NextRequest, NextResponse } from "next/server";
import { getLeads, updateLeadStatus } from "@/lib/services/googleSheets";

function getConfig() {
  const googleServiceKey = process.env.GOOGLE_SERVICE_KEY;
  const sheetId = process.env.SHEET_ID;
  if (!googleServiceKey || !sheetId) throw new Error("Missing env vars");
  return { serviceAccountKey: googleServiceKey, sheetId };
}

export async function GET() {
  try {
    const leads = await getLeads(getConfig());
    return NextResponse.json({ leads });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { rowIndex, status } = await request.json();
    if (!rowIndex || !status) {
      return NextResponse.json({ error: "Missing rowIndex or status" }, { status: 400 });
    }
    await updateLeadStatus(rowIndex, status, getConfig());
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to update status" }, { status: 500 });
  }
}
