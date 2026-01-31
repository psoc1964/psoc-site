"use client";

import Image from "next/image";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Hero() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const bgTextRef = useRef<HTMLHeadingElement | null>(null);
  const lensRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      /* ================= INITIAL STATE ================= */
      gsap.set(sectionRef.current, { opacity: 0 });

      gsap.set(imageRef.current, {
        scale: 1.15,
        filter: "blur(20px)",
      });

      gsap.set([leftRef.current, rightRef.current], {
        y: 80,
        opacity: 0,
        filter: "blur(15px)",
        scale: 0.95,
      });

      /* ================= INTRO FOCUS PULL WITH POP ================= */
      const intro = gsap.timeline({ defaults: { ease: "power3.out" } });

      intro
        .to(sectionRef.current, {
          opacity: 1,
          duration: 1.2,
        })
        .to(
          imageRef.current,
          {
            scale: 1.05,
            filter: "blur(0px)",
            duration: 2.8,
          },
          0
        )
        .to(
          leftRef.current,
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
            duration: 2,
          },
          0.7
        )
        .to(
          rightRef.current,
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            scale: 1,
            duration: 1.8,
          },
          1
        );

      /* ================= SCROLL: IMAGE PARALLAX ================= */
      gsap.to(imageRef.current, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      /* ================= SCROLL: CONTENT STAYS VISIBLE ================= */
      // Only slight parallax movement, no opacity change
      gsap.to([leftRef.current, rightRef.current], {
        y: -50,       // Gentle upward movement
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      /* ================= SCROLL: LENS VIGNETTE ================= */
      gsap.to(lensRef.current, {
        scale: 1.4,
        opacity: 0.35,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      /* ================= BG TYPOGRAPHY PARALLAX ================= */
      gsap.to(bgTextRef.current, {
        y: -140,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-screen w-full overflow-hidden bg-black"
    >
      {/* ================= BACKGROUND IMAGE ================= */}
      <div ref={imageRef} className="absolute inset-0">
        <Image
          src="/camera1.jpg"
          alt="Vintage camera"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* ================= LENS OVERLAY ================= */}
      <div
        ref={lensRef}
        className="absolute inset-0 z-20 pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at center, transparent 25%, rgba(0,0,0,0.55) 80%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* ================= CONTENT ================= */}
      <div className="relative z-30 max-w-7xl mx-auto px-8 lg:px-16 h-full grid grid-cols-1 lg:grid-cols-3 items-center gap-8">
        {/* LEFT */}
        <div ref={leftRef} className="space-y-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.05] drop-shadow-2xl">
            Capture your
            <br />
            moment through
            <br />
            our scope.
          </h1>

          <p className="text-gray-200 text-base max-w-md leading-relaxed drop-shadow-lg">
            PSOC is a community of visual storytellers dedicated to capturing
            moments with intention, clarity, and creative vision.
          </p>

          <a
            href="#about"
            className="inline-flex items-center gap-2 text-sm font-medium border-b-2 border-white/80 pb-1 hover:border-white hover:gap-3 transition-all duration-300 group"
          >
            Learn more
            <svg className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>

        <div />

        {/* RIGHT */}
        <div ref={rightRef} className="text-right space-y-6 lg:text-right text-left">
          <div className="inline-block">
            <h2 className="text-7xl md:text-8xl font-light tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent drop-shadow-2xl">
              280K+
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-blue-500 mt-2 ml-auto rounded-full"></div>
          </div>

          <p className="text-gray-200 text-sm leading-relaxed max-w-sm lg:ml-auto drop-shadow-lg">
            Frames captured across events, workshops,
            and everyday campus life.
          </p>
        </div>
      </div>

      {/* ================= BACKGROUND TEXT ================= */}
      <div className="absolute inset-x-0 bottom-[-6rem] pointer-events-none overflow-hidden">
        <h1
          ref={bgTextRef}
          className="text-center text-[16vw] font-bold text-white/10 leading-none select-none"
        >
          
        </h1>
      </div>

      {/* ================= SCROLL INDICATOR ================= */}
      <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 animate-bounce">
        <div className="flex flex-col items-center gap-2 text-white/60">
          <span className="text-xs tracking-widest uppercase">Scroll</span>
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
}