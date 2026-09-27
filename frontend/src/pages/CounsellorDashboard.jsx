import nirbhaymindLogo from "../assets/nirbhaymind_logo.jpeg";

import {
  Bell,
  CalendarDays,
  ChevronDown,
  ChevronRight,
  CircleAlert,
  ClipboardCheck,
  FileText,
  HeartPulse,
  Home,
  LogOut,
  MapPin,
  Menu,
  MessageCircle,
  Search,
  Settings,
  ShieldAlert,
  TrendingUp,
  UserRound,
  Users,
  X,
} from "lucide-react";

import {
  ComposableMap,
  Geographies,
  Geography,
} from "react-simple-maps";

import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import "./CounsellorDashboard.css";


/* =====================================================
   INDIA MAP DATA
===================================================== */

const INDIA_STATES_GEO_URL =
  "https://raw.githubusercontent.com/india-in-data/india-states-2019/master/india_states.geojson";
const DISTRICT_GEO_URL =
  `${import.meta.env.BASE_URL}maps/india-districts.geojson`;

/* =====================================================
   DEMO DISTRICT COUNSELLOR DATA
===================================================== */

const demoCounsellorData = {
  district: "Kolkata",
  state: "West Bengal",

  total_registered_victims: 142,
  active_victims: 96,
  closed_cases: 46,

  high_risk_victims: 12,
  moderate_risk_victims: 18,
  low_risk_victims: 112,
  crisis_cases: 4,

  average_distress_score: 52,
  average_mood_score: 68,
  average_stress_score: 47,
  average_anxiety_score: 43,
  average_sleep_score: 64,

  improving_wellbeing: 38,
  declining_wellbeing: 21,
  stable_wellbeing: 83,

  new_registrations: 9,
  new_high_risk_cases: 3,
  resolved_cases: 14,

  counselling_required: 31,
  counselling_completed: 22,
  pending_counselling: 9,

  pending_followups: 13,
  overdue_followups: 5,

  legal_aid_required: 18,
  medical_support_required: 11,
  relocation_required: 6,
  protection_required: 9,

  high_threat_cases: 7,
  average_case_delay_days: 4,
  delayed_cases: 12,
  upcoming_hearings: 8,

  total_interventions: 48,
  pending_interventions: 14,
  completed_interventions: 34,

  total_alerts: 27,
  critical_alerts: 4,
  high_risk_alerts: 9,
  unresolved_alerts: 11,
  resolved_alerts: 16,
  new_alerts_today: 3,
  new_alerts_this_week: 8,

  last_updated: "24 Sep 2026",
};


/* =====================================================
   DISTRICT MENTAL WELL-BEING TREND
   FRONTEND DEMO DATA ONLY

   Later this can come from backend API.
===================================================== */

const demoDistrictWellbeingTrend = [
  {
    month: "Apr",
    wellbeing: 61,
  },

  {
    month: "May",
    wellbeing: 64,
  },

  {
    month: "Jun",
    wellbeing: 60,
  },

  {
    month: "Jul",
    wellbeing: 67,
  },

  {
    month: "Aug",
    wellbeing: 71,
  },

  {
    month: "Sep",
    wellbeing: 74,
  },
];

/* =====================================================
   INDIA STATE RISK DATA
   FRONTEND DEMO DATA ONLY

   NOTE:
   The map is intentionally nationwide and remains
   STATE-wise even though the logged-in counsellor
   is assigned to one DISTRICT.
===================================================== */

const demoStateRiskData = {
  "Andhra Pradesh": {
    high: 18,
    moderate: 32,
    low: 95,
  },

  "Arunachal Pradesh": {
    high: 5,
    moderate: 10,
    low: 35,
  },

  Assam: {
    high: 21,
    moderate: 38,
    low: 82,
  },

  Bihar: {
    high: 31,
    moderate: 52,
    low: 108,
  },

  Chhattisgarh: {
    high: 15,
    moderate: 29,
    low: 71,
  },

  Goa: {
    high: 4,
    moderate: 9,
    low: 28,
  },

  Gujarat: {
    high: 17,
    moderate: 35,
    low: 110,
  },

  Haryana: {
    high: 19,
    moderate: 31,
    low: 76,
  },

  "Himachal Pradesh": {
    high: 7,
    moderate: 15,
    low: 42,
  },

  Jharkhand: {
    high: 23,
    moderate: 41,
    low: 69,
  },

  Karnataka: {
    high: 20,
    moderate: 44,
    low: 126,
  },

  Kerala: {
    high: 11,
    moderate: 29,
    low: 118,
  },

  "Madhya Pradesh": {
    high: 27,
    moderate: 48,
    low: 102,
  },

  Maharashtra: {
    high: 34,
    moderate: 61,
    low: 165,
  },

  Manipur: {
    high: 8,
    moderate: 13,
    low: 31,
  },

  Meghalaya: {
    high: 6,
    moderate: 12,
    low: 29,
  },

  Mizoram: {
    high: 4,
    moderate: 8,
    low: 24,
  },

  Nagaland: {
    high: 5,
    moderate: 9,
    low: 27,
  },

  Odisha: {
    high: 25,
    moderate: 43,
    low: 97,
  },

  Punjab: {
    high: 16,
    moderate: 29,
    low: 72,
  },

  Rajasthan: {
    high: 29,
    moderate: 51,
    low: 115,
  },

  Sikkim: {
    high: 3,
    moderate: 7,
    low: 20,
  },

  "Tamil Nadu": {
    high: 24,
    moderate: 47,
    low: 132,
  },

  Telangana: {
    high: 18,
    moderate: 36,
    low: 94,
  },

  Tripura: {
    high: 9,
    moderate: 15,
    low: 37,
  },

  "Uttar Pradesh": {
    high: 42,
    moderate: 75,
    low: 180,
  },

  Uttarakhand: {
    high: 8,
    moderate: 17,
    low: 49,
  },

  "West Bengal": {
    high: 12,
    moderate: 18,
    low: 112,
  },

  /* -------------------------------
     UNION TERRITORIES
  -------------------------------- */

  Delhi: {
    high: 12,
    moderate: 24,
    low: 64,
  },

  "Jammu and Kashmir": {
    high: 14,
    moderate: 25,
    low: 58,
  },

  Ladakh: {
    high: 3,
    moderate: 6,
    low: 18,
  },

  Puducherry: {
    high: 4,
    moderate: 8,
    low: 25,
  },

  Chandigarh: {
    high: 3,
    moderate: 7,
    low: 21,
  },

  "Dadra and Nagar Haveli and Daman and Diu": {
    high: 2,
    moderate: 5,
    low: 18,
  },

  "Andaman and Nicobar Islands": {
    high: 2,
    moderate: 4,
    low: 15,
  },

  Lakshadweep: {
    high: 1,
    moderate: 3,
    low: 10,
  },
};


/* =====================================================
   STATE NAME NORMALIZATION
===================================================== */

function normalizeStateName(stateName) {
  if (!stateName) {
    return "";
  }

  return stateName
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
}


/* =====================================================
   STATE DATA LOOKUP
===================================================== */

function getStateData(stateName) {
  const normalizedName =
    normalizeStateName(stateName);

  const matchingEntry =
    Object.entries(
      demoStateRiskData
    ).find(
      ([name]) =>
        normalizeStateName(name) ===
        normalizedName
    );

  return matchingEntry
    ? matchingEntry[1]
    : null;
}


/* =====================================================
   STATE RISK CALCULATION
===================================================== */

function getStateRisk(stateName, districtRiskData) {
  const normalizedStateName =
    normalizeStateName(stateName);
  const stateDistrictData =
    Array.isArray(districtRiskData)
      ? districtRiskData.filter(
          (entry) =>
            normalizeStateName(entry.state) ===
            normalizedStateName
        )
      : null;
  const stateData = stateDistrictData
    ? stateDistrictData.reduce(
        (totals, entry) => ({
          high:
            totals.high +
            (Number(entry.highRiskVictims) || 0),
          moderate:
            totals.moderate +
            (Number(entry.moderateRiskVictims) || 0),
          low:
            totals.low +
            (Number(entry.lowRiskVictims) || 0),
          stable:
            totals.stable +
            (Number(entry.stableVictims) || 0),
        }),
        { high: 0, moderate: 0, low: 0, stable: 0 }
      )
    : getStateData(stateName);

  if (!stateData) {
    return {
      level: "No Data",
      percentage: 0,
      total: 0,
      high: 0,
      moderate: 0,
      low: 0,
    };
  }

  const total =
    stateData.high +
    stateData.moderate +
    stateData.low +
    (stateData.stable || 0);

  if (total === 0) {
    return {
      level: "No Data",
      percentage: 0,
      total: 0,
      high: 0,
      moderate: 0,
      low: 0,
    };
  }

  const riskPercentage =
    (
      (
        stateData.high +
        stateData.moderate
      ) /
      total
    ) *
    100;

  let level;

  if (riskPercentage >= 45) {
    level = "High Risk";
  } else if (riskPercentage >= 25) {
    level = "Moderate Risk";
  } else {
    level = "Low Risk";
  }

  return {
    level,

    percentage:
      Math.round(
        riskPercentage
      ),

    total,

    high:
      stateData.high,

    moderate:
      stateData.moderate,

    low:
      stateData.low,

    stable:
      stateData.stable || 0,
  };
}


/* =====================================================
   STATE RISK COLOUR
===================================================== */

function getStateRiskColor(riskLevel) {
  switch (riskLevel) {
    case "High Risk":
      return "#7A2638";

    case "Moderate Risk":
      return "#D9825B";

    case "Low Risk":
      return "#C9A6A0";

    default:
      return "#F1E7E3";
  }
}

/* =====================================================
   DISTRICT NAME NORMALIZATION
===================================================== */

function normalizeDistrictName(name) {
  if (!name) {
    return "";
  }

  return name
    .trim()
    .toLowerCase()
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ");
}


/* =====================================================
   DISTRICT RISK LOOKUP
===================================================== */

