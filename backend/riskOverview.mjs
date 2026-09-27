const riskCountFields = [
  ["high", "high_risk_victims"],
  ["moderate", "moderate_risk_victims"],
  ["low", "low_risk_victims"],
  ["registered", "total_registered_victims"],
];

function addRiskCounts(totals, row) {
  for (const [riskLevel, field] of riskCountFields) {
    const count = row[field];
    if (!Number.isInteger(count) || count < 0) {
      throw new Error(
        `Counsellor dataset row ${row.counsellor_id || "(unknown)"} has an invalid ${field}`
      );
    }
    totals[riskLevel] += count;
  }
}

function getRiskTotals(map, key) {
  if (!map.has(key)) {
    map.set(key, {
      high: 0,
      moderate: 0,
      low: 0,
      registered: 0,
    });
  }
  return map.get(key);
}

export function aggregateStateRiskData(counsellorRows) {
  const stateTotals = new Map();

  for (const row of counsellorRows) {
    const state = row.state?.trim();
    if (!state) {
      throw new Error(
        `Counsellor dataset row ${row.counsellor_id || "(unknown)"} has no state`
      );
    }

    addRiskCounts(getRiskTotals(stateTotals, state), row);
  }

  return Object.fromEntries(stateTotals);
}

export function aggregateDistrictRiskData(counsellorRows) {
  const districtTotals = new Map();

  for (const row of counsellorRows) {
    const state = row.state?.trim();
    const district = row.district?.trim();
    if (!state || !district) {
      throw new Error(
        `Counsellor dataset row ${row.counsellor_id || "(unknown)"} has no district or state`
      );
    }

    const key = `${state.toLowerCase()}\0${district.toLowerCase()}`;
    const totals = getRiskTotals(districtTotals, key);
    totals.state = state;
    totals.district = district;
    addRiskCounts(totals, row);
  }

  return [...districtTotals.values()];
}
