import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.join(__dirname, "data");
const checkinsFile = path.join(dataDirectory, "checkins.json");
const port = Number(process.env.PORT || 4000);
const datasetUrl =
  process.env.DATASET_URL ||
  "https://docs.google.com/spreadsheets/d/1qWwxA1IpWQfhUJialshiwMeJ2kFtTto6DvHlSyCoDlA/gviz/tq?tqx=out:csv&gid=0";
const counsellorDatasetUrl =
  process.env.COUNSELLOR_DATASET_URL ||
  "https://docs.google.com/spreadsheets/d/1qWwxA1IpWQfhUJialshiwMeJ2kFtTto6DvHlSyCoDlA/gviz/tq?tqx=out:csv&gid=746552781";
const defaultVictimId = process.env.DEFAULT_VICTIM_ID || "V1001";
const geminiApiKey = process.env.GEMINI_API_KEY;
const geminiModel = process.env.GEMINI_MODEL || "gemini-2.0-flash";

const app = express();
const configuredClientOrigin = process.env.CLIENT_ORIGIN;
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || !configuredClientOrigin) {
      callback(null, true);
      return;
    }
    const allowedOrigins = configuredClientOrigin
      .split(",")
      .map((value) => value.trim());
    callback(null, allowedOrigins.includes(origin));
  }
}));
app.use(express.json({ limit: "32kb" }));

app.get("/", (_request, response) => {
  response.json({
    name: "NirbhayMind API",
    status: "running",
    health: "/api/health"
  });
});

let dataset = [];
let counsellorDataset = [];
let datasetLastSyncedAt = null;
let datasetError = null;
let counsellorDatasetLastSyncedAt = null;
let counsellorDatasetError = null;

const scoreMaps = {
  mood: { "Very Low": 20, Low: 40, Okay: 60, Good: 80, "Very Good": 100 },
  stress: { "Very Low": 100, Low: 80, Moderate: 60, High: 40, "Very High": 20 },
  anxiety: { "Very Low": 100, Low: 80, Moderate: 60, High: 40, "Very High": 20 },
  sleep: { "Very Poor": 20, Poor: 40, Average: 60, Good: 80, "Very Good": 100 }
};

function parseCsvLine(line) {
  const values = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < line.length; index += 1) {
    const character = line[index];
    if (character === '"' && line[index + 1] === '"' && quoted) {
      value += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      values.push(value.trim());
      value = "";
    } else {
      value += character;
    }
  }

  values.push(value.trim());
  return values;
}

function parseCsv(csv, preserveHeaders = false) {
  const rows = parseCsvRows(csv);
  const headers = (rows.shift() || []).map((header) => {
    if (preserveHeaders) return header.trim();
    const normalizedHeader = header.toLowerCase().trim();
    if (/victim.*id|identification.*id/.test(normalizedHeader)) return "Victim_id";
    if (/case\s*id/.test(normalizedHeader)) return "Case_id";
    const parts = header.split(/\s+/);
    return parts.at(-1) || header;
  });
  return rows
    .filter((values) => values.some(Boolean))
    .map((values) =>
      Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]))
    );
}

function parseCsvRows(csv) {
  const rows = [];
  let row = "";
  let quoted = false;

  for (const character of csv.replace(/^\uFEFF/, "")) {
    if (character === '"') quoted = !quoted;
    if (character === "\n" && !quoted) {
      if (row.trim()) rows.push(parseCsvLine(row.replace(/\r$/, "")));
      row = "";
    } else {
      row += character;
    }

  }
  if (row.trim()) rows.push(parseCsvLine(row.replace(/\r$/, "")));
  return rows.filter((values) => values.some(Boolean));
}

