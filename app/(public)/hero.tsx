"use client";

import Image from "next/image";
import { useEffect, useRef, memo, useMemo } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

interface HeroProps {
  /** Set to true once IntroLogo has finished — gates the intro animation. */
  ready: boolean;
}

// Memoized Learn More Link
const LearnMoreLink = memo(() => (
  <a
    href="#about"
    className="inline-flex items-center gap-2 text-sm font-medium border-b-2 border-white/80 pb-1 hover:border-white hover:gap-3 transition-all duration-300 group"
  >
    Learn more
    <svg
      className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M17 8l4 4m0 0l-4 4m4-4H3"
      />
    </svg>
  </a>
));

LearnMoreLink.displayName = "LearnMoreLink";

// Memoized Scroll Indicator
const ScrollIndicator = memo(() => (
  <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-40 animate-bounce">
    <div className="flex flex-col items-center gap-2 text-white/60">
      <span className="text-xs tracking-widest uppercase">Scroll</span>
      <svg
        className="w-6 h-6"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </div>
  </div>
));

ScrollIndicator.displayName = "ScrollIndicator";

export default function Hero({ ready }: HeroProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const imageRef = useRef<HTMLDivElement | null>(null);
  const leftRef = useRef<HTMLDivElement | null>(null);
  const rightRef = useRef<HTMLDivElement | null>(null);
  const bgTextRef = useRef<HTMLHeadingElement | null>(null);
  const lensRef = useRef<HTMLDivElement | null>(null);

  // Detect device type for performance optimization
  const isMobile = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return window.innerWidth < 768;
  }, []);

  // Memoized animation configs for better performance
  const scrollConfig = useMemo(() => ({
    imageParallax: isMobile ? { yPercent: -10 } : { yPercent: -15 },
    contentParallax: isMobile ? { y: -20 } : { y: -40 },
    bgTypography: isMobile ? { y: -50 } : { y: -100 },
  }), [isMobile]);

  // Scroll-based animations
  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      /* IMAGE PARALLAX - Optimized for device */
      gsap.to(imageRef.current, {
        ...scrollConfig.imageParallax,
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: isMobile ? 0.5 : 1,
        },
      });

      /* CONTENT GENTLE PARALLAX - Optimized for device */
      gsap.to([leftRef.current, rightRef.current], {
        ...scrollConfig.contentParallax,
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: isMobile ? 0.5 : 1,
        },
      });

      /* LENS VIGNETTE */
      gsap.to(lensRef.current, {
        opacity: 0.5,
        ease: "none",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      /* BG TYPOGRAPHY PARALLAX - Optimized for device */
      gsap.to(bgTextRef.current, {
        ...scrollConfig.bgTypography,
        ease: "none",
        force3D: true,
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "bottom top",
          scrub: isMobile ? 1 : 1.5,
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, [isMobile, scrollConfig]);

  // Intro animation
  useEffect(() => {
    if (!ready) return;
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      /* Set the starting state explicitly */
      gsap.set(imageRef.current, {
        scale: 1.15,
        opacity: 0,
        filter: "blur(20px)",
      });

      gsap.set([leftRef.current, rightRef.current], {
        y: 60,
        opacity: 0,
        filter: "blur(10px)",
      });

      /* Run the intro timeline - Optimized durations for mobile */
      const timeline = gsap.timeline({ 
        defaults: { 
          ease: "power3.out", 
          force3D: true 
        } 
      });

      if (isMobile) {
        timeline
          .to(sectionRef.current, { opacity: 1, duration: 0.8, ease: "power2.out" })
          .to(
            imageRef.current,
            { scale: 1, opacity: 1, filter: "blur(0px)", duration: 1.8 },
            0.2
          )
          .to(
            leftRef.current,
            { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.4 },
            0.8
          )
          .to(
            rightRef.current,
            { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.4 },
            1.0
          );
      } else {
        timeline
          .to(sectionRef.current, { opacity: 1, duration: 1, ease: "power2.out" })
          .to(
            imageRef.current,
            { scale: 1, opacity: 1, filter: "blur(0px)", duration: 2.4 },
            0.3
          )
          .to(
            leftRef.current,
            { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.8 },
            1.0
          )
          .to(
            rightRef.current,
            { y: 0, opacity: 1, filter: "blur(0px)", duration: 1.8 },
            1.2
          );
      }
    }, sectionRef);

    return () => ctx.revert();
  }, [ready, isMobile]);

  return (
    <section
      ref={sectionRef}
      className={`relative h-screen w-full overflow-hidden bg-black ${
        !ready ? 'pointer-events-none' : ''
      }`}
      style={{ opacity: 0 }}
    >
      {/* ================= BACKGROUND IMAGE ================= */}
      <div
        ref={imageRef}
        className="absolute inset-0 will-change-transform"
        style={{ transform: "translateZ(0)" }}
      >
        <Image
          src="/camera1.jpg"
          alt="Vintage camera"
          fill
          priority
          quality={isMobile ? 75 : 90}
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* ================= LENS OVERLAY ================= */}
      <div
        ref={lensRef}
        className="absolute inset-0 z-20 pointer-events-none will-change-opacity"
        style={{
          background:
            "radial-gradient(circle at center, transparent 20%, rgba(0,0,0,0.6) 85%)",
          mixBlendMode: "multiply",
        }}
      />

      {/* ================= CONTENT ================= */}
      <div className="relative z-30 max-w-7xl mx-auto px-8 lg:px-16 h-full grid grid-cols-1 lg:grid-cols-3 items-center gap-8">
        {/* LEFT */}
        <div
          ref={leftRef}
          className="space-y-10 will-change-transform"
          style={{ transform: "translateZ(0)" }}
        >
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

          <LearnMoreLink />
        </div>

        <div />

        {/* RIGHT */}
        <div
          ref={rightRef}
          className="text-right space-y-6 lg:text-right text-left will-change-transform"
          style={{ transform: "translateZ(0)" }}
        >
          <div className="inline-block">
            <h2 className="text-7xl md:text-8xl font-light tracking-tight bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent drop-shadow-2xl">
              280K+
            </h2>
            <div className="h-1 w-24 bg-gradient-to-r from-purple-500 to-blue-500 mt-2 ml-auto rounded-full"></div>
          </div>

          <p className="text-gray-200 text-sm leading-relaxed max-w-sm lg:ml-auto drop-shadow-lg">
            Frames captured across events, workshops, and everyday campus life.
          </p>
        </div>
      </div>

      {/* ================= SCROLL INDICATOR ================= */}
      <ScrollIndicator />
    </section>
  );
}