function getDistrictRiskStats(
  districtName,
  state,
  districtRiskData
) {
  const matchingDistrict =
    Array.isArray(districtRiskData)
      ? districtRiskData.find(
          (entry) =>
            normalizeMapName(entry.district) ===
              normalizeMapName(districtName) &&
            normalizeMapName(entry.state) ===
              normalizeMapName(state)
        )
      : null;

  if (!matchingDistrict && Array.isArray(districtRiskData)) {
    const stateRiskTotals =
      districtRiskData
        .filter(
          (entry) =>
            normalizeMapName(entry.state) ===
            normalizeMapName(state)
        )
        .reduce(
          (totals, entry) => ({
            highRisk:
              totals.highRisk +
              (Number(entry.highRiskVictims) || 0),
            moderateRisk:
              totals.moderateRisk +
              (Number(entry.moderateRiskVictims) || 0),
            lowRisk:
              totals.lowRisk +
              (Number(entry.lowRiskVictims) || 0),
            stable:
              totals.stable +
              (Number(entry.stableVictims) || 0),
          }),
          {
            highRisk: 0,
            moderateRisk: 0,
            lowRisk: 0,
            stable: 0,
          }
        );
    const highestStateRisk = Math.max(
      stateRiskTotals.highRisk,
      stateRiskTotals.moderateRisk,
      stateRiskTotals.lowRisk,
      stateRiskTotals.stable
    );
    const stateRiskLevel =
      highestStateRisk === 0
        ? getStateRisk(state, districtRiskData).level
        : [
            ["High Risk", stateRiskTotals.highRisk],
            ["Moderate Risk", stateRiskTotals.moderateRisk],
            ["Low Risk", stateRiskTotals.lowRisk],
            ["Stable", stateRiskTotals.stable],
          ].find(([, count]) => count === highestStateRisk)[0];

    return {
      riskLevel:
        stateRiskLevel === "No Data"
          ? "Low Risk"
          : stateRiskLevel,
      highRisk: 0,
      moderateRisk: 0,
      lowRisk: 0,
      stable: 0,
    };
  }

  if (!matchingDistrict) {
    return {
      riskLevel: "No Data",
      highRisk: 0,
      moderateRisk: 0,
      lowRisk: 0,
      stable: 0,
    };
  }

  const highRisk =
    Number(matchingDistrict.highRiskVictims) || 0;
  const moderateRisk =
    Number(matchingDistrict.moderateRiskVictims) || 0;
  const lowRisk =
    Number(matchingDistrict.lowRiskVictims) || 0;
  const stable =
    Number(matchingDistrict.stableVictims) || 0;
  const riskCounts = [
    ["High Risk", highRisk],
    ["Moderate Risk", moderateRisk],
    ["Low Risk", lowRisk],
    ["Stable", stable],
  ];
  const highestCount = Math.max(
    highRisk,
    moderateRisk,
    lowRisk,
    stable
  );

  return {
    riskLevel: highestCount > 0
      ? riskCounts.find(([, count]) => count === highestCount)[0]
      : "No Data",
    highRisk,
    moderateRisk,
    lowRisk,
    stable,
  };
}

function getDistrictRisk(
  districtName,
  state,
  districtRiskData
) {
  return getDistrictRiskStats(
    districtName,
    state,
    districtRiskData
  ).riskLevel;
}


/* =====================================================
   DISTRICT RISK COLOURS
===================================================== */

function getDistrictRiskColor(riskLevel) {
  switch (riskLevel) {
    case "High Risk":
      return "#7A2638";

    case "Moderate Risk":
      return "#D99A73";

    case "Low Risk":
      return "#C9A0A7";

    case "Stable":
      return "#9DAA96";

    case "No Data":
      return "#EDE4DF";

    default:
      return "#EDE4DF";
  }
}

function normalizeMapName(name) {
  return String(name || "")
    .toLowerCase()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]/g, "");
}

function getDistrictMapProjection(features) {
  const bounds = {
    west: Infinity,
    east: -Infinity,
    south: Infinity,
    north: -Infinity,
  };

  const visitCoordinates = (coordinates) => {
    if (!Array.isArray(coordinates)) {
      return;
    }

    if (
      typeof coordinates[0] === "number" &&
      typeof coordinates[1] === "number"
    ) {
      const [longitude, latitude] = coordinates;
      bounds.west = Math.min(bounds.west, longitude);
      bounds.east = Math.max(bounds.east, longitude);
      bounds.south = Math.min(bounds.south, latitude);
      bounds.north = Math.max(bounds.north, latitude);
      return;
    }

    coordinates.forEach(visitCoordinates);
  };

  features.forEach((feature) => {
    visitCoordinates(feature.geometry?.coordinates);
  });

  if (
    !Number.isFinite(bounds.west) ||
    !Number.isFinite(bounds.east) ||
    !Number.isFinite(bounds.south) ||
    !Number.isFinite(bounds.north)
  ) {
    return null;
  }

  const radians = Math.PI / 180;
  const mercatorY = (latitude) => {
    const clampedLatitude = Math.max(
      -85.05112878,
      Math.min(85.05112878, latitude)
    );
    const latitudeRadians = clampedLatitude * radians;

    return Math.log(
      Math.tan(Math.PI / 4 + latitudeRadians / 2)
    );
  };

  const west = bounds.west * radians;
  const east = bounds.east * radians;
  const south = mercatorY(bounds.south);
  const north = mercatorY(bounds.north);
  const longitudeSpan = Math.max(east - west, 0.0001);
  const latitudeSpan = Math.max(north - south, 0.0001);
  const width = 650;
  const height = 390;

  return {
    center: [
      (bounds.west + bounds.east) / 2,
      (
        2 *
        Math.atan(
          Math.exp((south + north) / 2)
        ) -
        Math.PI / 2
      ) / radians,
    ],
    scale:
      Math.min(
        (width - 70) / longitudeSpan,
        (height - 70) / latitudeSpan
      ) * 0.9,
  };
}

/* =====================================================
   DEMO SEARCH DATA
===================================================== */

const demoSearchItems = [
  {
    id: "V1001",
    type: "Victim",
    title: "Critical distress alert",
    subtitle:
      "Significant increase in distress indicators",
    section: "alerts",
    risk: "Critical",
  },

  {
    id: "C1001",
    type: "Case",
    title: "High-risk case detected",
    subtitle:
      "Requires counsellor review",
    section: "alerts",
    risk: "High Risk",
  },

  {
    id: "V1002",
    type: "Victim",
    title: "Follow-up pending",
    subtitle:
      "No response for 3 consecutive days",
    section: "interventions",
    risk: "Moderate",
  },

  {
    id: "C1002",
    type: "Case",
    title: "Rapid wellbeing decline",
    subtitle:
      "Intervention review required",
    section: "interventions",
    risk: "Critical",
  },

  {
    id: "V1003",
    type: "Victim",
    title: "Counselling session pending",
    subtitle:
      "Follow-up counselling required",
    section: "interventions",
    risk: "Moderate",
  },

  {
    id: "C1003",
    type: "Case",
    title: "Legal aid requirement",
    subtitle:
      "Legal support identified for case",
    section: "cases",
    risk: "Support",
  },

  {
    id: "V1004",
    type: "Victim",
    title: "Protection requirement",
    subtitle:
      "Protection support required",
    section: "cases",
    risk: "High Risk",
  },
];


/* =====================================================
   DISTRICT WELL-BEING TREND CHART
===================================================== */

function WellbeingTrendChart({
  district,
  trend,
}) {
  const width = 620;
  const height = 250;

  const paddingLeft = 42;
  const paddingRight = 20;
  const paddingTop = 25;
  const paddingBottom = 40;

  const chartWidth =
    width -
    paddingLeft -
    paddingRight;

  const chartHeight =
    height -
    paddingTop -
    paddingBottom;

  const minScore = 0;
  const maxScore = 100;

  const safeTrend =
    Array.isArray(trend) &&
    trend.length > 0
      ? trend
      : [
          {
            month: "Current",
            wellbeing: 0,
          },
        ];

  const points =
    safeTrend.map(
      (item, index) => {
        const x =
          paddingLeft +
          (
            index /
            Math.max(
              safeTrend.length - 1,
              1
            )
          ) *
            chartWidth;

        const numericScore =
          Number(
            item.wellbeing
          ) || 0;

        const y =
          paddingTop +
          (
            (
              maxScore -
              numericScore
            ) /
            (
              maxScore -
              minScore
            )
          ) *
            chartHeight;

        return {
          ...item,
          wellbeing:
            numericScore,
          x,
          y,
        };
      }
    );

  const linePoints =
    points
      .map(
        (point) =>
          `${point.x},${point.y}`
      )
      .join(" ");

  const areaPoints = [
    `${paddingLeft},${
      paddingTop +
      chartHeight
    }`,

    ...points.map(
      (point) =>
        `${point.x},${point.y}`
    ),

    `${
      paddingLeft +
      chartWidth
    },${
      paddingTop +
      chartHeight
    }`,
  ].join(" ");

  const startingScore =
    points[0]?.wellbeing ?? 0;

  const latestScore =
    points[
      points.length - 1
    ]?.wellbeing ?? 0;

  const overallChange =
    latestScore -
    startingScore;

  return (
    <div className="district-wellbeing-chart">

      <div className="district-chart-header">

        <div>

          <h3>
            Mental Well-being Trend
          </h3>

          <p>
            District-level wellbeing trend for{" "}
            {district}
          </p>

        </div>

        <div className="district-chart-current">

          <span>
            Current
          </span>

          <strong>
            {latestScore}
          </strong>

        </div>

      </div>


      <div className="district-chart-container">

        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="district-wellbeing-svg"
          role="img"
          aria-label={`Mental well-being trend for ${district}`}
        >

          {[0, 25, 50, 75, 100].map(
            (score) => {

              const y =
                paddingTop +
                (
                  (
                    maxScore -
                    score
                  ) /
                  (
                    maxScore -
                    minScore
                  )
                ) *
                  chartHeight;

              return (
                <g
                  key={score}
                >

                  <line
                    x1={paddingLeft}
                    y1={y}
                    x2={
                      paddingLeft +
                      chartWidth
                    }
                    y2={y}
                    className="district-chart-grid-line"
                  />

                  <text
                    x={
                      paddingLeft -
                      10
                    }
                    y={y + 4}
                    textAnchor="end"
                    className="district-chart-axis-label"
                  >
                    {score}
                  </text>

                </g>
              );
            }
          )}


          <polygon
            points={areaPoints}
            className="district-chart-area"
          />


          <polyline
            points={linePoints}
            fill="none"
            className="district-chart-line"
          />


          {points.map(
            (point) => (

              <g
                key={point.month}
              >

                <circle
                  cx={point.x}
                  cy={point.y}
                  r="5"
                  className="district-chart-point"
                />

                <text
                  x={point.x}
                  y={
                    height -
                    12
                  }
                  textAnchor="middle"
                  className="district-chart-month"
                >
                  {point.month}
                </text>

              </g>

            )
          )}

        </svg>

      </div>


      <div className="district-trend-summary">

        <div className="trend-stat">

          <strong>
            {startingScore}
          </strong>

          <span>
          Starting score
          </span>

        </div>


        <div className="trend-stat">

          <strong>
            {latestScore}
          </strong>

          <span>
            Latest score
          </span>

        </div>


        <div className="trend-stat change">

          <strong>
            {overallChange > 0 ? "+" : ""}
            {overallChange}
            
          </strong>

          <span>
            Overall change
          </span>

        </div>

      </div>

    </div>
  );
}
/* =====================================================
   DISTRICT-WISE RISK OVERVIEW MAP
===================================================== */

