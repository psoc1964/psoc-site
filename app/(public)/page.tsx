"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/compo/Navbar";
import IntroLogo from "./components/compo/IntroLogo";
import Hero from "./hero";
import About from "./components/compo/About";
import Footer from "./components/compo/Footer";

export default function Page() {
  const [introDone, setIntroDone] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!introDone) return;

    const hash = window.location.hash?.slice(1);
    if (hash) {
      const el = document.getElementById(hash);
      if (el) {
        requestAnimationFrame(() => {
          el.scrollIntoView({ behavior: "smooth" });
        });
      }
    }
  }, [introDone]);

  const handleNavTransition = (targetId: string) => {
    if (targetId === "album") {
      setIsTransitioning(true);
      setTimeout(() => {
        router.push("/album");
      }, 500);
      return;
    }

    setIsTransitioning(true);

  setTimeout(() => {
    const element = document.getElementById(targetId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }

    setTimeout(() => {
      setIsTransitioning(false);
    }, 600);
  }, 400);
};

return (
    <main className="bg-black text-white relative">
      {/* Navigation transition overlay */}
      <div
        className={`fixed inset-0 z-100 pointer-events-none transition-all duration-300 ${
          isTransitioning
            ? "backdrop-blur-xl bg-black/20 opacity-100"
            : "backdrop-blur-none opacity-0"
        }`}
      />

      {/* IntroLogo - shows on first load, zooms out dramatically */}
      {!introDone && <IntroLogo onFinish={() => setIntroDone(true)} />}

      {/* Main content - always rendered but Hero is blurred until IntroLogo finishes */}
      <div
        className={`transition-all duration-300 ${
          isTransitioning ? "scale-[0.98]" : "scale-100"
        }`}
      >
        {/* Navbar fades in after IntroLogo completes */}
        <Navbar visible={introDone} onNavigate={handleNavTransition} />

        {/* Hero section - visible but blurred during IntroLogo, comes into focus after */}
        <section id="home">
          <Hero ready={introDone} />
        </section>

        <section id="about">
          <About />
        </section>

        <Footer />
      </div>
    </main>
  );
}