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

      // ── Split text reveal ────────────────────────────────────────────────
      document.querySelectorAll<HTMLElement>(".split-text").forEach((text) => {
        const split = new SplitType(text, { types: "chars,words,lines", tagName: "span" });
        gsap.fromTo(split.chars,
          { opacity: 0, y: 40 },
          {
            opacity: 1, y: 0,
            stagger: 0.015, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: text, start: "top 88%", end: "top 60%", scrub: 1 },
          }
        );
      });

      // ── Manifesto word reveal ────────────────────────────────────────────
      document.querySelectorAll<HTMLElement>(".manifesto-word").forEach((word, i) => {
        gsap.fromTo(word,
          { opacity: 0, y: 24, rotateX: -60, filter: "blur(8px)" },
          {
            opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)",
            duration: 0.7, ease: "power3.out", delay: i * 0.04,
            scrollTrigger: { trigger: word, start: "top 88%", end: "top 68%", scrub: 1 },
          }
        );
      });

      // ── Reveal up ───────────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((el) => {
        gsap.fromTo(el,
          { y: 60, opacity: 0 },
          {
            y: 0, opacity: 1, duration: 1.1, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 92%", end: "top 65%", scrub: 1 },
          }
        );
      });

      // ── Parallax background word ─────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>(".parallax-slow").forEach((el) => {
        gsap.to(el, {
          y: -120, ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.5 },
        });
      });

      // ── Stats counter ────────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>(".stat-number").forEach((stat) => {
        const target = stat.getAttribute("data-target") || "0";
        ScrollTrigger.create({
          trigger: stat, start: "top 82%",
          onEnter: () => {
            gsap.from(stat, {
              textContent: 0, duration: 2, ease: "power2.out",
              snap: { textContent: 1 },
              onUpdate: function () {
                const cur = Math.ceil(Number(this.targets()[0].textContent));
                stat.textContent = target.includes("K+")
                  ? `${cur}K+`
                  : target.includes("+") ? `${cur}+` : cur.toString();
              },
            });
          },
        });
      });

      // ── Cinematic line ───────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>(".cinematic-line").forEach((line) => {
        gsap.fromTo(line,
          { scaleX: 0, transformOrigin: "left center" },
          {
            scaleX: 1, duration: 1.5, ease: "power2.inOut",
            scrollTrigger: { trigger: line, start: "top 85%", end: "top 60%", scrub: 1 },
          }
        );
      });

      // ── Image clip reveal ────────────────────────────────────────────────
      gsap.utils.toArray<HTMLElement>(".image-reveal").forEach((img) => {
        gsap.fromTo(img,
          { clipPath: "inset(100% 0% 0% 0%)", scale: 1.15 },
          {
            clipPath: "inset(0% 0% 0% 0%)", scale: 1,
            duration: 1.5, ease: "power3.out",
            scrollTrigger: { trigger: img, start: "top 82%", end: "top 42%", scrub: 1 },
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
      {/* Ambient gradient blob */}
      <div className="absolute top-0 right-0 w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] pointer-events-none opacity-10 bg-gradient-to-br from-purple-500/30 via-blue-500/30 to-cyan-500/30 blur-[120px] rounded-full" />

      {/* ── INTRO ──────────────────────────────────────────────────────────── */}
      <div className="pt-[4.375rem] py-24 sm:py-32 md:py-40 relative">

        {/* Background word — scales with viewport */}
        <div className="absolute inset-x-0 top-16 sm:top-20 md:top-24 pointer-events-none overflow-hidden px-2">
  <h1
    className="parallax-slow text-center font-bold text-white/[0.025] leading-none tracking-tighter select-none"
    style={{ fontSize: "clamp(4rem, 28vw, 18vw)" }}
  >
    ABOUT US
  </h1>
</div>

        {/* Who we are */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 mb-[20vh] sm:mb-[25vh] md:mb-[30vh]">
          <p className="reveal-up text-[10px] sm:text-xs tracking-[0.35em] uppercase text-white/50 mb-4 sm:mb-6">
            Who we are
          </p>
          <h2 className="split-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-6 sm:mb-8 max-w-3xl leading-tight">
            The Photographic Society
          </h2>
          <p className="reveal-up max-w-xl sm:max-w-2xl text-white/65 leading-relaxed text-sm sm:text-base md:text-lg">
            PSOC is the official Photographic Society of Birla Institute of
            Technology, Mesra — a collective of visual storytellers who believe
            photography is more than an image.
          </p>
        </div>

        {/* Manifesto */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 mb-24 sm:mb-28 md:mb-32">
          <p className="max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-3xl text-base sm:text-lg md:text-[1.25rem] lg:text-[1.35rem] font-light text-white/85 leading-[1.75] sm:leading-[1.8] tracking-wide perspective-1000">
            {[
              "We","don't","just","take","photographs","—",
              "we","preserve","moments","that","outlive","time."
            ].map((w, i) => (
              <span key={i} className={`manifesto-word inline-block${i >= 6 ? " font-normal text-white" : ""}`}>
                {w}
              </span>
            )).reduce<React.ReactNode[]>((acc, el, i) => i === 0 ? [el] : [...acc, " ", el], [])}
          </p>
        </div>

        {/* Stats */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 mb-28 sm:mb-32 md:mb-36">
          <div className="grid grid-cols-3 gap-6 sm:gap-10 md:gap-12 text-white/75">
            {[
              { value: "60+",   target: "60+",   label: "Years Active" },
              { value: "250K+", target: "250K+", label: "Frames Captured" },
              { value: "100+",  target: "100+",  label: "Members & Alumni" },
            ].map(({ value, target, label }) => (
              <div key={label} className="reveal-up group cursor-pointer">
                <div className="transition-transform duration-300 hover:-translate-y-1">
                  <p
                    className="stat-number text-3xl sm:text-4xl md:text-5xl font-serif mb-1.5 sm:mb-2 bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent"
                    data-target={target}
                  >
                    {value}
                  </p>
                  <p className="text-[9px] sm:text-[10px] md:text-xs tracking-[0.25em] sm:tracking-[0.3em] uppercase text-white/45 group-hover:text-white/70 transition-colors leading-tight">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cinematic divider */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 mb-20 sm:mb-24 md:mb-28">
          <div className="cinematic-line h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
        </div>

        {/* Section header */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 mb-14 sm:mb-16 md:mb-20">
          <p className="reveal-up text-[10px] sm:text-xs tracking-[0.35em] uppercase text-white/50 mb-4 sm:mb-6">
            What defines us
          </p>
          <h3 className="split-text text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif leading-tight">
            Flagship Events
          </h3>
        </div>

        {/* ── EVENTS ──────────────────────────────────────────────────────── */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 space-y-24 sm:space-y-32 md:space-y-40 pb-20 sm:pb-24 md:pb-32">

          {/* EVENT 1: UTKRISHT */}
          <div className="reveal-up">
            {/*
              Mobile  → single col: title → image → description
              Tablet  → single col same order (wider padding)
              Desktop → two col: image left | title+desc right
            */}
            <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-20 xl:gap-24 lg:items-center gap-6 sm:gap-8">

              {/* Title block — top on mobile, right col row-1 on desktop */}
              <div className="order-1 lg:order-2 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-px w-6 sm:w-8 bg-red-500/60" />
                  <p className="text-[9px] sm:text-[10px] tracking-[0.4em] sm:tracking-[0.5em] uppercase text-white/40 font-medium">
                    Annual Exhibition
                  </p>
                </div>
                <h4 className="text-[2.2rem] sm:text-[2.8rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem] font-serif leading-[0.95] tracking-tight text-white">
                  Utkrisht
                </h4>
                <div className="h-[2px] w-12 sm:w-16 bg-gradient-to-r from-red-500 to-orange-400 rounded-full" />
              </div>

              {/* Image — middle on mobile, left col (spans both rows) on desktop */}
              <div className="order-2 lg:order-1 lg:row-span-2 relative group">
                <div className="absolute -inset-px rounded-[28px] bg-gradient-to-br from-red-500/30 via-orange-400/20 to-transparent blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-700" />
                <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-14 sm:w-20 h-14 sm:h-20 border-l-2 border-t-2 border-red-500/40 rounded-tl-2xl z-10 pointer-events-none" />
                <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-14 sm:w-20 h-14 sm:h-20 border-r-2 border-b-2 border-orange-500/40 rounded-br-2xl z-10 pointer-events-none" />

                <div className="relative rounded-[20px] sm:rounded-[24px] overflow-hidden border border-white/[0.08] bg-black shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <img
                      src="/camera1.jpg"
                      alt="Utkrisht Exhibition"
                      className="image-reveal w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
                    <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.5)]" />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 px-4 sm:px-6 py-3 sm:py-5 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-red-400 shadow-[0_0_8px_2px_rgba(248,113,113,0.6)]" />
                      <span className="text-[10px] sm:text-[11px] tracking-[0.3em] sm:tracking-[0.35em] uppercase text-white/60 font-medium">Annual Event</span>
                    </div>
                    <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                      <svg className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description + stats — bottom on mobile, right col row-2 on desktop */}
              <div className="order-3 lg:order-3 space-y-5 sm:space-y-6">
                <p className="text-white/55 leading-[1.8] sm:leading-[1.85] text-sm sm:text-base md:text-[1.05rem] max-w-md font-light">
                  Utkrisht is PSOC's annual photography exhibition — a curated
                  showcase of the society's most compelling visual narratives.
                  Each frame tells a story, each composition captures a moment
                  frozen in time.
                </p>
                <div className="flex gap-6 sm:gap-10">
                  <div className="space-y-1 border-l border-white/10 pl-4 sm:pl-5">
                    <span className="block text-[1.8rem] sm:text-[2.2rem] font-serif text-white leading-none">500+</span>
                    <span className="text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-white/35">Photographs</span>
                  </div>
                  <div className="space-y-1 border-l border-white/10 pl-4 sm:pl-5">
                    <span className="block text-[1.8rem] sm:text-[2.2rem] font-serif text-white leading-none">5K+</span>
                    <span className="text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-white/35">Visitors</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Divider */}
          <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

          {/* EVENT 2: BATCH PHOTOGRAPHY */}
          <div className="reveal-up">
            <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-20 xl:gap-24 lg:items-center gap-6 sm:gap-8">

              {/* Title block — top on mobile, left col row-1 on desktop */}
              <div className="order-1 lg:order-1 space-y-2 sm:space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-px w-6 sm:w-8 bg-cyan-500/60" />
                  <p className="text-[9px] sm:text-[10px] tracking-[0.4em] sm:tracking-[0.5em] uppercase text-white/40 font-medium">
                    Legacy Project
                  </p>
                </div>
                <h4 className="text-[2.2rem] sm:text-[2.8rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem] font-serif leading-[0.95] tracking-tight text-white">
                  Batch<br className="hidden sm:block" />
                  {" "}Photography
                </h4>
                <div className="h-[2px] w-12 sm:w-16 bg-gradient-to-r from-cyan-500 to-blue-400 rounded-full" />
              </div>

              {/* Image — middle on mobile, right col (spans both rows) on desktop */}
              <div className="order-2 lg:order-2 lg:row-span-2 relative group">
                <div className="absolute -inset-px rounded-[28px] bg-gradient-to-br from-cyan-500/25 via-blue-500/20 to-transparent blur-2xl opacity-60 group-hover:opacity-90 transition-opacity duration-700" />
                <div className="absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-14 sm:w-20 h-14 sm:h-20 border-l-2 border-t-2 border-cyan-500/40 rounded-tl-2xl z-10 pointer-events-none" />
                <div className="absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-14 sm:w-20 h-14 sm:h-20 border-r-2 border-b-2 border-blue-500/40 rounded-br-2xl z-10 pointer-events-none" />

                <div className="relative rounded-[20px] sm:rounded-[24px] overflow-hidden border border-white/[0.08] bg-black shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
                  <div className="relative w-full aspect-[4/3] overflow-hidden">
                    <img
                      src="/camera1.jpg"
                      alt="Batch Photography"
                      className="image-reveal w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-[1.04]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
                    <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.5)]" />
                  </div>
                  <div className="absolute bottom-0 inset-x-0 px-4 sm:px-6 py-3 sm:py-5 flex items-center justify-between">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <span className="w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_2px_rgba(34,211,238,0.6)]" />
                      <span className="text-[10px] sm:text-[11px] tracking-[0.3em] sm:tracking-[0.35em] uppercase text-white/60 font-medium">Tradition</span>
                    </div>
                    <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500">
                      <svg className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description + stats — bottom on mobile, left col row-2 on desktop */}
              <div className="order-3 lg:order-3 space-y-5 sm:space-y-6">
                <p className="text-white/55 leading-[1.8] sm:leading-[1.85] text-sm sm:text-base md:text-[1.05rem] max-w-md font-light">
                  A timeless PSOC tradition capturing graduating batches —
                  preserving memories long after campus life ends. These portraits
                  become heirlooms, connecting generations of BITians.
                </p>
                <div className="flex gap-6 sm:gap-10">
                  <div className="space-y-1 border-l border-white/10 pl-4 sm:pl-5">
                    <span className="block text-[1.8rem] sm:text-[2.2rem] font-serif text-white leading-none">50+</span>
                    <span className="text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-white/35">Batches</span>
                  </div>
                  <div className="space-y-1 border-l border-white/10 pl-4 sm:pl-5">
                    <span className="block text-[1.8rem] sm:text-[2.2rem] font-serif text-white leading-none">10K+</span>
                    <span className="text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-white/35">Students</span>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </div>


      <style>{`
        .perspective-1000 {
          perspective: 1000px;
          transform-style: preserve-3d;
        }
        .manifesto-word {
          display: inline-block;
          transform-origin: bottom center;
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0; }
          50% { opacity: 0.3; }
        }
        .manifesto-glow {
          animation: glow-pulse 3s ease-in-out infinite;
        }
        @media (max-width: 360px) {
          .stat-number { font-size: 1.4rem; }
        }
      `}</style>
    </section>
  );
}