import { Brain, CheckCircle2, HeartHandshake, LockKeyhole, Menu, ShieldCheck, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import nirbhaymindLogo from "../assets/nirbhaymind_logo.jpeg";
import { useI18n } from "../i18n";

function Landing({ onLogin }) {
  const { t } = useI18n();
  const [menuOpen, setMenuOpen] = useState(false);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  return (
    <main className="landing-page">
      <nav className="landing-navbar">
        <button className="landing-brand" onClick={() => scrollTo("hero")} aria-label="Go to top">
          <span className="landing-logo small">
            <img src={nirbhaymindLogo} alt="NirbhayMind" />
          </span>
          <span>NirbhayMind</span>
        </button>
        <button className="landing-menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
          <Menu size={22} />
        </button>
        <div className={`landing-links ${menuOpen ? "open" : ""}`}>
          <button onClick={() => scrollTo("about")}>{t("What Is NirbhayMind?")}</button>
          <button onClick={() => scrollTo("features")}>{t("Key Features")}</button>
          <button onClick={() => scrollTo("how-it-works")}>{t("How It Works")}</button>
          <button className="landing-nav-login" onClick={onLogin}>{t("Login")}</button>
        </div>
      </nav>

      <section id="hero" className="landing-hero landing-section">
        <div className="landing-hero-copy">
          <p className="landing-eyebrow"><Sparkles size={15} /> NirbhayMind</p>
          <h1>{t("Your Mind Matters")}</h1>
          <p className="landing-hero-title">{t("Your Voice. Your Well-being. Our Priority.")}</p>
          <p className="landing-description">
            {t("A safe and private place to access your case, support, and well-being services.")}
          </p>
          <div className="landing-hero-actions">
              <button className="landing-secondary-button" onClick={() => scrollTo("about")}>
                {t("Learn more")}
              </button>
          </div>
          <div className="landing-privacy">
            <ShieldCheck size={17} />
            <span>{t("Your information is private and secure.")}</span>
          </div>
        </div>
        <div className="landing-hero-art" aria-hidden="true">
          <div className="landing-art-glow"></div>
          <Brain size={86} />
          <span>{t("A safe space to feel heard.")}</span>
        </div>
      </section>

      <section id="about" className="landing-section landing-about">
        <div className="landing-section-heading">
          <p className="landing-eyebrow">{t("What Is NirbhayMind?")}</p>
          <h2>{t("Support that puts you first.")}</h2>
          <p>{t("NirbhayMind brings your well-being, case information, and support services together in one private space.")}</p>
        </div>
        <div className="landing-about-grid">
          <InfoCard icon={<HeartHandshake />} title={t("Compassionate support")} text={t("Reach support when you need someone to listen.")} />
          <InfoCard icon={<LockKeyhole />} title={t("Private by design")} text={t("Your personal information is protected throughout your journey.")} />
          <InfoCard icon={<Users />} title={t("Connected care")} text={t("Access counselling, legal aid, helplines, and case support.")} />
        </div>
      </section>

      <section id="features" className="landing-section landing-features">
        <div className="landing-section-heading">
          <p className="landing-eyebrow">{t("Key Features")}</p>
          <h2>{t("Everything you need, in one place.")}</h2>
        </div>
        <div className="landing-feature-grid">
          {[
            [<Brain />, "Well-being check-ins", "Understand changes in your well-being over time."],
            [<ShieldCheck />, "Case and safety support", "Stay informed about your case and safety options."],
            [<HeartHandshake />, "Human support", "Connect with counselling, legal aid, and helplines."],
            [<Sparkles />, "A safe space to talk", "Share what you are feeling through supportive tools."],
          ].map(([icon, title, text]) => (
            <div className="landing-feature" key={title}>
              <div className="landing-feature-icon">{icon}</div>
              <h3>{t(title)}</h3>
              <p>{t(text)}</p>
            </div>
          ))}
        </div>
      </section>

      <section id="how-it-works" className="landing-section landing-steps">
        <div className="landing-section-heading">
          <p className="landing-eyebrow">{t("How It Works")}</p>
          <h2>{t("Your journey, made simpler.")}</h2>
        </div>
        <div className="landing-step-grid">
          {["Login securely", "Check your well-being", "Access the right support"].map((title, index) => (
            <div className="landing-step" key={title}>
              <span>{index + 1}</span>
              <div><h3>{t(title)}</h3><p>{t(["Use your Victim ID and Case ID to access your account.", "Complete a quick check-in whenever you need.", "Find your case updates, resources, and support options."][index])}</p></div>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section landing-trust">
        <CheckCircle2 size={28} />
        <div>
          <p className="landing-eyebrow">{t("Why Choose Us?")}</p>
          <h2>{t("You do not have to navigate this alone.")}</h2>
          <p>{t("NirbhayMind is designed to make support easier to find, understand, and access.")}</p>
        </div>
      </section>

      <section className="landing-section landing-cta">
        <h2>{t("Ready to take the next step?")}</h2>
        <p>{t("Your voice matters, and support is available.")}</p>
        <p className="landing-cta-note">{t("Login from the top-right corner to access your secure dashboard.")}</p>
      </section>

      <footer className="landing-footer">
        <strong>NirbhayMind</strong>
        <span>{t("Your Voice. Your Well-being. Our Priority.")}</span>
        <span>© 2026 NirbhayMind</span>
      </footer>
    </main>
  );
}

function InfoCard({ icon, title, text }) {
  return <div className="landing-info-card"><div className="landing-feature-icon">{icon}</div><h3>{title}</h3><p>{text}</p></div>;
}

export default Landing;