function parseCounsellorCsv(csv) {
  const rawRows = parseCsvRows(csv);
  const expectedHeaders = [
    "Counsellor id", "district", "state", "total_registered_victims",
    "active_victims", "closed_cases", "high_risk_victims",
    "moderate_risk_victims", "low_risk_victims", "crisis_cases",
    "average_distress_score", "average_mood_score", "average_stress_score",
    "average_anxiety_score", "average_sleep_score", "improving_wellbeing",
    "declining_wellbeing", "stable_wellbeing", "new_registrations",
    "new_high_risk_cases", "resolved_cases", "counselling_required",
    "counselling_completed", "pending_counselling", "pending_followups",
    "overdue_followups", "legal_aid_required", "medical_support_required",
    "relocation_required", "protection_required", "high_threat_cases",
    "average_case_delay_days", "delayed_cases", "upcoming_hearings",
    "total_interventions", "pending_interventions", "completed_interventions",
    "last_updated", "total_alerts", "critical_alerts", "high_risk_alerts",
    "unresolved_alerts", "resolved_alerts", "new_alerts_today",
    "new_alerts_this_week"
  ];
  const firstCell = rawRows[0]?.[0]?.trim().toLowerCase() || "";
  const hasNormalHeader = firstCell === "counsellor id";
  const hasEmbeddedHeader = firstCell.startsWith("counsellor id ");
  const headers = hasNormalHeader
    ? rawRows.shift()
    : hasEmbeddedHeader || rawRows[0]?.length === 1
      ? expectedHeaders
      : rawRows.shift();
  const dataRows = hasNormalHeader
    ? rawRows
    : hasEmbeddedHeader || rawRows[0]?.length === 1
      ? rawRows.slice(1)
      : rawRows;
  return dataRows.map((row) =>
    Object.fromEntries(
      headers.map((header, index) => [
        header.toLowerCase().replace(/\s+/g, "_"),
        row[index] || ""
      ])
    )
  );
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function text(row, ...keys) {
  for (const key of keys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) return value.trim();
  }
  return "";
}

function scoreAsPercent(value, direction = "positive") {
  if (value === null) return null;
  if (value >= 0 && value <= 5) {
    return direction === "inverse" ? (5 - value) * 20 : value * 20;
  }
  if (value >= 0 && value <= 10) {
    return direction === "inverse" ? (10 - value) * 10 : value * 10;
  }
  if (value >= 0 && value <= 100) {
    return direction === "inverse" ? 100 - value : value;
  }
  return null;
}

function riskForScore(score) {
  return score >= 70 ? "Low" : score >= 45 ? "Moderate" : "High";
}

function normalizeRow(row) {
  return {
    victimId: text(row, "Victim_id", "victim_id", "Victim ID", "victimId", "Id"),
    caseId: text(row, "Case_id", "case_id", "Case ID", "caseId"),
    name: text(row, "Name", "name", "Victims", "Victim_name", "victim_name", "Full_name", "full_name"),
    registrationDate: row.Registration_Date,
    category: row.Victim_category,
    incidentType: row.incident_type,
    ageGroup: row.age_group,
    gender: text(row, "Gender", "gender"),
    district: text(row, "district", "District"),
    state: text(row, "state", "State"),
    urbanRural: row.urban_rural,
    vulnerabilityLevel: row.Vulnerability_level,
    caseStage: row.Case_stage,
    courtAppearances: number(row.Court_appearances),
    investigationDelayDays: number(row.Investigation_delay_days),
    trialDelayDays: number(row.Trial_delay_days),
    nextHearingDays: number(row.Next_hearing_days),
    caseUpdateFrequency: row.Case_update_frequency,
    caseDelayFlag: row.Case_delay_flag === "1",
    threatCount: number(row.Threat_count),
    threatSeverity: row.Threat_severity,
    threatFrequency: row.Threat_frequency,
    physicalHarmRisk: row.physical_harm_risk,
    protectionRequested: row.protection_requested === "Yes",
    protectionStatus: row.Protection_status,
    protectionRequired: row.Protection_required === "Yes",
    authorityNotified: row.Authority_notified === "Yes",
    checkinId: row.Checkin_id,
    checkinDate: row.Checkin_date,
    interactionChannel: row.interaction_channel,
    language: row.Language,
    moodScore: number(row.Mood_score),
    stressScore: number(row.stress_score),
    anxietyScore: number(row.anxiety_score),
    sleepScore: number(row.sleep_score),
    sentimentScore: number(row.sentiment_score),
    dominantEmotion: row.dominant_score,
    engagementScore: number(row.engagement_score),
    voiceStressScore: number(row.voice_stress_score),
    previousDistressScore: number(row.previous_distress_score),
    currentDistressScore: number(row.current_distress_score),
    distressChange: number(row.distress_change),
    riskLevel: row.risk_level,
    counsellingReceived: row.counselling_received === "Yes",
    counsellingSessions: number(row.counselling_sessions),
    medicalSupport: row.medical_support === "Yes",
    legalAid: row.legal_aid === "Yes",
    helplineUsed: row.helpline_used === "Yes",
    relocationSupport: row.relocation_support === "Yes",
    supportResponseDays: number(row.support_response_days),
    followupRequired: row.followup_required === "Yes",
    compensationEligible: row.compensation_eligible === "Yes",
    compensationStatus: row.compensation_status,
    amountSanctioned: number(row.amount_sanctioned),
    amountDisbursed: number(row.amount_disbursed),
    rehabilitationRequired: row.rehabilitation_required === "Yes",
    rehabilitationType: row.rehabilitation_type,
    rehabilitationStatus: row.rehabilitation_status,
    rehabilitationDelayDays: number(row.rehabilitation_delay_days),
    futureRiskLevel: row.future_risk_level,
    interventionRequired: row.intervention_required === "Yes",
    crisisFlag: row.crisis_flag === "Yes"
  };
}

