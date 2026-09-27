const API_URL = import.meta.env.VITE_API_URL || "";
const COUNSELLOR_DATASET_URL =
  "https://docs.google.com/spreadsheets/d/1qWwxA1IpWQfhUJialshiwMeJ2kFtTto6DvHlSyCoDlA/gviz/tq?tqx=out:csv&gid=746552781";

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API_URL}${path}`, {
      headers: { "Content-Type": "application/json", ...options.headers },
      ...options
    });
  } catch {
    throw new Error(
      "Unable to connect to the NirbhayMind backend. Start the backend on port 4000 or configure VITE_API_URL."
    );
  }

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error || `Request failed with status ${response.status}`);
  }

  return response.json();
}

export function getDashboard(victimId) {
  return request(`/api/v1/dashboard/${encodeURIComponent(victimId)}`);
}

export function login(victimId, caseId) {
  return request("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ victimId, caseId })
  });
}

export function loginCounsellor(counsellorId) {
  return request("/api/auth/counsellor-login", {
    method: "POST",
    body: JSON.stringify({ counsellorId })
  });
}

function parseCsvRows(csv) {
  const rows = [];
  let row = [];
  let value = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];

    if (character === '"' && quoted && csv[index + 1] === '"') {
      value += '"';
      index += 1;
    } else if (character === '"') {
      quoted = !quoted;
    } else if (character === "," && !quoted) {
      row.push(value.trim());
      value = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && csv[index + 1] === "\n") {
        index += 1;
      }
      row.push(value.trim());
      if (row.some(Boolean)) {
        rows.push(row);
      }
      row = [];
      value = "";
    } else {
      value += character;
    }
  }

  row.push(value.trim());
  if (row.some(Boolean)) {
    rows.push(row);
  }

  return rows;
}

function normalizeCsvHeader(header) {
  return header
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

async function getDistrictRiskDataFromDataset() {
  const response = await fetch(COUNSELLOR_DATASET_URL);
  if (!response.ok) {
    throw new Error(
      `Counsellor dataset request failed with status ${response.status}`
    );
  }

  const rows = parseCsvRows(await response.text());
  const headers = rows.shift()?.map(normalizeCsvHeader) || [];
  const columnIndex = (header) => headers.indexOf(header);
  const districtIndex = columnIndex("district");
  const stateIndex = columnIndex("state");
  const totalIndex = columnIndex("total_registered_victims");
  const highIndex = columnIndex("high_risk_victims");
  const moderateIndex = columnIndex("moderate_risk_victims");
  const lowIndex = columnIndex("low_risk_victims");

  if (
    [
      districtIndex,
      stateIndex,
      totalIndex,
      highIndex,
      moderateIndex,
      lowIndex,
    ].some((index) => index < 0)
  ) {
    throw new Error(
      "Counsellor dataset is missing district risk columns"
    );
  }

  const districtRows = new Map();
  rows.forEach((row) => {
    const district = row[districtIndex]?.trim();
    const state = row[stateIndex]?.trim();
    if (!district || !state) return;

    const key = `${state.toLowerCase()}|${district.toLowerCase()}`;
    const entry = districtRows.get(key) || {
      district,
      state,
      totalRegisteredVictims: 0,
      highRiskVictims: 0,
      moderateRiskVictims: 0,
      lowRiskVictims: 0,
      stableVictims: 0,
    };
    const totalRegistered = Number(row[totalIndex]) || 0;
    const highRisk = Number(row[highIndex]) || 0;
    const moderateRisk = Number(row[moderateIndex]) || 0;
    const lowRisk = Number(row[lowIndex]) || 0;

    entry.totalRegisteredVictims += totalRegistered;
    entry.highRiskVictims += highRisk;
    entry.moderateRiskVictims += moderateRisk;
    entry.lowRiskVictims += lowRisk;
    entry.stableVictims += Math.max(
      totalRegistered - highRisk - moderateRisk - lowRisk,
      0
    );
    districtRows.set(key, entry);
  });

  return [...districtRows.values()];
}

export function getCounsellorDashboard(counsellorId) {
  return request(`/api/v1/counsellors/${encodeURIComponent(counsellorId)}/dashboard`)
    .then(async (dashboard) => {
      if (Array.isArray(dashboard.districtRiskData)) {
        return dashboard;
      }

      try {
        return {
          ...dashboard,
          districtRiskData: await getDistrictRiskDataFromDataset(),
        };
      } catch (error) {
        console.error(
          "Failed to load district risk data from the counsellor dataset:",
          error
        );

        return {
          ...dashboard,
          districtRiskData: null,
          districtRiskError: error.message,
        };
      }
    });
}

export function createCheckin(victimId, answers) {
  return request(`/api/v1/victims/${encodeURIComponent(victimId)}/checkins`, {
    method: "POST",
    body: JSON.stringify(answers)
  });
}

export function sendChatMessage(message) {
  return request("/api/v1/chat", {
    method: "POST",
    body: JSON.stringify({ message })
  });
}
