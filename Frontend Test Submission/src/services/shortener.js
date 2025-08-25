import dayjs from "dayjs";
import { getAllMaps } from "./storage";
import { logInfo, logError } from "./logger";

const isValidUrl = (value) => {
  try {
    const u = new URL(value);
    return ["http:", "https:"].includes(u.protocol);
  } catch { return false; }
};

const cleanCode = (s) => (s || "").trim();
const codeRegex = /^[a-zA-Z0-9_-]{3,20}$/;

const randomCode = (len = 6) => {
  const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let out = "";
  for (let i = 0; i < len; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
};

const uniqueCode = (preferred, taken) => {
  if (preferred) return preferred;
  let code = randomCode();
  while (taken.has(code)) code = randomCode();
  return code;
};

export const shortenBatch = (rows) => {
  // rows: [{ longUrl, minutes?, preferredCode? }]
  const maps = getAllMaps();
  const taken = new Set(Object.keys(maps));
  const results = [];
  const errors = [];

  rows.forEach((r, idx) => {
    const longUrl = (r.longUrl || "").trim();
    const minutes = Number.isFinite(+r.minutes) && +r.minutes > 0 ? +r.minutes : 30; // default 30
    const preferred = cleanCode(r.preferredCode);

    if (!isValidUrl(longUrl)) {
      errors.push({ index: idx, message: "Invalid URL" });
      return;
    }
    if (preferred && !codeRegex.test(preferred)) {
      errors.push({ index: idx, message: "Shortcode must be 3–20 chars (A–Z, a–z, 0–9, _ or -)" });
      return;
    }
    if (preferred && taken.has(preferred)) {
      errors.push({ index: idx, message: "Shortcode already in use" });
      return;
    }

    const code = uniqueCode(preferred, taken);
    taken.add(code);

    const now = dayjs();
    const rec = {
      code,
      url: longUrl,
      createdAt: now.toISOString(),
      expiresAt: now.add(minutes, "minute").toISOString(),
    };
    results.push(rec);
  });

  if (errors.length) logError("SHORTEN_BATCH_ERRORS", { errors });
  if (results.length)  logInfo("SHORTEN_BATCH_SUCCESS", { count: results.length });

  return { results, errors };
};
