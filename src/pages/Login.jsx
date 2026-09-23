import { ArrowLeft, LogIn, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useI18n } from "../i18n";
import nirbhaymindLogo from "../assets/nirbhaymind_logo.jpeg";

function Login({ onBack, onLogin, loading, error }) {
  const { t } = useI18n();
  const [victimId, setVictimId] = useState("");
  const [caseId, setCaseId] = useState("");

  const submit = (event) => {
    event.preventDefault();
    onLogin(victimId.trim(), caseId.trim());
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
        <p>{t("Use the ID details provided by your support service.")}</p>
        <label htmlFor="victim-id">{t("Victim ID")}</label>
        <input id="victim-id" value={victimId} onChange={(event) => setVictimId(event.target.value)} required />
        <label htmlFor="case-id">{t("Case ID")}</label>
        <input id="case-id" value={caseId} onChange={(event) => setCaseId(event.target.value)} required />
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
