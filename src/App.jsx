import SplashScreen from "./pages/SplashScreen";
import VoiceSupport from "./pages/VoiceSupport";
import AIChat from "./pages/AIChat";
import welcomeScene from "./assets/welcome_scenario.jpg";
import nirbhaymindLogo from "./assets/nirbhaymind_logo.jpeg";
import { useEffect, useState } from "react";
import MoodCheck from "./pages/MoodCheck";
import History from "./pages/History";
import MyCase from "./pages/MyCase";
import Alerts from "./pages/Alerts";
import Resources from "./pages/Resources";
import Profile from "./pages/Profile";
import SMS from "./pages/SMS";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import { createCheckin, getDashboard } from "./api";
import { login } from "./api";


import {
  Bell,
  Globe,
  ChevronDown,
  ChevronRight,
  Info,
  CalendarDays,
  MessageCircle,
  Phone,
  MessageSquare,
  Brain,
  Users,
  FileWarning,
  BookOpen,
  User,
  Clock3,
  Heart,
  ShieldCheck,
  MapPin,
  FileText,
  TrendingUp,
  MoreHorizontal,
  ArrowRight,
  LogOut,
} from "lucide-react";

import "./App.css";
import { LANGUAGE_LABELS, LANGUAGES, useI18n } from "./i18n";
import { sortCheckIns } from "./checkinUtils";

