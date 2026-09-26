import { ArrowLeft, HeartHandshake, LogIn, ShieldCheck, UserRound } from "lucide-react";
import { useState } from "react";
import { useI18n } from "../i18n";
import nirbhaymindLogo from "../assets/nirbhaymind_logo.jpeg";

function Login({ onBack, onLogin, loading, error }) {
  const { t } = useI18n();
  const [victimId, setVictimId] = useState("");
  const [caseId, setCaseId] = useState("");
  const [counsellorId, setCounsellorId] = useState("");
  const [role, setRole] = useState("victim");

  const submit = (event) => {
    event.preventDefault();
    onLogin(
      role,
      role === "victim" ? victimId.trim() : counsellorId.trim(),
      role === "victim" ? caseId.trim() : ""
    );
  };

  return (
    <main className="login-page">
      <form className="login-card" onSubmit={submit}>
        <button className="login-back" type="button" onClick={onBack}>
          <ArrowLeft size={19} />
          {t("Back")}
        </button>
        <img className="login-logo" src={nirbhaymindLogo} alt="NirbhayMind" />
        <h1>{t("Login to NirbhayMind")}</h1>
        <p>{t("Choose how you want to access NirbhayMind.")}</p>
        <div className="login-role-options" role="group" aria-label="Login type">
          <button
            type="button"
            className={`login-role-option ${role === "victim" ? "selected" : ""}`}
            onClick={() => setRole("victim")}
          >
            <UserRound size={18} />
            <span>Victim</span>
          </button>
          <button
            type="button"
            className={`login-role-option ${role === "counsellor" ? "selected" : ""}`}
            onClick={() => setRole("counsellor")}
          >
            <HeartHandshake size={18} />
            <span>Counsellor</span>
          </button>
        </div>
        {role === "victim" ? (
          <>
            <label htmlFor="victim-id">{t("Victim ID")}</label>
            <input
              id="victim-id"
              type="text"
              placeholder="Victim ID"
              value={victimId}
              onChange={(e) => setVictimId(e.target.value)}
            />
            <label htmlFor="case-id">{t("Case ID")}</label>
            <input
              id="case-id"
              type="text"
              placeholder="Case ID"
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
            />
          </>
        ) : (
          <>
            <label htmlFor="counsellor-id">Counsellor ID</label>
            <input
              id="counsellor-id"
              type="text"
              placeholder="e.g. COU1001"
              value={counsellorId}
              onChange={(e) => setCounsellorId(e.target.value)}
            />
          </>
        )}
        {error && <div className="login-error" role="alert">{t(error)}</div>}
        <button className="login-submit" type="submit" disabled={loading}>
          <LogIn size={18} />
          {loading ? t("Checking details...") : t("Login")}
        </button>
        <div className="login-privacy">
          <ShieldCheck size={16} />
          {t("Your information is private and secure.")}
        </div>
      </form>
    </main>
  );
}

export default Login;
