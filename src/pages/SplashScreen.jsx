import { useEffect } from "react";
import "./SplashScreen.css";
import splashImage from "../assets/splash_screen.jpeg";

function SplashScreen({ onComplete }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete();
    }, 2200);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <main className="splash-screen">
      <img
        src={splashImage}
        alt="NirbhayMind"
        className="splash-image"
      />
    </main>
  );
}

export default SplashScreen;