"use client";

import Image from "next/image";
import { useEffect, useRef, memo, useMemo } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  ready: boolean;
}

const LearnMoreLink = memo(() => (
  <a
    href="#about"
    className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium border-b-2 border-white/80 pb-1 hover:border-white hover:gap-3 transition-all duration-300 group w-fit"
  >
    Learn more
    <svg
      className="w-3.5 h-3.5 sm:w-4 sm:h-4 transition-transform duration-300 group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  </a>
));
LearnMoreLink.displayName = "LearnMoreLink";

const ScrollIndicator = memo(() => (
  <div className="absolute bottom-4 sm:bottom-6 md:bottom-8 lg:bottom-12 left-1/2 -translate-x-1/2 z-40 animate-bounce">
    <div className="flex flex-col items-center gap-1 sm:gap-1.5 text-white/40">
      <span className="text-[9px] sm:text-[10px] tracking-widest uppercase">Scroll</span>
      <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
      </svg>
    </div>
  </div>
));
ScrollIndicator.displayName = "ScrollIndicator";

export default function Hero({ ready }: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageRef   = useRef<HTMLDivElement | null>(null);
  const leftRef    = useRef<HTMLDivElement | null>(null);
  const rightRef   = useRef<HTMLDivElement | null>(null);
  const lensRef    = useRef<HTMLDivElement | null>(null);

  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  }, []);

  const isTablet = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth >= 768 && window.innerWidth < 1024;
  }, []);

  const scrollConfig = useMemo(() => ({
    imageParallax:   isMobile ? { yPercent: -6 } : isTablet ? { yPercent: -10 } : { yPercent: -15 },
    contentParallax: isMobile ? { y: -12 }       : isTablet ? { y: -24 }        : { y: -40 },
  }), [isMobile, isTablet]);

  // Scroll animations
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.to(imageRef.current, {
        ...scrollConfig.imageParallax,
        ease: "none", force3D: true,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top", end: "bottom top",
          scrub: isMobile ? 0.4 : 1,
        },
      });
      gsap.to([leftRef.current, rightRef.current], {
        ...scrollConfig.contentParallax,
        ease: "none", force3D: true,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top", end: "bottom top",
          scrub: isMobile ? 0.4 : 1,
        },
      });
      gsap.to(lensRef.current, {
        opacity: 0.5, ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top", end: "bottom top",
          scrub: 1,
        },
      });
    }, sectionRef);
    return () => ctx.revert();
  }, [isMobile, scrollConfig]);

  // Intro animation
  useEffect(() => {
    if (!ready || !sectionRef.current) return;
    const ctx = gsap.context(() => {
      gsap.set(imageRef.current, { scale: 1.12, opacity: 0, filter: "blur(16px)" });
      gsap.set([leftRef.current, rightRef.current], { y: 50, opacity: 0, filter: "blur(8px)" });

      const tl = gsap.timeline({ defaults: { ease: "power3.out", force3D: true } });

      if (isMobile) {
        tl.to(sectionRef.current, { opacity: 1, duration: 0.7, ease: "power2.out" })
          .to(imageRef.current,   { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.6 }, 0.1)
          .to(leftRef.current,    { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2 }, 0.6)
          .to(rightRef.current,   { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.2 }, 0.85);
      } else {
        tl.to(sectionRef.current, { opacity: 1, duration: 1, ease: "power2.out" })
          .to(imageRef.current,   { scale: 1, opacity: 1, filter: "blur(0px)", duration: 2.2 }, 0.2)
          .to(leftRef.current,    { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.6 }, 0.9)
          .to(rightRef.current,   { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.6 }, 1.1);
      }
    }, sectionRef);
    return () => ctx.revert();
  }, [ready, isMobile]);

  return (
    <section
      ref={sectionRef}
      className={`relative w-full overflow-hidden bg-black ${!ready ? "pointer-events-none" : ""}`}
      style={{ opacity: 0, height: "100svh", marginTop: 0 }}
    >

      {/* ── Background image ──────────────────────────────────────── */}
      <div
        ref={imageRef}
        className="absolute inset-0 will-change-transform"
        style={{ transform: "translateZ(0)" }}
      >
        {/* Mobile + Tablet + Portrait monitors: portrait crop */}
        <div className="block lg:hidden absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/camera2-mobile.jpeg"
            alt="Vintage camera"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Desktop landscape only — also overridden if monitor is portrait orientation */}
        <div className="hidden lg:block absolute inset-0 portrait:!hidden">
          <Image
            src="/camera1.jpg"
            alt="Vintage camera"
            fill
            priority
            quality={90}
            sizes="100vw"
            className="object-cover object-center"
          />
        </div>

        {/* Portrait monitor fallback — lg+ but in portrait orientation */}
        <div className="hidden portrait:lg:block absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/camera2-mobile.jpeg"
            alt="Vintage camera"
            className="w-full h-full object-cover object-center"
          />
        </div>

        {/* Overlay — lighter on mobile so image shows through more */}
        <div className="absolute inset-0 bg-black/40 md:bg-black/45" />
      </div>

      {/* ── Lens vignette ─────────────────────────────────────────── */}
      <div
        ref={lensRef}
        className="absolute inset-0 z-20 pointer-events-none will-change-[opacity]"
        style={{
          background: "radial-gradient(circle at center, transparent 15%, rgba(0,0,0,0.7) 88%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* ── Mobile text-area blend layer ──────────────────────────────
           Soft feathered gradient behind the top text block only,
           so heading sits on a dark-to-transparent surface that
           bleeds naturally into the image beneath it. md+ hidden.
      ─────────────────────────────────────────────────────────────── */}
      <div
        className="md:hidden absolute inset-x-0 top-0 z-25 pointer-events-none"
        style={{
          height: "68%",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.55) 45%, rgba(0,0,0,0.18) 78%, transparent 100%)",
          backdropFilter: "blur(0.8px)",
          WebkitBackdropFilter: "blur(0.8px)",
        }}
      />

      {/* ── Content ───────────────────────────────────────────────────
           Mobile  (<768)  : single column, stacked vertically
           Tablet  (768-1023): single column, centered, bigger type
           Desktop (≥1024) : 3-col grid, left headline + right stat
      ──────────────────────────────────────────────────────────────── */}
      <div
        className={`
          relative z-30 h-full
          max-w-7xl mx-auto
          px-5 sm:px-8 md:px-10 lg:px-16
          flex flex-col justify-start gap-0
          lg:grid lg:grid-cols-3 lg:items-center lg:gap-0
          portrait:lg:flex portrait:lg:flex-col portrait:lg:grid-none
        `}
        style={{ paddingTop: "max(88px, 14vh)", paddingBottom: "max(72px, 11vh)" }}
      >

        {/* LEFT: headline — stays near top over the image */}
        <div
          ref={leftRef}
          className="will-change-transform lg:col-span-2 flex flex-col gap-3 sm:gap-4 lg:gap-6 mt-6 sm:mt-8"
          style={{ transform: "translateZ(0)" }}
        >
          {/* Eyebrow */}
          <div className="flex flex-col gap-2.5">
            <div className="w-6 h-px bg-white/30 rounded-full" />
            <p className="text-[9px] sm:text-[10px] md:text-[11px] tracking-[0.5em] uppercase text-white/40 font-medium">
              PSOC · BIT Mesra
            </p>
          </div>

          {/* Heading */}
          <h1
            className="font-serif leading-[1.08] text-[2.2rem] sm:text-[2.8rem] md:text-[3.4rem] lg:text-[4.2rem] xl:text-[5rem]"
            style={{ textShadow: "0 2px 24px rgba(0,0,0,0.9), 0 1px 6px rgba(0,0,0,0.7)" }}
          >
            Capture your
            <br />
            moment through
            <br />
            our scope.
          </h1>
        </div>

        {/* DESCRIPTION + CTA — pushed into the dark black zone below the image */}
        <div
          className="will-change-transform lg:hidden flex flex-col gap-3 mt-auto mb-2"
          style={{ transform: "translateZ(0)" }}
        >
          <p
            className="text-white/60 leading-[1.75] text-[13px] max-w-[290px] sm:text-[14px] sm:max-w-sm"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.8)" }}
          >
            PSOC is a community of visual storytellers dedicated to capturing
            moments with intention, clarity, and creative vision.
          </p>
          <LearnMoreLink />
        </div>

        {/* Description + CTA for desktop (stays inside left col) */}
        <div className="hidden lg:col-span-2 lg:flex flex-col gap-4 mt-4">
          <p
            className="text-white/55 leading-[1.75] text-base max-w-md"
            style={{ textShadow: "0 1px 12px rgba(0,0,0,0.8)" }}
          >
            PSOC is a community of visual storytellers dedicated to capturing
            moments with intention, clarity, and creative vision.
          </p>
          <LearnMoreLink />
        </div>

        {/* CENTER spacer — desktop grid only */}
        <div className="hidden lg:block" />

        {/* RIGHT: stat */}
        <div
          ref={rightRef}
          className="will-change-transform lg:text-right mt-auto lg:mt-0"
          style={{ transform: "translateZ(0)" }}
        >
          {/* Mobile + tablet only — hidden on desktop */}
          <div className="flex items-center gap-5 lg:hidden">
            <div className="flex-shrink-0">
              <h2
                className="font-light tracking-tight leading-none text-white text-[2.4rem] sm:text-[2.8rem]"
                style={{ textShadow: "0 2px 20px rgba(0,0,0,0.8)" }}
              >
                280K+
              </h2>
              {/* Subtle white rule — no color, blends with the dark scene */}
              <div className="h-px mt-2 w-10 sm:w-12 bg-white/25" />
            </div>
            {/* Thin vertical separator */}
            <div className="w-px h-9 bg-white/10 flex-shrink-0" />
            <p className="text-white/40 text-[11px] sm:text-[12px] leading-snug max-w-[150px]"
              style={{ textShadow: "0 1px 8px rgba(0,0,0,0.9)" }}
            >
              Frames captured across events, workshops, and everyday campus life.
            </p>
          </div>
        </div>

      </div>

      {/* ── Scroll indicator ──────────────────────────────────────── */}
      <ScrollIndicator />
    </section>
  );
}