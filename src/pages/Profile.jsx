import { useState } from "react";
import { LANGUAGE_LABELS, LANGUAGES, useI18n } from "../i18n";
import {
  ArrowLeft,
  User,
  Globe2,
  Bell,
  ShieldCheck,
  HelpCircle,
  Phone,
  LogOut,
  ChevronRight,
  Moon,
  Lock,
} from "lucide-react";

import nirbhaymindLogo from "../assets/nirbhaymind_logo.jpeg";

function Profile({ onBack, profile, language, onLanguageChange, onNavigate, onLogout }) {
  const { t } = useI18n();
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

  const languages = LANGUAGES;

  const handleLogout = () => {
    const confirmed = window.confirm(
      t("Are you sure you want to log out?")
    );

    if (confirmed) {
      alert(t("You have been logged out."));
      onLogout();
    }
  };

  return (
    <div className={`profile-page ${darkMode ? "dark-mode" : ""}`}>

      {/* =========================
          HEADER
      ========================= */}

      <header className="profile-header">

        <button
          className="profile-back"
          onClick={onBack}
        >
          <ArrowLeft size={21} />
        </button>

        <div className="profile-title">

          <div className="profile-logo">
            <img
              src={nirbhaymindLogo}
              alt="NirbhayMind"
            />
          </div>

          <div>
            <h1>{t("Profile & Settings")}</h1>
            <p>{t("Your account & preferences")}</p>
          </div>

        </div>

      </header>


      {/* =========================
          CONTENT
      ========================= */}

      <main className="profile-content">

        {/* =========================
            PROFILE CARD
        ========================= */}

        <section className="profile-card">

          <div className="profile-avatar">
            <User size={30} />
          </div>

          <div className="profile-user-info">

            <h2>{profile.name}</h2>

            <span className="profile-user-type">
              {t("Registered User")}
            </span>

            <div className="profile-case-info">
              <span>
                {t("Case ID")}
              </span>

              <strong>
                {profile.caseId}
              </strong>
            </div>

          </div>

        </section>


        {/* =========================
            PERSONAL INFORMATION
        ========================= */}

        <section className="profile-section">

          <div className="profile-section-heading">
            <h2>{t("Account Information")}</h2>
            <p>{t("Your registered information")}</p>
          </div>

          <div className="profile-info-card">

            <div className="profile-info-row">
              <span>{t("District")}</span>
              <strong>{profile.district}</strong>
            </div>

            <div className="profile-info-row">
              <span>{t("State")}</span>
              <strong>{profile.state}</strong>
            </div>

            <div className="profile-info-row">
              <span>{t("Gender")}</span>
              <strong>{profile.gender || "--"}</strong>
            </div>

            <div className="profile-info-row">
              <span>{t("Case Status")}</span>

              <strong className="profile-status">
                {profile.caseStatus}
              </strong>
            </div>

          </div>

        </section>


        {/* =========================
            PREFERENCES
        ========================= */}

        <section className="profile-section">

          <div className="profile-section-heading">
            <h2>{t("Preferences")}</h2>
            <p>{t("Customize your NirbhayMind experience")}</p>
          </div>


          {/* LANGUAGE */}

          <div className="profile-setting-card">

            <div className="profile-setting-icon lavender">
              <Globe2 size={20} />
            </div>

            <div className="profile-setting-info">
              <h3>{t("Language")}</h3>
              <p>{LANGUAGE_LABELS[language] || language}</p>
            </div>

            <button
              className="profile-setting-action"
              onClick={() =>
                setShowLanguages(!showLanguages)
              }
            >
              <span>{t("Change")}</span>
              <ChevronRight size={18} />
            </button>

          </div>


          {/* LANGUAGE DROPDOWN */}

          {showLanguages && (
            <div className="profile-language-menu">

              {languages.map((item) => (
                <button
                  key={item}
                  className={
                    language === item
                      ? "profile-language-option active"
                      : "profile-language-option"
                  }
                  onClick={() => {
                    onLanguageChange(item);
                    setShowLanguages(false);
                  }}
                >
                  {LANGUAGE_LABELS[item]}

                  {language === item && (
                    <span>✓</span>
                  )}
                </button>
              ))}

            </div>
          )}


          {/* NOTIFICATIONS */}

          <div className="profile-setting-card">

            <div className="profile-setting-icon peach">
              <Bell size={20} />
            </div>

            <div className="profile-setting-info">
              <h3>{t("Notifications")}</h3>
              <p>
                {notifications
                  ? t("Alerts are enabled")
                  : t("Alerts are disabled")}
              </p>
            </div>

            <button
              className={
                notifications
                  ? "profile-toggle active"
                  : "profile-toggle"
              }
              onClick={() =>
                setNotifications(!notifications)
              }
            >
              <span></span>
            </button>

          </div>


          {/* DARK MODE */}

          <div className="profile-setting-card">

            <div className="profile-setting-icon sage">
              <Moon size={20} />
            </div>

            <div className="profile-setting-info">
              <h3>{t("Appearance")}</h3>
              <p>
                {darkMode
                  ? t("Dark mode")
                  : t("Light mode")}
              </p>
            </div>

            <button
              className={
                darkMode
                  ? "profile-toggle active"
                  : "profile-toggle"
              }
              onClick={() =>
                setDarkMode(!darkMode)
              }
            >
              <span></span>
            </button>

          </div>

        </section>


        {/* =========================
            PRIVACY & SECURITY
        ========================= */}

        <section className="profile-section">

          <div className="profile-section-heading">
            <h2>{t("Privacy & Security")}</h2>
            <p>{t("Keep your information protected")}</p>
          </div>

          <button className="profile-setting-card clickable" onClick={() => alert(t("Your privacy controls are managed securely by NirbhayMind."))}>

            <div className="profile-setting-icon green">
              <Lock size={20} />
            </div>

            <div className="profile-setting-info">
              <h3>{t("Privacy & Data")}</h3>
              <p>{t("Manage your privacy preferences")}</p>
            </div>

            <ChevronRight size={18} />

          </button>


          <button className="profile-setting-card clickable" onClick={() => alert(t("Your account security is active."))}>

            <div className="profile-setting-icon lavender">
              <ShieldCheck size={20} />
            </div>

            <div className="profile-setting-info">
              <h3>{t("Security")}</h3>
              <p>{t("Your account security settings")}</p>
            </div>

            <ChevronRight size={18} />

          </button>

        </section>


        {/* =========================
            SUPPORT
        ========================= */}

        <section className="profile-section">

          <div className="profile-section-heading">
            <h2>{t("Support")}</h2>
            <p>{t("Need help with NirbhayMind?")}</p>
          </div>


          <button className="profile-setting-card clickable" onClick={() => onNavigate("resources")}>

            <div className="profile-setting-icon peach">
              <HelpCircle size={20} />
            </div>

            <div className="profile-setting-info">
              <h3>{t("Help & FAQ")}</h3>
              <p>{t("Find answers to common questions")}</p>
            </div>

            <ChevronRight size={18} />

          </button>


          <button className="profile-setting-card clickable" onClick={() => onNavigate("voice-support")}>

            <div className="profile-setting-icon sage">
              <Phone size={20} />
            </div>

            <div className="profile-setting-info">
              <h3>{t("Contact Support")}</h3>
              <p>{t("Get help from the support team")}</p>
            </div>

            <ChevronRight size={18} />

          </button>

        </section>


        {/* =========================
            LOGOUT
        ========================= */}

        <button
          className="profile-logout"
          onClick={handleLogout}
        >
          <LogOut size={18} />
          {t("Log Out")}
        </button>


        <p className="profile-version">
          {t("NirbhayMind · Your Voice. Your Well-being. Our Priority.")}
        </p>

      </main>

    </div>
  );
}

export default Profile;