function DistrictRiskOverview({
  district,
  state,
  districtRiskData,
  districtRiskError,
  onViewAll,
}) {
  const [hoveredDistrict, setHoveredDistrict] =
    useState(null);

  const [districtGeoData, setDistrictGeoData] =
    useState(null);
  const [districtMapError, setDistrictMapError] =
    useState(false);

  useEffect(() => {
    let isMounted = true;

    fetch(DISTRICT_GEO_URL)
      .then((response) => {
        if (!response.ok) {
          throw new Error(
            `District map request failed with status ${response.status}`
          );
        }

        return response.json();
      })
      .then((geoJson) => {
        if (!Array.isArray(geoJson.features)) {
          throw new Error(
            "District map data is not a valid GeoJSON FeatureCollection"
          );
        }

        if (isMounted) {
          setDistrictGeoData(geoJson);
        }
      })
      .catch((error) => {
        console.error("Failed to load district map data:", error);

        if (isMounted) {
          setDistrictMapError(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const stateMap = useMemo(() => {
    if (!districtGeoData) {
      return null;
    }

    const features = districtGeoData.features.filter((feature) => {
      const properties = feature.properties || {};
      const districtName =
        properties.district ||
        properties.DISTRICT ||
        properties.District ||
        properties.dtname ||
        properties.DT_NAME ||
        properties.district_name ||
        properties.NAME_2 ||
        properties.NAME ||
        properties.name ||
        "";

      return (
        Boolean(String(districtName).trim()) &&
        normalizeMapName(properties.st_nm) ===
          normalizeMapName(state)
      );
    });

    if (features.length === 0) {
      return null;
    }

    const projection = getDistrictMapProjection(features);

    return projection
      ? {
          geography: {
            ...districtGeoData,
            features,
          },
          projection,
        }
      : null;
  }, [districtGeoData, state]);

  const riskCounts = useMemo(() => {
    const counts = {
      "High Risk": 0,
      "Moderate Risk": 0,
      "Low Risk": 0,
      Stable: 0,
      available: Array.isArray(districtRiskData),
    };

    if (Array.isArray(districtRiskData)) {
      districtRiskData
        .filter(
          (entry) =>
            normalizeMapName(entry.state) ===
            normalizeMapName(state)
        )
        .forEach((entry) => {
          const stats = getDistrictRiskStats(
            entry.district,
            state,
            districtRiskData
          );

          counts["High Risk"] += stats.highRisk;
          counts["Moderate Risk"] += stats.moderateRisk;
          counts["Low Risk"] += stats.lowRisk;
          counts.Stable += stats.stable;
        });
    }

    return counts;
  }, [districtRiskData, state]);

  const hoveredDistrictStats = hoveredDistrict
    ? getDistrictRiskStats(
        hoveredDistrict,
        state,
        districtRiskData
      )
    : null;
  const assignedDistrictStats = getDistrictRiskStats(
    district,
    state,
    districtRiskData
  );


  return (
    <section className="dashboard-card district-risk-card">


      {/* HEADER */}

      <div className="district-risk-header">

        <div>

          <span className="district-risk-eyebrow">
            DISTRICT RISK MONITORING
          </span>

          <h3>
            District-wise Risk Overview
          </h3>

          <p>
            Current wellbeing risk distribution
            across districts in {state}.
          </p>

        </div>


        <button
          type="button"
          className="district-risk-view-all"
          onClick={onViewAll}
        >
          View all
          <ChevronRight size={15} />
        </button>

      </div>


      {/* MAP + LEGEND */}

      <div className="district-risk-body">


        {/* MAP */}

        <div className="district-map-panel">

          <div className="district-map-location">

            <MapPin size={14} />

            <span>
              {state}
            </span>

          </div>


          <div className="district-map-compass">

            <span className="compass-line vertical" />

            <span className="compass-line horizontal" />

            <span className="compass-dot" />

          </div>


          {stateMap ? (
            <ComposableMap
              projection="geoMercator"
              projectionConfig={stateMap.projection}
              width={650}
              height={390}
              className="district-risk-map"
              aria-label={`${state} district risk map`}
            >
              <Geographies geography={stateMap.geography}>
                {({ geographies }) =>
                  geographies.map((geo) => {
                    const properties = geo.properties || {};
                    const districtName =
                      properties.district ||
                      properties.DISTRICT ||
                      properties.District ||
                      properties.dtname ||
                      properties.DT_NAME ||
                      properties.district_name ||
                      properties.NAME_2 ||
                      properties.NAME ||
                      properties.name ||
                      "";
                    const riskLevel =
                      getDistrictRisk(
                        districtName,
                        state,
                        districtRiskData
                      );
                    const fillColor =
                      getDistrictRiskColor(riskLevel);
                    const isAssignedDistrict =
                      normalizeDistrictName(districtName) ===
                      normalizeDistrictName(district);

                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        className={
                          [
                            "district-map-shape",
                            `district-risk-${riskLevel
                              .toLowerCase()
                              .replace(/\s+/g, "-")}`,
                            isAssignedDistrict ? "assigned" : "",
                          ]
                            .filter(Boolean)
                            .join(" ")
                        }
                        fill={fillColor}
                        stroke="#FFF9F5"
                        strokeWidth={isAssignedDistrict ? 1.8 : 1}
                        onMouseEnter={() =>
                          setHoveredDistrict(districtName)
                        }
                        onMouseLeave={() =>
                          setHoveredDistrict(null)
                        }
                        tabIndex={-1}
                      />
                    );
                  })
                }
              </Geographies>
            </ComposableMap>
          ) : (
            <div className="district-map-unavailable">
              <MapPin size={22} />
              <strong>
                {districtMapError
                  ? "District map could not be loaded"
                  : districtGeoData
                  ? "District map unavailable"
                  : "Loading district map"}
              </strong>
              <span>
                {districtMapError
                  ? "Please refresh the page and try again."
                  : districtGeoData
                  ? `No district map data was found for ${state}.`
                  : `Loading district boundaries for ${state}.`}
              </span>
            </div>
          )}


          {/* HOVER LABEL */}

          {hoveredDistrict && (

            <div className="district-map-tooltip">

              <strong>
                {hoveredDistrict}
              </strong>

              <span>
                {hoveredDistrictStats.riskLevel}
              </span>

              {hoveredDistrictStats.riskLevel !== "No Data" && (
                  <small>
                    High{" "}
                    {hoveredDistrictStats.highRisk.toLocaleString()}{" "}
                    · Medium{" "}
                    {hoveredDistrictStats.moderateRisk.toLocaleString()}{" "}
                    · Low{" "}
                    {hoveredDistrictStats.lowRisk.toLocaleString()}{" "}
                    · Stable{" "}
                    {hoveredDistrictStats.stable.toLocaleString()}
                  </small>
              )}

            </div>

          )}


          {/* ASSIGNED DISTRICT */}

          <div className="district-map-assigned">

            <span className="assigned-dot" />

            <span>
              Assigned district:
            </span>

            <strong>
              {district}
            </strong>

          </div>

        </div>


        {/* DIVIDER */}

        <div className="district-risk-divider" />


        {/* LEGEND */}

        <div className="district-risk-legend">

          <div className="district-risk-legend-title">

            <span>
              Risk level
            </span>

            <small>
              {state}
            </small>

          </div>


          <DistrictRiskLegendItem
            label="High Risk"
            color="#7A2638"
            count={
              riskCounts.available
                ? riskCounts["High Risk"].toLocaleString()
                : "—"
            }
          />


          <DistrictRiskLegendItem
            label="Medium Risk"
            color="#D99A73"
            count={
              riskCounts.available
                ? riskCounts["Moderate Risk"].toLocaleString()
                : "—"
            }
          />


          <DistrictRiskLegendItem
            label="Low Risk"
            color="#C9A0A7"
            count={
              riskCounts.available
                ? riskCounts["Low Risk"].toLocaleString()
                : "—"
            }
          />


          <DistrictRiskLegendItem
            label="Stable"
            color="#9DAA96"
            count={
              riskCounts.available
                ? riskCounts.Stable.toLocaleString()
                : "—"
            }
          />

          {!riskCounts.available && (
            <p className="district-risk-data-notice" role="status">
              {districtRiskError ||
                "Risk data is unavailable. Please refresh the dashboard."}
            </p>
          )}


          <div className="district-risk-legend-divider" />


          <div className="district-risk-selected">

            <span>
              Your district
            </span>

            <strong>
              {district}
            </strong>

            <div>

              <span
                className="district-selected-dot"
                style={{
                  background:
                    getDistrictRiskColor(
                      getDistrictRisk(
                        district,
                        state,
                        districtRiskData
                      )
                    ),
                }}
              />

              {
                getDistrictRisk(
                  district,
                  state,
                  districtRiskData
                )
              }

            </div>

            {Array.isArray(districtRiskData) && (
              <small className="district-selected-counts">
                High {assignedDistrictStats.highRisk.toLocaleString()}
                {" · "}Medium{" "}
                {assignedDistrictStats.moderateRisk.toLocaleString()}
                {" · "}Low {assignedDistrictStats.lowRisk.toLocaleString()}
                {" · "}Stable{" "}
                {assignedDistrictStats.stable.toLocaleString()}
              </small>
            )}

          </div>

        </div>

      </div>

    </section>
  );
}


/* =====================================================
   DISTRICT RISK LEGEND ITEM
===================================================== */

function DistrictRiskLegendItem({
  label,
  color,
  count,
}) {

  return (
    <div className="district-risk-legend-item">

      <div className="district-risk-legend-label">

        <span
          className="district-risk-color-dot"
          style={{
            background: color,
          }}
        />

        <span>
          {label}
        </span>

      </div>


      <strong>
        {count}
      </strong>

    </div>
  );
}


/* =====================================================
   MAIN DASHBOARD
===================================================== */

function CounsellorDashboard({
  onLogout,
  data: dashboardData,
  profile,
  searchItems,
  districtRiskData,
  districtRiskError,
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  const [activeSection, setActiveSection] =
    useState("dashboard");

  const [notificationsOpen, setNotificationsOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  const [searchQuery, setSearchQuery] =
    useState("");


  const data =
    dashboardData ||
    demoCounsellorData;


  /* =====================================================
     DISTRICT + STATE ASSIGNMENT

     Counsellor scope = DISTRICT
     Nationwide map scope = STATE
  ===================================================== */

  const assignedDistrict =
    profile?.district ||
    data.district ||
    "Kolkata";

  const assignedState =
    profile?.state ||
    data.state ||
    "West Bengal";

  const assignedStateRisk =
    getStateRisk(assignedState, districtRiskData);


  const counsellorName =
    profile?.name ||
    data.counsellor_name ||
    data.counsellor_id ||
    "Counsellor";


  const searchableItems =
    searchItems ||
    demoSearchItems;


  /* =====================================================
     REFS
  ===================================================== */

  const profileRef =
    useRef(null);

  const notificationRef =
    useRef(null);

  const searchRef =
    useRef(null);


  /* =====================================================
     OUTSIDE CLICK + ESCAPE
  ===================================================== */

  useEffect(() => {
    const handleOutsideClick =
      (event) => {

        if (
          profileRef.current &&
          !profileRef.current.contains(
            event.target
          )
        ) {
          setProfileOpen(false);
        }

        if (
          notificationRef.current &&
          !notificationRef.current.contains(
            event.target
          )
        ) {
          setNotificationsOpen(false);
        }

        if (
          searchRef.current &&
          !searchRef.current.contains(
            event.target
          )
        ) {
          setSearchQuery("");
        }
      };


    const handleEscape =
      (event) => {

        if (
          event.key === "Escape"
        ) {
          setProfileOpen(false);
          setNotificationsOpen(false);
          setSearchQuery("");
        }
      };


    document.addEventListener(
      "mousedown",
      handleOutsideClick
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );


    return () => {

      document.removeEventListener(
        "mousedown",
        handleOutsideClick
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );

    };

  }, []);


  /* =====================================================
     RISK CALCULATION
  ===================================================== */

  const riskTotal =
    data.high_risk_victims +
    data.moderate_risk_victims +
    data.low_risk_victims;


  const highRiskPercentage =
    riskTotal > 0
      ? Math.round(
          (
            data.high_risk_victims /
            riskTotal
          ) *
            100
        )
      : 0;


  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredSearchResults =
    searchQuery.trim().length === 0
      ? []
      : searchableItems.filter(
          (item) =>
            `${item.id} ${item.type} ${item.title} ${item.subtitle}`
              .toLowerCase()
              .includes(
                searchQuery.toLowerCase()
              )
        );


  const handleSearchResultClick =
    (item) => {

      setActiveSection(
        item.section
      );

      setSearchQuery("");

      setSidebarOpen(false);

      setNotificationsOpen(false);

      setProfileOpen(false);

    };


  const clearSearch = () => {
    setSearchQuery("");
  };


  /* =====================================================
     NAVIGATION
  ===================================================== */

  const handleNavigation =
    (section) => {

      setActiveSection(section);

      setSidebarOpen(false);

      setNotificationsOpen(false);

      setProfileOpen(false);

      setSearchQuery("");

    };


  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {

    setProfileOpen(false);

    setNotificationsOpen(false);

    setSidebarOpen(false);

    setSearchQuery("");


    if (onLogout) {
      onLogout();
    }

  };


  /* =====================================================
     PROFILE
  ===================================================== */

  const toggleProfile = () => {

    setProfileOpen(
      (previous) =>
        !previous
    );

    setNotificationsOpen(false);

  };


  /* =====================================================
     NOTIFICATIONS
  ===================================================== */

  const toggleNotifications = () => {

    setNotificationsOpen(
      (previous) =>
        !previous
    );

    setProfileOpen(false);

  };


  return (
    <div className="counsellor-dashboard">


      {/* =================================================
          SIDEBAR
      ================================================= */}

      <aside
        className={`counsellor-sidebar ${
          sidebarOpen
            ? "open"
            : ""
        }`}
      >

        <div className="counsellor-brand">

          <div className="sidebar-brand">

            <div className="sidebar-logo-circle">

              <img
                src={nirbhaymindLogo}
                alt="NirbhayMind logo"
              />

            </div>

            <div className="sidebar-brand-text">

              <h2>
                NirbhayMind
              </h2>

            </div>

          </div>

        </div>


        <nav className="counsellor-nav">

          <button
            type="button"
            className={
              activeSection ===
              "dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              handleNavigation(
                "dashboard"
              )
            }
          >

            <Home size={19} />

            <span>
              Dashboard
            </span>

          </button>


          <button
            type="button"
            className={
              activeSection ===
              "cases"
                ? "active"
                : ""
            }
            onClick={() =>
              handleNavigation(
                "cases"
              )
            }
          >

            <Users size={19} />

            <span>
              Victims & Cases
            </span>

          </button>


          <button
            type="button"
            className={
              activeSection ===
              "alerts"
                ? "active"
                : ""
            }
            onClick={() =>
              handleNavigation(
                "alerts"
              )
            }
          >

            <ShieldAlert
              size={19}
            />

            <span>
              Risk Alerts
            </span>

            {data.unresolved_alerts >
              0 && (

              <span className="nav-badge">
                {data.unresolved_alerts}
              </span>

            )}

          </button>


          <button
            type="button"
            className={
              activeSection ===
              "interventions"
                ? "active"
                : ""
            }
            onClick={() =>
              handleNavigation(
                "interventions"
              )
            }
          >

            <ClipboardCheck
              size={19}
            />

            <span>
              Interventions
            </span>

          </button>


          <button
            type="button"
            className={
              activeSection ===
              "reports"
                ? "active"
                : ""
            }
            onClick={() =>
              handleNavigation(
                "reports"
              )
            }
          >

            <FileText size={19} />

            <span>
              Reports & Analytics
            </span>

          </button>

        </nav>


        <div className="sidebar-bottom">

          <div className="state-info">

            <span>
              Assigned District
            </span>

            <strong>
              {assignedDistrict}
            </strong>

            <small>
              {assignedState}
            </small>

          </div>


          <button
            type="button"
            className="sidebar-logout"
            onClick={
              handleLogout
            }
          >

            <LogOut size={17} />

            <span>
              Logout
            </span>

          </button>

        </div>

      </aside>


      {/* =================================================
          MAIN
      ================================================= */}

      <main className="counsellor-main">


        {/* =================================================
            HEADER
        ================================================= */}

        <header className="counsellor-header">


          <button
            type="button"
            className="mobile-menu"
            onClick={() => {

              setSidebarOpen(
                (previous) =>
                  !previous
              );

              setNotificationsOpen(
                false
              );

              setProfileOpen(
                false
              );

            }}
            aria-label="Toggle menu"
          >

            {sidebarOpen ? (
              <X size={22} />
            ) : (
              <Menu size={22} />
            )}

          </button>


          {/* SEARCH */}

          <div
            className="header-search"
            ref={searchRef}
          >

            <Search
              size={18}
              className="header-search-icon"
            />


            <input
              type="text"
              value={searchQuery}
              placeholder="Search by Victim ID or Case ID..."
              onChange={(event) =>
                setSearchQuery(
                  event.target.value
                )
              }
              aria-label="Search cases or victims"
              autoComplete="off"
            />


            {searchQuery && (

              <button
                type="button"
                className="search-clear-button"
                onClick={
                  clearSearch
                }
                aria-label="Clear search"
              >

                <X size={15} />

              </button>

            )}


            {searchQuery.trim() && (

              <div className="search-results-panel">

                {filteredSearchResults.length >
                0 ? (

                  <>

                    <div className="search-results-heading">

                      <span>
                        Search results
                      </span>

                      <small>
                        {
                          filteredSearchResults.length
                        }{" "}
                        found
                      </small>

                    </div>


                    {filteredSearchResults.map(
                      (item) => (

                        <button
                          type="button"
                          key={item.id}
                          className="search-result-item"
                          onClick={() =>
                            handleSearchResultClick(
                              item
                            )
                          }
                        >

                          <div
                            className={`search-result-icon ${
                              item.risk ===
                              "Critical"
                                ? "critical"
                                : item.risk ===
                                  "High Risk"
                                ? "high"
                                : "normal"
                            }`}
                          >

                            {item.section ===
                            "alerts" ? (

                              <ShieldAlert
                                size={17}
                              />

                            ) : item.section ===
                              "interventions" ? (

                              <ClipboardCheck
                                size={17}
                              />

                            ) : (

                              <Users
                                size={17}
                              />

                            )}

                          </div>


                          <div className="search-result-content">

                            <div className="search-result-top">

                              <div className="search-result-id-block">

                                <strong>
                                  {item.id}
                                </strong>

                                <small>
                                  {item.type}
                                </small>

                              </div>


                              <span
                                className={`search-risk ${
                                  item.risk
                                    .toLowerCase()
                                    .replace(
                                      /\s+/g,
                                      "-"
                                    )
                                }`}
                              >
                                {item.risk}
                              </span>

                            </div>


                            <span className="search-result-title">
                              {item.title}
                            </span>


                            <span className="search-result-subtitle">
                              {item.subtitle}
                            </span>

                          </div>


                          <ChevronRight
                            size={16}
                            className="search-result-arrow"
                          />

                        </button>

                      )
                    )}

                  </>

                ) : (

                  <div className="search-empty-state">

                    <div className="search-empty-icon">

                      <Search size={20} />

                    </div>

                    <strong>
                      No matching cases found
                    </strong>

                    <span>
                      Try an ID such as V1001 or C1001.
                    </span>

                  </div>

                )}

              </div>

            )}

          </div>


          {/* HEADER RIGHT */}

          <div className="header-right">


            {/* NOTIFICATIONS */}

            <div
              className="notification-wrapper"
              ref={notificationRef}
            >

              <button
                type="button"
                className={`header-notification ${
                  notificationsOpen
                    ? "notification-active"
                    : ""
                }`}
                onClick={
                  toggleNotifications
                }
                aria-label={`Open notifications. ${data.new_alerts_today} new today`}
                aria-expanded={
                  notificationsOpen
                }
                aria-haspopup="dialog"
              >

                <Bell size={20} />

                {data.new_alerts_today >
                  0 && (

                  <span className="notification-dot">
                    {data.new_alerts_today}
                  </span>

                )}

              </button>


              {notificationsOpen && (

                <div
                  className="notification-panel"
                  role="dialog"
                  aria-label="Notifications"
                >

                  <div className="notification-panel-header">

                    <div>

                      <strong>
                        Notifications
                      </strong>

                      <small>
                        {data.new_alerts_today} new today
                      </small>

                    </div>


                    <button
                      type="button"
                      onClick={() =>
                        setNotificationsOpen(
                          false
                        )
                      }
                      aria-label="Close notifications"
                    >

                      <X size={17} />

                    </button>

                  </div>


                  <div className="notification-list">


                    <button
                      type="button"
                      className="notification-item critical"
                      onClick={() =>
                        handleSearchResultClick(
                          demoSearchItems[0]
                        )
                      }
                    >

                      <div className="notification-item-icon">

                        <ShieldAlert
                          size={17}
                        />

                      </div>

                      <div>

                        <strong>
                          Critical distress alert
                        </strong>

                        <p>
                          Victim V1001 shows a
                          significant increase in
                          distress indicators.
                        </p>

                        <small>
                          2 hours ago
                        </small>

                      </div>

                    </button>


                    <button
                      type="button"
                      className="notification-item warning"
                      onClick={() =>
                        handleSearchResultClick(
                          demoSearchItems[1]
                        )
                      }
                    >

                      <div className="notification-item-icon">

                        <CircleAlert
                          size={17}
                        />

                      </div>

                      <div>

                        <strong>
                          High-risk case detected
                        </strong>

                        <p>
                          Case C1001 requires
                          counsellor review.
                        </p>

                        <small>
                          4 hours ago
                        </small>

                      </div>

                    </button>


                    <button
                      type="button"
                      className="notification-item reminder"
                      onClick={() =>
                        handleSearchResultClick(
                          demoSearchItems[2]
                        )
                      }
                    >

                      <div className="notification-item-icon">

                        <CalendarDays
                          size={17}
                        />

                      </div>

                      <div>

                        <strong>
                          Follow-up overdue
                        </strong>

                        <p>
                          {data.overdue_followups}{" "}
                          follow-ups require attention.
                        </p>

                        <small>
                          Today
                        </small>

                      </div>

                    </button>

                  </div>


                  <button
                    type="button"
                    className="notification-view-all"
                    onClick={() =>
                      handleNavigation(
                        "alerts"
                      )
                    }
                  >

                    View all alerts

                    <ChevronRight
                      size={16}
                    />

                  </button>

                </div>

              )}

            </div>


            {/* PROFILE */}

            <div
              className="profile-wrapper"
              ref={profileRef}
            >

              <button
                type="button"
                className={`counsellor-profile ${
                  profileOpen
                    ? "profile-active"
                    : ""
                }`}
                onClick={
                  toggleProfile
                }
                aria-label="Open counsellor profile menu"
                aria-expanded={
                  profileOpen
                }
                aria-haspopup="menu"
              >

                <div className="profile-avatar">

                  <UserRound size={20} />

                </div>


                <div className="profile-main-info">

                  <strong>
                    {counsellorName}
                  </strong>

                  <small>
                    {assignedDistrict}
                  </small>

                </div>


                <span className="profile-active-badge">
                  Active
                </span>


                <ChevronDown
                  size={16}
                  className={`profile-chevron ${
                    profileOpen
                      ? "profile-chevron-open"
                      : ""
                  }`}
                />

              </button>


              {profileOpen && (

                <div
                  className="profile-dropdown"
                  role="menu"
                  aria-label="Counsellor profile menu"
                >

                  <div className="profile-dropdown-top">

                    <div className="profile-dropdown-avatar">

                      <UserRound size={20} />

                      <span className="profile-dropdown-online" />

                    </div>


                    <div className="profile-dropdown-identity">

                      <strong>
                        {counsellorName}
                      </strong>

                      <span>
                        NirbhayMind Counsellor
                      </span>

                    </div>


                    <span className="profile-session-badge">

                      <span className="profile-session-dot" />

                      Active

                    </span>

                  </div>


                  <div className="profile-location-row">

                    <MapPin size={15} />

                    <div>

                      <span>
                        Assigned District
                      </span>

                      <strong>
                        {assignedDistrict}
                      </strong>

                    </div>

                  </div>


                  <div className="profile-quick-grid">

                    <div>

                      <span>
                        Role
                      </span>

                      <strong>
                        Counsellor
                      </strong>

                    </div>


                    <div>

                      <span>
                        Registered
                      </span>

                      <strong>
                        {
                          data.total_registered_victims
                        }
                      </strong>

                    </div>

                  </div>


                  <div className="profile-portal-status">

                    <div className="portal-status-icon">

                      <HeartPulse size={15} />

                    </div>

                    <div>

                      <strong>
                        Portal status
                      </strong>

                      <span>
                        Monitoring services active
                      </span>

                    </div>

                    <span className="portal-status-dot" />

                  </div>


                  <div className="profile-last-updated">

                    <CalendarDays size={14} />

                    <span>
                      District data updated
                    </span>

                    <strong>
                      {data.last_updated}
                    </strong>

                  </div>


                  <div className="profile-dropdown-divider" />


                  <button
                    type="button"
                    className="profile-dropdown-item"
                    onClick={() =>
                      setProfileOpen(
                        false
                      )
                    }
                    role="menuitem"
                  >

                    <div className="profile-item-icon">

                      <UserRound size={17} />

                    </div>


                    <div className="profile-item-copy">

                      <strong>
                        My Profile
                      </strong>

                      <small>
                        View counsellor information
                      </small>

                    </div>


                    <ChevronRight
                      size={15}
                      className="profile-item-arrow"
                    />

                  </button>


                  <button
                    type="button"
                    className="profile-dropdown-item"
                    onClick={() =>
                      setProfileOpen(
                        false
                      )
                    }
                    role="menuitem"
                  >

                    <div className="profile-item-icon">

                      <Settings size={17} />

                    </div>


                    <div className="profile-item-copy">

                      <strong>
                        Account Settings
                      </strong>

                      <small>
                        Manage portal preferences
                      </small>

                    </div>


                    <ChevronRight
                      size={15}
                      className="profile-item-arrow"
                    />

                  </button>


                  <div className="profile-dropdown-divider" />


                  <button
                    type="button"
                    className="profile-dropdown-item logout-item"
                    onClick={
                      handleLogout
                    }
                    role="menuitem"
                  >

                    <div className="profile-item-icon">

                      <LogOut size={17} />

                    </div>


                    <div className="profile-item-copy">

                      <strong>
                        Logout
                      </strong>

                      <small>
                        Sign out of counsellor portal
                      </small>

                    </div>

                  </button>

                </div>

              )}

            </div>

          </div>

        </header>


        {/* =====================================================
            DASHBOARD
        ===================================================== */}

        {activeSection ===
          "dashboard" && (

          <div className="dashboard-content">

            <section className="dashboard-heading">

              <div>

                <p className="eyebrow">
                  DISTRICT WELFARE MONITORING
                </p>

                <h1>
                  Hello, {counsellorName}
                </h1>

                <p>
                  Here's the latest overview of
                  victim wellbeing, cases and
                  welfare interventions in{" "}
                  {assignedDistrict}.
                </p>

              </div>

              <div className="date-display">

                <CalendarDays size={17} />

                {data.last_updated}

              </div>

            </section>
           

            {/* SUMMARY CARDS */}

            <section className="summary-grid">

              <SummaryCard
                icon={<Users />}
                title="Registered Victims"
                value={
                  data.total_registered_victims
                }
                subtitle={`${data.new_registrations} new registrations`}
                type="green"
              />

              <SummaryCard
                icon={<CircleAlert />}
                title="At Risk"
                value={
                  data.high_risk_victims +
                  data.moderate_risk_victims
                }
                subtitle={`${highRiskPercentage}% high-risk`}
                type="sunset"
              />

              <SummaryCard
                icon={<HeartPulse />}
                title="Under Intervention"
                value={
                  data.total_interventions
                }
                subtitle={`${data.pending_interventions} pending`}
                type="yellow"
              />

              <SummaryCard
                icon={<TrendingUp />}
                title="Stable Wellbeing"
                value={
                  data.stable_wellbeing
                }
                subtitle={`${data.improving_wellbeing} improving`}
                type="olive"
              />

            </section>


            {/* MAIN ANALYTICS GRID */}

            <section className="analytics-grid">


              {/* CURRENT WELLBEING */}

              <div className="dashboard-card wellbeing-trend">

                <div className="card-title-row">

                  <div>

                    <h3>
                      Mental Well-being Overview
                    </h3>

                    <p>
                      District-level wellbeing
                      indicators
                    </p>

                  </div>

                  <select defaultValue="current">

                    <option value="current">
                      Current
                    </option>

                    <option value="previous">
                      Previous Period
                    </option>

                  </select>

                </div>


                <div className="wellbeing-metrics">

                  <Metric
                    label="Distress"
                    value={
                      data.average_distress_score
                    }
                  />

                  <Metric
                    label="Mood"
                    value={
                      data.average_mood_score
                    }
                  />

                  <Metric
                    label="Stress"
                    value={
                      data.average_stress_score
                    }
                  />

                  <Metric
                    label="Anxiety"
                    value={
                      data.average_anxiety_score
                    }
                  />

                  <Metric
                    label="Sleep"
                    value={
                      data.average_sleep_score
                    }
                  />

                </div>


                <div className="wellbeing-status">

                  <StatusItem
                    label="Improving"
                    value={
                      data.improving_wellbeing
                    }
                    type="improving"
                  />

                  <StatusItem
                    label="Stable"
                    value={
                      data.stable_wellbeing
                    }
                    type="stable"
                  />

                  <StatusItem
                    label="Declining"
                    value={
                      data.declining_wellbeing
                    }
                    type="declining"
                  />

                </div>

              </div>


              {/* DISTRICT WELLBEING TREND */}

              <div className="dashboard-card district-wellbeing-trend-card">

                <WellbeingTrendChart
                  district={
                    assignedDistrict
                  }
                  trend={
                    demoDistrictWellbeingTrend
                  }
                />

              </div>


              {/* RISK DISTRIBUTION */}

              <div className="dashboard-card risk-card">

                <div className="card-title-row">

                  <div>

                    <h3>
                      Risk Distribution
                    </h3>

                    <p>
                      Current district-level
                      risk profile
                    </p>

                  </div>

                </div>


                <div className="risk-visual">

                  <div
                    className="risk-donut"
                    style={{
                      background:
                        riskTotal > 0
                          ? `conic-gradient(
                              #7A2638 0 ${
                                (
                                  data.high_risk_victims /
                                  riskTotal
                                ) *
                                100
                              }%,
                              #E58A4E ${
                                (
                                  data.high_risk_victims /
                                  riskTotal
                                ) *
                                100
                              }% ${
                                (
                                  (
                                    data.high_risk_victims +
                                    data.moderate_risk_victims
                                  ) /
                                  riskTotal
                                ) *
                                100
                              }%,
                              #A8B86B ${
                                (
                                  (
                                    data.high_risk_victims +
                                    data.moderate_risk_victims
                                  ) /
                                  riskTotal
                                ) *
                                100
                              }% 100%
                            )`
                          : "#A8B86B",
                    }}
                  >

                    <div>

                      <strong>
                        {riskTotal}
                      </strong>

                      <span>
                        Total Cases
                      </span>

                    </div>

                  </div>


                  <div className="risk-legend">

                    <RiskLegend
                      label="High Risk"
                      value={
                        data.high_risk_victims
                      }
                      type="high"
                    />

                    <RiskLegend
                      label="Moderate Risk"
                      value={
                        data.moderate_risk_victims
                      }
                      type="moderate"
                    />

                    <RiskLegend
                      label="Low Risk"
                      value={
                        data.low_risk_victims
                      }
                      type="low"
                    />

                  </div>

                </div>


                <div className="crisis-banner">

                  <ShieldAlert size={18} />

                  <span>

                    <strong>
                      {data.crisis_cases}
                    </strong>{" "}
                    active crisis cases
                    require immediate
                    attention.

                  </span>

                </div>

              </div>

            </section>


            {/* =================================================
                NATIONWIDE INDIA STATE RISK OVERVIEW
            ================================================= */}

            <section className="dashboard-card state-map-card">

              <div className="card-title-row">

                <div>

                  <h3>
                    Nationwide Overview
                  </h3>

                  <p>
                    India-wide risk context
                    by state
                  </p>

                </div>


                <div className="state-map-badge">

                  <MapPin size={14} />

                  {assignedDistrict}

                </div>

              </div>


              <div className="state-map-content">


                {/* INDIA MAP */}

                <div className="india-map-wrapper">

                  <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                      center: [
                        82.5,
                        24.5,
                      ],
                      scale: 760,
                    }}
                    width={620}
                    height={420}
                    className="india-risk-map"
                    aria-label="India state risk map"
                  >

                    <Geographies
                      geography={
                        INDIA_STATES_GEO_URL
                      }
                    >

                      {({
                        geographies,
                      }) =>
                        geographies.map(
                          (geo) => {

                            const stateName =
                              geo.properties
                                ?.ST_NM
                                ?.trim() ||

                              geo.properties
                                ?.NAME_1
                                ?.trim() ||

                              geo.properties
                                ?.NAME
                                ?.trim() ||

                              geo.properties
                                ?.name
                                ?.trim() ||

                              "";


                            const risk =
                              getStateRisk(
                                stateName,
                                districtRiskData
                              );


                            const stateColor =
                              getStateRiskColor(
                                risk.level
                              );


                            const isSelected =
                              normalizeStateName(
                                stateName
                              ) ===
                              normalizeStateName(
                                assignedState
                              );


                            return (

                              <Geography
                                key={
                                  geo.rsmKey
                                }

                                geography={
                                  geo
                                }

                                className={
                                  [
                                    "india-state",
                                    `state-risk-${risk.level
                                      .toLowerCase()
                                      .replace(/\s+/g, "-")}`,
                                    isSelected
                                      ? "selected-state"
                                      : "",
                                  ]
                                    .filter(Boolean)
                                    .join(" ")
                                }
                                fill={stateColor}
                                stroke="#FAF7EF"
                                strokeWidth={isSelected ? 1.8 : 0.8}
                                tabIndex={
                                  -1
                                }

                              />

                            );

                          }
                        )
                      }

                    </Geographies>

                  </ComposableMap>

                </div>


                {/* STATE RISK LEGEND */}

                <div className="state-map-risk-legend">

                  <div className="state-map-risk-title">
                    State Risk Level
                  </div>


                  <div className="map-risk-legend">

                    <div className="map-risk-legend-item">

                      <span
                        className="state-map-risk-dot"
                        style={{
                          background:
                            "#7A2638",
                        }}
                      />

                      <span>
                        High Risk
                      </span>

                    </div>


                    <div className="map-risk-legend-item">

                      <span
                        className="state-map-risk-dot"
                        style={{
                          background:
                            "#D9825B",
                        }}
                      />

                      <span>
                        Moderate Risk
                      </span>

                    </div>


                    <div className="map-risk-legend-item">

                      <span
                        className="state-map-risk-dot"
                        style={{
                          background:
                            "#C9A6A0",
                        }}
                      />

                      <span>
                        Low Risk
                      </span>

                    </div>


                    <div className="map-risk-legend-item">

                      <span
                        className="state-map-risk-dot"
                        style={{
                          background:
                            "#F1E7E3",
                        }}
                      />

                      <span>
                        No Data
                      </span>

                    </div>

                  </div>


                  <div className="map-selected-state">

                    <span>
                      Assigned State
                    </span>

                    <strong>
                      {assignedState}
                    </strong>

                    <small>
                      {
                        assignedStateRisk.level
                      }
                    </small>

                  </div>


                  <div className="map-total-victims">

                    <span>
                      District registered victims
                    </span>

                    <strong>
                      {
                        data.total_registered_victims
                      }
                    </strong>

                  </div>


                  <div className="map-selected-breakdown">

                    <div>

                      <span>
                        High
                      </span>

                      <strong>
                        {
                          assignedStateRisk.high
                        }
                      </strong>

                    </div>


                    <div>

                      <span>
                        Moderate
                      </span>

                      <strong>
                        {
                          assignedStateRisk.moderate
                        }
                      </strong>

                    </div>


                    <div>

                      <span>
                        Low
                      </span>

                      <strong>
                        {
                          assignedStateRisk.low
                        }
                      </strong>

                    </div>

                  </div>

                </div>

              </div>

            </section>
        {/* =================================================
          DISTRICT-WISE RISK OVERVIEW
          ================================================= */}

          <DistrictRiskOverview
            district={assignedDistrict}
            state={assignedState}
            districtRiskData={districtRiskData}
            districtRiskError={districtRiskError}
            onViewAll={() =>
              handleNavigation("cases")
            }
          />

            {/* LOWER GRID */}

            <section className="lower-dashboard-grid">


              {/* ALERTS */}

              <div className="dashboard-card alerts-card">

                <div className="card-title-row">

                  <div>

                    <h3>
                      Recent High-Risk Alerts
                    </h3>

                    <p>
                      Cases requiring counsellor
                      attention
                    </p>

                  </div>

                  <button
                    type="button"
                    className="view-all-button"
                    onClick={() =>
                      handleNavigation(
                        "alerts"
                      )
                    }
                  >

                    View all

                    <ChevronRight
                      size={15}
                    />

                  </button>

                </div>


                <AlertItem
                  caseId="V1001"
                  message="Significant increase in distress indicators"
                  time="2 hours ago"
                  critical
                />

                <AlertItem
                  caseId="C1001"
                  message="Repeated distress signals detected"
                  time="4 hours ago"
                />

                <AlertItem
                  caseId="V1002"
                  message="No response for 3 consecutive days"
                  time="6 hours ago"
                />

              </div>


              {/* COUNSELLING */}

              <div className="dashboard-card counselling-card">

                <div className="card-title-row">

                  <div>

                    <h3>
                      Counselling Overview
                    </h3>

                    <p>
                      Current counselling workload
                    </p>

                  </div>

                  <MessageCircle
                    size={20}
                  />

                </div>


                <div className="counselling-progress">

                  <div className="progress-label">

                    <span>
                      Completed
                    </span>

                    <strong>
                      {
                        data.counselling_completed
                      }
                      /
                      {
                        data.counselling_required
                      }
                    </strong>

                  </div>


                  <div className="progress-track">

                    <div
                      className="progress-fill"
                      style={{
                        width: `${
                          data.counselling_required
                            ? (
                                data.counselling_completed /
                                data.counselling_required
                              ) *
                              100
                            : 0
                        }%`,
                      }}
                    />

                  </div>

                </div>


                <div className="counselling-stats">

                  <div>

                    <strong>
                      {
                        data.pending_counselling
                      }
                    </strong>

                    <span>
                      Pending
                    </span>

                  </div>


                  <div>

                    <strong>
                      {
                        data.pending_followups
                      }
                    </strong>

                    <span>
                      Follow-ups
                    </span>

                  </div>


                  <div className="danger-stat">

                    <strong>
                      {
                        data.overdue_followups
                      }
                    </strong>

                    <span>
                      Overdue
                    </span>

                  </div>

                </div>


                <button
                  type="button"
                  className="primary-dashboard-button"
                  onClick={() =>
                    handleNavigation(
                      "interventions"
                    )
                  }
                >

                  Manage Counselling

                  <ChevronRight
                    size={17}
                  />

                </button>

              </div>

            </section>


            {/* SUPPORT REQUIREMENTS */}

            <section className="dashboard-card support-overview">

              <div className="card-title-row">

                <div>

                  <h3>
                    Welfare Support Requirements
                  </h3>

                  <p>
                    Current support needs across
                    the district
                  </p>

                </div>

                <FileText size={20} />

              </div>


              <div className="support-grid">

                <SupportItem
                  label="Legal Aid"
                  value={
                    data.legal_aid_required
                  }
                />

                <SupportItem
                  label="Medical Support"
                  value={
                    data.medical_support_required
                  }
                />

                <SupportItem
                  label="Relocation"
                  value={
                    data.relocation_required
                  }
                />

                <SupportItem
                  label="Protection"
                  value={
                    data.protection_required
                  }
                />

                <SupportItem
                  label="High Threat"
                  value={
                    data.high_threat_cases
                  }
                  danger
                />

              </div>

            </section>

          </div>

        )}


        {/* =====================================================
            VICTIMS & CASES
        ===================================================== */}

        {activeSection ===
          "cases" && (

          <div className="dashboard-content">

            <section className="dashboard-heading">

              <div>

                <p className="eyebrow">
                  CASE MANAGEMENT
                </p>

                <h1>
                  Victims & Cases
                </h1>

                <p>
                  Monitor registered victims and
                  their case status across the{" "}
                  {assignedDistrict} district.
                </p>

              </div>

              <div className="date-display">

                <CalendarDays size={17} />

                {data.last_updated}

              </div>

            </section>


            <section className="summary-grid">

              <SummaryCard
                icon={<Users />}
                title="Total Registered"
                value={
                  data.total_registered_victims
                }
                subtitle={`${data.new_registrations} new registrations`}
                type="green"
              />

              <SummaryCard
                icon={<HeartPulse />}
                title="Active Cases"
                value={
                  data.active_victims
                }
                subtitle="Currently active"
                type="olive"
              />

              <SummaryCard
                icon={<ClipboardCheck />}
                title="Closed Cases"
                value={
                  data.closed_cases
                }
                subtitle={`${data.resolved_cases} recently resolved`}
                type="yellow"
              />

              <SummaryCard
                icon={<TrendingUp />}
                title="New Registrations"
                value={
                  data.new_registrations
                }
                subtitle="Recent registrations"
                type="sunset"
              />

            </section>


            <section className="analytics-grid">

              <div className="dashboard-card">

                <div className="card-title-row">

                  <div>

                    <h3>
                      Case Overview
                    </h3>

                    <p>
                      Current case-management
                      status in the district
                    </p>

                  </div>

                </div>


                <div className="wellbeing-metrics">

                  <Metric
                    label="Resolved Cases"
                    value={
                      data.resolved_cases
                    }
                  />

                  <Metric
                    label="Delayed Cases"
                    value={
                      data.delayed_cases
                    }
                  />

                  <Metric
                    label="Upcoming Hearings"
                    value={
                      data.upcoming_hearings
                    }
                  />

                  <Metric
                    label="High Threat Cases"
                    value={
                      data.high_threat_cases
                    }
                  />

                </div>

              </div>


              <div className="dashboard-card">

                <div className="card-title-row">

                  <div>

                    <h3>
                      Case Timeline
                    </h3>

                    <p>
                      District-level case activity
                    </p>

                  </div>

                </div>


                <div className="wellbeing-metrics">

                  <Metric
                    label="Average Case Delay"
                    value={
                      data.average_case_delay_days
                    }
                  />

                  <Metric
                    label="Pending Follow-ups"
                    value={
                      data.pending_followups
                    }
                  />

                  <Metric
                    label="Overdue Follow-ups"
                    value={
                      data.overdue_followups
                    }
                  />

                </div>

              </div>

            </section>


            <section className="dashboard-card support-overview">

              <div className="card-title-row">

                <div>

                  <h3>
                    Case Support Requirements
                  </h3>

                  <p>
                    Current support requirements
                    across active district cases
                  </p>

                </div>

                <ShieldAlert
                  size={20}
                />

              </div>


              <div className="support-grid">

                <SupportItem
                  label="Legal Aid"
                  value={
                    data.legal_aid_required
                  }
                />

                <SupportItem
                  label="Medical Support"
                  value={
                    data.medical_support_required
                  }
                />

                <SupportItem
                  label="Relocation"
                  value={
                    data.relocation_required
                  }
                />

                <SupportItem
                  label="Protection"
                  value={
                    data.protection_required
                  }
                />

                <SupportItem
                  label="High Threat"
                  value={
                    data.high_threat_cases
                  }
                  danger
                />

              </div>

            </section>

          </div>

        )}


        {/* =====================================================
            RISK ALERTS
        ===================================================== */}

        {activeSection ===
          "alerts" && (

          <div className="dashboard-content">

            <section className="dashboard-heading">

              <div>

                <p className="eyebrow">
                  RISK MONITORING
                </p>

                <h1>
                  Risk Alerts
                </h1>

                <p>
                  Monitor critical, high-risk and
                  unresolved alerts requiring
                  counsellor attention in{" "}
                  {assignedDistrict}.
                </p>

              </div>

              <div className="date-display">

                <CalendarDays size={17} />

                {data.last_updated}

              </div>

            </section>


            <section className="summary-grid">

              <SummaryCard
                icon={<Bell />}
                title="Total Alerts"
                value={
                  data.total_alerts
                }
                subtitle={`${data.new_alerts_this_week} this week`}
                type="green"
              />

              <SummaryCard
                icon={<CircleAlert />}
                title="Critical Alerts"
                value={
                  data.critical_alerts
                }
                subtitle={`${data.new_alerts_today} new today`}
                type="sunset"
              />

              <SummaryCard
                icon={<ShieldAlert />}
                title="High-Risk Alerts"
                value={
                  data.high_risk_alerts
                }
                subtitle="Require attention"
                type="yellow"
              />

              <SummaryCard
                icon={<ClipboardCheck />}
                title="Resolved Alerts"
                value={
                  data.resolved_alerts
                }
                subtitle={`${data.unresolved_alerts} unresolved`}
                type="olive"
              />

            </section>


            <section className="analytics-grid">

              <div className="dashboard-card">

                <div className="card-title-row">

                  <div>

                    <h3>
                      Alert Status
                    </h3>

                    <p>
                      Current district-level
                      alert distribution
                    </p>

                  </div>

                </div>


                <div className="wellbeing-metrics">

                  <Metric
                    label="Unresolved Alerts"
                    value={
                      data.unresolved_alerts
                    }
                  />

                  <Metric
                    label="Resolved Alerts"
                    value={
                      data.resolved_alerts
                    }
                  />

                  <Metric
                    label="Critical Alerts"
                    value={
                      data.critical_alerts
                    }
                  />

                  <Metric
                    label="High-Risk Alerts"
                    value={
                      data.high_risk_alerts
                    }
                  />

                </div>

              </div>


              <div className="dashboard-card">

                <div className="card-title-row">

                  <div>

                    <h3>
                      Recent Activity
                    </h3>

                    <p>
                      Latest alert activity in{" "}
                      {assignedDistrict}
                    </p>

                  </div>

                  <Bell size={20} />

                </div>


                <div className="metric-list">

                  <Metric
                    label="New Alerts Today"
                    value={
                      data.new_alerts_today
                    }
                  />

                  <Metric
                    label="New Alerts This Week"
                    value={
                      data.new_alerts_this_week
                    }
                  />

                  <Metric
                    label="Unresolved"
                    value={
                      data.unresolved_alerts
                    }
                  />

                </div>

              </div>

            </section>


            <section className="dashboard-card alerts-card">

              <div className="card-title-row">

                <div>

                  <h3>
                    Recent High-Risk Alerts
                  </h3>

                  <p>
                    Alerts requiring counsellor
                    review
                  </p>

                </div>

                <span className="nav-badge">

                  {
                    data.unresolved_alerts
                  }{" "}
                  unresolved

                </span>

              </div>


              <AlertItem
                caseId="V1001"
                message="Significant increase in distress indicators"
                time="2 hours ago"
                critical
              />

              <AlertItem
                caseId="C1001"
                message="Repeated distress signals detected"
                time="4 hours ago"
              />

              <AlertItem
                caseId="V1002"
                message="No response for 3 consecutive days"
                time="6 hours ago"
              />

              <AlertItem
                caseId="C1002"
                message="Rapid deterioration in wellbeing indicators"
                time="Yesterday"
                critical
              />

            </section>


            <section className="dashboard-card support-overview">

              <div className="card-title-row">

                <div>

                  <h3>
                    Alert Priorities
                  </h3>

                  <p>
                    Current distribution of
                    unresolved district alerts
                  </p>

                </div>

                <ShieldAlert
                  size={20}
                />

              </div>


              <div className="support-grid">

                <SupportItem
                  label="Critical"
                  value={
                    data.critical_alerts
                  }
                  danger
                />

                <SupportItem
                  label="High Risk"
                  value={
                    data.high_risk_alerts
                  }
                />

                <SupportItem
                  label="Unresolved"
                  value={
                    data.unresolved_alerts
                  }
                />

                <SupportItem
                  label="Resolved"
                  value={
                    data.resolved_alerts
                  }
                />

                <SupportItem
                  label="New Today"
                  value={
                    data.new_alerts_today
                  }
                />

              </div>

            </section>

          </div>

        )}


        {/* =====================================================
            INTERVENTIONS
        ===================================================== */}

        {activeSection ===
          "interventions" && (

          <div className="dashboard-content">

            <section className="dashboard-heading">

              <div>

                <p className="eyebrow">
                  WELFARE ACTIONS
                </p>

                <h1>
                  Interventions
                </h1>

                <p>
                  Monitor counselling, welfare
                  support and ongoing intervention
                  activities across the district.
                </p>

              </div>

              <div className="date-display">

                <CalendarDays size={17} />

                {data.last_updated}

              </div>

            </section>


            <section className="summary-grid">

              <SummaryCard
                icon={<ClipboardCheck />}
                title="Total Interventions"
                value={
                  data.total_interventions
                }
                subtitle="All district interventions"
                type="green"
              />

              <SummaryCard
                icon={<CircleAlert />}
                title="Pending Interventions"
                value={
                  data.pending_interventions
                }
                subtitle="Require follow-up"
                type="sunset"
              />

              <SummaryCard
                icon={<ClipboardCheck />}
                title="Completed"
                value={
                  data.completed_interventions
                }
                subtitle="Successfully completed"
                type="yellow"
              />

              <SummaryCard
                icon={<HeartPulse />}
                title="Counselling Required"
                value={
                  data.counselling_required
                }
                subtitle="Cases requiring counselling"
                type="olive"
              />

            </section>


            <section className="analytics-grid">

              <div className="dashboard-card">

                <div className="card-title-row">

                  <div>

                    <h3>
                      Counselling Overview
                    </h3>

                    <p>
                      District counselling activity
                    </p>

                  </div>

                  <MessageCircle
                    size={20}
                  />

                </div>


                <div className="wellbeing-metrics">

                  <Metric
                    label="Counselling Required"
                    value={
                      data.counselling_required
                    }
                  />

                  <Metric
                    label="Counselling Completed"
                    value={
                      data.counselling_completed
                    }
                  />

                  <Metric
                    label="Pending Counselling"
                    value={
                      data.pending_counselling
                    }
                  />

                </div>

              </div>


              <div className="dashboard-card">

                <div className="card-title-row">

                  <div>

                    <h3>
                      Follow-up Status
                    </h3>

                    <p>
                      Cases requiring continued
                      attention
                    </p>

                  </div>

                  <CalendarDays
                    size={20}
                  />

                </div>


                <div className="wellbeing-metrics">

                  <Metric
                    label="Pending Follow-ups"
                    value={
                      data.pending_followups
                    }
                  />

                  <Metric
                    label="Overdue Follow-ups"
                    value={
                      data.overdue_followups
                    }
                  />

                  <Metric
                    label="Completed Interventions"
                    value={
                      data.completed_interventions
                    }
                  />

                </div>

              </div>

            </section>


            <section className="dashboard-card support-overview">

              <div className="card-title-row">

                <div>

                  <h3>
                    Welfare Support Requirements
                  </h3>

                  <p>
                    Support categories identified
                    across registered district cases
                  </p>

                </div>

                <HeartPulse size={20} />

              </div>


              <div className="support-grid">

                <SupportItem
                  label="Legal Aid"
                  value={
                    data.legal_aid_required
                  }
                />

                <SupportItem
                  label="Medical Support"
                  value={
                    data.medical_support_required
                  }
                />

                <SupportItem
                  label="Relocation"
                  value={
                    data.relocation_required
                  }
                />

                <SupportItem
                  label="Protection"
                  value={
                    data.protection_required
                  }
                  danger
                />

                <SupportItem
                  label="High Threat"
                  value={
                    data.high_threat_cases
                  }
                  danger
                />

              </div>

            </section>


            <section className="dashboard-card">

              <div className="card-title-row">

                <div>

                  <h3>
                    Intervention Progress
                  </h3>

                  <p>
                    Overall district intervention
                    completion
                  </p>

                </div>

                <TrendingUp size={20} />

              </div>


              <div className="intervention-progress">

                <div className="progress-label">

                  <span>
                    Completed Interventions
                  </span>

                  <strong>

                    {
                      data.completed_interventions
                    }

                    {" / "}

                    {
                      data.total_interventions
                    }

                  </strong>

                </div>


                <div className="progress-track">

                  <div
                    className="progress-fill"
                    style={{
                      width: `${
                        data.total_interventions >
                        0
                          ? Math.round(
                              (
                                data.completed_interventions /
                                data.total_interventions
                              ) *
                                100
                            )
                          : 0
                      }%`,
                    }}
                  />

                </div>

              </div>

            </section>

          </div>

        )}


        {/* =====================================================
            REPORTS & ANALYTICS
        ===================================================== */}

        {activeSection ===
          "reports" && (

          <div className="dashboard-content">

            <section className="dashboard-heading">

              <div>

                <p className="eyebrow">
                  DISTRICT ANALYTICS
                </p>

                <h1>
                  Reports & Analytics
                </h1>

                <p>
                  Review district-level wellbeing,
                  case, risk and intervention
                  trends.
                </p>

              </div>

              <div className="date-display">

                <CalendarDays size={17} />

                {data.last_updated}

              </div>

            </section>


            <section className="summary-grid">

              <SummaryCard
                icon={<Users />}
                title="Registered Victims"
                value={
                  data.total_registered_victims
                }
                subtitle={`${data.active_victims} active cases`}
                type="green"
              />

              <SummaryCard
                icon={<ShieldAlert />}
                title="High-Risk Cases"
                value={
                  data.high_risk_victims
                }
                subtitle={`${data.crisis_cases} crisis cases`}
                type="sunset"
              />

              <SummaryCard
                icon={<HeartPulse />}
                title="Average Distress"
                value={
                  data.average_distress_score
                }
                subtitle="District average"
                type="yellow"
              />

              <SummaryCard
                icon={<ClipboardCheck />}
                title="Interventions"
                value={
                  data.total_interventions
                }
                subtitle={`${data.completed_interventions} completed`}
                type="olive"
              />

            </section>


            {/* DISTRICT WELLBEING TREND ALSO AVAILABLE IN REPORTS */}

            <section className="dashboard-card district-wellbeing-trend-card">

              <WellbeingTrendChart
                district={
                  assignedDistrict
                }
                trend={
                  demoDistrictWellbeingTrend
                }
              />

            </section>


            <section className="analytics-grid">

              <div className="dashboard-card">

                <div className="card-title-row">

                  <div>

                    <h3>
                      Well-being Indicators
                    </h3>

                    <p>
                      Average district-level
                      mental wellbeing scores
                    </p>

                  </div>

                  <HeartPulse
                    size={20}
                  />

                </div>


                <div className="wellbeing-metrics">

                  <Metric
                    label="Distress"
                    value={
                      data.average_distress_score
                    }
                  />

                  <Metric
                    label="Mood"
                    value={
                      data.average_mood_score
                    }
                  />

                  <Metric
                    label="Stress"
                    value={
                      data.average_stress_score
                    }
                  />

                  <Metric
                    label="Anxiety"
                    value={
                      data.average_anxiety_score
                    }
                  />

                  <Metric
                    label="Sleep"
                    value={
                      data.average_sleep_score
                    }
                  />

                </div>

              </div>


              <div className="dashboard-card">

                <div className="card-title-row">

                  <div>

                    <h3>
                      Case Analytics
                    </h3>

                    <p>
                      Current district case activity
                    </p>

                  </div>

                  <FileText
                    size={20}
                  />

                </div>


                <div className="wellbeing-metrics">

                  <Metric
                    label="Resolved Cases"
                    value={
                      data.resolved_cases
                    }
                  />

                  <Metric
                    label="Delayed Cases"
                    value={
                      data.delayed_cases
                    }
                  />

                  <Metric
                    label="Upcoming Hearings"
                    value={
                      data.upcoming_hearings
                    }
                  />

                  <Metric
                    label="High Threat Cases"
                    value={
                      data.high_threat_cases
                    }
                  />

                </div>

              </div>

            </section>


            <section className="dashboard-card">

              <div className="card-title-row">

                <div>

                  <h3>
                    Risk Distribution
                  </h3>

                  <p>
                    Current distribution of
                    district cases by risk level
                  </p>

                </div>

                <ShieldAlert
                  size={20}
                />

              </div>


              <div className="support-grid">

                <SupportItem
                  label="High Risk"
                  value={
                    data.high_risk_victims
                  }
                  danger
                />

                <SupportItem
                  label="Moderate Risk"
                  value={
                    data.moderate_risk_victims
                  }
                />

                <SupportItem
                  label="Low Risk"
                  value={
                    data.low_risk_victims
                  }
                />

                <SupportItem
                  label="Crisis Cases"
                  value={
                    data.crisis_cases
                  }
                  danger
                />

                <SupportItem
                  label="Total Cases"
                  value={
                    riskTotal
                  }
                />

              </div>

            </section>


            <section className="analytics-grid">

              <div className="dashboard-card">

                <div className="card-title-row">

                  <div>

                    <h3>
                      Well-being Status
                    </h3>

                    <p>
                      Current district wellbeing
                      movement
                    </p>

                  </div>

                  <TrendingUp
                    size={20}
                  />

                </div>


                <div className="support-grid">

                  <SupportItem
                    label="Improving"
                    value={
                      data.improving_wellbeing
                    }
                  />

                  <SupportItem
                    label="Stable"
                    value={
                      data.stable_wellbeing
                    }
                  />

                  <SupportItem
                    label="Declining"
                    value={
                      data.declining_wellbeing
                    }
                    danger
                  />

                </div>

              </div>


              <div className="dashboard-card">

                <div className="card-title-row">

                  <div>

                    <h3>
                      Intervention Analytics
                    </h3>

                    <p>
                      District welfare
                      intervention status
                    </p>

                  </div>

                  <ClipboardCheck
                    size={20}
                  />

                </div>


                <div className="support-grid">

                  <SupportItem
                    label="Total"
                    value={
                      data.total_interventions
                    }
                  />

                  <SupportItem
                    label="Completed"
                    value={
                      data.completed_interventions
                    }
                  />

                  <SupportItem
                    label="Pending"
                    value={
                      data.pending_interventions
                    }
                    danger
                  />

                </div>

              </div>

            </section>


            <section className="dashboard-card">

              <div className="card-title-row">

                <div>

                  <h3>
                    Counselling Report
                  </h3>

                  <p>
                    Current counselling workload
                    and completion status
                  </p>

                </div>

                <MessageCircle
                  size={20}
                />

              </div>


              <div className="support-grid">

                <SupportItem
                  label="Required"
                  value={
                    data.counselling_required
                  }
                />

                <SupportItem
                  label="Completed"
                  value={
                    data.counselling_completed
                  }
                />

                <SupportItem
                  label="Pending"
                  value={
                    data.pending_counselling
                  }
                  danger
                />

                <SupportItem
                  label="Follow-ups"
                  value={
                    data.pending_followups
                  }
                />

                <SupportItem
                  label="Overdue"
                  value={
                    data.overdue_followups
                  }
                  danger
                />

              </div>

            </section>


            <section className="dashboard-card">

              <div className="card-title-row">

                <div>

                  <h3>
                    Alert Report
                  </h3>

                  <p>
                    District risk-alert activity
                  </p>

                </div>

                <Bell size={20} />

              </div>


              <div className="support-grid">

                <SupportItem
                  label="Total Alerts"
                  value={
                    data.total_alerts
                  }
                />

                <SupportItem
                  label="Critical"
                  value={
                    data.critical_alerts
                  }
                  danger
                />

                <SupportItem
                  label="High Risk"
                  value={
                    data.high_risk_alerts
                  }
                />

                <SupportItem
                  label="Unresolved"
                  value={
                    data.unresolved_alerts
                  }
                  danger
                />

                <SupportItem
                  label="Resolved"
                  value={
                    data.resolved_alerts
                  }
                />

              </div>

            </section>

          </div>

        )}

      </main>

    </div>
  );
}


/* =====================================================
   SMALL COMPONENTS
===================================================== */

function SummaryCard({
  icon,
  title,
  value,
  subtitle,
  type,
}) {

  return (

    <div
      className={`summary-card ${type}`}
    >

      <div className="summary-icon">
        {icon}
      </div>

      <div>

        <span>
          {title}
        </span>

        <strong>
          {value}
        </strong>

        <small>
          {subtitle}
        </small>

      </div>

    </div>

  );

}


function Metric({
  label,
  value,
}) {

  return (

    <div className="metric">

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

      <div className="metric-bar">

        <div
          style={{
            width: `${Math.min(
              value,
              100
            )}%`,
          }}
        />

      </div>

    </div>

  );

}


function StatusItem({
  label,
  value,
  type,
}) {

  return (

    <div
      className={`status-item ${type}`}
    >

      <span />

      <label>
        {label}
      </label>

      <strong>
        {value}
      </strong>

    </div>

  );

}


function RiskLegend({
  label,
  value,
  type,
}) {

  return (

    <div
      className={`risk-legend-item ${type}`}
    >

      <span />

      <label>
        {label}
      </label>

      <strong>
        {value}
      </strong>

    </div>

  );

}


function AlertItem({
  caseId,
  message,
  time,
  critical,
}) {

  return (

    <div className="alert-item">

      <div
        className={`alert-icon ${
          critical
            ? "critical"
            : ""
        }`}
      >

        <ShieldAlert
          size={17}
        />

      </div>

      <div className="alert-content">

        <strong>
          Case ID: {caseId}
        </strong>

        <p>
          {message}
        </p>

        <small>
          {time}
        </small>

      </div>

      <ChevronRight
        size={17}
      />

    </div>

  );

}


function SupportItem({
  label,
  value,
  danger,
}) {

  return (

    <div
      className={`support-item ${
        danger
          ? "danger"
          : ""
      }`}
    >

      <span>
        {label}
      </span>

      <strong>
        {value}
      </strong>

      <small>
        cases
      </small>

    </div>

  );

}


export default CounsellorDashboard;