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
import { useI18n } from "../i18n";

function Alerts({ onBack, alerts: initialAlerts }) {
  const { t } = useI18n();
  const [activeFilter, setActiveFilter] = useState("All");
  const [alerts, setAlerts] = useState(initialAlerts);

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
            <h1>{t("Alerts & Notifications")}</h1>
            <p>{t("Stay updated about your case & well-being")}</p>
          </div>

        </div>

      </header>


      {/* CONTENT */}
      <main className="alerts-content">

        {/* SUMMARY */}
        <div className="alerts-summary">

          <div>
            <h2>{t("Notifications")}</h2>

            <p>
              {unreadCount > 0
                ? `${unreadCount} new alerts`
                : t("You're all caught up")}
            </p>
          </div>

          {unreadCount > 0 && (
            <button
              className="mark-read-button"
              onClick={markAllAsRead}
            >
              <CheckCheck size={14} />
              {t("Mark all as read")}
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

            <h3>{t("No alerts here")}</h3>

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