function App() {
  const [showSplash, setShowSplash] = useState(true);
  console.log("SPLASH TEST");
  const { t, language, setLanguage } = useI18n();
  const [authenticatedVictimId, setAuthenticatedVictimId] = useState(null);
  const [authPage, setAuthPage] = useState("landing");
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");
  const [currentPage, setCurrentPage] = useState("home");
  const [dashboard, setDashboard] = useState(null);
  const [loadError, setLoadError] = useState("");
  const [languageMenuOpen, setLanguageMenuOpen] = useState(false);
  const changeLanguage = (nextLanguage) => {
    setLanguage(nextLanguage);
  };
  


  useEffect(() => {
    if (!authenticatedVictimId) return;
    getDashboard(authenticatedVictimId)
      .then((data) => {
        setDashboard(data);
        if (!localStorage.getItem("nirbhaymind_language")) {
          setLanguage(data.profile.language || "English");
        }
      })
      .catch((error) => setLoadError(error.message));
  }, [authenticatedVictimId, setLanguage]);

  const handleLogin = async (victimId, caseId) => {
    setAuthLoading(true);
    setAuthError("");
    try {
      const result = await login(victimId, caseId);
      setAuthenticatedVictimId(result.victimId);
      setAuthPage("landing");
    } catch (error) {
      setAuthError(error.message);
    } finally {
      setAuthLoading(false);
    }
  };

  const handleLogout = () => {
    if (!window.confirm(t("Are you sure you want to log out?"))) return;
    setAuthenticatedVictimId(null);
    setDashboard(null);
    setCurrentPage("home");
  };
  if (showSplash) {
    return (
      <SplashScreen
        onComplete={() => setShowSplash(false)}
      />
    );
  }
  if (!authenticatedVictimId) {
    if (authPage === "login") {
      return (
        <Login
          onBack={() => {
            setAuthError("");
            setAuthPage("landing");
          }}
          onLogin={handleLogin}
          loading={authLoading}
          error={authError}
        />
      );
    }
    return <Landing onLogin={() => setAuthPage("login")} />;
  }

  if (loadError) {
    return <main className="app"><p role="alert">Unable to load your data: {loadError}</p></main>;
  }

  if (!dashboard) {
    return <main className="app"><p>{t("Loading your secure dashboard...")}</p></main>;
  }

  const checkIns = sortCheckIns(dashboard.checkins);
  const latestCheckin = checkIns.at(-1);
  const wellbeingScore = latestCheckin?.score ?? "--";
  const riskLevel = latestCheckin?.risk ?? "Unknown";

  /* =========================================
     MOOD CHECK PAGE
  ========================================= */

  if (currentPage === "mood") {
    return (
      <>
      <SessionControls onLogout={handleLogout} />
      <MoodCheck
        onBack={() => setCurrentPage("home")}
        onComplete={async (result) => {
          const savedCheckin = await createCheckin(authenticatedVictimId, result.answers);
          setDashboard((previous) => ({
            ...previous,
            checkins: [...previous.checkins, savedCheckin],
            latestCheckin: savedCheckin
          }));
        }}
      />
      </>
    );
  }

  /* =========================================
     HISTORY PAGE
  ========================================= */

  if (currentPage === "history") {
    return (
      <>
      <SessionControls onLogout={handleLogout} />
      <History
        checkIns={checkIns}
        onBack={() => setCurrentPage("home")}
      />
      </>
    );
  }
  if (currentPage === "ai-chat") {
  return (
    <>
    <SessionControls onLogout={handleLogout} />
    <AIChat
      onBack={() => setCurrentPage("home")}
    />
    </>
  );
}
  if (currentPage === "voice-support") {
  return (
    <>
    <SessionControls onLogout={handleLogout} />
    <VoiceSupport
      language={language}
      onLanguageChange={changeLanguage}
      onBack={() => setCurrentPage("home")}
    />
    </>
  );
}
 if (currentPage === "my-case") {
  return (
  <>
  <SessionControls onLogout={handleLogout} />
  <MyCase
      caseData={dashboard.case}
      onSupport={() => setCurrentPage("resources")}
      onBack={() => setCurrentPage("home")}
    />
    </>
  );
}
if (currentPage === "alerts") {
  return (
    <>
    <SessionControls onLogout={handleLogout} />
    <Alerts
      alerts={dashboard.alerts}
      onBack={() => setCurrentPage("home")}
    />
    </>
  );
}
if (currentPage === "resources") {
  return (
    <>
    <SessionControls onLogout={handleLogout} />
    <Resources
      onNavigate={setCurrentPage}
      onBack={() => setCurrentPage("home")}
    />
    </>
  );
}
if (currentPage === "profile") {
  return (
    <>
    <SessionControls onLogout={handleLogout} />
    <Profile
      profile={dashboard.profile}
      language={language}
      onLanguageChange={changeLanguage}
      onNavigate={setCurrentPage}
      onLogout={() => {
        setAuthenticatedVictimId(null);
        setDashboard(null);
        setCurrentPage("home");
      }}
      onBack={() => setCurrentPage("home")}
    />
    </>
  );
}
if (currentPage === "sms") {
  return (
    <>
    <SessionControls onLogout={handleLogout} />
    <SMS
      onBack={() => setCurrentPage("home")}
    />
    </>
  );
}
 
  /* =========================================
     DYNAMIC TREND DATA
  ========================================= */

  const trendData =
    checkIns.length > 0
      ? checkIns.slice(-7)
      : [
          {
            score: wellbeingScore === "--" ? 0 : wellbeingScore,
            date: "Latest",
          },
        ];

  /* =========================================
     HOME PAGE
  ========================================= */

  return (
    <div className="app">

      {/* =====================================
          HEADER
      ===================================== */}

      <header className="header">

        <div className="brand-section">

          <div className="logo-circle">
            <img
              src={nirbhaymindLogo}
              alt="NirbhayMind"
              className="logo-image"
            />
          </div>

          <div className="brand-text">

            <h1 
             style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "42px",
              fontWeight: 700,
              color: "#5d2632",
             }}
             >
                NirbhayMind
              </h1>

            <p>
              {t("for all the battles you've won that nobody knows about...")}
            </p>

          </div>

        </div>

        <div className="header-actions">

          <button className="notification-button" onClick={() => setCurrentPage("alerts")} aria-label={t("Open alerts")}>

            <Bell size={22} />

            <span className="notification-dot"></span>

          </button>

          <div className="language-picker">
          <button className="language-button" onClick={() => setLanguageMenuOpen((open) => !open)} aria-label={t("Change language")}>

            <Globe size={20} />

            <span>{language === "English" ? "EN" : language}</span>

            <ChevronDown size={17} />

          </button>
          {languageMenuOpen && (
            <div className="language-menu">
              {LANGUAGES.map((item) => (
                <button
                  type="button"
                  key={item}
                  className={language === item ? "selected" : ""}
                  onClick={() => {
                    changeLanguage(item);
                    setLanguageMenuOpen(false);
                  }}
                >
                  {LANGUAGE_LABELS[item]}
                </button>
              ))}
            </div>
          )}
          </div>
          <button className="header-logout-button" onClick={handleLogout}>
            {t("Log Out")}
          </button>

        </div>

      </header>


      {/* =====================================
          WELCOME
      ===================================== */}

      <section
        className="welcome-section"
        style={{
          backgroundImage: `url(${welcomeScene})`,
        }}
      >

        <div className="welcome-overlay">

          <div className="welcome-content">

            <h2>{t("Hello, {{name}} 👋", { name: dashboard.profile.name })}</h2>

            <p>
              {t("You are not alone. We are here for you.")}
            </p>

          </div>

        </div>

        <div className="quote">

          {t("Your strength")}
          <br />
          {t("matters.")} 🌿

        </div>

      </section>


      {/* =====================================
          WELL-BEING
      ===================================== */}

      <section className="wellbeing-card">

        <div className="wellbeing-left">

          <div className="section-title">

            <h3>
              {t("Your Well-being Score")}
            </h3>

            <Info size={16} />

          </div>

          <div className="score-content">

            <div className="score-circle">

              <div>

                <strong>
                  {wellbeingScore}
                </strong>

                <span>
                  /100
                </span>

              </div>

            </div>

            <div className="score-divider"></div>

            <div className="score-status">

              <div className="stable-badge">

                🌿

                <span>
                  {riskLevel}
                </span>

              </div>

              <p>

                {t("Your current well-being")}
                <br />

                {t("status is")}{" "}

                {riskLevel.toLowerCase()}.

              </p>

              <button className="soft-button" onClick={() => setCurrentPage("history")}>

                {t("View Trend")}

                <ArrowRight size={17} />

              </button>

            </div>

          </div>

        </div>


        {/* NEXT CHECK-IN */}

        <div className="checkin-section">

          <div className="checkin-heading">

            <CalendarDays size={24} />

            <span>
              {t("Next Check-in")}
            </span>

          </div>

          <h3>
            {t("In 2 days")}
          </h3>

          <p>
            {t("Next check-in scheduled from the backend")}
          </p>

          <button className="schedule-button" onClick={() => setCurrentPage("my-case")}>
            {t("View Schedule")}
          </button>

        </div>

      </section>


      {/* =====================================
          FIRST ACTION ROW
      ===================================== */}

      <section className="quick-grid">

        <ActionCard
          icon={<MessageCircle />}
          iconClass="green"
          title={t("Chat with AI")}
          description={
            <>
              Talk anytime, in your
              <br />
              language
            </>
          }
          onClick={() => setCurrentPage("ai-chat")}
        />

        <ActionCard
          icon={<Phone />}
          iconClass="purple"
          title={t("Voice Call (IVRS)")}
          description={
            <>
              Get support via
              <br />
              phone
            </>
          }
         onClick={() => setCurrentPage("voice-support")} 
        />

        <ActionCard
          icon={<MessageSquare />}
          iconClass="orange"
          title="SMS"
          description={
            <>
              Quick check-ins
              <br />
              & updates
            </>
          }
          onClick={() => setCurrentPage("sms")}
        />

        <ActionCard
          icon={<Brain />}
          iconClass="lavender"
          title={t("Mood Check")}
          description={
            <>
              Share how you feel
              <br />
              today
            </>
          }
          onClick={() => setCurrentPage("mood")}
        />

      </section>


      {/* =====================================
          SECOND ACTION ROW
      ===================================== */}

      <section className="feature-grid">

        <ActionCard
          icon={<Users />}
          iconClass="pink"
          title={t("My Case")}
          description={
            <>
              Track your case &
              <br />
              next steps
            </>
          }
           onClick={() => setCurrentPage("my-case")}
        />

        <ActionCard
          icon={<FileWarning />}
          iconClass="yellow"
          title={t("Alerts & Notifications")}
          description={
            <>
              Important updates
              <br />
              for you
            </>
          }
          onClick={() => setCurrentPage("alerts")}
        />

        <ActionCard
          icon={<BookOpen />}
          iconClass="teal"
          title={t("Resources & Help")}
          description={
            <>
              Guides, helplines,
              <br />
              legal aid & more
            </>
          }
          onClick={() => setCurrentPage("resources")}
        />

        <ActionCard
          icon={<User />}
          iconClass="purple"
          title={t("Profile & Settings")}
          description={
            <>
              Manage your details
              <br />
              & preferences
            </>
          }
          onClick={() => setCurrentPage("profile")}
        />

      </section>


      {/* =====================================
          LOWER SECTION
      ===================================== */}

      <section className="lower-grid">


        {/* ===================================
            DISTRESS TREND
        =================================== */}

        <div className="trend-card">

          <div className="card-heading">

            <div className="heading-left">

              <TrendingUp size={22} />

              <h3>
                Your Distress Trend
              </h3>

            </div>

            <button
              onClick={() => setCurrentPage("history")}
            >
              View Details →
            </button>

          </div>


          {/* CHART */}

          <div className="chart">

            <div className="y-axis">

              <span>100</span>
              <span>75</span>
              <span>50</span>
              <span>25</span>
              <span>0</span>

            </div>


            <div className="chart-area">


              {/* GRID */}

              <div className="grid-line line-1"></div>

              <div className="grid-line line-2"></div>

              <div className="grid-line line-3"></div>

              <div className="grid-line line-4"></div>


              {/* DYNAMIC SVG */}

              <svg
                className="trend-line"
                viewBox="0 0 500 130"
                preserveAspectRatio="none"
              >

                {(() => {

                  const width = 480;
                  const height = 100;

                  const startX = 10;

                  const points =
                    trendData.length === 1
                      ? [
                          {
                            x: 250,
                            y:
                              115 -
                              (trendData[0].score / 100) *
                                height,
                          },
                        ]
                      : trendData.map(
                          (item, index) => {

                            const x =
                              startX +
                              (index * width) /
                                (trendData.length - 1);

                            const y =
                              115 -
                              (item.score / 100) *
                                height;

                            return {
                              x,
                              y,
                            };

                          }
                        );


                  const pointString =
                    points
                      .map(
                        (point) =>
                          `${point.x},${point.y}`
                      )
                      .join(" ");


                  return (
                    <>
                      <polyline
                        points={pointString}
                        fill="none"
                        stroke="#e89c3d"
                        strokeWidth="3"
                      />

                      {points.map(
                        (point, index) => (

                          <circle
                            key={index}
                            cx={point.x}
                            cy={point.y}
                            r="5"
                            fill={
                              trendData[index]?.risk ===
                              "High"
                                ? "#d94c57"
                                : "#e89c3d"
                            }
                          />

                        )
                      )}

                    </>
                  );

                })()}

              </svg>


              {/* DYNAMIC DATES */}

              <div className="dates">

                {trendData.map(
                  (item, index) => (

                    <span key={index}>

                      {item.date}

                    </span>

                  )
                )}

              </div>

            </div>

          </div>


          {/* RISK BOX */}

          <div className="risk-box">

            <div className="risk-icon">
              ☺
            </div>

            <div>

              <strong>
                {t("Risk Level")}: {riskLevel}
              </strong>

              <p>

                {riskLevel === "High"
                  ? t("Your distress level may need attention.")
                  : riskLevel === "Moderate"
                  ? t("Your distress level is showing some changes.")
                  : t("Your distress level is currently stable.")}

              </p>

              <span>
                {t("Keep going!")}
              </span>

            </div>

          </div>

        </div>


        {/* ===================================
            SUPPORT
        =================================== */}

        <div className="support-card">

          <div className="support-heading">

            <Heart
              size={27}
              fill="currentColor"
            />

            <div>

              <h3>
                {t("Need Support Now?")}
              </h3>

              <p>
                {t("You can reach out to a counsellor")}
              </p>

            </div>

          </div>


          <button className="counsellor-button" onClick={() => setCurrentPage("voice-support")}>

            <Phone size={21} />

            {t("Talk to Counsellor")}

            <ArrowRight size={18} />

          </button>


          <p className="quick-title">
            {t("Quick Actions")}
          </p>


          <div className="support-actions">

            <button onClick={() => setCurrentPage("resources")}>

              <ShieldCheck size={21} />

              <span>

                {t("Report")}
                <br />
                {t("Threat")}

              </span>

            </button>


            <button onClick={() => setCurrentPage("my-case")}>

              <MapPin size={21} />

              <span>

                {t("Request")}
                <br />
                {t("Relocation")}

              </span>

            </button>


            <button onClick={() => setCurrentPage("my-case")}>

              <FileText size={21} />

              <span>

                {t("Legal Aid")}
                <br />
                {t("Support")}

              </span>

            </button>

          </div>

        </div>

      </section>


      {/* =====================================
          BOTTOM NAV
      ===================================== */}

      <nav className="bottom-nav">

        <NavItem
          icon={<HomeIcon />}
          label="Home"
          active
          onClick={() => setCurrentPage("home")}
        />


        <NavItem
          icon={<Clock3 />}
          label="History"
          onClick={() => setCurrentPage("history")}
        />


        <NavItem
          icon={<BookOpen />}
          label="Resources"
        />


        <NavItem
          icon={<Bell />}
          label="Alerts"
          notification
        />


        <NavItem
          icon={<MoreHorizontal />}
          label="More"
        />

      </nav>

    </div>
  );
}


