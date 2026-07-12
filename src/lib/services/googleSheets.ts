/**
 * Google Sheets service for managing form submissions, leads, and site settings
 */

import { google } from "googleapis";
import { ContactFormSubmission } from "@/lib/types/contact";
import { Lead, SiteSettings, DEFAULT_SETTINGS } from "@/lib/types/settings";

interface GoogleSheetsConfig {
  serviceAccountKey: string;
  sheetId: string;
  sheetName?: string;
}

function initializeSheetsClient(serviceAccountKey: string) {
  const credentials = JSON.parse(serviceAccountKey);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });
  return google.sheets({ version: "v4", auth });
}

/** Appends a contact form submission to Sheet1 */
export async function appendToSheet(
  data: ContactFormSubmission,
  config: GoogleSheetsConfig
): Promise<void> {
  const sheets = initializeSheetsClient(config.serviceAccountKey);
  const sheetName = config.sheetName || "Sheet1";

  const values = [
    [data.timestamp, data.name, data.email, data.phone, data.message || ""],
  ];

  await sheets.spreadsheets.values.append({
    spreadsheetId: config.sheetId,
    range: `${sheetName}!A:E`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values },
  });
}

/** Fetches all leads from Sheet1 */
export async function getLeads(config: GoogleSheetsConfig): Promise<Lead[]> {
  const sheets = initializeSheetsClient(config.serviceAccountKey);

  const response = await sheets.spreadsheets.values.get({
    spreadsheetId: config.sheetId,
    range: "Sheet1!A:F",
  });

  const rows = response.data.values || [];

  // Skip header row (row 1 = Timestamp, Name, Email, Phone, Message, Status)
  const dataRows = rows.slice(1);

  return dataRows.map((row, index) => ({
    rowIndex: index + 2, // +2 because: +1 for 1-indexing, +1 for skipped header
    timestamp: row[0] || "",
    name: row[1] || "",
    email: row[2] || "",
    phone: row[3] || "",
    message: row[4] || "",
    status: (row[5] as Lead["status"]) || "New",
  }));
}

/** Updates the status of a lead in Sheet1 column F */
export async function updateLeadStatus(
  rowIndex: number,
  status: string,
  config: GoogleSheetsConfig
): Promise<void> {
  const sheets = initializeSheetsClient(config.serviceAccountKey);

  await sheets.spreadsheets.values.update({
    spreadsheetId: config.sheetId,
    range: `Sheet1!F${rowIndex}`,
    valueInputOption: "USER_ENTERED",
    requestBody: { values: [[status]] },
  });
}

/** Gets site settings from the Settings sheet */
export async function getSettings(
  config: GoogleSheetsConfig
): Promise<SiteSettings> {
  const sheets = initializeSheetsClient(config.serviceAccountKey);

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: config.sheetId,
      range: "Settings!A:B",
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    const rows = response.data.values || [];
    const partial: Partial<SiteSettings> = {};

    rows.forEach((row) => {
      if (row[0] && row[1] !== undefined) {
        const val = String(row[1]);
        // Skip Google Sheets formula errors (e.g. #ERROR!, #VALUE!, #REF!)
        if (!val.startsWith("#")) {
          (partial as Record<string, string>)[row[0]] = val;
        }
      }
    });

    console.log("Settings loaded from Google:", partial);
    return { ...DEFAULT_SETTINGS, ...partial };
  } catch (error) {
    console.error("Error fetching settings from Google Sheets:", error);
    return DEFAULT_SETTINGS;
  }
}

/** Updates a single setting in the Settings sheet */
export async function updateSetting(
  key: string,
  value: string,
  config: GoogleSheetsConfig
): Promise<void> {
  const sheets = initializeSheetsClient(config.serviceAccountKey);

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: config.sheetId,
      range: "Settings!A:B",
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    const rows = response.data.values || [];
    const rowIndex = rows.findIndex((row) => row[0] === key);

    if (rowIndex === -1) {
      await sheets.spreadsheets.values.append({
        spreadsheetId: config.sheetId,
        range: "Settings!A:B",
        valueInputOption: "RAW",
        requestBody: { values: [[key, value]] },
      });
    } else {
      await sheets.spreadsheets.values.update({
        spreadsheetId: config.sheetId,
        range: `Settings!B${rowIndex + 1}`,
        valueInputOption: "RAW",
        requestBody: { values: [[value]] },
      });
    }
  } catch {
    // Settings sheet might not exist — create it with all defaults + new value
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId: config.sheetId,
      requestBody: {
        requests: [{ addSheet: { properties: { title: "Settings" } } }],
      },
    });

    const allSettings: SiteSettings = { ...DEFAULT_SETTINGS, [key]: value };
    const values = Object.entries(allSettings).map(([k, v]) => [k, v]);

    await sheets.spreadsheets.values.update({
      spreadsheetId: config.sheetId,
      range: "Settings!A:B",
      valueInputOption: "USER_ENTERED",
      requestBody: { values },
    });
  }
}

/** Updates all settings in the Settings sheet in a single batch write */
export async function updateAllSettings(
  settings: SiteSettings,
  config: GoogleSheetsConfig
): Promise<void> {
  const sheets = initializeSheetsClient(config.serviceAccountKey);

  try {
    const values = Object.entries(settings).map(([k, v]) => [k, String(v)]);

    await sheets.spreadsheets.values.update({
      spreadsheetId: config.sheetId,
      range: "Settings!A:B",
      valueInputOption: "RAW",
      requestBody: { values },
    });
  } catch (error) {
    console.error("Failed to batch update settings in Google Sheets, attempting to recreate sheet:", error);
    try {
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: config.sheetId,
        requestBody: {
          requests: [{ addSheet: { properties: { title: "Settings" } } }],
        },
      });

      const values = Object.entries(settings).map(([k, v]) => [k, String(v)]);
      await sheets.spreadsheets.values.update({
        spreadsheetId: config.sheetId,
        range: "Settings!A:B",
        valueInputOption: "RAW",
        requestBody: { values },
      });
    } catch (innerError) {
      console.error("Critical error updating settings sheet:", innerError);
      throw innerError;
    }
  }
}

/** Deletes a lead row in Sheet1 */
export async function deleteLead(
  rowIndex: number,
  config: GoogleSheetsConfig
): Promise<void> {
  const sheets = initializeSheetsClient(config.serviceAccountKey);
  const sheetName = config.sheetName || "Sheet1";

  const spreadsheet = await sheets.spreadsheets.get({
    spreadsheetId: config.sheetId,
  });

  const sheet = spreadsheet.data.sheets?.find(
    (s) => s.properties?.title === sheetName
  );

  if (!sheet || sheet.properties?.sheetId === undefined || sheet.properties?.sheetId === null) {
    throw new Error(`Sheet with title "${sheetName}" not found`);
  }

  const numericSheetId = sheet.properties.sheetId;

  await sheets.spreadsheets.batchUpdate({
    spreadsheetId: config.sheetId,
    requestBody: {
      requests: [
        {
          deleteDimension: {
            range: {
              sheetId: numericSheetId,
              dimension: "ROWS",
              startIndex: rowIndex - 1,
              endIndex: rowIndex,
            },
          },
        },
      ],
    },
  });
}

/** Gets current timestamp in IST */
export function getTimestamp(): string {
  return new Date().toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    dateStyle: "medium",
    timeStyle: "short",
  });
}