async function loadStoredCheckins() {
  try {
    return JSON.parse(await readFile(checkinsFile, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return {};
    throw error;
  }
}

async function saveStoredCheckins(checkins) {
  await mkdir(dataDirectory, { recursive: true });
  await writeFile(checkinsFile, JSON.stringify(checkins, null, 2));
}

async function syncDataset() {
  const response = await fetch(datasetUrl);
  if (!response.ok) throw new Error(`Dataset request failed with ${response.status}`);
  dataset = parseCsv(await response.text()).map(normalizeRow);
  datasetLastSyncedAt = new Date().toISOString();
  datasetError = null;
  return dataset;
}

const syncIntervalMs = 60 * 1000;
let lastSyncAttemptAt = 0;
let lastCounsellorSyncAttemptAt = 0;

async function refreshDatasetIfStale() {
  if (Date.now() - lastSyncAttemptAt < syncIntervalMs) return;
  lastSyncAttemptAt = Date.now();
  await syncDataset();
}

async function syncCounsellorDataset() {
  const response = await fetch(counsellorDatasetUrl);
  if (!response.ok) throw new Error(`Counsellor dataset request failed with ${response.status}`);
  counsellorDataset = parseCounsellorCsv(await response.text()).map((row) => ({
    counsellor_id: text(row, "counsellor_id"),
    counsellor_name: text(row, "counsellor_name", "name"),
    district: text(row, "district"),
    state: text(row, "state"),
    ...Object.fromEntries(
      Object.entries(row)
        .filter(([key]) => !["counsellor_id", "district", "state"].includes(key))
        .map(([key, value]) => [key, number(value) ?? value])
    )
  }));
  counsellorDatasetLastSyncedAt = new Date().toISOString();
  counsellorDatasetError = null;
  return counsellorDataset;
}

async function refreshCounsellorDatasetIfStale() {
  if (Date.now() - lastCounsellorSyncAttemptAt < syncIntervalMs) return;
  lastCounsellorSyncAttemptAt = Date.now();
  await syncCounsellorDataset();
}

function getVictim(victimId) {
  return dataset.find((row) => row.victimId === victimId);
}

function toCheckin(row) {
  const scoreParts = [
    scoreAsPercent(row.moodScore),
    scoreAsPercent(row.stressScore, "inverse"),
    scoreAsPercent(row.anxietyScore, "inverse"),
    scoreAsPercent(row.sleepScore)
  ].filter((score) => score !== null);
  const score = scoreParts.length
    ? Math.round(scoreParts.reduce((sum, part) => sum + part, 0) / scoreParts.length)
    : null;

  return {
    id: row.checkinId,
    score,
    risk: score === null ? row.riskLevel : riskForScore(score),
    date: row.checkinDate,
    channel: row.interactionChannel,
    language: row.language,
    message: row.crisisFlag
      ? "Your responses indicate that additional support may be helpful."
      : "Your check-in has been recorded securely."
  };
}

function calculateCheckin(body) {
  const fields = ["mood", "stress", "anxiety", "sleep"];
  if (fields.some((field) => !scoreMaps[field][body[field]])) {
    const error = new Error("mood, stress, anxiety, and sleep are required valid options");
    error.status = 400;
    throw error;
  }

  const score = Math.round(
    fields.reduce((total, field) => total + scoreMaps[field][body[field]], 0) / fields.length
  );
  const risk = riskForScore(score);
  return {
    id: `LOCAL-${Date.now()}`,
    score,
    risk,
    message: risk === "Low"
      ? "Your current responses indicate a relatively stable pattern."
      : risk === "Moderate"
        ? "Some areas may need attention. Regular check-ins can help track changes."
        : "Your responses indicate that additional support may be helpful.",
    date: new Date().toLocaleDateString("en-IN"),
    time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    answers: { mood: body.mood, stress: body.stress, anxiety: body.anxiety, sleep: body.sleep }
  };
}

app.get("/api/health", (_request, response) => {
  response.json({
    status: dataset.length && counsellorDataset.length ? "ok" : "degraded",
    datasetRows: dataset.length,
    datasetLastSyncedAt,
    datasetError,
    counsellorDatasetRows: counsellorDataset.length,
    counsellorDatasetLastSyncedAt,
    counsellorDatasetError
  });

});

app.post("/api/v1/chat", async (request, response, next) => {
  if (typeof request.body.message !== "string" || !request.body.message.trim()) {
    return response.status(400).json({ error: "message is required" });
  }
  if (!geminiApiKey) {
    return response.status(503).json({ error: "AI support is not configured. Add GEMINI_API_KEY to the backend environment." });
  }

  try {
    const modelResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(geminiModel)}:generateContent?key=${encodeURIComponent(geminiApiKey)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{
              text: "You are NirbhayMind, a warm and trauma-informed emotional support assistant. Listen without judgment, use simple language, do not diagnose or give legal or medical certainty, and suggest a trusted person or qualified professional when appropriate. If the user says they are in immediate danger or may hurt themselves, encourage contacting local emergency services and a trusted person immediately. Keep replies concise and practical."
            }]
          },
          contents: [{ role: "user", parts: [{ text: request.body.message.trim() }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 400 }
        })
      }
    );
    const body = await modelResponse.json();
    if (!modelResponse.ok) {
      const providerMessage = body.error?.message || "";
      const invalidKey = modelResponse.status === 400 &&
        /api key not valid|invalid api key/i.test(providerMessage);
      const error = new Error(
        invalidKey
          ? "The Gemini API key configured for AI support is invalid."
          : providerMessage || `AI provider returned status ${modelResponse.status}`
      );
      error.status = invalidKey ? 503 : 502;
      throw error;
    }
    const text = body.candidates?.[0]?.content?.parts
      ?.map((part) => part.text)
      .filter(Boolean)
      .join("")
      .trim();
    if (!text) {
      const error = new Error("AI provider returned an empty response");
      error.status = 502;
      throw error;
    }
    response.json({ text });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/login", async (request, response, next) => {
  try {
    await refreshDatasetIfStale();
  const victimId = String(request.body.victimId || "").trim();
  const caseId = String(request.body.caseId || "").trim();
  const victim = getVictim(victimId);

  if (!victim || victim.caseId !== caseId) {
    return response.status(401).json({ error: "Invalid victim ID or case ID" });
  }

  response.json({ victimId: victim.victimId });
  } catch (error) {
    next(error);
  }
});

