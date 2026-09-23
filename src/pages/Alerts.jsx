import { useState } from "react";
import {
  ArrowLeft,
  Bell,
  AlertTriangle,
  CalendarDays,
  HeartHandshake,
  Activity,
  CheckCheck,
} from "lucide-react";

import nirbhaymindLogo from "../assets/nirbhaymind_logo.jpeg";

function Alerts({ onBack }) {
  const [activeFilter, setActiveFilter] = useState("All");

  const [alerts, setAlerts] = useState([
    {
      id: 1,
      type: "high",
      category: "Well-being",
      title: "Well-being Alert",
      message:
        "Your recent check-in indicates increased distress. Consider connecting with a counsellor for additional support.",
      time: "10 min ago",
      unread: true,
    },

    {
      id: 2,
      type: "case",
      category: "Case",
      title: "Upcoming Hearing",
      message:
        "Your next hearing is scheduled for 28 September 2026. Keep your case information and required documents ready.",
      time: "2 hours ago",
      unread: true,
    },

    {
      id: 3,
      type: "support",
      category: "Support",
      title: "Counselling Follow-up",
      message:
        "Your counselling follow-up is due soon. You can connect with a counsellor through NirbhayMind.",
      time: "Yesterday",
      unread: true,
    },

    {
      id: 4,
      type: "case",
      category: "Case",
      title: "Case Information Updated",
      message:
        "Your case record was updated on 18 September 2026.",
      time: "2 days ago",
      unread: false,
    },

    {
      id: 5,
      type: "wellbeing",
      category: "Well-being",
      title: "Mood Check Reminder",
      message:
        "Regular check-ins help NirbhayMind understand changes in your well-being over time.",
      time: "3 days ago",
      unread: false,
    },
  ]);

  const filters = [
    "All",
    "Case",
    "Well-being",
    "Support",
  ];

  const filteredAlerts =
    activeFilter === "All"
      ? alerts
      : alerts.filter(
          (alert) => alert.category === activeFilter
        );

  const unreadCount = alerts.filter(
    (alert) => alert.unread
  ).length;

  const markAllAsRead = () => {
    setAlerts((prev) =>
      prev.map((alert) => ({
        ...alert,
        unread: false,
      }))
    );
  };

  const getIcon = (type) => {
    if (type === "high") {
      return <AlertTriangle size={20} />;
    }

    if (type === "case") {
      return <CalendarDays size={20} />;
    }

    if (type === "support") {
      return <HeartHandshake size={20} />;
    }

    return <Activity size={20} />;
  };

  return (
    <div className="alerts-page">

      {/* HEADER */}
      <header className="alerts-header">

        <button
          className="alerts-back"
          onClick={onBack}
        >
          <ArrowLeft size={21} />
        </button>

        <div className="alerts-title">

          <div className="alerts-logo">
            <img
              src={nirbhaymindLogo}
              alt="NirbhayMind"
            />
          </div>

          <div>
            <h1>Alerts & Notifications</h1>
            <p>Stay updated about your case & well-being</p>
          </div>

        </div>

      </header>


      {/* CONTENT */}
      <main className="alerts-content">

        {/* SUMMARY */}
        <div className="alerts-summary">

          <div>
            <h2>Notifications</h2>

            <p>
              {unreadCount > 0
                ? `${unreadCount} new alerts`
                : "You're all caught up"}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              className="mark-read-button"
              onClick={markAllAsRead}
            >
              <CheckCheck size={14} />
              Mark all as read
            </button>
          )}

        </div>


        {/* FILTERS */}
        <div className="alert-filter-row">

          {filters.map((filter) => (
            <button
              key={filter}
              className={
                activeFilter === filter
                  ? "alert-filter active"
                  : "alert-filter"
              }
              onClick={() => setActiveFilter(filter)}
            >
              {filter}
            </button>
          ))}

        </div>


        {/* ALERTS */}
        {filteredAlerts.length > 0 ? (

          <div className="alert-list">

            {filteredAlerts.map((alert) => (

              <div
                key={alert.id}
                className={`alert-card ${
                  alert.unread ? "unread" : ""
                } ${alert.type}`}
              >

                <div
                  className={`alert-icon ${alert.type}`}
                >
                  {getIcon(alert.type)}
                </div>


                <div className="alert-details">

                  <div className="alert-title-row">

                    <h3>{alert.title}</h3>

                    <span className="alert-time">
                      {alert.time}
                    </span>

                  </div>

                  <p>{alert.message}</p>

                </div>


                {alert.unread && (
                  <span className="alert-unread-dot"></span>
                )}

              </div>

            ))}

          </div>

        ) : (

          <div className="alerts-empty">

            <div className="alerts-empty-icon">
              <Bell size={27} />
            </div>

            <h3>No alerts here</h3>

            <p>
              There are no notifications in this category.
            </p>

          </div>

        )}

      </main>

    </div>
  );
}

export default Alerts;