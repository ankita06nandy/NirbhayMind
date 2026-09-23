import { useState } from "react";
import {
  ArrowLeft,
  MessageSquare,
  Send,
  ShieldCheck,
  AlertTriangle,
} from "lucide-react";

import nirbhaymindLogo from "../assets/nirbhaymind_logo.jpeg";

function SMS({ onBack }) {
  const [message, setMessage] = useState(
    "Hello, I need support regarding my case."
  );

  const quickMessages = [
    "I need mental health support.",
    "I need help regarding my case.",
    "I feel unsafe and need assistance.",
    "I would like to speak with a counsellor.",
  ];

  const handleSendSMS = () => {
    if (!message.trim()) return;

    const phoneNumber = "14566";

    window.location.href = `sms:${phoneNumber}?body=${encodeURIComponent(
      message
    )}`;
  };

  return (
    <div className="sms-page">

      {/* HEADER */}
      <header className="sms-header">
        <button className="sms-back" onClick={onBack}>
          <ArrowLeft size={21} />
        </button>

        <div className="sms-title">
          <div className="sms-logo">
            <img src={nirbhaymindLogo} alt="NirbhayMind" />
          </div>

          <div>
            <h1>SMS Support</h1>
            <p>Reach out when you need help</p>
          </div>
        </div>
      </header>

      {/* CONTENT */}
      <main className="sms-content">

        <section className="sms-hero">
          <div className="sms-hero-icon">
            <MessageSquare size={28} />
          </div>

          <h2>Send a Support Message</h2>

          <p>
            You can send an SMS to the NHAA support service
            whenever you need assistance.
          </p>

          <div className="sms-number">
            <span>NHAA Support</span>
            <strong>14566</strong>
          </div>
        </section>

        {/* QUICK MESSAGES */}
        <section className="sms-section">

          <div className="sms-section-heading">
            <h2>Quick Messages</h2>
            <p>Choose a message or write your own.</p>
          </div>

          <div className="sms-quick-list">
            {quickMessages.map((item) => (
              <button
                key={item}
                className="sms-quick-button"
                onClick={() => setMessage(item)}
              >
                {item}
              </button>
            ))}
          </div>

        </section>

        {/* MESSAGE BOX */}
        <section className="sms-section">

          <div className="sms-section-heading">
            <h2>Your Message</h2>
            <p>Write what you would like to communicate.</p>
          </div>

          <div className="sms-input-card">

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type your message..."
              rows={5}
              maxLength={320}
            />

            <div className="sms-character-count">
              {message.length}/320
            </div>

          </div>

        </section>

        {/* SEND */}
        <button
          className="sms-send-button"
          onClick={handleSendSMS}
        >
          <Send size={18} />
          Send SMS to 14566
        </button>

        {/* SAFETY NOTE */}
        <div className="sms-safety-card">

          <div className="sms-safety-icon">
            <ShieldCheck size={20} />
          </div>

          <div>
            <strong>Private & Supportive</strong>

            <p>
              Your message is intended for support services.
              Avoid sharing passwords, OTPs, or other sensitive
              account information.
            </p>
          </div>

        </div>

        <div className="sms-emergency-note">
          <AlertTriangle size={17} />

          <p>
            If you are in immediate danger, contact local
            emergency services or a trusted person nearby.
          </p>
        </div>

      </main>
    </div>
  );
}

export default SMS;