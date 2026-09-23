import {
  ArrowLeft,
  FileText,
  CalendarDays,
  MapPin,
  Clock3,
  CheckCircle2,
  Circle,
  ShieldCheck,
  HeartHandshake,
  Scale,
  Home,
} from "lucide-react";
import { useI18n } from "../i18n";

function MyCase({ onBack, caseData, onSupport }) {
  const { t } = useI18n();
  const formatDatasetDate = (value) => {
    const match = String(value || "").match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (!match) return value || t("Not available");
    const [, day, month, year] = match;
    return new Intl.DateTimeFormat(undefined, {
      day: "numeric",
      month: "long",
      year: "numeric"
    }).format(new Date(Number(year), Number(month) - 1, Number(day)));
  };
  const registrationDate = formatDatasetDate(caseData.registrationDate);
  const nextHearing = caseData.nextHearingDays === null
    ? t("Not scheduled")
    : `${t("In")} ${caseData.nextHearingDays} ${t("days")}`;

  const caseStages = [
    {
      title: t("Complaint Registered"),
      date: registrationDate,
      completed: true,
    },
    {
      title: caseData.caseStage,
      date: t("In Progress"),
      completed: false,
      current: true,
    },
    {
      title: t("Charge Sheet"),
      date: t("Pending"),
      completed: false,
    },
    {
      title: t("Trial"),
      date: t("Pending"),
      completed: false,
    },
    {
      title: t("Case Resolution"),
      date: t("Pending"),
      completed: false,
    },
  ];

  return (
    <div className="my-case-page">

      {/* HEADER */}
      <header className="my-case-header">

        <button
          className="my-case-back"
          onClick={onBack}
        >
          <ArrowLeft size={21} />
        </button>

        <div className="my-case-title">
          <div className="my-case-logo">
            <img
              src="/src/assets/nirbhaymind_logo.jpeg"
              alt="NirbhayMind"
            />
          </div>

          <div>
            <h1>{t("My Case")}</h1>
            <p>{t("Case & Support")}</p>
          </div>
        </div>

      </header>


      {/* CONTENT */}
      <main className="my-case-content">

        {/* CASE OVERVIEW */}
        <section className="case-overview-card">

          <div className="case-overview-top">

            <div className="case-file-icon">
              <FileText size={24} />
            </div>

            <div>
              <span>{t("Case ID")}</span>
              <h2>{caseData.caseId}</h2>
            </div>

          </div>

          <div className="case-status-badge">
            <span></span>
            {caseData.caseStage}
          </div>

          <div className="case-info-grid">

            <div className="case-info-item">
              <CalendarDays size={17} />
              <div>
                <span>{t("Registered")}</span>
                <strong>                {registrationDate}</strong>
              </div>
            </div>

            <div className="case-info-item">
              <MapPin size={17} />
              <div>
                <span>{t("Location")}</span>
                <strong>
                  {caseData.district}, {caseData.state}
                </strong>
              </div>
            </div>

          </div>

        </section>


        {/* CASE JOURNEY */}
        <section className="case-section">

          <div className="case-section-heading">
            <div>
              <h2>{t("Case Journey")}</h2>
              <p>{t("Track the progress of your case.")}</p>
            </div>
          </div>

          <div className="case-timeline">

            {caseStages.map((stage, index) => (

              <div
                className={`case-timeline-item ${
                  stage.current ? "current" : ""
                }`}
                key={stage.title}
              >

                <div className="timeline-icon">

                  {stage.completed ? (
                    <CheckCircle2 size={21} />
                  ) : stage.current ? (
                    <Clock3 size={20} />
                  ) : (
                    <Circle size={19} />
                  )}

                </div>

                <div className="timeline-content">

                  <h3>{stage.title}</h3>

                  <span>{stage.date}</span>

                  {stage.current && (
                    <div className="timeline-current">
                      {t("Currently here")}
                    </div>
                  )}

                </div>

                {index < caseStages.length - 1 && (
                  <div className="timeline-line"></div>
                )}

              </div>

            ))}

          </div>

        </section>


        {/* UPCOMING HEARING */}
        <section className="hearing-card">

          <div className="hearing-icon">
            <CalendarDays size={23} />
          </div>

          <div className="hearing-details">

            <span>{t("Next Hearing")}</span>

            <h3>{nextHearing}</h3>

            <p>
              {caseData.nextHearingDays === null ? t("No upcoming hearing") : t("from now")}
            </p>

          </div>

          <div className="hearing-arrow">
            →
          </div>

        </section>


        {/* CASE UPDATE */}
        <section className="case-update-card">

          <div className="case-update-icon">
            <Clock3 size={19} />
          </div>

          <div>
            <span>{t("Last Case Update")}</span>
            <strong>{formatDatasetDate(caseData.checkinDate)}</strong>
            <p>
              {t("Your case information was last updated.")}
            </p>
          </div>

        </section>


        {/* SUPPORT */}
        <section className="case-section">

          <div className="case-section-heading">
            <div>
              <h2>{t("Support")}</h2>
              <p>{t("Services available through NirbhayMind.")}</p>
            </div>
          </div>

          <div className="case-support-grid">

            <SupportCard
              onClick={onSupport}
              icon={<HeartHandshake size={21} />}
              title={t("Counselling")}
              description={t("Talk to a counsellor")}
              className="green"
            />

            <SupportCard
              onClick={onSupport}
              icon={<Scale size={21} />}
              title={t("Legal Aid")}
              description={t("Get legal support")}
              className="purple"
            />

            <SupportCard
              onClick={onSupport}
              icon={<ShieldCheck size={21} />}
              title={t("Protection")}
              description={t("Report a safety concern")}
              className="peach"
            />

            <SupportCard
              onClick={onSupport}
              icon={<Home size={21} />}
              title={t("Relocation")}
              description={t("Request relocation support")}
              className="yellow"
            />

          </div>

        </section>


        {/* REASSURANCE */}
        <div className="case-reassurance">

          <ShieldCheck size={20} />

          <p>
            {t("You don't have to navigate your case alone.")}
            {" "}
            {t("NirbhayMind is here to help you access support.")}
          </p>

        </div>

      </main>

    </div>
  );
}


function SupportCard({
  icon,
  title,
  description,
  className,
  onClick,
}) {
  return (
    <button className={`case-support-card ${className}`} onClick={onClick}>

      <div className="case-support-icon">
        {icon}
      </div>

      <div>
        <h3>{title}</h3>
        <p>{description}</p>
      </div>

    </button>
  );
}


export default MyCase;