app.post("/api/auth/counsellor-login", async (request, response, next) => {
  try {
    await refreshCounsellorDatasetIfStale();
  const counsellorId = String(request.body.counsellorId || "").trim();
  const counsellor = counsellorDataset.find(
    (row) => row.counsellor_id.toLowerCase() === counsellorId.toLowerCase()
  );

  if (!counsellor) {
    return response.status(401).json({ error: "Invalid counsellor ID" });
  }

  response.json({ counsellorId: counsellor.counsellor_id });
  } catch (error) {
    next(error);
  }
});

app.get("/api/v1/counsellors/:counsellorId/dashboard", async (request, response, next) => {
  try {
    await refreshCounsellorDatasetIfStale();
  const counsellor = counsellorDataset.find(
    (row) => row.counsellor_id.toLowerCase() === request.params.counsellorId.toLowerCase()
  );
  if (!counsellor) return response.status(404).json({ error: "Counsellor not found" });

  response.json({
    profile: {
      counsellorId: counsellor.counsellor_id,
      name: counsellor.counsellor_name || counsellor.counsellor_id,
      district: counsellor.district,
      state: counsellor.state
    },
    data: counsellor,
    searchItems: counsellorDataset.map((row) => ({
      id: row.counsellor_id,
      type: "District",
      title: `${row.district} counsellor summary`,
      subtitle: `${row.total_registered_victims} registered victims`,
      section: "dashboard",
      risk: row.high_risk_victims > row.moderate_risk_victims ? "High Risk" : "Moderate"
    }))
  });
  } catch (error) {
    next(error);
  }
});

