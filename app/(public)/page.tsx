"use client";

import { useState } from "react";
import Navbar from "./components/compo/Navbar";
import IntroLogo from "./components/compo/IntroLogo";
import Hero from "./hero";
import About from "./components/compo/About";
import Footer from "./components/compo/Footer";

export default function Page() {
  const [introDone, setIntroDone] = useState(false);

  return (
    <main className="bg-black text-white">
      {!introDone && (
        <IntroLogo onFinish={() => setIntroDone(true)} />
      )}

      {introDone && (
        <>
          <Navbar visible={introDone} />

          <section id="home">
            <Hero />
          </section>

          <section id="about">
            <About />
          </section>

          <Footer />
        </>
      )}
    </main>
  );
}
