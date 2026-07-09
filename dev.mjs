// dev.mjs — Custom dev server startup with links printed
import { spawn } from "child_process";

const PORT = process.env.PORT || 3000;
const BASE = `http://localhost:${PORT}`;

// Print links immediately
console.log("\n");
console.log("┌─────────────────────────────────────────────────┐");
console.log("│         LevelUp Finance Institute               │");
console.log("├─────────────────────────────────────────────────┤");
console.log(`│  🌐  Landing Page  →  ${BASE.padEnd(25)}│`);
console.log(`│  🔐  Admin Panel   →  ${(BASE + "/lfi-portal").padEnd(25)} │`);
console.log("└─────────────────────────────────────────────────┘");
console.log("   Admin login uses the ADMIN_PASSWORD from .env.local\n");

// Start Next.js dev server
const child = spawn(
  "npx",
  ["next", "dev", "--turbopack"],
  { stdio: "inherit", shell: true }
);

child.on("exit", (code) => process.exit(code ?? 0));
