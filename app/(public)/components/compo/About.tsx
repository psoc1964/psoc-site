"use client";
import { toDriveThumbnail } from "@/app/(private)/lib/utils";
import { useEffect, useRef, useState, memo, useMemo, useCallback } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import SplitType from "split-type";
import { useLazyQuery } from "@apollo/client";
import { GET_FEATURED_ALBUMS } from "@/lib/queries";
import { toast } from "react-hot-toast";
import Modal from "@/components/ui/modal";
import { useUser } from "@/lib/auth-client";

gsap.registerPlugin(ScrollTrigger);

type Album = {
  id:            number;
  name:          string;
  albumUrl?:     string;
  thumbnailUrl?: string;
  createdAt:     string;
  featuredAlbum?: boolean;
  isauthentic?:  boolean; 
};

const normalize = (str: string) =>
  str.toLowerCase().replace(/\s+/g, "");

const EVENT_META = [
  {
    dbName:      "Utkrisht",
    tag:         "Annual Exhibition",
    accentFrom:  "red-500",
    accentTo:    "orange-400",
    glowClasses: "from-red-500/30 via-orange-400/20",
    dot:         "bg-red-400",
    dotGlow:     "rgba(248,113,113,0.6)",
    cornerT:     "border-red-500/40",
    cornerB:     "border-orange-500/40",
    badgeLabel:  "Annual Event",
    description: "Utkrisht is PSOC's annual photography exhibition — a curated showcase of the society's most compelling visual narratives. Each frame tells a story, each composition captures a moment frozen in time.",
    stats:       [{ value: "500+", label: "Photographs" }, { value: "5K+", label: "Visitors" }],
    imageOnLeft: true,
  },
  {
    dbName:      "Batch Photography",
    tag:         "Legacy Project",
    accentFrom:  "cyan-500",
    accentTo:    "blue-400",
    glowClasses: "from-cyan-500/25 via-blue-500/20",
    dot:         "bg-cyan-400",
    dotGlow:     "rgba(34,211,238,0.6)",
    cornerT:     "border-cyan-500/40",
    cornerB:     "border-blue-500/40",
    badgeLabel:  "Tradition",
    description: "A timeless PSOC tradition capturing graduating batches — preserving memories long after campus life ends. These portraits become heirlooms, connecting generations of BITians.",
    stats:       [{ value: "50+", label: "Batches" }, { value: "10K+", label: "Students" }],
    imageOnLeft: false,
  },
] as const;

