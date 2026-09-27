const stateAliases = new Map([
  ["andaman and nicobar island", "Andaman and Nicobar Islands"],
  ["andaman and nicobar islands", "Andaman and Nicobar Islands"],
  [
    "dadara and nagar havelli and daman and diu",
    "Dadra and Nagar Haveli and Daman and Diu",
  ],
  [
    "dadra and nagar haveli and daman and diu",
    "Dadra and Nagar Haveli and Daman and Diu",
  ],
  ["daman and diu", "Dadra and Nagar Haveli and Daman and Diu"],
  ["delhi", "Delhi"],
  ["nct of delhi", "Delhi"],
  ["jammu and kashmir", "Jammu and Kashmir"],
  ["orissa", "Odisha"],
  ["pondicherry", "Puducherry"],
  ["uttaranchal", "Uttarakhand"],
]);

function normalizeStateName(value) {
  const normalized = String(value || "")
    .trim()
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/\s*\((?:ut|nct)\)\s*$/i, "")
    .replace(/^nct of\s+/, "")
    .replace(/\s+/g, " ");

  return stateAliases.get(normalized) || normalized
    .split(" ")
    .map((word) => word[0]?.toUpperCase() + word.slice(1))
    .join(" ");
}

function getRiskBucket(value) {
  const risk = String(value || "")
    .trim()
    .toLowerCase();

  if (risk === "high" || risk === "critical" || risk === "very high") {
    return "high";
  }
  if (
    risk === "moderate" ||
    risk === "medium" ||
    risk === "moderate risk" ||
    risk === "medium risk"
  ) {
    return "moderate";
  }
  if (risk === "low" || risk === "low risk") {
    return "low";
  }
  return "noData";
}

function getRiskTotals(map, key, location) {
  if (!map.has(key)) {
    map.set(key, {
      high: 0,
      moderate: 0,
      low: 0,
      noData: 0,
      registered: 0,
      ...location,
    });
  }
  return map.get(key);
}

function addRiskRecord(totals, row) {
  if (typeof row.riskLevel === "string") {
    totals.registered += 1;
    totals[getRiskBucket(row.riskLevel)] += 1;
    return;
  }

  const fields = [
    ["high", "high_risk_victims"],
    ["moderate", "moderate_risk_victims"],
    ["low", "low_risk_victims"],
  ];
  for (const [riskLevel, field] of fields) {
    const count = row[field];
    if (!Number.isInteger(count) || count < 0) {
      throw new Error(
        `Counsellor ${row.counsellor_id || "(unknown)"} has an invalid ${field}`
      );
    }
    totals[riskLevel] += count;
  }

  if (
    !Number.isInteger(row.total_registered_victims) ||
    row.total_registered_victims < 0
  ) {
    throw new Error(
      `Counsellor ${row.counsellor_id || "(unknown)"} has an invalid total_registered_victims`
    );
  }
  totals.registered += row.total_registered_victims;
}

export function aggregateStateRiskData(victims) {
  const stateTotals = new Map();

  for (const victim of victims) {
    const state = normalizeStateName(victim.state);
    if (!state) {
      continue;
    }
    addRiskRecord(getRiskTotals(stateTotals, state, {}), victim);
  }

  return Object.fromEntries(stateTotals);
}

export function aggregateDistrictRiskData(victims) {
  const districtTotals = new Map();

  for (const victim of victims) {
    const state = normalizeStateName(victim.state);
    const district = String(victim.district || "").trim();
    if (!state || !district) {
      continue;
    }

    const key = `${state.toLowerCase()}\0${district.toLowerCase()}`;
    addRiskRecord(
      getRiskTotals(districtTotals, key, { state, district }),
      victim
    );
  }

  return [...districtTotals.values()];
}
