import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Phone,
  Globe2,
  ShieldCheck,
  PhoneOff,
} from "lucide-react";

import nirbhaymindLogo from "../assets/nirbhaymind_logo.jpeg";

function VoiceSupport({ onBack }) {
  const [language, setLanguage] = useState("English");
  const [callStarted, setCallStarted] = useState(false);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!callStarted) return;

    const timer = setInterval(() => {
      setSeconds((prev) => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [callStarted]);

  const formatTime = () => {
    const minutes = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");

    const secs = (seconds % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${secs}`;
  };

  const handleStartCall = () => {
    if (phone.trim().length < 10) return;

    setCallStarted(true);
  };

  const handleEndCall = () => {
    setCallStarted(false);
    setSeconds(0);
  };

  return (
    <div className="voice-support-page">

      {/* HEADER */}
      <header className="voice-support-header">

        <button
          className="voice-support-back"
          onClick={onBack}
        >
          <ArrowLeft size={21} />
        </button>

        <div className="voice-support-title">

          {/* LOGO BESIDE NIRBHAYMIND */}
          <div className="voice-support-logo">
            <img
              src={nirbhaymindLogo}
              alt="NirbhayMind"
            />
          </div>

          <div>
            <h1>NirbhayMind</h1>
            <p>Voice Support</p>
          </div>

        </div>

      </header>


      {/* MAIN */}
      <main className="voice-support-content">

        {!callStarted ? (

          <>
            {/* INTRO */}
            <div className="voice-support-intro">

              <div className="voice-support-phone-icon">
                <Phone size={30} />
              </div>

              <h2>IVRS Call</h2>

              <p>
                Get support through a guided voice call
                in your preferred language.
              </p>

            </div>


            {/* LANGUAGE */}
            <div className="voice-support-card">

              <div className="voice-support-label">
                <Globe2 size={18} />
                <span>Preferred Language</span>
              </div>

              <div className="voice-language-options">

                {[
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
                ].map((item) => (
                  <button
                    key={item}
                    className={
                      language === item
                        ? "voice-language active"
                        : "voice-language"
                    }
                    onClick={() => setLanguage(item)}
                  >
                    {item}
                  </button>
                ))}

              </div>

            </div>


            


            {/* START CALL */}
            <div className="nhaa-helpline-card">

              <div className="nhaa-helpline-header">
                  <div className="nhaa-helpline-icon">
                     <Phone size={20} />
                  </div>

                 <div>
                     <h3>NHAA Helpline</h3>
                     <p>National Helpline Against Atrocities</p>
                 </div>
             </div>

            <div className="nhaa-number-row">
                 <div>
                     <span>National Helpline</span>
                     <strong>14566</strong>
                </div>

                  <a
                     href="tel:14566"
                     className="nhaa-call-button"
                     onClick={handleStartCall}
                  >
                     <Phone size={17} />
                     Call
                   </a>
               </div>

               <div className="nhaa-number-row">
                 <div>
                      <span>Toll Free Support</span>
                     <strong>18002021989</strong>
                 </div>

                 <a
                     href="tel:18002021989"
                     className="nhaa-call-button secondary"
                      onClick={handleStartCall}
                 >
                     <Phone size={17} />
                      Call
                 </a>
             </div>
          </div>


            {/* PRIVACY */}
            <div className="voice-support-note">

              <ShieldCheck size={18} />

              <p>
                Your information is kept private and is
                used only to provide support.
              </p>

            </div>

          </>

        ) : (

          /* =========================
             ACTIVE IVRS CALL SCREEN
             ========================= */

          <div className="ivrs-call-screen">

            <div className="ivrs-call-status">
              IVRS Call
            </div>

            <p className="ivrs-call-subtitle">
              Connecting you to NHAA
            </p>


            {/* PHONE CIRCLE */}
            <div className="ivrs-phone-circle">
              <Phone size={42} />
            </div>


            {/* TIMER */}
            <div className="ivrs-timer">
              {formatTime()}
            </div>


            {/* MESSAGE */}
            <p className="ivrs-message">
              Please speak when you are ready.
              <br />
              NirbhayMind will help you understand
              your well-being.
            </p>


            {/* WAVEFORM */}
            <div className="voice-wave">

              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>
              <span></span>

            </div>


            {/* LANGUAGE */}
            <div className="ivrs-number">
             NHAA • 14566
            </div>


            {/* END CALL */}
            <button
              className="end-call-button"
              onClick={handleEndCall}
            >
              <PhoneOff size={18} />
              End Call
            </button>


            {/* SECURITY */}
            <div className="ivrs-secure">
              <ShieldCheck size={15} />
              <span>This call is secure and confidential</span>
            </div>

          </div>

        )}

      </main>

    </div>
  );
}

export default VoiceSupport;