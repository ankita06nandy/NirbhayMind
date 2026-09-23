import React, { useState } from "react";
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

function Profile({ onBack }) {
  const [language, setLanguage] = useState("English");
  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [showLanguages, setShowLanguages] = useState(false);

  const languages = [
    "English",
    "বাংলা",
    "हिंदी",
    "অসমীয়া",
    "ଓଡ଼ିଆ",
    "தமிழ்",
    "తెలుగు",
    "ಕನ್ನಡ",
    "മലയാളം",
    "मराठी",
    "ગુજરાતી",
    "ਪੰਜਾਬੀ",
    "اردو",
  ];

  const handleLogout = () => {
    const confirmed = window.confirm(
      "Are you sure you want to log out?"
    );

    if (confirmed) {
      alert("You have been logged out.");
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
            <h1>Profile & Settings</h1>
            <p>Your account & preferences</p>
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

            <h2>Ankita</h2>

            <span className="profile-user-type">
              Registered User
            </span>

            <div className="profile-case-info">
              <span>
                Case ID
              </span>

              <strong>
                NHAA-2026-00124
              </strong>
            </div>

          </div>

        </section>


        {/* =========================
            PERSONAL INFORMATION
        ========================= */}

        <section className="profile-section">

          <div className="profile-section-heading">
            <h2>Account Information</h2>
            <p>Your registered information</p>
          </div>

          <div className="profile-info-card">

            <div className="profile-info-row">
              <span>District</span>
              <strong>Kolkata</strong>
            </div>

            <div className="profile-info-row">
              <span>State</span>
              <strong>West Bengal</strong>
            </div>

            <div className="profile-info-row">
              <span>Case Status</span>

              <strong className="profile-status">
                Investigation
              </strong>
            </div>

          </div>

        </section>


        {/* =========================
            PREFERENCES
        ========================= */}

        <section className="profile-section">

          <div className="profile-section-heading">
            <h2>Preferences</h2>
            <p>Customize your NirbhayMind experience</p>
          </div>


          {/* LANGUAGE */}

          <div className="profile-setting-card">

            <div className="profile-setting-icon lavender">
              <Globe2 size={20} />
            </div>

            <div className="profile-setting-info">
              <h3>Language</h3>
              <p>{language}</p>
            </div>

            <button
              className="profile-setting-action"
              onClick={() =>
                setShowLanguages(!showLanguages)
              }
            >
              <span>Change</span>
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
                    setLanguage(item);
                    setShowLanguages(false);
                  }}
                >
                  {item}

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
              <h3>Notifications</h3>
              <p>
                {notifications
                  ? "Alerts are enabled"
                  : "Alerts are disabled"}
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
              <h3>Appearance</h3>
              <p>
                {darkMode
                  ? "Dark mode"
                  : "Light mode"}
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
            <h2>Privacy & Security</h2>
            <p>Keep your information protected</p>
          </div>

          <button className="profile-setting-card clickable">

            <div className="profile-setting-icon green">
              <Lock size={20} />
            </div>

            <div className="profile-setting-info">
              <h3>Privacy & Data</h3>
              <p>Manage your privacy preferences</p>
            </div>

            <ChevronRight size={18} />

          </button>


          <button className="profile-setting-card clickable">

            <div className="profile-setting-icon lavender">
              <ShieldCheck size={20} />
            </div>

            <div className="profile-setting-info">
              <h3>Security</h3>
              <p>Your account security settings</p>
            </div>

            <ChevronRight size={18} />

          </button>

        </section>


        {/* =========================
            SUPPORT
        ========================= */}

        <section className="profile-section">

          <div className="profile-section-heading">
            <h2>Support</h2>
            <p>Need help with NirbhayMind?</p>
          </div>


          <button className="profile-setting-card clickable">

            <div className="profile-setting-icon peach">
              <HelpCircle size={20} />
            </div>

            <div className="profile-setting-info">
              <h3>Help & FAQ</h3>
              <p>Find answers to common questions</p>
            </div>

            <ChevronRight size={18} />

          </button>


          <button className="profile-setting-card clickable">

            <div className="profile-setting-icon sage">
              <Phone size={20} />
            </div>

            <div className="profile-setting-info">
              <h3>Contact Support</h3>
              <p>Get help from the support team</p>
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
          Log Out
        </button>


        <p className="profile-version">
          NirbhayMind · Your Voice. Your Well-being. Our Priority.
        </p>

      </main>

    </div>
  );
}

export default Profile;