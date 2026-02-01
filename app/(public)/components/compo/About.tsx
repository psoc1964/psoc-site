"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // ========== TEXT SPLIT & REVEAL ANIMATIONS ==========
      const splitTexts = document.querySelectorAll(".split-text");
      splitTexts.forEach((text) => {
        const split = new SplitType(text as HTMLElement, { 
          types: "chars,words,lines",
          tagName: "span"
        });

        gsap.fromTo(
          split.chars,
          { 
            opacity: 0,
            y: 50,
          },
          {
            opacity: 1,
            y: 0,
            stagger: 0.015,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: text,
              start: "top 85%",
              end: "top 60%",
              scrub: 1,
            }
          }
        );
      });

      // ========== MANIFESTO WORD-BY-WORD REVEAL ==========
      const manifestoWords = document.querySelectorAll(".manifesto-word");
      manifestoWords.forEach((word, index) => {
        gsap.fromTo(
          word,
          { 
            opacity: 0,
            y: 30,
            rotateX: -90,
            filter: "blur(10px)",
          },
          {
            opacity: 1,
            y: 0,
            rotateX: 0,
            filter: "blur(0px)",
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: word,
              start: "top 85%",
              end: "top 65%",
              scrub: 1,
            },
            delay: index * 0.05,
          }
        );
      });

      // ========== ENHANCED REVEAL ANIMATIONS ==========
      gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((el) => {
        gsap.fromTo(
          el,
          { 
            y: 80, 
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
              end: "top 60%",
              scrub: 1,
            },
          }
        );
      });

      // ========== PARALLAX BACKGROUND WORD ==========
      gsap.utils.toArray<HTMLElement>(".parallax-slow").forEach((el) => {
        gsap.to(el, {
          y: -150,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      });

      // ========== STATS COUNTER ==========
      gsap.utils.toArray<HTMLElement>(".stat-number").forEach((stat) => {
        const target = stat.getAttribute("data-target") || "0";
        
        ScrollTrigger.create({
          trigger: stat,
          start: "top 80%",
          onEnter: () => {
            gsap.from(stat, {
              textContent: 0,
              duration: 2,
              ease: "power2.out",
              snap: { textContent: 1 },
              onUpdate: function() {
                const current = Math.ceil(Number(this.targets()[0].textContent));
                stat.textContent = target.includes("+") 
                  ? `${current}+` 
                  : target.includes("K+")
                  ? `${current}K+`
                  : current.toString();
              }
            });
          },
        });
      });

      // ========== CINEMATIC LINE REVEALS ==========
      gsap.utils.toArray<HTMLElement>(".cinematic-line").forEach((line) => {
        gsap.fromTo(
          line,
          { 
            scaleX: 0, 
            transformOrigin: "left center"
          },
          {
            scaleX: 1,
            duration: 1.5,
            ease: "power2.inOut",
            scrollTrigger: {
              trigger: line,
              start: "top 85%",
              end: "top 60%",
              scrub: 1,
            },
          }
        );
      });

      // ========== IMAGE REVEAL WITH CLIP-PATH ==========
      gsap.utils.toArray<HTMLElement>(".image-reveal").forEach((img) => {
        gsap.fromTo(
          img,
          { 
            clipPath: "inset(100% 0% 0% 0%)",
            scale: 1.2,
          },
          {
            clipPath: "inset(0% 0% 0% 0%)",
            scale: 1,
            duration: 1.5,
            ease: "power3.out",
            scrollTrigger: {
              trigger: img,
              start: "top 80%",
              end: "top 40%",
              scrub: 1,
            },
          }
        );
      });

    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative bg-[#0b0d0c] text-white overflow-hidden"
    >
      {/* SIMPLE GRADIENT BACKGROUND - Optimized */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] pointer-events-none opacity-10 bg-gradient-to-br from-purple-500/30 via-blue-500/30 to-cyan-500/30 blur-[120px] rounded-full" />

      {/* INTRO SECTION */}
      <div className="py-32 md:py-40 relative">
        {/* PARALLAX BACKGROUND WORD */}
        <div className="absolute inset-x-0 top-24 pointer-events-none">
          <h1 className="parallax-slow text-center text-[28vw] md:text-[20vw] font-bold text-white/[0.03] leading-none tracking-tighter select-none">
            ABOUT US
          </h1>
        </div>

        {/* INTRO */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mb-[30vh]">
          <p className="reveal-up text-xs tracking-[0.35em] uppercase text-white/50 mb-6">
            Who we are
          </p>

          <h2 className="split-text text-4xl md:text-5xl lg:text-6xl font-serif mb-8 max-w-3xl leading-tight">
            The Photographic Society
          </h2>

          <p className="reveal-up max-w-2xl text-white/70 leading-relaxed text-base md:text-lg">
            PSOC is the official Photographic Society of Birla Institute of
            Technology, Mesra — a collective of visual storytellers who believe
            photography is more than an image.
          </p>
        </div>

        {/* MANIFESTO - ENHANCED PREMIUM ANIMATION */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mb-32">
          <div className="relative">
            {/* Subtle spotlight effect that follows scroll */}
            <div className="absolute -inset-8 bg-gradient-radial from-white/5 via-transparent to-transparent opacity-0 manifesto-glow pointer-events-none" />
            
            <p className="max-w-3xl text-[1.15rem] md:text-[1.35rem] font-light text-white/85 leading-[1.8] tracking-wide perspective-1000">
              <span className="manifesto-word inline-block">We</span>{" "}
              <span className="manifesto-word inline-block">don't</span>{" "}
              <span className="manifesto-word inline-block">just</span>{" "}
              <span className="manifesto-word inline-block">take</span>{" "}
              <span className="manifesto-word inline-block">photographs</span>{" "}
              <span className="manifesto-word inline-block">—</span>{" "}
              <span className="manifesto-word inline-block font-normal text-white">we</span>{" "}
              <span className="manifesto-word inline-block font-normal text-white">preserve</span>{" "}
              <span className="manifesto-word inline-block font-normal text-white">moments</span>{" "}
              <span className="manifesto-word inline-block font-normal text-white">that</span>{" "}
              <span className="manifesto-word inline-block font-normal text-white">outlive</span>{" "}
              <span className="manifesto-word inline-block font-normal text-white">time.</span>
            </p>
          </div>
        </div>

        {/* ANIMATED STATS */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mb-36">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-white/75">
            <div className="reveal-up group cursor-pointer">
              <div className="transition-all duration-300 hover:translate-y-[-4px]">
                <p className="stat-number text-4xl md:text-5xl font-serif mb-2 bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent" data-target="10+">
                  60+
                </p>
                <p className="text-xs tracking-[0.3em] uppercase text-white/45 group-hover:text-white/70 transition-colors">
                  Years Active
                </p>
              </div>
            </div>

            <div className="reveal-up group cursor-pointer">
              <div className="transition-all duration-300 hover:translate-y-[-4px]">
                <p className="stat-number text-4xl md:text-5xl font-serif mb-2 bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent" data-target="250K+">
                  250K+
                </p>
                <p className="text-xs tracking-[0.3em] uppercase text-white/45 group-hover:text-white/70 transition-colors">
                  Frames Captured
                </p>
              </div>
            </div>

            <div className="reveal-up group cursor-pointer">
              <div className="transition-all duration-300 hover:translate-y-[-4px]">
                <p className="stat-number text-4xl md:text-5xl font-serif mb-2 bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent" data-target="100+">
                  100+
                </p>
                <p className="text-xs tracking-[0.3em] uppercase text-white/45 group-hover:text-white/70 transition-colors">
                  Members & Alumni
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* CINEMATIC DIVIDER */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mb-28">
          <div className="cinematic-line h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* SECTION HEADER */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mb-20">
          <p className="reveal-up text-xs tracking-[0.35em] uppercase text-white/50 mb-6">
            What defines us
          </p>
          <h3 className="split-text text-3xl md:text-4xl lg:text-5xl font-serif leading-tight">
            Flagship Events
          </h3>
        </div>

        {/* ========== EVENTS SECTION ========== */}
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 space-y-32 pb-32">
          
          {/* EVENT 1: UTKRISHT */}
          <div className="reveal-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Image with Bold Red Glow */}
              <div className="relative group">
                {/* Bold Animated Glow - RED/ORANGE */}
                <div className="absolute -inset-2 bg-gradient-to-r from-red-600 via-orange-500 to-amber-500 rounded-[24px] opacity-40 group-hover:opacity-70 blur-2xl transition-all duration-700 animate-pulse-slow" />
                
                {/* Stronger Always-On Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-red-500/50 via-orange-500/50 to-amber-500/50 rounded-[22px] blur-xl opacity-60" />
                
                {/* Main Card */}
                <div className="relative rounded-[20px] overflow-hidden w-full aspect-square border border-white/10 shadow-2xl">
                  <img
                    src="/camera1.jpg"
                    alt="Utkrisht Exhibition"
                    className="image-reveal w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                  
                  {/* Floating Badge */}
                  <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full text-xs tracking-wider shadow-lg">
                    ANNUAL EVENT
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="space-y-6">
                <div>
                  <p className="text-[11px] tracking-[0.4em] uppercase text-white/45 mb-4">
                    Annual Exhibition
                  </p>
                  <h4 className="text-[2.5rem] md:text-[3rem] font-serif mb-6 leading-none bg-gradient-to-br from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                    Utkrisht
                  </h4>
                </div>

                <p className="text-white/70 leading-[1.9] text-base md:text-lg max-w-xl">
                  Utkrisht is PSOC's annual photography exhibition — a curated
                  showcase of the society's most compelling visual narratives.
                  Each frame tells a story, each composition captures a moment
                  frozen in time.
                </p>

                <div className="flex gap-8 pt-4">
                  <div className="text-sm text-white/50">
                    <span className="block text-3xl font-serif text-white/90 mb-1">500+</span>
                    Photographs
                  </div>
                  <div className="text-sm text-white/50">
                    <span className="block text-3xl font-serif text-white/90 mb-1">5K+</span>
                    Visitors
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* EVENT 2: BATCH PHOTOGRAPHY */}
          <div className="reveal-up">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
              {/* Content - Appears first on mobile, first on desktop */}
              <div className="space-y-6 lg:order-1">
                <div>
                  <p className="text-[11px] tracking-[0.4em] uppercase text-white/45 mb-4">
                    Legacy Project
                  </p>
                  <h4 className="text-[2.5rem] md:text-[3rem] font-serif mb-6 leading-none bg-gradient-to-br from-white via-white/90 to-white/60 bg-clip-text text-transparent">
                    Batch Photography
                  </h4>
                </div>

                <p className="text-white/70 leading-[1.9] text-base md:text-lg max-w-xl">
                  A timeless PSOC tradition capturing graduating batches —
                  preserving memories long after campus life ends. These portraits
                  become heirlooms, connecting generations of BITians.
                </p>

                <div className="flex gap-8 pt-4">
                  <div className="text-sm text-white/50">
                    <span className="block text-3xl font-serif text-white/90 mb-1">50+</span>
                    Batches
                  </div>
                  <div className="text-sm text-white/50">
                    <span className="block text-3xl font-serif text-white/90 mb-1">10K+</span>
                    Students
                  </div>
                </div>
              </div>

              {/* Image with Bold Blue/Cyan Glow - Appears second on mobile, second on desktop */}
              <div className="relative group lg:order-2">
                {/* Bold Animated Glow - BLUE/CYAN */}
                <div className="absolute -inset-2 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-600 rounded-[24px] opacity-40 group-hover:opacity-70 blur-2xl transition-all duration-700 animate-pulse-slow" />
                
                {/* Stronger Always-On Glow */}
                <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/50 via-blue-500/50 to-indigo-500/50 rounded-[22px] blur-xl opacity-60" />
                
                {/* Main Card */}
                <div className="relative rounded-[20px] overflow-hidden w-full aspect-square border border-white/10 shadow-2xl">
                  <img
                    src="/camera1.jpg"
                    alt="Batch Photography"
                    className="image-reveal w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent pointer-events-none" />
                  
                  {/* Floating Badge */}
                  <div className="absolute top-6 right-6 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-full text-xs tracking-wider shadow-lg">
                    TRADITION
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 0.4;
            transform: scale(1);
          }
          50% {
            opacity: 0.7;
            transform: scale(1.05);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }

        .perspective-1000 {
          perspective: 1000px;
          transform-style: preserve-3d;
        }

        .manifesto-word {
          display: inline-block;
          transform-origin: bottom center;
        }

        @keyframes glow-pulse {
          0%, 100% {
            opacity: 0;
          }
          50% {
            opacity: 0.3;
          }
        }

        .manifesto-glow {
          animation: glow-pulse 3s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}