const EventImage = memo(({
  album,
  meta,
}: {
  album: Album | undefined;
  meta:  typeof EVENT_META[number];
}) => {
  const [user] = useUser();
  const [currentPath] = useState(() => 
            typeof window !== "undefined" ? window.location.pathname : "/"
            );
  const [open, setOpen] = useState(false);

  // ✅ isGated comes from the DB's isauthentic column — no hardcoded list needed
  const isGated = album?.isauthentic === true;
  const isAuthenticated = Boolean(user);

 const [imgSrc, setImgSrc] = useState(() => toDriveThumbnail(album?.thumbnailUrl));
const [loaded, setLoaded] = useState(false);

useEffect(() => {
  const src = toDriveThumbnail(album?.thumbnailUrl);
  setImgSrc(src);
  setLoaded(false);
}, [album?.thumbnailUrl]);

  // Resolve href: gated + not logged in → keep "#" so browser doesn't navigate
  const href = (!isGated || isAuthenticated) ? (album?.albumUrl ?? "#") : "#";

  // Show modal only when album is gated AND user is not authenticated
  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isGated && !isAuthenticated) {
      e.preventDefault();
      setOpen(true);
    }
  }, [isGated, isAuthenticated]);

  return (
    <>
      <a
        href={href}
        target={href === "#" ? undefined : "_blank"}
        rel="noopener noreferrer"
        onClick={handleClick}
        className={`order-2 relative group cursor-pointer ${
          meta.imageOnLeft ? "lg:order-1 lg:row-span-2" : "lg:order-2 lg:row-span-2"
        }`}
      >
        {/* Outer ambient glow — blooms on hover */}
        <div className={`absolute -inset-6 rounded-[44px] bg-gradient-to-br ${meta.glowClasses} to-transparent blur-3xl opacity-0 group-hover:opacity-70 transition-opacity duration-700`} />
        {/* Mid glow — always subtly present */}
        <div className={`absolute -inset-2 rounded-[32px] bg-gradient-to-br ${meta.glowClasses} to-transparent blur-2xl opacity-25 group-hover:opacity-55 transition-opacity duration-500`} />

        <div className={`absolute -top-3 -left-3 sm:-top-4 sm:-left-4 w-14 sm:w-20 h-14 sm:h-20 border-l-2 border-t-2 ${meta.cornerT} rounded-tl-2xl z-10 pointer-events-none`} />
        <div className={`absolute -bottom-3 -right-3 sm:-bottom-4 sm:-right-4 w-14 sm:w-20 h-14 sm:h-20 border-r-2 border-b-2 ${meta.cornerB} rounded-br-2xl z-10 pointer-events-none`} />

        <div className="relative rounded-[20px] sm:rounded-[24px] overflow-hidden border border-white/[0.08] bg-black shadow-[0_24px_60px_rgba(0,0,0,0.7)]">
          <div className="relative w-full aspect-[3/2] overflow-hidden bg-white/[0.03]">
            <div className="skeleton-shimmer absolute inset-0" style={{ opacity: loaded ? 0 : 1, transition: "opacity 0.5s" }} />
{imgSrc && (
  <img
    src={imgSrc}
    alt={album?.name ?? meta.dbName}
    className="image-reveal w-full h-full object-cover transition-[transform,opacity] duration-1000 ease-out group-hover:scale-[1.04]"
    style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.7s ease" }}
    loading="lazy"
    decoding="async"
    onLoad={() => setLoaded(true)}
    onError={() => setLoaded(true)}
  />
)}
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-black/20" />
            <div className="absolute inset-0 shadow-[inset_0_0_80px_rgba(0,0,0,0.5)]" />
          </div>

          <div className="absolute bottom-0 inset-x-0 px-4 sm:px-6 py-3 sm:py-5 flex items-center justify-between">
            <div className="flex items-center gap-2 sm:gap-3">
              <span
                className={`w-1.5 sm:w-2 h-1.5 sm:h-2 rounded-full ${meta.dot}`}
                style={{ boxShadow: `0 0 8px 2px ${meta.dotGlow}` }}
              />
              <span className="text-[10px] sm:text-[11px] tracking-[0.3em] sm:tracking-[0.35em] uppercase text-white/60 font-medium">
                {meta.badgeLabel}
              </span>
            </div>
            <div className="w-7 sm:w-8 h-7 sm:h-8 rounded-full border border-white/20 flex items-center justify-center opacity-0 group-hover:opacity-100 translate-x-2 group-hover:translate-x-0 transition-all duration-500">
              <svg className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </div>
      </a>

      <Modal
        open={open}
        close={() => setOpen(false)}
        title="Sign in to view albums"
        panelClassName="bg-[#050505] border border-white/10 text-white max-w-md"
      >
        <div className="mt-4 space-y-4">
          <p className="text-sm text-white/70 leading-relaxed">
            These albums are reserved for faculty and students of the BIT Mesra
            only. Sign in to unlock full-resolution galleries on our Drive.
          </p>
          <div className="flex items-center gap-3 text-xs text-white/40">
            <span className="inline-flex h-10 items-center justify-center rounded-full border border-white/15 bg-white/5 px-2 font-mono uppercase tracking-[0.18em] text-center">
              Private Collection
            </span>
            <span className="h-px w-10 bg-white/10" />
            <span>Curated photo stories, behind the scenes & more.</span>
          </div>
          <div className="mt-6 flex items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="text-xs font-medium text-white/50 hover:text-white/80 transition-colors"
            >
              Maybe later
            </button>
            
            <a
              href={`/login?redirectURL=${encodeURIComponent(currentPath)}`}
              className="inline-flex items-center gap-2 rounded-full bg-white text-black px-4 py-2 text-xs font-semibold tracking-[0.18em] uppercase hover:bg-white/90 transition-colors"
            >
              Sign in to continue
            </a>
          </div>
        </div>
      </Modal>
    </>
  );
});
EventImage.displayName = "EventImage";

