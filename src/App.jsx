import VoiceSupport from "./pages/VoiceSupport";
import AIChat from "./pages/AIChat";
import welcomeScene from "./assets/welcome_scenario.jpg";
import nirbhaymindLogo from "./assets/nirbhaymind_logo.jpeg";
import { useState } from "react";
import MoodCheck from "./pages/MoodCheck";
import History from "./pages/History";
import MyCase from "./pages/MyCase";
import Alerts from "./pages/Alerts";
import Resources from "./pages/Resources";
import Profile from "./pages/Profile";
import SMS from "./pages/SMS";

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
} from "lucide-react";

import "./App.css";

function App() {
  const [currentPage, setCurrentPage] = useState("home");

  /* =========================================
     LOAD CHECK-INS
  ========================================= */

  const [checkIns, setCheckIns] = useState(() => {
    const savedCheckIns = localStorage.getItem("nirbhaymind_checkins");

    try {
      return savedCheckIns ? JSON.parse(savedCheckIns) : [];
    } catch {
      return [];
    }
  });

  /* =========================================
     LOAD LATEST SCORE
  ========================================= */

  const [wellbeingScore, setWellbeingScore] = useState(() => {
    const savedCheckIns = localStorage.getItem("nirbhaymind_checkins");

    try {
      if (savedCheckIns) {
        const parsedCheckIns = JSON.parse(savedCheckIns);

        if (parsedCheckIns.length > 0) {
          return parsedCheckIns[parsedCheckIns.length - 1].score;
        }
      }
    } catch {
      return 72;
    }

    return 72;
  });

  /* =========================================
     LOAD LATEST RISK
  ========================================= */

  const [riskLevel, setRiskLevel] = useState(() => {
    const savedCheckIns = localStorage.getItem("nirbhaymind_checkins");

    try {
      if (savedCheckIns) {
        const parsedCheckIns = JSON.parse(savedCheckIns);

        if (parsedCheckIns.length > 0) {
          return parsedCheckIns[parsedCheckIns.length - 1].risk;
        }
      }
    } catch {
      return "Low";
    }

    return "Low";
  });

  /* =========================================
     MOOD CHECK PAGE
  ========================================= */

  if (currentPage === "mood") {
    return (
      <MoodCheck
        onBack={() => setCurrentPage("home")}
        onComplete={(result) => {
          setWellbeingScore(result.score);
          setRiskLevel(result.risk);

          const newCheckIn = {
            id: Date.now(),
            score: result.score,
            risk: result.risk,
            message: result.message,

            date: new Date().toLocaleDateString("en-IN"),

            time: new Date().toLocaleTimeString("en-IN", {
              hour: "2-digit",
              minute: "2-digit",
            }),
          };

          setCheckIns((previous) => {
            const updated = [...previous, newCheckIn];

            localStorage.setItem(
              "nirbhaymind_checkins",
              JSON.stringify(updated)
            );

            return updated;
          });
        }}
      />
    );
  }

  /* =========================================
     HISTORY PAGE
  ========================================= */

  if (currentPage === "history") {
    return (
      <History
        checkIns={checkIns}
        onBack={() => setCurrentPage("home")}
      />
    );
  }
  if (currentPage === "ai-chat") {
  return (
    <AIChat
      onBack={() => setCurrentPage("home")}
    />
  );
}
  if (currentPage === "voice-support") {
  return (
    <VoiceSupport
      onBack={() => setCurrentPage("home")}
    />
  );
}
 if (currentPage === "my-case") {
  return (
    <MyCase
      onBack={() => setCurrentPage("home")}
    />
  );
}
if (currentPage === "alerts") {
  return (
    <Alerts
      onBack={() => setCurrentPage("home")}
    />
  );
}
if (currentPage === "resources") {
  return (
    <Resources
      onBack={() => setCurrentPage("home")}
    />
  );
}
if (currentPage === "profile") {
  return (
    <Profile
      onBack={() => setCurrentPage("home")}
    />
  );
}
if (currentPage === "sms") {
  return (
    <SMS
      onBack={() => setCurrentPage("home")}
    />
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
            score: 72,
            date: "Today",
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
              Your Voice. Your Well-being. Our Priority.
            </p>

          </div>

        </div>

        <div className="header-actions">

          <button className="notification-button">

            <Bell size={22} />

            <span className="notification-dot"></span>

          </button>

          <button className="language-button">

            <Globe size={20} />

            <span>EN</span>

            <ChevronDown size={17} />

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

            <h2>
              Hello, Ankita 👋
            </h2>

            <p>
              You are not alone. We are here for you.
            </p>

          </div>

        </div>

        <div className="quote">

          “Your strength
          <br />
          matters.” 🌿

        </div>

      </section>


      {/* =====================================
          WELL-BEING
      ===================================== */}

      <section className="wellbeing-card">

        <div className="wellbeing-left">

          <div className="section-title">

            <h3>
              Your Well-being Score
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

                Your current well-being
                <br />

                status is{" "}

                {riskLevel.toLowerCase()}.

              </p>

              <button className="soft-button">

                View Trend

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
              Next Check-in
            </span>

          </div>

          <h3>
            In 2 days
          </h3>

          <p>
            23 Sep 2026 · 10:00 AM
          </p>

          <button className="schedule-button">
            View Schedule
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
          title="Chat with AI"
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
          title="Voice Call (IVRS)"
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
          title="Mood Check"
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
          title="My Case"
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
          title="Alerts & Notifications"
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
          title="Resources & Help"
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
          title="Profile & Settings"
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
                Risk Level: {riskLevel}
              </strong>

              <p>

                {riskLevel === "High"
                  ? "Your distress level may need attention."
                  : riskLevel === "Moderate"
                  ? "Your distress level is showing some changes."
                  : "Your distress level is currently stable."}

              </p>

              <span>
                Keep going!
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
                Need Support Now?
              </h3>

              <p>
                You can reach out to a counsellor
              </p>

            </div>

          </div>


          <button className="counsellor-button">

            <Phone size={21} />

            Talk to Counsellor

            <ArrowRight size={18} />

          </button>


          <p className="quick-title">
            Quick Actions
          </p>


          <div className="support-actions">

            <button>

              <ShieldCheck size={21} />

              <span>

                Report
                <br />
                Threat

              </span>

            </button>


            <button>

              <MapPin size={21} />

              <span>

                Request
                <br />
                Relocation

              </span>

            </button>


            <button>

              <FileText size={21} />

              <span>

                Legal Aid
                <br />
                Support

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