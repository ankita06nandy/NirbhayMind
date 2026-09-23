import { useState } from "react";
import {
  ArrowLeft,
  Brain,
  Moon,
  HeartPulse,
  Send,
  CheckCircle2,
} from "lucide-react";
import "./MoodCheck.css";

function MoodCheck({ onBack, onComplete }) {
  const [mood, setMood] = useState("");
  const [stress, setStress] = useState("");
  const [anxiety, setAnxiety] = useState("");
  const [sleep, setSleep] = useState("");

  const [result, setResult] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!mood || !stress || !anxiety || !sleep) {
      alert("Please answer all questions before submitting.");
      return;
    }

    // Positive mood gives a higher score.
    const moodScore = {
      "Very Low": 20,
      Low: 40,
      Okay: 60,
      Good: 80,
      "Very Good": 100,
    };

    // Lower stress = better well-being.
    const stressScore = {
      "Very Low": 100,
      Low: 80,
      Moderate: 60,
      High: 40,
      "Very High": 20,
    };

    const anxietyScore = {
      "Very Low": 100,
      Low: 80,
      Moderate: 60,
      High: 40,
      "Very High": 20,
    };

    const sleepScore = {
      "Very Poor": 20,
      Poor: 40,
      Average: 60,
      Good: 80,
      "Very Good": 100,
    };

    const finalScore = Math.round(
      (
        moodScore[mood] +
        stressScore[stress] +
        anxietyScore[anxiety] +
        sleepScore[sleep]
      ) / 4
    );

    let riskLevel;
    let statusMessage;

    if (finalScore >= 70) {
      riskLevel = "Low";
      statusMessage =
        "Your current responses indicate a relatively stable pattern.";
    } else if (finalScore >= 45) {
      riskLevel = "Moderate";
      statusMessage =
        "Some areas may need attention. Regular check-ins can help track changes.";
    } else {
      riskLevel = "High";
      statusMessage =
        "Your responses indicate that additional support may be helpful.";
    }

    const checkInResult={
      score: finalScore,
      risk: riskLevel,
      message: statusMessage,
    };
    setResult(checkInResult);
    onComplete(checkInResult);
     
  };

  if (result) {
    return (
      <div className="mood-page">

        <div className="mood-success-card">

          <div className="success-icon">
            <CheckCircle2 size={52} />
          </div>

          <h1>Check-in Complete 💚</h1>

          <p>
            Thank you for sharing how you're feeling today.
            Your responses have been recorded securely.
          </p>

          <div className="score-preview">

            <span>Your Well-being Score</span>

            <strong>{result.score}/100</strong>

            <small>
              Risk Level: {result.risk}
            </small>

          </div>

          <p className="support-text">
            {result.message}
          </p>

          <button
            className="back-home-btn"
            onClick={onBack}
          >
            Back to Dashboard
          </button>

        </div>

      </div>
    );
  }

  return (
    <div className="mood-page">

      {/* HEADER */}
      <div className="mood-header">

        <button
          className="back-btn"
          onClick={onBack}
        >
          <ArrowLeft size={20} />
        </button>

        <div>
          <h1>Mood Check</h1>

          <p>
            A quick check-in to understand how you're feeling.
          </p>
        </div>

      </div>


      {/* INTRO */}
      <div className="mood-intro">

        <div className="intro-icon">
          <Brain size={28} />
        </div>

        <div>
          <h2>How are you feeling today?</h2>

          <p>
            Your answers help NirbhayMind understand changes
            in your well-being over time.
          </p>
        </div>

      </div>


      <form onSubmit={handleSubmit}>

        {/* MOOD */}
        <section className="question-card">

          <div className="question-title">
            <HeartPulse size={22} />

            <h3>
              How would you describe your mood?
            </h3>
          </div>

          <div className="option-grid">

            {[
              ["Very Low", "😔"],
              ["Low", "😕"],
              ["Okay", "😐"],
              ["Good", "🙂"],
              ["Very Good", "😊"],
            ].map(([label, emoji]) => (

              <button
                type="button"
                key={label}
                className={`mood-option ${
                  mood === label ? "selected" : ""
                }`}
                onClick={() => setMood(label)}
              >

                <span>{emoji}</span>

                <small>{label}</small>

              </button>

            ))}

          </div>

        </section>


        {/* STRESS */}
        <section className="question-card">

          <div className="question-title">

            <Brain size={22} />

            <h3>
              How stressed do you feel right now?
            </h3>

          </div>

          <div className="scale-row">

            {[
              "Very Low",
              "Low",
              "Moderate",
              "High",
              "Very High",
            ].map((level) => (

              <button
                type="button"
                key={level}
                className={`scale-option ${
                  stress === level ? "selected" : ""
                }`}
                onClick={() => setStress(level)}
              >
                {level}
              </button>

            ))}

          </div>

        </section>


        {/* ANXIETY */}
        <section className="question-card">

          <div className="question-title">

            <Brain size={22} />

            <h3>
              How anxious have you been feeling?
            </h3>

          </div>

          <div className="scale-row">

            {[
              "Very Low",
              "Low",
              "Moderate",
              "High",
              "Very High",
            ].map((level) => (

              <button
                type="button"
                key={level}
                className={`scale-option ${
                  anxiety === level ? "selected" : ""
                }`}
                onClick={() => setAnxiety(level)}
              >
                {level}
              </button>

            ))}

          </div>

        </section>


        {/* SLEEP */}
        <section className="question-card">

          <div className="question-title">

            <Moon size={22} />

            <h3>
              How was your sleep recently?
            </h3>

          </div>

          <div className="scale-row">

            {[
              "Very Poor",
              "Poor",
              "Average",
              "Good",
              "Very Good",
            ].map((level) => (

              <button
                type="button"
                key={level}
                className={`scale-option ${
                  sleep === level ? "selected" : ""
                }`}
                onClick={() => setSleep(level)}
              >
                {level}
              </button>

            ))}

          </div>

        </section>


        {/* SUBMIT */}
        <button
          className="submit-checkin"
          type="submit"
        >

          <Send size={19} />

          Submit Check-in

        </button>

      </form>

    </div>
  );
}

export default MoodCheck;