import welcomeImage from "../assets/welcome.jpeg";
import moodImage from "../assets/mood.jpeg";
import supportImage from "../assets/support.jpeg";
import {
  ArrowRight,
  Brain,
  HeartHandshake,
  Sparkles,
} from "lucide-react";
import { useRef, useState } from "react";
import nirbhaymindLogo from "../assets/nirbhaymind_logo.jpeg";
import "./Landing.css";

function Landing({ onLogin, onCounsellorDemo}) {
  const [currentSlide, setCurrentSlide] = useState(0);

  const touchStartX = useRef(null);
  const touchEndX = useRef(null);

  const slides = [
    {
      image: welcomeImage,
      eyebrow: "WELCOME TO NIRBHAYMIND",
      title: "You will be okay. Storms don't last forever.",
      description:
        "Life always finds a way. And so will you",
    },
    {
      image: moodImage,
      eyebrow: "It's gonna be okay",
      title: "Talk a little nicer to yourself today.",
      description:
        "You'll be okay. Eventually all waves settle.",
    },
    {
      image: supportImage,
      eyebrow: "Be gentle with your heart.",
      title: "Feel how you need to feel!",
      description:
        "It's okay to not be okay. Your feelings are valid, and your journey is unique.",
    },
  ];

  const slide = slides[currentSlide];
  

  const goNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((prev) => prev + 1);
    } else {
      onLogin();
    }
  };

  const goPrevious = () => {
    if (currentSlide > 0) {
      setCurrentSlide((prev) => prev - 1);
    }
  };

  const handleTouchStart = (event) => {
    touchStartX.current = event.touches[0].clientX;
  };

  const handleTouchMove = (event) => {
    touchEndX.current = event.touches[0].clientX;
  };

  const handleTouchEnd = () => {
    if (
      touchStartX.current === null ||
      touchEndX.current === null
    ) {
      return;
    }

    const distance =
      touchStartX.current - touchEndX.current;

    if (distance > 50) {
      goNext();
    }

    if (distance < -50) {
      goPrevious();
    }

    touchStartX.current = null;
    touchEndX.current = null;
  };

  return (
    <main
      className="onboarding-page"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* HEADER */}
      <header className="onboarding-header">
        <div className="onboarding-brand">
          <div className="onboarding-logo">
            <img
              src={nirbhaymindLogo}
              alt="NirbhayMind"
            />
          </div>

          <span>NirbhayMind</span>
        </div>

        {currentSlide < slides.length - 1 && (
          <button
            className="onboarding-skip"
            onClick={onLogin}
          >
            Skip
          </button>
        )}
      </header>

      {/* MAIN SLIDE */}
      <section className="onboarding-content">
        <div className="onboarding-visual">
          <div className="sun-glow"></div>

          <div className="visual-ring ring-one"></div>
          <div className="visual-ring ring-two"></div>

          <div
            className="onboarding-icon"
            key={currentSlide}
          >
            <img
              src={slide.image}
              alt=""
              className="onboarding-image"
            />
          </div>

          <div className="floating-symbol symbol-one">
            ✦
          </div>

          <div className="floating-symbol symbol-two">
            ✦
          </div>

          <div className="floating-symbol symbol-three">
            •
          </div>
        </div>

        <div
          className="onboarding-text"
          key={`text-${currentSlide}`}
        >
          <span className="onboarding-eyebrow">
            {slide.eyebrow}
          </span>

          <h1>{slide.title}</h1>

          <p>{slide.description}</p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="onboarding-footer">
        <div className="onboarding-dots">
          {slides.map((_, index) => (
            <button
              key={index}
              className={`onboarding-dot ${
                index === currentSlide ? "active" : ""
              }`}
              onClick={() => setCurrentSlide(index)}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        <button
          className="onboarding-next"
          onClick={goNext}
        >
          <span>
            {currentSlide === slides.length - 1
              ? "Get Started"
              : "Next"}
          </span>

          <ArrowRight size={19} />
        </button>
        <button
          className="counsellor-demo-button"
          onClick={onCounsellorDemo}
        >
          <HeartHandshake size={17} />
          <span>District Counsellor Demo</span>
        </button>
      </footer>
    </main>
  );
}

export default Landing;