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

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      /* ================= INITIAL OUT-OF-FOCUS STATE ================= */
      gsap.set(sectionRef.current, { opacity: 0 });

      gsap.set(imageRef.current, {
        scale: 1.15,
        filter: "blur(20px)",
      });

      gsap.set([leftRef.current, rightRef.current], {
        y: 60,
        opacity: 0,
        filter: "blur(10px)",
      });

      /* ================= LENS FOCUS INTRO ================= */
      const intro = gsap.timeline({
        defaults: { ease: "power3.out" },
      });

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
            duration: 2.8, // slow focus pull
          },
          0
        )
        .to(
          leftRef.current,
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.8,
          },
          0.7
        )
        .to(
          rightRef.current,
          {
            y: 0,
            opacity: 1,
            filter: "blur(0px)",
            duration: 1.6,
          },
          1
        );

      /* ================= SCROLL EFFECTS (AFTER INTRO) ================= */
      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top top",
        end: "bottom top",
        scrub: true,
        animation: gsap.to(imageRef.current, {
          yPercent: -18,
          ease: "none",
        }),
      });

      gsap.to(bgTextRef.current, {
        y: -120,
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

        {/* subtle atmospheric layers */}
        <div className="absolute inset-0 backdrop-blur-[2px] opacity-20" />
        <div className="absolute inset-0 bg-black/35" />
      </div>

      {/* ================= CONTENT ================= */}
      <div className="relative z-10 max-w-7xl mx-auto px-8 lg:px-16 h-full grid grid-cols-1 lg:grid-cols-3 items-center">
        {/* LEFT TEXT */}
        <div ref={leftRef} className="space-y-10">
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif leading-[1.05] tracking-tight">
            Capture your
            <br />
            moment through
            <br />
            our scope.
          </h1>

          <p className="text-gray-200 text-base max-w-md leading-relaxed">
            PSOC is a community of visual storytellers dedicated to capturing
            moments with intention, clarity, and creative vision.
          </p>

          <a
            href="#about"
            className="inline-block text-sm font-medium border-b border-white/80 pb-1 hover:opacity-80 transition"
          >
            Learn more
          </a>
        </div>

        <div />

        {/* RIGHT METRIC */}
        <div ref={rightRef} className="text-right space-y-6">
          <h2 className="text-6xl font-light tracking-tight">280K+</h2>

          <p className="text-gray-200 text-sm leading-relaxed max-w-sm ml-auto">
            Frames captured across events, workshops,
            and everyday campus life.
          </p>
        </div>
      </div>

      {/* ================= BACKGROUND TYPOGRAPHY ================= */}
      <div className="absolute inset-x-0 bottom-[-5rem] pointer-events-none">
        <h1
          ref={bgTextRef}
          className="text-center text-[16vw] font-bold text-white/10 leading-none"
        >
          
        </h1>
      </div>
    </section>
  );
}
