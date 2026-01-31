"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import TiltedCard from "../../../../components/ui/TiltedCards";

gsap.registerPlugin(ScrollTrigger);

export default function About() {
  const sectionRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
        gsap.fromTo(
          el,
          { y: 40, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 1.4,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
            },
          }
        );
      });

      gsap.utils.toArray<HTMLElement>(".bg-word").forEach((el) => {
        gsap.to(el, {
          y: -120,
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="about"
      className="relative bg-[#0b0d0c] text-white py-32 md:py-40 overflow-hidden"
    >
      {/* BACKGROUND WORD */}
      <div className="absolute inset-x-0 top-24 pointer-events-none">
        <h1 className="bg-word text-center text-[28vw] md:text-[20vw] font-bold text-white/[0.035] leading-none">
          PSOC
        </h1>
      </div>

      {/* INTRO */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mb-[30vh]">
        <p className="reveal text-xs tracking-[0.35em] uppercase text-white/50 mb-6">
          Who we are
        </p>

        <h2 className="reveal text-4xl md:text-5xl lg:text-6xl font-serif mb-8 max-w-3xl">
          The Photographic Society
        </h2>

        <p className="reveal max-w-2xl text-white/70 leading-relaxed">
          PSOC is the official Photographic Society of Birla Institute of
          Technology, Mesra — a collective of visual storytellers who believe
          photography is more than an image.
        </p>
      </div>
      {/* ================= MANIFESTO ================= */}
<div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mb-32">
  <p className="reveal max-w-3xl text-[1.15rem] md:text-[1.35rem] font-serif text-white/85 leading-relaxed">
    We don’t just take photographs —  
    <span className="text-white"> we preserve moments that outlive time.</span>
  </p>
</div>
{/* ================= QUIET STATS ================= */}
<div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mb-36">
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-12 text-white/75">
    <div className="reveal">
      <p className="text-3xl font-serif mb-2">10+</p>
      <p className="text-xs tracking-[0.3em] uppercase text-white/45">
        Years Active
      </p>
    </div>

    <div className="reveal">
      <p className="text-3xl font-serif mb-2">250K+</p>
      <p className="text-xs tracking-[0.3em] uppercase text-white/45">
        Frames Captured
      </p>
    </div>

    <div className="reveal">
      <p className="text-3xl font-serif mb-2">100+</p>
      <p className="text-xs tracking-[0.3em] uppercase text-white/45">
        Members & Alumni
      </p>
    </div>
  </div>
</div>


      {/* FLAGSHIP EVENTS */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        <p className="reveal text-xs tracking-[0.35em] uppercase text-white/50 mb-6">
          What defines us
        </p>
        {/* ================= CINEMATIC DIVIDER ================= */}
<div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16 mb-28">
  <div className="h-px w-full bg-gradient-to-r from-transparent via-white/20 to-transparent" />
</div>


        <h3 className="reveal text-3xl md:text-4xl font-serif mb-28">
          Flagship Events
        </h3>

        <div className="flex flex-col gap-[32vh]">
          {/* UTKRISHT */}
          <div className="relative reveal">
            <h1 className="bg-word absolute -top-24 left-0 text-[18vw] md:text-[14vw] font-bold text-white/[0.03]">
              UTKRISHT
            </h1>

            <div className="flex justify-end">
              <div className="relative shadow-[0_35px_90px_rgba(0,0,0,0.6)] rounded-[18px]">
                <TiltedCard
                  imageSrc="/camera1.jpg"
                  altText="Utkrisht Exhibition"
                  captionText="Utkrisht — Annual Exhibition"
                  imageWidth="min(80vw, 440px)"
                  imageHeight="min(80vw, 440px)"
                  rotateAmplitude={14}
                  scaleOnHover={1.06}
                />
              </div>
            </div>

            {/* 🔼 SHIFTED UP TEXT */}
            <div className="mt-6 md:mt-8 max-w-[36rem] relative pl-6 lg:-translate-y-16">
              <span className="absolute left-0 top-1 h-[85%] w-px bg-white/15" />

              <p className="text-[11px] tracking-[0.4em] uppercase text-white/45 mb-6">
                Annual Exhibition
              </p>

              <h4 className="text-[1.65rem] md:text-2xl font-serif mb-5 leading-tight">
                Utkrisht
              </h4>

              <p className="text-white/65 leading-[1.85] text-[15px] md:text-base">
                Utkrisht is PSOC’s annual photography exhibition — a curated
                showcase of the society’s most compelling visual narratives.
              </p>
            </div>
          </div>

          {/* BATCH PHOTOGRAPHY */}
          <div className="relative reveal">
            <h1 className="bg-word absolute -top-28 left-0 text-[16vw] md:text-[12vw] font-bold text-white/[0.03] leading-none">
              BATCH <br /> PHOTOGRAPHY
            </h1>

            <div className="flex justify-end">
              <div className="relative shadow-[0_35px_90px_rgba(0,0,0,0.6)] rounded-[18px]">
                <TiltedCard
                  imageSrc="/camera2.jpeg"
                  altText="Batch Photography"
                  captionText="Batch Photography"
                  imageWidth="min(80vw, 440px)"
                  imageHeight="min(80vw, 440px)"
                  rotateAmplitude={12}
                  scaleOnHover={1.06}
                />
              </div>
            </div>

            {/* 🔼 SHIFTED UP TEXT */}
            <div className="mt-6 md:mt-8 max-w-[36rem] relative pl-6 lg:-translate-y-16">
              <span className="absolute left-0 top-1 h-[85%] w-px bg-white/15" />

              <p className="text-[11px] tracking-[0.4em] uppercase text-white/45 mb-6">
                Legacy Project
              </p>

              <h4 className="text-[1.65rem] md:text-2xl font-serif mb-5 leading-tight">
                Batch Photography
              </h4>

              <p className="text-white/65 leading-[1.85] text-[15px] md:text-base">
                A timeless PSOC tradition capturing graduating batches —
                preserving memories long after campus life ends.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