app.post("/api/dataset/sync", async (_request, response, next) => {
  try {
    await syncDataset();
    response.json({ rows: dataset.length, syncedAt: datasetLastSyncedAt });
  } catch (error) {
    datasetError = error.message;
    next(error);
  }
});

app.get("/api/v1/dashboard/:victimId", async (request, response, next) => {
  try {
    await refreshDatasetIfStale();
    const victim = getVictim(request.params.victimId);
    if (!victim) return response.status(404).json({ error: "Victim not found" });
    const stored = await loadStoredCheckins();
    const checkins = [...(stored[victim.victimId] || []), toCheckin(victim)];
    response.json({
      profile: {
        name: victim.name || "Registered User",
        victimId: victim.victimId,
        caseId: victim.caseId,
        gender: victim.gender,
        district: victim.district,
        state: victim.state,
        language: victim.language,
        caseStatus: victim.caseStage
      },
      case: victim,
      checkins,
      latestCheckin: checkins.at(-1),
      alerts: [
        ...(victim.crisisFlag ? [{
          id: "crisis",
          type: "high",
          category: "Well-being",
          title: "Well-being Alert",
          message: "Your recent check-in indicates increased distress. Consider connecting with a counsellor.",
          unread: true
        }] : []),
        ...(victim.nextHearingDays !== null ? [{
          id: "hearing",
          type: "case",
          category: "Case",
          title: "Upcoming Hearing",
          message: `Your next hearing is scheduled in ${victim.nextHearingDays} days.`,
          unread: true
        }] : [])
      ]
    });
  } catch (error) {
    next(error);
  }
});

app.get("/api/v1/victims/:victimId/checkins", async (request, response, next) => {
  try {
    const victim = getVictim(request.params.victimId);
    if (!victim) return response.status(404).json({ error: "Victim not found" });
    const stored = await loadStoredCheckins();
    response.json([...(stored[victim.victimId] || []), toCheckin(victim)]);
  } catch (error) {
    next(error);
  }
});

app.post("/api/v1/victims/:victimId/checkins", async (request, response, next) => {
  try {
    if (!getVictim(request.params.victimId)) {
      return response.status(404).json({ error: "Victim not found" });
    }
    const checkin = calculateCheckin(request.body);
    const stored = await loadStoredCheckins();
    stored[request.params.victimId] = [...(stored[request.params.victimId] || []), checkin];
    await saveStoredCheckins(stored);
    response.status(201).json(checkin);
  } catch (error) {
    next(error);
  }
});

app.get("/api/v1/victims/:victimId/case", (request, response) => {
  const victim = getVictim(request.params.victimId);
  if (!victim) return response.status(404).json({ error: "Victim not found" });
  response.json(victim);
});

app.use((error, _request, response, _next) => {
  const status = error.status || 500;
  response.status(status).json({ error: status === 500 ? "Internal server error" : error.message });
});

async function start() {
  try {
    await syncDataset();
  } catch (error) {
    datasetError = error.message;
    console.error(`Dataset sync failed: ${error.message}`);
  }
  try {
    await syncCounsellorDataset();
  } catch (error) {
    counsellorDatasetError = error.message;
    console.error(`Counsellor dataset sync failed: ${error.message}`);
  }

  app.listen(port, "0.0.0.0", () => {
  console.log(`NirbhayMind API listening on port ${port}`);
  if (dataset.length) console.log(`Loaded ${dataset.length} dataset rows`);
});
}

start();
