import cors from "cors";
import express from "express";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDirectory = path.join(__dirname, "data");
const checkinsFile = path.join(dataDirectory, "checkins.json");
const port = Number(process.env.PORT || 4000);
const datasetUrl =
  process.env.DATASET_URL ||
  "https://docs.google.com/spreadsheets/d/1qWwxA1IpWQfhUJialshiwMeJ2kFtTto6DvHlSyCoDlA/gviz/tq?tqx=out:csv&gid=0";
const defaultVictimId = process.env.DEFAULT_VICTIM_ID || "V1001";

const app = express();
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: "32kb" }));

app.get("/", (_request, response) => {
  response.json({
    name: "NirbhayMind API",
    status: "running",
    health: "/api/health"
  });
});

let dataset = [];
let datasetLastSyncedAt = null;
let datasetError = null;

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

function parseCsv(csv) {
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

  const headers = (rows.shift() || []).map((header) => {
    const parts = header.split(/\s+/);
    return parts.at(-1) || header;
  });
  return rows
    .filter((values) => values.some(Boolean))
    .map((values) =>
      Object.fromEntries(headers.map((header, index) => [header, values[index] || ""]))
    );
}

function number(value) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeRow(row) {
  return {
    victimId: row.Victim_id,
    caseId: row.Case_id,
    registrationDate: row.Registration_Date,
    category: row.Victim_category,
    incidentType: row.incident_type,
    ageGroup: row.age_group,
    gender: row.gender,
    district: row.district,
    state: row.state,
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

function getVictim(victimId) {
  return dataset.find((row) => row.victimId === victimId);
}

function toCheckin(row) {
  const scoreParts = [
    row.moodScore === null ? null : row.moodScore * 20,
    row.stressScore === null ? null : (10 - row.stressScore) * 20,
    row.anxietyScore === null ? null : (10 - row.anxietyScore) * 20,
    row.sleepScore === null ? null : row.sleepScore * 20
  ].filter((score) => score !== null);

  return {
    id: row.checkinId,
    score: scoreParts.length ? Math.round(scoreParts.reduce((sum, score) => sum + score, 0) / scoreParts.length) : null,
    risk: row.riskLevel,
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
  const risk = score >= 70 ? "Low" : score >= 45 ? "Moderate" : "High";
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
    status: dataset.length ? "ok" : "degraded",
    datasetRows: dataset.length,
    datasetLastSyncedAt,
    datasetError
  });

});

app.post("/api/v1/chat", (request, response) => {
  if (typeof request.body.message !== "string" || !request.body.message.trim()) {
    return response.status(400).json({ error: "message is required" });
  }
  const text = request.body.message.toLowerCase();
  const responseText = ["threat", "danger", "unsafe", "attack", "harm me"].some((term) => text.includes(term))
    ? "Your safety comes first. If you are in immediate danger, please contact local emergency services or a trusted person nearby. You can also use the Report Threat option from your NirbhayMind dashboard."
    : ["anxious", "anxiety", "panic", "worried", "worry"].some((term) => text.includes(term))
      ? "It sounds like you're carrying a lot of worry right now. Try taking a few slow breaths and focus on what you can control at this moment. If this feeling continues, consider talking to a counsellor."
      : "Thank you for sharing that with me. I'm here to listen. You can tell me more about how you're feeling, what's worrying you, or what you'd like support with.";
  response.json({ text: responseText });
});

app.post("/api/auth/login", (request, response) => {
  const victimId = String(request.body.victimId || "").trim();
  const caseId = String(request.body.caseId || "").trim();
  const victim = getVictim(victimId);

  if (!victim || victim.caseId !== caseId) {
    return response.status(401).json({ error: "Invalid victim ID or case ID" });
  }

  response.json({ victimId: victim.victimId });
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
    const victim = getVictim(request.params.victimId);
    if (!victim) return response.status(404).json({ error: "Victim not found" });
    const stored = await loadStoredCheckins();
    const checkins = [...(stored[victim.victimId] || []), toCheckin(victim)];
    response.json({
      profile: {
        name: "Registered User",
        victimId: victim.victimId,
        caseId: victim.caseId,
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

  app.listen(port, () => {
    console.log(`NirbhayMind API listening on http://localhost:${port}`);
    if (dataset.length) console.log(`Loaded ${dataset.length} dataset rows`);
  });
}

start();
