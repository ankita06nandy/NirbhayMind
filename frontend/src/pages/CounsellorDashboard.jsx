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
  useRef,
  useState,
} from "react";

import "./CounsellorDashboard.css";


/* =====================================================
   INDIA MAP DATA
===================================================== */

const INDIA_STATES_GEO_URL =
  "https://raw.githubusercontent.com/india-in-data/india-states-2019/master/india_states.geojson";


/* =====================================================
   DEMO DATA
===================================================== */

const demoCounsellorData = {
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
   DEMO SEARCH DATA
===================================================== */

const demoSearchItems = [
  {
    id: "V1001",
    type: "Victim",
    title: "Critical distress alert",
    subtitle: "Significant increase in distress indicators",
    section: "alerts",
    risk: "Critical",
  },

  {
    id: "C1001",
    type: "Case",
    title: "High-risk case detected",
    subtitle: "Requires counsellor review",
    section: "alerts",
    risk: "High Risk",
  },

  {
    id: "V1002",
    type: "Victim",
    title: "Follow-up pending",
    subtitle: "No response for 3 consecutive days",
    section: "interventions",
    risk: "Moderate",
  },

  {
    id: "C1002",
    type: "Case",
    title: "Rapid wellbeing decline",
    subtitle: "Intervention review required",
    section: "interventions",
    risk: "Critical",
  },

  {
    id: "V1003",
    type: "Victim",
    title: "Counselling session pending",
    subtitle: "Follow-up counselling required",
    section: "interventions",
    risk: "Moderate",
  },

  {
    id: "C1003",
    type: "Case",
    title: "Legal aid requirement",
    subtitle: "Legal support identified for case",
    section: "cases",
    risk: "Support",
  },

  {
    id: "V1004",
    type: "Victim",
    title: "Protection requirement",
    subtitle: "Protection support required",
    section: "cases",
    risk: "High Risk",
  },
];


function CounsellorDashboard({ onLogout, data: dashboardData, profile, searchItems }) {

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

  const data = dashboardData || demoCounsellorData;
  const counsellorName = profile?.name || data.counsellor_name || data.counsellor_id || "Counsellor";
  const searchableItems = searchItems || demoSearchItems;


  /* =====================================================
     REFS
  ===================================================== */

  const profileRef = useRef(null);
  const notificationRef = useRef(null);
  const searchRef = useRef(null);


  /* =====================================================
     OUTSIDE CLICK + ESCAPE
  ===================================================== */

  useEffect(() => {

    const handleOutsideClick = (event) => {

      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }

      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationsOpen(false);
      }

      if (
        searchRef.current &&
        !searchRef.current.contains(event.target)
      ) {
        setSearchQuery("");
      }
    };


    const handleEscape = (event) => {

      if (event.key === "Escape") {

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
          (data.high_risk_victims / riskTotal) * 100
        )
      : 0;


  /* =====================================================
     SEARCH
  ===================================================== */

  const filteredSearchResults =
    searchQuery.trim().length === 0
      ? []
      : searchableItems.filter((item) =>
          `${item.id} ${item.type} ${item.title} ${item.subtitle}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        );


  const handleSearchResultClick = (item) => {

    setActiveSection(item.section);

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

  const handleNavigation = (section) => {

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
      (previous) => !previous
    );

    setNotificationsOpen(false);

  };


  /* =====================================================
     NOTIFICATIONS
  ===================================================== */

  const toggleNotifications = () => {

    setNotificationsOpen(
      (previous) => !previous
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
          sidebarOpen ? "open" : ""
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


        {/* SIDEBAR NAVIGATION */}

        <nav className="counsellor-nav">

          <button
            type="button"
            className={
              activeSection === "dashboard"
                ? "active"
                : ""
            }
            onClick={() =>
              handleNavigation("dashboard")
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
              activeSection === "cases"
                ? "active"
                : ""
            }
            onClick={() =>
              handleNavigation("cases")
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
              activeSection === "alerts"
                ? "active"
                : ""
            }
            onClick={() =>
              handleNavigation("alerts")
            }
          >

            <ShieldAlert size={19} />

            <span>
              Risk Alerts
            </span>

            {data.unresolved_alerts > 0 && (

              <span className="nav-badge">
                {data.unresolved_alerts}
              </span>

            )}

          </button>


          <button
            type="button"
            className={
              activeSection === "interventions"
                ? "active"
                : ""
            }
            onClick={() =>
              handleNavigation("interventions")
            }
          >

            <ClipboardCheck size={19} />

            <span>
              Interventions
            </span>

          </button>


          <button
            type="button"
            className={
              activeSection === "reports"
                ? "active"
                : ""
            }
            onClick={() =>
              handleNavigation("reports")
            }
          >

            <FileText size={19} />

            <span>
              Reports & Analytics
            </span>

          </button>

        </nav>


        {/* SIDEBAR BOTTOM */}

        <div className="sidebar-bottom">

          <div className="state-info">

            <span>
              Assigned State            </span>

            <strong>
              {data.state}
            </strong>

            <small>
              {data.state}
            </small>

          </div>


          <button
            type="button"
            className="sidebar-logout"
            onClick={handleLogout}
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


          {/* MOBILE MENU */}

          <button
            type="button"
            className="mobile-menu"
            onClick={() => {

              setSidebarOpen(
                (previous) => !previous
              );

              setNotificationsOpen(false);
              setProfileOpen(false);

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
                onClick={clearSearch}
                aria-label="Clear search"
              >

                <X size={15} />

              </button>

            )}


            {/* SEARCH RESULTS */}

            {searchQuery.trim() && (

              <div className="search-results-panel">

                {filteredSearchResults.length > 0 ? (

                  <>

                    <div className="search-results-heading">

                      <span>
                        Search results
                      </span>

                      <small>
                        {filteredSearchResults.length} found
                      </small>

                    </div>


                    {filteredSearchResults.map(
                      (item) => (

                        <button
                          type="button"
                          key={item.id}
                          className="search-result-item"
                          onClick={() =>
                            handleSearchResultClick(item)
                          }
                        >

                          <div
                            className={`search-result-icon ${
                              item.risk === "Critical"
                                ? "critical"
                                : item.risk === "High Risk"
                                ? "high"
                                : "normal"
                            }`}
                          >

                            {item.section === "alerts" ? (

                              <ShieldAlert size={17} />

                            ) : item.section === "interventions" ? (

                              <ClipboardCheck size={17} />

                            ) : (

                              <Users size={17} />

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
                onClick={toggleNotifications}
                aria-label={`Open notifications. ${data.new_alerts_today} new today`}
                aria-expanded={notificationsOpen}
                aria-haspopup="dialog"
              >

                <Bell size={20} />

                {data.new_alerts_today > 0 && (

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
                        setNotificationsOpen(false)
                      }
                      aria-label="Close notifications"
                    >

                      <X size={17} />

                    </button>

                  </div>


                  <div className="notification-list">


                    {/* CRITICAL */}

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

                        <ShieldAlert size={17} />

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


                    {/* HIGH RISK */}

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

                        <CircleAlert size={17} />

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


                    {/* FOLLOW UP */}

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

                        <CalendarDays size={17} />

                      </div>

                      <div>

                        <strong>
                          Follow-up overdue
                        </strong>

                        <p>
                          {data.overdue_followups} follow-ups
                          require attention.
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
                      handleNavigation("alerts")
                    }
                  >

                    View all alerts

                    <ChevronRight size={16} />

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
                onClick={toggleProfile}
                aria-label="Open counsellor profile menu"
                aria-expanded={profileOpen}
                aria-haspopup="menu"
              >

                <div className="profile-avatar">

                   <UserRound size={20} />

                  

                </div>


                <div className="profile-main-info">

                  <strong>
                    Counsellor
                  </strong>

                  <small>
                    {data.state} 
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


              {/* PROFILE DROPDOWN */}

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
                        Counsellor
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
                        Assigned State                      </span>

                      <strong>
                        {data.state}
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
                        {data.total_registered_victims}
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
                      State data updated
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
                      setProfileOpen(false)
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
                      setProfileOpen(false)
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
                    onClick={handleLogout}
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

        {activeSection === "dashboard" && (

          <div className="dashboard-content">

            <section className="dashboard-heading">

              <div>

                <p className="eyebrow">
                  State WELFARE MONITORING
                </p>

                <h1>
                  Hello, {counsellorName}
                </h1>

                <p>
                  Here's the latest overview of
                  victim wellbeing, cases and
                  welfare interventions.
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
                value={data.total_registered_victims}
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
                value={data.total_interventions}
                subtitle={`${data.pending_interventions} pending`}
                type="yellow"
              />

              <SummaryCard
                icon={<TrendingUp />}
                title="Stable Wellbeing"
                value={data.stable_wellbeing}
                subtitle={`${data.improving_wellbeing} improving`}
                type="olive"
              />

            </section>


            {/* MAIN ANALYTICS GRID */}

            <section className="analytics-grid">


              {/* WELLBEING */}

              <div className="dashboard-card wellbeing-trend">

                <div className="card-title-row">

                  <div>

                    <h3>
                      Mental Well-being Overview
                    </h3>

                    <p>
                      State-level wellbeing
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
                    value={data.average_distress_score}
                  />

                  <Metric
                    label="Mood"
                    value={data.average_mood_score}
                  />

                  <Metric
                    label="Stress"
                    value={data.average_stress_score}
                  />

                  <Metric
                    label="Anxiety"
                    value={data.average_anxiety_score}
                  />

                  <Metric
                    label="Sleep"
                    value={data.average_sleep_score}
                  />

                </div>


                <div className="wellbeing-status">

                  <StatusItem
                    label="Improving"
                    value={data.improving_wellbeing}
                    type="improving"
                  />

                  <StatusItem
                    label="Stable"
                    value={data.stable_wellbeing}
                    type="stable"
                  />

                  <StatusItem
                    label="Declining"
                    value={data.declining_wellbeing}
                    type="declining"
                  />

                </div>

              </div>


              {/* RISK DISTRIBUTION */}

              <div className="dashboard-card risk-card">

                <div className="card-title-row">

                  <div>

                    <h3>
                      Risk Distribution
                    </h3>

                    <p>
                      Current State-level
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
                                (data.high_risk_victims /
                                  riskTotal) *
                                100
                              }%,
                              #E58A4E ${
                                (data.high_risk_victims /
                                  riskTotal) *
                                100
                              }% ${
                                ((data.high_risk_victims +
                                  data.moderate_risk_victims) /
                                  riskTotal) *
                                100
                              }%,
                              #A8B86B ${
                                ((data.high_risk_victims +
                                  data.moderate_risk_victims) /
                                  riskTotal) *
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
                      value={data.high_risk_victims}
                      type="high"
                    />

                    <RiskLegend
                      label="Moderate Risk"
                      value={data.moderate_risk_victims}
                      type="moderate"
                    />

                    <RiskLegend
                      label="Low Risk"
                      value={data.low_risk_victims}
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
                State OVERVIEW — INDIA MAP
            ================================================= */}

            <section className="dashboard-card state-map-card">

              <div className="card-title-row">

                <div>

                  <h3>
                    State Overview
                  </h3>

                  <p>
                    India-wide risk context with
                    the selected State highlighted
                  </p>

                </div>


                <div className="state-map-badge">

                  <MapPin size={14} />

                   {data.state}

                </div>

              </div>


              <div className="state-map-content">


                {/* =================================================
                    INDIA MAP
                ================================================= */}

                <div className="india-map-wrapper">

                  <ComposableMap
                    projection="geoMercator"
                    projectionConfig={{
                      center: [82.5, 24.5],
                      scale: 760,
                    }}
                    width={620}
                    height={420}
                    className="india-risk-map"
                    aria-label="India state map showing West Bengal"
                  >

                    <Geographies
                      geography={INDIA_STATES_GEO_URL}
                    >

                      {({ geographies }) =>
                        geographies.map((geo) => {

                          const stateId =
                            geo.properties?.ST_ID || "";

                          const stateName =
                            geo.properties?.ST_NM || "";

                          /*
                           * IMPORTANT:
                           * This is a NATIONAL-LEVEL state map.
                           
                           *
                           * West Bengal is highlighted as the
                           * COMPLETE STATE using its state ID/name.
                           */

                          const isWestBengal =
                            stateId === "IN-WB" ||
                            stateName
                              .trim()
                              .toLowerCase() ===
                              "west bengal";

                          return (

                            <Geography
                              key={geo.rsmKey}
                              geography={geo}

                              className={
                                isWestBengal
                                  ? "india-state west-bengal-state"
                                  : "india-state"
                              }

                              style={{
                                default: {
                                  fill: isWestBengal
                                    ? "#7A2638"
                                    : "#E8C9CF",
                                  stroke: "#FAF7EF",
                                  strokeWidth: 0.9,
                                  outline: "none",
                                },

                                hover: {
                                  fill: isWestBengal
                                    ? "#7A2638"
                                    : "#E8C9CF",
                                  stroke: "#FAF7EF",
                                  strokeWidth: 0.9,
                                  outline: "none",
                                },

                                pressed: {
                                  fill: isWestBengal
                                    ? "#7A2638"
                                    : "#E8C9CF",
                                  stroke: "#FAF7EF",
                                  strokeWidth: 0.9,
                                  outline: "none",
                                },
                              }}

                              tabIndex={-1}
                            />

                          );

                        })
                      }

                    </Geographies>

                  </ComposableMap>

                </div>


                {/* =================================================
                    State RISK LEGEND
                ================================================= */}

                <div className="state-map-risk-legend">

                  <div className="state-map-risk-title">
                    State Risk Profile
                  </div>


                  <div className="state-map-risk-item">

                    <span className="state-map-risk-dot high-risk-dot" />

                    <span>
                      High Risk
                    </span>

                    <strong>
                      {data.high_risk_victims}
                    </strong>

                  </div>


                  <div className="state-map-risk-item">

                    <span className="state-map-risk-dot moderate-risk-dot" />

                    <span>
                      Moderate Risk
                    </span>

                    <strong>
                      {data.moderate_risk_victims}
                    </strong>

                  </div>


                  <div className="state-map-risk-item">

                    <span className="state-map-risk-dot low-risk-dot" />

                    <span>
                      Low Risk
                    </span>

                    <strong>
                      {data.low_risk_victims}
                    </strong>

                  </div>


                  <div className="state-map-risk-item">

                    <span className="state-map-risk-dot stable-risk-dot" />

                    <span>
                      Stable
                    </span>

                    <strong>
                      {data.stable_wellbeing}
                    </strong>

                  </div>


                  <div className="map-selected-state">

                    <span>
                      Selected State
                    </span>

                    <strong>
                      {data.state}
                    </strong>

                    <small>
                      {data.state}
                    </small>

                  </div>


                  <div className="map-total-victims">

                    <span>
                      Registered victims
                    </span>

                    <strong>
                      {data.total_registered_victims}
                    </strong>

                  </div>

                </div>

              </div>

            </section>


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
                      handleNavigation("alerts")
                    }
                  >

                    View all

                    <ChevronRight size={15} />

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

                  <MessageCircle size={20} />

                </div>


                <div className="counselling-progress">

                  <div className="progress-label">

                    <span>
                      Completed
                    </span>

                    <strong>
                      {data.counselling_completed}/
                      {data.counselling_required}
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
                              ) * 100
                            : 0
                        }%`,
                      }}
                    />

                  </div>

                </div>


                <div className="counselling-stats">

                  <div>

                    <strong>
                      {data.pending_counselling}
                    </strong>

                    <span>
                      Pending
                    </span>

                  </div>


                  <div>

                    <strong>
                      {data.pending_followups}
                    </strong>

                    <span>
                      Follow-ups
                    </span>

                  </div>


                  <div className="danger-stat">

                    <strong>
                      {data.overdue_followups}
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
                    handleNavigation("interventions")
                  }
                >

                  Manage Counselling

                  <ChevronRight size={17} />

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
                    the                   </p>

                </div>

                <FileText size={20} />

              </div>


              <div className="support-grid">

                <SupportItem
                  label="Legal Aid"
                  value={data.legal_aid_required}
                />

                <SupportItem
                  label="Medical Support"
                  value={data.medical_support_required}
                />

                <SupportItem
                  label="Relocation"
                  value={data.relocation_required}
                />

                <SupportItem
                  label="Protection"
                  value={data.protection_required}
                />

                <SupportItem
                  label="High Threat"
                  value={data.high_threat_cases}
                  danger
                />

              </div>

            </section>

          </div>

        )}


        {/* =====================================================
            VICTIMS & CASES
        ===================================================== */}

        {activeSection === "cases" && (

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
                  their case status across the
                  state.
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
                value={data.total_registered_victims}
                subtitle={`${data.new_registrations} new registrations`}
                type="green"
              />

              <SummaryCard
                icon={<HeartPulse />}
                title="Active Cases"
                value={data.active_victims}
                subtitle="Currently active"
                type="olive"
              />

              <SummaryCard
                icon={<ClipboardCheck />}
                title="Closed Cases"
                value={data.closed_cases}
                subtitle={`${data.resolved_cases} recently resolved`}
                type="yellow"
              />

              <SummaryCard
                icon={<TrendingUp />}
                title="New Registrations"
                value={data.new_registrations}
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
                      status
                    </p>

                  </div>

                </div>


                <div className="wellbeing-metrics">

                  <Metric
                    label="Resolved Cases"
                    value={data.resolved_cases}
                  />

                  <Metric
                    label="Delayed Cases"
                    value={data.delayed_cases}
                  />

                  <Metric
                    label="Upcoming Hearings"
                    value={data.upcoming_hearings}
                  />

                  <Metric
                    label="High Threat Cases"
                    value={data.high_threat_cases}
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
                      State-level case activity
                    </p>

                  </div>

                </div>


                <div className="wellbeing-metrics">

                  <Metric
                    label="Average Case Delay"
                    value={data.average_case_delay_days}
                  />

                  <Metric
                    label="Pending Follow-ups"
                    value={data.pending_followups}
                  />

                  <Metric
                    label="Overdue Follow-ups"
                    value={data.overdue_followups}
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
                    across active cases
                  </p>

                </div>

                <ShieldAlert size={20} />

              </div>


              <div className="support-grid">

                <SupportItem
                  label="Legal Aid"
                  value={data.legal_aid_required}
                />

                <SupportItem
                  label="Medical Support"
                  value={data.medical_support_required}
                />

                <SupportItem
                  label="Relocation"
                  value={data.relocation_required}
                />

                <SupportItem
                  label="Protection"
                  value={data.protection_required}
                />

                <SupportItem
                  label="High Threat"
                  value={data.high_threat_cases}
                  danger
                />

              </div>

            </section>

          </div>

        )}


        {/* =====================================================
            RISK ALERTS
        ===================================================== */}

        {activeSection === "alerts" && (

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
                  counsellor attention.
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
                value={data.total_alerts}
                subtitle={`${data.new_alerts_this_week} this week`}
                type="green"
              />

              <SummaryCard
                icon={<CircleAlert />}
                title="Critical Alerts"
                value={data.critical_alerts}
                subtitle={`${data.new_alerts_today} new today`}
                type="sunset"
              />

              <SummaryCard
                icon={<ShieldAlert />}
                title="High-Risk Alerts"
                value={data.high_risk_alerts}
                subtitle="Require attention"
                type="yellow"
              />

              <SummaryCard
                icon={<ClipboardCheck />}
                title="Resolved Alerts"
                value={data.resolved_alerts}
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
                      Current state-level
                      alert distribution
                    </p>

                  </div>

                </div>


                <div className="wellbeing-metrics">

                  <Metric
                    label="Unresolved Alerts"
                    value={data.unresolved_alerts}
                  />

                  <Metric
                    label="Resolved Alerts"
                    value={data.resolved_alerts}
                  />

                  <Metric
                    label="Critical Alerts"
                    value={data.critical_alerts}
                  />

                  <Metric
                    label="High-Risk Alerts"
                    value={data.high_risk_alerts}
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
                      Latest alert activity in
                      the state
                    </p>

                  </div>

                  <Bell size={20} />

                </div>


                <div className="metric-list">

                  <Metric
                    label="New Alerts Today"
                    value={data.new_alerts_today}
                  />

                  <Metric
                    label="New Alerts This Week"
                    value={data.new_alerts_this_week}
                  />

                  <Metric
                    label="Unresolved"
                    value={data.unresolved_alerts}
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
                  {data.unresolved_alerts} unresolved
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
                    unresolved alerts
                  </p>

                </div>

                <ShieldAlert size={20} />

              </div>


              <div className="support-grid">

                <SupportItem
                  label="Critical"
                  value={data.critical_alerts}
                  danger
                />

                <SupportItem
                  label="High Risk"
                  value={data.high_risk_alerts}
                />

                <SupportItem
                  label="Unresolved"
                  value={data.unresolved_alerts}
                />

                <SupportItem
                  label="Resolved"
                  value={data.resolved_alerts}
                />

                <SupportItem
                  label="New Today"
                  value={data.new_alerts_today}
                />

              </div>

            </section>

          </div>

        )}


        {/* =====================================================
            INTERVENTIONS
        ===================================================== */}

        {activeSection === "interventions" && (

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
                  activities across the state.
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
                value={data.total_interventions}
                subtitle="All state interventions"
                type="green"
              />

              <SummaryCard
                icon={<CircleAlert />}
                title="Pending Interventions"
                value={data.pending_interventions}
                subtitle="Require follow-up"
                type="sunset"
              />

              <SummaryCard
                icon={<ClipboardCheck />}
                title="Completed"
                value={data.completed_interventions}
                subtitle="Successfully completed"
                type="yellow"
              />

              <SummaryCard
                icon={<HeartPulse />}
                title="Counselling Required"
                value={data.counselling_required}
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
                      State counselling activity
                    </p>

                  </div>

                  <MessageCircle size={20} />

                </div>


                <div className="wellbeing-metrics">

                  <Metric
                    label="Counselling Required"
                    value={data.counselling_required}
                  />

                  <Metric
                    label="Counselling Completed"
                    value={data.counselling_completed}
                  />

                  <Metric
                    label="Pending Counselling"
                    value={data.pending_counselling}
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

                  <CalendarDays size={20} />

                </div>


                <div className="wellbeing-metrics">

                  <Metric
                    label="Pending Follow-ups"
                    value={data.pending_followups}
                  />

                  <Metric
                    label="Overdue Follow-ups"
                    value={data.overdue_followups}
                  />

                  <Metric
                    label="Completed Interventions"
                    value={data.completed_interventions}
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
                    across registered cases
                  </p>

                </div>

                <HeartPulse size={20} />

              </div>


              <div className="support-grid">

                <SupportItem
                  label="Legal Aid"
                  value={data.legal_aid_required}
                />

                <SupportItem
                  label="Medical Support"
                  value={data.medical_support_required}
                />

                <SupportItem
                  label="Relocation"
                  value={data.relocation_required}
                />

                <SupportItem
                  label="Protection"
                  value={data.protection_required}
                  danger
                />

                <SupportItem
                  label="High Threat"
                  value={data.high_threat_cases}
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
                    Overall State intervention
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
                    {data.completed_interventions}
                    {" / "}
                    {data.total_interventions}
                  </strong>

                </div>


                <div className="progress-track">

                  <div
                    className="progress-fill"
                    style={{
                      width: `${
                        data.total_interventions > 0
                          ? Math.round(
                              (data.completed_interventions /
                                data.total_interventions) *
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

        {activeSection === "reports" && (

          <div className="dashboard-content">

            <section className="dashboard-heading">

              <div>

                <p className="eyebrow">
                  STATE ANALYTICS
                </p>

                <h1>
                  Reports & Analytics
                </h1>

                <p>
                  Review state-level wellbeing,
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
                value={data.total_registered_victims}
                subtitle={`${data.active_victims} active cases`}
                type="green"
              />

              <SummaryCard
                icon={<ShieldAlert />}
                title="High-Risk Cases"
                value={data.high_risk_victims}
                subtitle={`${data.crisis_cases} crisis cases`}
                type="sunset"
              />

              <SummaryCard
                icon={<HeartPulse />}
                title="Average Distress"
                value={data.average_distress_score}
                subtitle="State average"
                type="yellow"
              />

              <SummaryCard
                icon={<ClipboardCheck />}
                title="Interventions"
                value={data.total_interventions}
                subtitle={`${data.completed_interventions} completed`}
                type="olive"
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
                      Average state-level
                      mental wellbeing scores
                    </p>

                  </div>

                  <HeartPulse size={20} />

                </div>


                <div className="wellbeing-metrics">

                  <Metric
                    label="Distress"
                    value={data.average_distress_score}
                  />

                  <Metric
                    label="Mood"
                    value={data.average_mood_score}
                  />

                  <Metric
                    label="Stress"
                    value={data.average_stress_score}
                  />

                  <Metric
                    label="Anxiety"
                    value={data.average_anxiety_score}
                  />

                  <Metric
                    label="Sleep"
                    value={data.average_sleep_score}
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
                      Current state case activity
                    </p>

                  </div>

                  <FileText size={20} />

                </div>


                <div className="wellbeing-metrics">

                  <Metric
                    label="Resolved Cases"
                    value={data.resolved_cases}
                  />

                  <Metric
                    label="Delayed Cases"
                    value={data.delayed_cases}
                  />

                  <Metric
                    label="Upcoming Hearings"
                    value={data.upcoming_hearings}
                  />

                  <Metric
                    label="High Threat Cases"
                    value={data.high_threat_cases}
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
                    state cases by risk level
                  </p>

                </div>

                <ShieldAlert size={20} />

              </div>


              <div className="support-grid">

                <SupportItem
                  label="High Risk"
                  value={data.high_risk_victims}
                  danger
                />

                <SupportItem
                  label="Moderate Risk"
                  value={data.moderate_risk_victims}
                />

                <SupportItem
                  label="Low Risk"
                  value={data.low_risk_victims}
                />

                <SupportItem
                  label="Crisis Cases"
                  value={data.crisis_cases}
                  danger
                />

                <SupportItem
                  label="Total Cases"
                  value={riskTotal}
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
                      Current state wellbeing
                      movement
                    </p>

                  </div>

                  <TrendingUp size={20} />

                </div>


                <div className="support-grid">

                  <SupportItem
                    label="Improving"
                    value={data.improving_wellbeing}
                  />

                  <SupportItem
                    label="Stable"
                    value={data.stable_wellbeing}
                  />

                  <SupportItem
                    label="Declining"
                    value={data.declining_wellbeing}
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
                      State welfare
                      intervention status
                    </p>

                  </div>

                  <ClipboardCheck size={20} />

                </div>


                <div className="support-grid">

                  <SupportItem
                    label="Total"
                    value={data.total_interventions}
                  />

                  <SupportItem
                    label="Completed"
                    value={data.completed_interventions}
                  />

                  <SupportItem
                    label="Pending"
                    value={data.pending_interventions}
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

                <MessageCircle size={20} />

              </div>


              <div className="support-grid">

                <SupportItem
                  label="Required"
                  value={data.counselling_required}
                />

                <SupportItem
                  label="Completed"
                  value={data.counselling_completed}
                />

                <SupportItem
                  label="Pending"
                  value={data.pending_counselling}
                  danger
                />

                <SupportItem
                  label="Follow-ups"
                  value={data.pending_followups}
                />

                <SupportItem
                  label="Overdue"
                  value={data.overdue_followups}
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
                    State risk-alert activity
                  </p>

                </div>

                <Bell size={20} />

              </div>


              <div className="support-grid">

                <SupportItem
                  label="Total Alerts"
                  value={data.total_alerts}
                />

                <SupportItem
                  label="Critical"
                  value={data.critical_alerts}
                  danger
                />

                <SupportItem
                  label="High Risk"
                  value={data.high_risk_alerts}
                />

                <SupportItem
                  label="Unresolved"
                  value={data.unresolved_alerts}
                  danger
                />

                <SupportItem
                  label="Resolved"
                  value={data.resolved_alerts}
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
          critical ? "critical" : ""
        }`}
      >

        <ShieldAlert size={17} />

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

      <ChevronRight size={17} />

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
        danger ? "danger" : ""
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