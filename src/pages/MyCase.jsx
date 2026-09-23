import nirbhaymindLogo from "../assets/nirbhaymind_logo.jpeg";
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

function MyCase({ onBack }) {
  const caseData = {
    caseId: "NHAA-2026-00124",
    registrationDate: "12 August 2026",
    district: "Kolkata",
    state: "West Bengal",
    currentStage: "Investigation",
    nextHearing: "28 September 2026",
    daysToHearing: 5,
    lastUpdate: "18 September 2026",
  };

  const caseStages = [
    {
      title: "Complaint Registered",
      date: "12 August 2026",
      completed: true,
    },
    {
      title: "Investigation",
      date: "In Progress",
      completed: false,
      current: true,
    },
    {
      title: "Charge Sheet",
      date: "Pending",
      completed: false,
    },
    {
      title: "Trial",
      date: "Pending",
      completed: false,
    },
    {
      title: "Case Resolution",
      date: "Pending",
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
            <h1>My Case</h1>
            <p>Case & Support</p>
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
              <span>Case ID</span>
              <h2>{caseData.caseId}</h2>
            </div>

          </div>

          <div className="case-status-badge">
            <span></span>
            {caseData.currentStage}
          </div>

          <div className="case-info-grid">

            <div className="case-info-item">
              <CalendarDays size={17} />
              <div>
                <span>Registered</span>
                <strong>{caseData.registrationDate}</strong>
              </div>
            </div>

            <div className="case-info-item">
              <MapPin size={17} />
              <div>
                <span>Location</span>
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
              <h2>Case Journey</h2>
              <p>Track the progress of your case.</p>
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
                      Currently here
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

            <span>Next Hearing</span>

            <h3>{caseData.nextHearing}</h3>

            <p>
              {caseData.daysToHearing} days from now
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
            <span>Last Case Update</span>
            <strong>{caseData.lastUpdate}</strong>
            <p>
              Your case information was last updated.
            </p>
          </div>

        </section>


        {/* SUPPORT */}
        <section className="case-section">

          <div className="case-section-heading">
            <div>
              <h2>Support</h2>
              <p>Services available through NirbhayMind.</p>
            </div>
          </div>

          <div className="case-support-grid">

            <SupportCard
              icon={<HeartHandshake size={21} />}
              title="Counselling"
              description="Talk to a counsellor"
              className="green"
            />

            <SupportCard
              icon={<Scale size={21} />}
              title="Legal Aid"
              description="Get legal support"
              className="purple"
            />

            <SupportCard
              icon={<ShieldCheck size={21} />}
              title="Protection"
              description="Report a safety concern"
              className="peach"
            />

            <SupportCard
              icon={<Home size={21} />}
              title="Relocation"
              description="Request relocation support"
              className="yellow"
            />

          </div>

        </section>


        {/* REASSURANCE */}
        <div className="case-reassurance">

          <ShieldCheck size={20} />

          <p>
            You don't have to navigate your case alone.
            NirbhayMind is here to help you access support.
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
}) {
  return (
    <button className={`case-support-card ${className}`}>

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