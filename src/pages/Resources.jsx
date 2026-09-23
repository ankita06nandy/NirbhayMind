import React, { useState } from "react";
import {
  ArrowLeft,
  Wind,
  Heart,
  BookOpen,
  Phone,
  ShieldAlert,
  Scale,
  FileText,
} from "lucide-react";

import nirbhaymindLogo from "../assets/nirbhaymind_logo.jpeg";

function Resources({ onBack }) {
  const [activeTab, setActiveTab] = useState("Self Care");
  const [selectedResource, setSelectedResource] = useState(null);

  /* =========================
     SELF CARE
  ========================= */

  const selfCareResources = [
    {
      icon: <Wind size={22} />,
      title: "Breathing Exercises",
      description: "Calm your mind",
      className: "green",
      content:
        "Take a slow breath in through your nose for 4 seconds. Hold for 2 seconds, then slowly breathe out for 6 seconds. Repeat this for a few minutes and focus on your breathing.",
    },

    {
      icon: <Heart size={22} />,
      title: "Guided Meditation",
      description: "5 min · 10 min · 20 min",
      className: "lavender",
      content:
        "Find a quiet place to sit or lie down. Close your eyes if you feel comfortable and take a few slow breaths. Focus on the sensation of your breathing. If your mind wanders, gently bring your attention back to the present moment.",
    },

    {
      icon: <BookOpen size={22} />,
      title: "Trauma Support Guide",
      description: "PDF · 12 MB",
      className: "peach",
      content:
        "This guide provides general information about coping with difficult emotions, identifying trusted support systems, and recognising when additional professional support may be helpful.",
    },

    {
      icon: <Phone size={22} />,
      title: "Helpline Numbers",
      description: "24/7 support",
      className: "sage",
      content:
        "If you need support, you can connect with the NHAA helpline directly from your phone.",
      action: "call",
    },
  ];

  /* =========================
     LEGAL RIGHTS
  ========================= */

  const legalResources = [
    {
      icon: <Scale size={22} />,
      title: "Know Your Legal Rights",
      description: "Understand your rights",
      className: "lavender",
      content:
        "Learn about your rights as a victim or complainant and understand the different forms of support that may be available to you.",
    },

    {
      icon: <FileText size={22} />,
      title: "Case Process Guide",
      description: "Understand the case journey",
      className: "green",
      content:
        "Understand the general stages of a case, from complaint registration and investigation through later stages of the case journey.",
    },

    {
      icon: <BookOpen size={22} />,
      title: "Legal Aid Information",
      description: "Learn about available support",
      className: "peach",
      content:
        "Access information about legal assistance and support services that may be available during your case.",
    },
  ];

  /* =========================
     EMERGENCY
  ========================= */

  const emergencyResources = [
    {
      icon: <Phone size={22} />,
      title: "NHAA Helpline",
      description: "14566 · National support",
      className: "green",
      content:
        "Connect directly with the NHAA helpline from your phone for support.",
      action: "call",
    },

    {
      icon: <ShieldAlert size={22} />,
      title: "Report a Threat",
      description: "Get immediate safety support",
      className: "peach",
      content:
        "If you feel unsafe or are facing a threat, use the safety support options available through NirbhayMind.",
      action: "threat",
    },

    {
      icon: <Phone size={22} />,
      title: "Emergency Support",
      description: "Contact help when needed",
      className: "lavender",
      content:
        "If you are facing an immediate safety concern, contact emergency services or a trusted person nearby.",
      action: "emergency",
    },
  ];

  /* =========================
     SELECT TAB
  ========================= */

  const resources =
    activeTab === "Self Care"
      ? selfCareResources
      : activeTab === "Legal Rights"
      ? legalResources
      : emergencyResources;

  /* =========================
     RENDER
  ========================= */

  return (
    <div className="resources-page">

      {/* =========================
          HEADER
      ========================= */}

      <header className="resources-header">

        <button
          className="resources-back"
          onClick={onBack}
        >
          <ArrowLeft size={21} />
        </button>

        <div className="resources-title">

          <div className="resources-logo">
            <img
              src={nirbhaymindLogo}
              alt="NirbhayMind"
            />
          </div>

          <div>
            <h1>Resources</h1>
            <p>Support & helpful information</p>
          </div>

        </div>

      </header>


      {/* =========================
          MAIN CONTENT
      ========================= */}

      <main className="resources-content">

        {/* TABS */}

        <div className="resources-tabs">

          {["Self Care", "Legal Rights", "Emergency"].map(
            (tab) => (
              <button
                key={tab}
                className={
                  activeTab === tab
                    ? "resource-tab active"
                    : "resource-tab"
                }
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            )
          )}

        </div>


        {/* RESOURCE LIST */}

        <div className="resource-list">

          {resources.map((resource) => (
            <button
              className="resource-card"
              key={resource.title}
              onClick={() => setSelectedResource(resource)}
            >

              <div
                className={`resource-icon ${resource.className}`}
              >
                {resource.icon}
              </div>

              <div className="resource-info">
                <h3>{resource.title}</h3>
                <p>{resource.description}</p>
              </div>

              <span className="resource-arrow">
                ›
              </span>

            </button>
          ))}

        </div>


        {/* =========================
            REASSURANCE
        ========================= */}

        <div className="resources-reassurance">

          <div className="resources-heart">
            ❤️
          </div>

          <div>
            <strong>You are not alone.</strong>
            <p>Help is always available.</p>
          </div>

        </div>


        {/* =========================
            RESOURCE MODAL
        ========================= */}

        {selectedResource && (

          <div
            className="resource-modal-overlay"
            onClick={() => setSelectedResource(null)}
          >

            <div
              className="resource-modal"
              onClick={(e) => e.stopPropagation()}
            >

              {/* CLOSE */}

              <button
                className="resource-modal-close"
                onClick={() => setSelectedResource(null)}
              >
                ×
              </button>


              {/* ICON */}

              <div
                className={`resource-modal-icon ${selectedResource.className}`}
              >
                {selectedResource.icon}
              </div>


              {/* TITLE */}

              <h2>
                {selectedResource.title}
              </h2>


              {/* DESCRIPTION */}

              <p className="resource-modal-description">
                {selectedResource.content}
              </p>


              {/* =========================
                  CALL ACTION
              ========================= */}

              {selectedResource.action === "call" && (
                <a
                  href="tel:14566"
                  className="resource-modal-action"
                >
                  <Phone size={18} />
                  Call 14566
                </a>
              )}


              {/* =========================
                  THREAT ACTION
              ========================= */}

              {selectedResource.action === "threat" && (
                <button
                  className="resource-modal-action"
                  onClick={() => {
                    setSelectedResource(null);

                    alert(
                      "Safety support can be accessed from your NirbhayMind dashboard."
                    );
                  }}
                >
                  <ShieldAlert size={18} />
                  Continue to Safety Support
                </button>
              )}


              {/* =========================
                  EMERGENCY ACTION
              ========================= */}

              {selectedResource.action === "emergency" && (
                <button
                  className="resource-modal-action"
                  onClick={() => {
                    setSelectedResource(null);

                    alert(
                      "If you are in immediate danger, contact emergency services or a trusted person nearby."
                    );
                  }}
                >
                  <Phone size={18} />
                  Get Emergency Help
                </button>
              )}


              {/* CLOSE BUTTON */}

              <button
                className="resource-modal-done"
                onClick={() => setSelectedResource(null)}
              >
                Close
              </button>

            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default Resources;