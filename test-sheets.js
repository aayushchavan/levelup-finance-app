const fs = require("fs");
const { google } = require("googleapis");

async function main() {
  try {
    const envContent = fs.readFileSync(".env.local", "utf8");
    const sheetIdMatch = envContent.match(/SHEET_ID=([^\r\n]+)/);
    const serviceKeyMatch = envContent.match(/GOOGLE_SERVICE_KEY=([^\r\n]+)/);
    
    const sheetId = sheetIdMatch ? sheetIdMatch[1].trim() : null;
    const googleServiceKey = serviceKeyMatch ? serviceKeyMatch[1].trim() : null;

    if (!googleServiceKey || !sheetId) {
      console.error("Missing GOOGLE_SERVICE_KEY or SHEET_ID in .env.local");
      return;
    }

    console.log("Sheet ID:", sheetId);
    console.log("Connecting to Google Sheets...");

    const credentials = JSON.parse(googleServiceKey);
    console.log("Credentials keys:", Object.keys(credentials));
    console.log("Private key length:", credentials.private_key ? credentials.private_key.length : 0);
    console.log("Private key contains real newlines?", credentials.private_key ? credentials.private_key.includes("\n") : false);
    console.log("Private key contains escaped newlines?", credentials.private_key ? credentials.private_key.includes("\\n") : false);
    
    if (credentials.private_key) {
      // Try both cleanups to see what works
      credentials.private_key = credentials.private_key.replace(/\\n/g, "\n");
    }
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    const sheets = google.sheets({ version: "v4", auth });

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: sheetId,
      range: "Settings!A:B",
      valueRenderOption: "UNFORMATTED_VALUE",
    });

    console.log("Settings rows found in Sheet:");
    console.log(JSON.stringify(response.data.values, null, 2));
  } catch (error) {
    console.error("Error connecting to Google Sheets:", error);
  }
}

main();
