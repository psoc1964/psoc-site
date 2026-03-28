"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Navbar from "./components/compo/Navbar";
import IntroLogo from "./components/compo/IntroLogo";
import Hero from "./components/compo/hero";
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
    <main className="bg-black text-white relative min-h-screen">
      {/* Navigation transition overlay */}
      <div
        className={`fixed inset-0 z-[60] pointer-events-none transition-all duration-300 ${
          isTransitioning
            ? "backdrop-blur-xl bg-black/20 opacity-100"
            : "backdrop-blur-none opacity-0"
        }`}
      />

      {/* IntroLogo - shows on first load */}
      {!introDone && <IntroLogo onFinish={() => setIntroDone(true)} />}

      {/* Navbar is OUTSIDE the scaling div so it never moves or scales */}
      <Navbar visible={introDone} onNavigate={handleNavTransition} />

      {/* Page content — no scale transform so navbar stays fixed above it */}
      <div
        className={`transition-opacity duration-300 ${
          isTransitioning ? "opacity-80" : "opacity-100"
        }`}
      >
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