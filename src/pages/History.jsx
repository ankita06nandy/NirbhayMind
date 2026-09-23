import {
  ArrowLeft,
  Clock3,
  TrendingUp,
  Leaf,
  AlertTriangle,
} from "lucide-react";

function History({ checkIns, onBack }) {
  return (
    <div className="history-page">

      {/* HEADER */}
      <div className="history-header">

        <button
          className="history-back"
          onClick={onBack}
        >
          <ArrowLeft size={21} />
        </button>

        <div>
          <h1>Check-in History</h1>
          <p>Your previous well-being check-ins</p>
        </div>

      </div>


      {/* SUMMARY */}
      <div className="history-summary">

        <div className="history-summary-card">

          <div className="history-summary-icon">
            <Clock3 size={22} />
          </div>

          <div>
            <span>Total Check-ins</span>
            <strong>{checkIns.length}</strong>
          </div>

        </div>


        <div className="history-summary-card">

          <div className="history-summary-icon">
            <TrendingUp size={22} />
          </div>

          <div>
            <span>Latest Score</span>

            <strong>
              {checkIns.length > 0
                ? checkIns[checkIns.length - 1].score
                : "--"}
            </strong>
          </div>

        </div>


        <div className="history-summary-card">

          <div className="history-summary-icon">
            <Leaf size={22} />
          </div>

          <div>
            <span>Latest Risk</span>

            <strong>
              {checkIns.length > 0
                ? checkIns[checkIns.length - 1].risk
                : "--"}
            </strong>
          </div>

        </div>

      </div>


      {/* HISTORY LIST */}
      <div className="history-section">

        <div className="history-section-heading">

          <div>
            <h2>Your Check-ins</h2>
            <p>Review how you've been feeling over time.</p>
          </div>

        </div>


        {checkIns.length === 0 ? (

          /* EMPTY STATE */

          <div className="history-empty">

            <div className="history-empty-icon">
              <Clock3 size={34} />
            </div>

            <h3>No check-ins yet</h3>

            <p>
              Complete your first Mood Check to start
              tracking your well-being.
            </p>

          </div>

        ) : (

          /* CHECK-IN LIST */

          <div className="history-list">

            {[...checkIns]
              .reverse()
              .map((checkIn) => (

                <div
                  className="history-item"
                  key={checkIn.id}
                >

                  {/* SCORE */}
                  <div
                    className={`history-score ${
                      checkIn.risk?.toLowerCase() || "low"
                    }`}
                  >
                    <strong>{checkIn.score}</strong>
                    <span>/100</span>
                  </div>


                  {/* DETAILS */}
                  <div className="history-details">

                    <div className="history-title-row">

                      <h3>
                        Well-being Check-in
                      </h3>

                      <span
                        className={`history-risk ${
                          checkIn.risk?.toLowerCase() || "low"
                        }`}
                      >

                        {checkIn.risk === "High" && (
                          <AlertTriangle size={14} />
                        )}

                        {checkIn.risk === "Moderate" && (
                          <TrendingUp size={14} />
                        )}

                        {checkIn.risk === "Low" && (
                          <Leaf size={14} />
                        )}

                        {checkIn.risk}

                      </span>

                    </div>


                    <div className="history-date">

                      <span>
                        {checkIn.date}
                      </span>

                      <span>
                        ·
                      </span>

                      <span>
                        {checkIn.time}
                      </span>

                    </div>


                    <p className="history-message">
                      {checkIn.message}
                    </p>

                  </div>

                </div>

              ))}

          </div>

        )}

      </div>

    </div>
  );
}

export default History;