/* =========================================
   ACTION CARD
========================================= */

function ActionCard({
  icon,
  iconClass,
  title,
  description,
  onClick,
}) {

  return (
    <button
      className="action-card"
      onClick={onClick}
    >

      <div className={`action-icon ${iconClass}`}>
        {icon}
      </div>


      <div className="action-content">

        <h3>
          {title}
        </h3>

        <p>
          {description}
        </p>

      </div>


      <ChevronRight
        className="action-arrow"
        size={19}
      />

    </button>
  );
}


/* =========================================
   NAV ITEM
========================================= */

function NavItem({
  icon,
  label,
  active,
  notification,
  onClick,
}) {

  return (
    <button
      className={`nav-item ${
        active ? "active" : ""
      }`}
      onClick={onClick}
    >

      <div className="nav-icon">

        {icon}

        {notification && (
          <span className="nav-notification"></span>
        )}

      </div>


      <span>
        {label}
      </span>

    </button>
  );
}

function SessionControls({ onLogout }) {
  const { t } = useI18n();
  return (
    <button className="session-logout-button" onClick={onLogout}>
      <LogOut size={15} />
      {t("Log Out")}
    </button>
  );
}


/* =========================================
   HOME ICON
========================================= */

function HomeIcon() {

  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
    >

      <path d="M3 10.5L12 3l9 7.5V21a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1v-10.5z" />

    </svg>
  );
}


export default App;