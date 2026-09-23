import { useState } from "react";
import {
  ArrowLeft,
  Send,
  Bot,
  User,
} from "lucide-react";

import nirbhaymindLogo from "../assets/nirbhaymind_logo.jpeg";

function getAIResponse(message) {
  const text = message.toLowerCase();

  // Immediate safety / threat-related messages
  if (
    text.includes("threat") ||
    text.includes("danger") ||
    text.includes("unsafe") ||
    text.includes("attack") ||
    text.includes("harm me")
  ) {
    return "Your safety comes first. If you are in immediate danger, please contact local emergency services or a trusted person nearby. You can also use the Report Threat option from your NirbhayMind dashboard.";
  }

  // Anxiety
  if (
    text.includes("anxious") ||
    text.includes("anxiety") ||
    text.includes("panic") ||
    text.includes("worried") ||
    text.includes("worry")
  ) {
    return "It sounds like you're carrying a lot of worry right now. Try taking a few slow breaths and focus on what you can control at this moment. If this feeling continues, consider talking to a counsellor.";
  }

  // Stress
  if (
    text.includes("stress") ||
    text.includes("stressed") ||
    text.includes("pressure") ||
    text.includes("overwhelmed")
  ) {
    return "I'm sorry you're feeling under pressure. You don't have to handle everything at once. Taking a short break, breathing slowly, and talking to someone you trust may help. Would you like to tell me what's causing the most stress?";
  }

  // Sleep
  if (
    text.includes("sleep") ||
    text.includes("insomnia") ||
    text.includes("can't sleep") ||
    text.includes("cannot sleep")
  ) {
    return "Poor sleep can make stress and emotions feel stronger. Try keeping your surroundings calm and taking some time away from screens before sleeping. If sleep problems continue, consider speaking with a healthcare professional.";
  }

  // Case-related concerns
  if (
    text.includes("case") ||
    text.includes("court") ||
    text.includes("hearing") ||
    text.includes("investigation")
  ) {
    return "I understand that dealing with a case can feel stressful and uncertain. You don't have to navigate those feelings alone. Your NirbhayMind dashboard can also help you access legal aid, support services, and counselling.";
  }

  // Sadness
  if (
    text.includes("sad") ||
    text.includes("cry") ||
    text.includes("lonely") ||
    text.includes("alone")
  ) {
    return "I'm glad you shared that with me. Feeling low or alone can be difficult. Please consider reaching out to someone you trust or a counsellor who can support you personally.";
  }

  // Positive emotions
  if (
    text.includes("good") ||
    text.includes("happy") ||
    text.includes("better") ||
    text.includes("fine")
  ) {
    return "I'm glad to hear that. 🌿 Keep taking care of yourself and remember that it's okay to check in again whenever you need support.";
  }

  // Default response
  return "Thank you for sharing that with me. I'm here to listen. You can tell me more about how you're feeling, what's worrying you, or what you'd like support with.";
}

function AIChat({ onBack }) {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello Ankita 🌿 I'm here to listen. How are you feeling today?",
    },
  ]);

  const handleSend = () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmedMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    setTimeout(() => {
      const aiResponse = getAIResponse(trimmedMessage);

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: aiResponse,
        },
      ]);
    }, 600);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <div
      className="ai-chat-page"
      style={{
        width: "100%",
        minHeight: "100vh",
        backgroundColor: "#f8f3ec",
        backgroundImage: "none",
        display: "flex",
        flexDirection: "column",
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        overflow: "hidden",
      }}
    >

      {/* ================= HEADER ================= */}

      <div
        className="ai-chat-header"
        style={{
          width: "100%",
          boxSizing: "border-box",
          display: "flex",
          alignItems: "center",
          gap: "14px",
          padding: "18px 28px",
          backgroundColor: "#fffaf4",
          backgroundImage: "none",
          borderBottom: "1px solid #eadfd5",
          flexShrink: 0,
        }}
      >

        {/* Back Button */}

        <button
          className="ai-chat-back"
          onClick={onBack}
        >
          <ArrowLeft size={21} />
        </button>


        {/* Logo + Title */}

        <div
          className="ai-chat-title"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            background: "transparent",
          }}
        >

          <div
            className="ai-chat-logo"
            style={{
              width: "34px",
              height: "34px",
              minWidth: "34px",
              minHeight: "34px",
              maxWidth: "34px",
              maxHeight: "34px",
              flexShrink: 0,
              borderRadius: "50%",
              overflow: "hidden",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#e7eee8",
            }}
          >
            <img
              src={nirbhaymindLogo}
              alt="NirbhayMind"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
              }}
            />
          </div>


          <div>
            <h1>NirbhayMind AI</h1>
            <p>A safe space to talk</p>
          </div>

        </div>

      </div>


      {/* ================= CHAT AREA ================= */}

      <div
        className="ai-chat-messages"
        style={{
          flex: 1,
          width: "100%",
          maxWidth: "900px",
          boxSizing: "border-box",
          margin: "0 auto",
          padding: "30px 24px",
          overflowY: "auto",
          background: "transparent",
          backgroundImage: "none",
        }}
      >

        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`ai-message-row ${msg.sender}`}
          >

            <div className="ai-message-avatar">

              {msg.sender === "ai" ? (
                <Bot size={17} />
              ) : (
                <User size={17} />
              )}

            </div>


            <div className="ai-message-bubble">
              {msg.text}
            </div>

          </div>
        ))}

      </div>


      {/* ================= INPUT ================= */}

      <div
        className="ai-chat-input-area"
        style={{
          width: "100%",
          maxWidth: "900px",
          boxSizing: "border-box",
          margin: "0 auto",
          padding: "16px 24px 24px",
          display: "flex",
          gap: "10px",
          background: "transparent",
          backgroundImage: "none",
          flexShrink: 0,
        }}
      >

        <input
          type="text"
          placeholder="Type your message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button onClick={handleSend}>
          <Send size={19} />
        </button>

      </div>

    </div>
  );
}

export default AIChat;