export default function About() {
  const sectionRef = useRef<HTMLElement | null>(null);

  const [fetchAlbums, { data }] = useLazyQuery(GET_FEATURED_ALBUMS, {
    fetchPolicy: "network-only",
  });

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  if (params.get("loggedin") === "true") {
    toast.success("You're logged in! You can now view the album.");
    window.history.replaceState({}, "", window.location.pathname);
  }
}, []);

  useEffect(() => { void fetchAlbums(); }, [fetchAlbums]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const albums: Album[] = useMemo(() => (data as any)?.getFeaturedAlbums ?? [], [data]);

  const albumByName = useCallback(
    (name: string) =>
      albums.find((a) => normalize(a.name) === normalize(name)),
    [albums]
  );

  // Main GSAP animations — runs once on mount
  useEffect(() => {
    if (!sectionRef.current) return;
    const ctx = gsap.context(() => {

      document.querySelectorAll<HTMLElement>(".split-text").forEach((text) => {
        const split = new SplitType(text, { types: "chars,words,lines", tagName: "span" });
        gsap.fromTo(split.chars,
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, stagger: 0.015, duration: 0.8, ease: "power3.out",
            scrollTrigger: { trigger: text, start: "top 88%", end: "top 60%", scrub: 1 } }
        );
      });

      document.querySelectorAll<HTMLElement>(".manifesto-word").forEach((word, i) => {
        gsap.fromTo(word,
          { opacity: 0, y: 24, rotateX: -60, filter: "blur(8px)" },
          { opacity: 1, y: 0, rotateX: 0, filter: "blur(0px)", duration: 0.7, ease: "power3.out", delay: i * 0.04,
            scrollTrigger: { trigger: word, start: "top 88%", end: "top 68%", scrub: 1 } }
        );
      });

      gsap.utils.toArray<HTMLElement>(".reveal-up").forEach((el) => {
        gsap.fromTo(el,
          { y: 60, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.1, ease: "power3.out",
            scrollTrigger: { trigger: el, start: "top 92%", end: "top 65%", scrub: 1 } }
        );
      });

      gsap.utils.toArray<HTMLElement>(".parallax-slow").forEach((el) => {
        gsap.to(el, { y: -120, ease: "none",
          scrollTrigger: { trigger: el, start: "top bottom", end: "bottom top", scrub: 1.5 } });
      });

      gsap.utils.toArray<HTMLElement>(".stat-number").forEach((stat) => {
        const target = stat.getAttribute("data-target") || "0";
        ScrollTrigger.create({
          trigger: stat, start: "top 82%",
          onEnter: () => {
            gsap.from(stat, {
              textContent: 0, duration: 2, ease: "power2.out", snap: { textContent: 1 },
              onUpdate: function () {
                const cur = Math.ceil(Number(this.targets()[0].textContent));
                stat.textContent = target.includes("K+") ? `${cur}K+` : target.includes("+") ? `${cur}+` : cur.toString();
              },
            });
          },
        });
      });

      gsap.utils.toArray<HTMLElement>(".cinematic-line").forEach((line) => {
        gsap.fromTo(line,
          { scaleX: 0, transformOrigin: "left center" },
          { scaleX: 1, duration: 1.5, ease: "power2.inOut",
            scrollTrigger: { trigger: line, start: "top 85%", end: "top 60%", scrub: 1 } }
        );
      });

    }, sectionRef);
    return () => ctx.revert();
  }, []);

  // image-reveal runs AFTER albums data loads so <img> elements exist in DOM
  useEffect(() => {
    if (albums.length === 0) return;

    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        gsap.utils.toArray<HTMLElement>(".image-reveal").forEach((img) => {
          ScrollTrigger.getAll()
            .filter((st) => st.vars.trigger === img)
            .forEach((st) => st.kill());

          gsap.set(img, { clipPath: "none" });

          gsap.fromTo(img,
            { opacity: 0, scale: 1.08 },
            {
              opacity: 1, scale: 1, duration: 1.2, ease: "power3.out",
              scrollTrigger: { trigger: img, start: "top 85%", end: "top 50%", scrub: 1 },
            }
          );
        });
      });
    });

    return () => cancelAnimationFrame(id);
  }, [albums]);

  return (
    <section ref={sectionRef} id="about" className="relative bg-[#0b0d0c] text-white overflow-hidden">
      <div className="absolute top-0 right-0 w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] pointer-events-none opacity-10 bg-gradient-to-br from-purple-500/30 via-blue-500/30 to-cyan-500/30 blur-[120px] rounded-full" />

      <div className="pt-[4.375rem] py-24 sm:py-32 md:py-40 relative">

        {/* Background word */}
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
          <p className="reveal-up text-[10px] sm:text-xs tracking-[0.35em] uppercase text-white/50 mb-4 sm:mb-6">Who we are</p>
          <h2 className="split-text text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-serif mb-6 sm:mb-8 max-w-3xl leading-tight">
            The Photographic Society
          </h2>
          <p className="reveal-up max-w-xl sm:max-w-2xl text-white/65 leading-relaxed text-sm sm:text-base md:text-lg">
            PSOC is the official Photographic Society of Birla Institute of Technology, Mesra — a collective of visual storytellers who believe photography is more than an image.
          </p>
        </div>

        {/* Manifesto */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 mb-24 sm:mb-28 md:mb-32">
          <p className="max-w-xs sm:max-w-xl md:max-w-2xl lg:max-w-3xl text-base sm:text-lg md:text-[1.25rem] lg:text-[1.35rem] font-light text-white/85 leading-[1.75] sm:leading-[1.8] tracking-wide perspective-1000">
            {["We","don't","just","take","photographs","—","we","preserve","moments","that","outlive","time."]
              .map((w, i) => (
                <span key={i} className={`manifesto-word inline-block${i >= 6 ? " font-normal text-white" : ""}`}>{w}</span>
              ))
              .reduce<React.ReactNode[]>((acc, el, i) => i === 0 ? [el] : [...acc, " ", el], [])}
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
                  <p className="stat-number text-3xl sm:text-4xl md:text-5xl font-serif mb-1.5 sm:mb-2 bg-gradient-to-br from-white to-white/60 bg-clip-text text-transparent" data-target={target}>
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
          <p className="reveal-up text-[10px] sm:text-xs tracking-[0.35em] uppercase text-white/50 mb-4 sm:mb-6">What defines us</p>
          <h3 className="split-text text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-serif leading-tight">Flagship Events</h3>
        </div>

        {/* Events */}
        <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-8 md:px-12 lg:px-16 space-y-24 sm:space-y-32 md:space-y-40 pb-20 sm:pb-24 md:pb-32">
          {EVENT_META.map((meta, idx) => {
            const album = albumByName(meta.dbName);
            return (
              <div key={meta.dbName}>
                <div className="reveal-up">
                  <div className="flex flex-col lg:grid lg:grid-cols-2 lg:gap-20 xl:gap-24 lg:items-center gap-6 sm:gap-8">

                    {/* Title */}
                    <div className={`order-1 space-y-2 sm:space-y-3 ${meta.imageOnLeft ? "lg:order-2" : "lg:order-1"}`}>
                      <div className="flex items-center gap-3">
                        <div className={`h-px w-6 sm:w-8 bg-${meta.accentFrom}/60`} />
                        <p className="text-[9px] sm:text-[10px] tracking-[0.4em] sm:tracking-[0.5em] uppercase text-white/40 font-medium">{meta.tag}</p>
                      </div>
                      <h4 className="text-[2.2rem] sm:text-[2.8rem] md:text-[3.5rem] lg:text-[4rem] xl:text-[4.5rem] font-serif leading-[0.95] tracking-tight text-white">
                        {meta.dbName === "Batch Photography"
                          ? <>Batch<br className="hidden sm:block" /> Photography</>
                          : meta.dbName}
                      </h4>
                      <div className={`h-[2px] w-12 sm:w-16 bg-gradient-to-r from-${meta.accentFrom} to-${meta.accentTo} rounded-full`} />
                    </div>

                    {/* Image */}
                    <EventImage album={album} meta={meta} />

                    {/* Description */}
                    <div className="order-3 space-y-5 sm:space-y-6">
                      <p className="text-white/55 leading-[1.8] sm:leading-[1.85] text-sm sm:text-base md:text-[1.05rem] max-w-md font-light">
                        {meta.description}
                      </p>
                      <div className="flex gap-6 sm:gap-10">
                        {meta.stats.map((s) => (
                          <div key={s.label} className="space-y-1 border-l border-white/10 pl-4 sm:pl-5">
                            <span className="block text-[1.8rem] sm:text-[2.2rem] font-serif text-white leading-none">{s.value}</span>
                            <span className="text-[9px] sm:text-[11px] tracking-[0.2em] sm:tracking-[0.25em] uppercase text-white/35">{s.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>
                </div>

                {idx < EVENT_META.length - 1 && (
                  <div className="mt-24 sm:mt-32 md:mt-40 h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                )}
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        .perspective-1000 { perspective: 1000px; transform-style: preserve-3d; }
        .manifesto-word { display: inline-block; transform-origin: bottom center; }
        @keyframes glow-pulse { 0%, 100% { opacity: 0; } 50% { opacity: 0.3; } }
        .manifesto-glow { animation: glow-pulse 3s ease-in-out infinite; }
        @keyframes shimmer { 0% { transform: translateX(-100%); } 100% { transform: translateX(100%); } }
        .skeleton-shimmer {
          position: relative; overflow: hidden;
          background: rgba(255,255,255,0.025); border-radius: 6px;
        }
        .skeleton-shimmer::after {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%);
          animation: shimmer 1.8s infinite linear; will-change: transform;
        }
        @media (max-width: 360px) { .stat-number { font-size: 1.4rem; } }
      `}</style>
    </section>
  );
}