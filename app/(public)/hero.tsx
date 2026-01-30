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
      // HERO FADE IN (after intro)
      gsap.to(sectionRef.current, {
        opacity: 1,
        duration: 1,
        ease: "power2.out",
      });

      // LEFT CONTENT
      gsap.from(leftRef.current, {
        y: 80,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.2,
      });

      // RIGHT METRIC
      gsap.from(rightRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.4,
      });

      // IMAGE PARALLAX
      gsap.to(imageRef.current, {
        yPercent: -15,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      // BACKGROUND TYPOGRAPHY FLOAT
      gsap.to(bgTextRef.current, {
        y: -80,
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
      className="relative h-screen w-full overflow-hidden opacity-0"
    >
      {/* BACKGROUND IMAGE */}
      <div ref={imageRef} className="absolute inset-0">
        <Image
          src="/camera1.jpg"
          alt="Vintage camera"
          fill
          priority
          className="
            object-cover
            scale-105
            [mask-image:linear-gradient(to_bottom,black_85%,transparent)]
          "
        />

        {/* SOFT BLUR */}
        <div className="absolute inset-0 backdrop-blur-[4px] opacity-30" />

        {/* DARK OVERLAY */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* CONTENT */}
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
            className="inline-block text-sm font-medium border-b border-white pb-1 hover:opacity-80 transition"
          >
            Learn more
          </a>
        </div>

        {/* CENTER GAP */}
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

      {/* BACKGROUND TYPOGRAPHY */}
      <div className="absolute inset-x-0 bottom-[-4rem] pointer-events-none">
        <h1
          ref={bgTextRef}
          className="text-center text-[16vw] font-bold text-white/10 leading-none"
        >
          PSOC
        </h1>
      </div>
    </section>
  );
}
