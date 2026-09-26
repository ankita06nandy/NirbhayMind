import { useState } from "react";
import {
  ArrowLeft,
  Send,
  Bot,
  User,
} from "lucide-react";

import nirbhaymindLogo from "../assets/nirbhaymind_logo.jpeg";
import { sendChatMessage } from "../api";
import { useI18n } from "../i18n";

function AIChat({ onBack }) {
  const { t } = useI18n();
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello 🌿 I'm here to listen. How are you feeling today?",
      translationKey: "Hello 🌿 I'm here to listen. How are you feeling today?",
    },
  ]);

  const handleSend = async () => {
    const trimmedMessage = message.trim();

    if (!trimmedMessage || isSending) return;

    const userMessage = {
      id: Date.now(),
      sender: "user",
      text: trimmedMessage,
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsSending(true);

    try {
      const { text } = await sendChatMessage(trimmedMessage);
      setMessages((prev) => [...prev, { id: Date.now() + 1, sender: "ai", text }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: error.message.includes("API key")
            ? "AI support is not configured yet. Please ask the administrator to add a valid Gemini API key."
            : `Unable to connect to support: ${error.message}`,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
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
            <p>{t("A safe space to talk")}</p>
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
              {msg.translationKey ? t(msg.translationKey) : msg.text}
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
          placeholder={t("Type your message...")}
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
        />

        <button onClick={handleSend} disabled={isSending || !message.trim()}>
          <Send size={19} />
        </button>

      </div>

    </div>
  );
}

export default AIChat;