#!/usr/bin/env node
/**
 * Fails CI/local checks if UTF-8 mojibake sequences remain in source.
 * Run: npm run check:encoding
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const EXTS = new Set([".jsx", ".js", ".tsx", ".ts", ".html", ".css", ".md", ".json"]);
const PATTERNS = [
  "Â·",
  "Â©",
  "â†’",
  "â†",
  "â†—",
  "â€™",
  "â€œ",
  "â€",
  "â€“",
  "â€”",
  "Ã—",
];

function walk(dir, out = []) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.name === "node_modules" || entry.name === ".git" || entry.name === "build") {
      continue;
    }
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, out);
    else if (EXTS.has(path.extname(entry.name))) out.push(full);
  }
  return out;
}

const hits = [];
for (const file of walk(ROOT)) {
  const text = fs.readFileSync(file, "utf8");
  for (const bad of PATTERNS) {
    if (!text.includes(bad)) continue;
    const lines = text.split(/\r?\n/);
    lines.forEach((line, i) => {
      if (line.includes(bad)) {
        hits.push(`${path.relative(ROOT, file)}:${i + 1}: contains ${JSON.stringify(bad)}`);
      }
    });
  }
}

if (hits.length) {
  console.error(`Encoding check FAILED (${hits.length} hits):\n`);
  hits.slice(0, 80).forEach((h) => console.error(`  ${h}`));
  if (hits.length > 80) console.error(`  …and ${hits.length - 80} more`);
  process.exit(1);
}

console.log("Encoding check passed — no mojibake sequences found.");
