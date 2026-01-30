import Reveal from "./Reveal";

export default function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden text-white"
    >
      {/* ===================== GRADIENT + BLUR BACKGROUND ===================== */}
      <div className="absolute inset-0 -z-10">
        {/* Base gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#7b857d] via-[#8A8F8A] to-[#6f776f]" />

        {/* Soft blur blobs */}
        <div className="absolute top-[-10%] left-[-15%] w-[45rem] h-[45rem] bg-[#a8b0a8]/30 rounded-full blur-[140px]" />
        <div className="absolute bottom-[-15%] right-[-10%] w-[40rem] h-[40rem] bg-[#c9d2c9]/20 rounded-full blur-[160px]" />
      </div>

      {/* ===================== MAIN CONTENT ===================== */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 lg:px-16 py-40 grid grid-cols-1 lg:grid-cols-2 gap-28 items-start">

        {/* LEFT — TITLE & STATEMENT */}
        <Reveal direction="up">
          <div className="space-y-12">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-serif leading-[1.1] tracking-tight">
              About the
              <br />
              Photographic Society
            </h2>

            <Reveal direction="none" delay={150}>
              <p className="text-lg md:text-xl font-light text-white/90 max-w-md leading-relaxed">
                The oldest club in campus bringing people who have a passion for
                photography &amp; filmmaking closer.
              </p>
            </Reveal>
          </div>
        </Reveal>

        {/* RIGHT — DESCRIPTION */}
        <Reveal direction="right" delay={200}>
          <div className="space-y-6 max-w-lg text-white/80 text-base leading-relaxed">
            <p>
              The Photographic Society of our college (PSOC) is a collective of
              visual storytellers driven by curiosity, creativity, and a deep
              respect for visual expression.
            </p>

            <p>
              From documenting campus life and cultural moments to exploring
              artistic and cinematic photography, we focus on preserving
              emotions, stories, and perspectives through the lens.
            </p>

            <p>
              PSOC is not just about cameras — it’s about vision, patience,
              storytelling, and learning how to see the world differently.
            </p>
          </div>
        </Reveal>
      </div>

      {/* ===================== TIMELINE ===================== */}
      <div className="relative z-10 max-w-6xl mx-auto px-8 lg:px-16">
        <div className="border-t border-white/20 pt-20 grid grid-cols-1 md:grid-cols-3 gap-16 text-sm text-white/80">

          <Reveal direction="up">
            <div>
              <p className="text-white font-medium mb-2">Founded</p>
              <p className="leading-relaxed">
                Established as the first visual arts club on campus,
                built on a shared love for photography.
              </p>
            </div>
          </Reveal>

          <Reveal direction="up" delay={150}>
            <div>
              <p className="text-white font-medium mb-2">Evolution</p>
              <p className="leading-relaxed">
                Expanded into filmmaking, visual storytelling,
                and campus-wide documentation.
              </p>
            </div>
          </Reveal>

          <Reveal direction="up" delay={300}>
            <div>
              <p className="text-white font-medium mb-2">Today</p>
              <p className="leading-relaxed">
                A creative community shaping visual culture
                and mentoring the next generation.
              </p>
            </div>
          </Reveal>

        </div>
      </div>

      {/* ===================== MANIFESTO ===================== */}
      <div className="relative z-10 max-w-4xl mx-auto px-8 lg:px-16 py-40">
        <Reveal direction="scale">
          <div className="text-center space-y-8">
            <p className="uppercase text-xs tracking-[0.35em] text-white/60">
              What we believe
            </p>

            <h3 className="text-2xl md:text-3xl font-serif italic leading-relaxed text-white/90">
              Photography is not about equipment.
              <br />
              It is about intention, patience,
              <br />
              and learning how to truly observe.
            </h3>
          </div>
        </Reveal>
      </div>

      {/* ===================== BACKGROUND TYPOGRAPHY ===================== */}
      <div className="absolute inset-x-0 bottom-[-10rem] pointer-events-none">
        <h1 className="text-center text-[22vw] font-bold tracking-tight text-white/5 leading-none">
          ABOUT
        </h1>
      </div>
    </section>
  );
}
