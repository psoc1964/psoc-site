"use client";
import { toast } from "react-hot-toast";
import {
  useEffect,
  useRef,
  useState,
  useMemo,
  memo,
  useCallback,
} from "react";
import { createPortal } from "react-dom";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import AlbumCard from "./AlbumCard";
import { useUser } from "@/lib/auth-client";
import Modal from "@/components/ui/modal";
import { toDriveThumbnail } from "@/app/(private)/lib/utils";
import { useLazyVisible } from "@/app/(private)/lib/useLazyVisible";

gsap.registerPlugin(ScrollTrigger);

const ALL_MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
] as const;

const INITIAL_YEAR_COUNT = 3;

type Album = {
  id: number;
  name: string;
  albumUrl?: string;
  thumbnailUrl?: string;
  createdAt: string;
  isauthentic: boolean;
};

// ─── Dropdown ────────────────────────────────────────────────────────────────
const Dropdown = memo(({
  value, onChange, options, placeholder, width = "w-40",
}: {
  value: string;
  onChange: (val: string) => void;
  options: { label: string; value: string }[];
  placeholder: string;
  width?: string;
}) => {
  const [open, setOpen]       = useState(false);
  const [rect, setRect]       = useState<DOMRect | null>(null);
  const [mounted, setMounted] = useState(false);
  const triggerRef            = useRef<HTMLButtonElement>(null);
  const panelRef              = useRef<HTMLDivElement>(null);

  const selected   = options.find((o) => o.value === value);
  const isFiltered = value !== "all";

  useEffect(() => { setMounted(true); }, []);

  const handleOpen = useCallback(() => {
    if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
    setOpen((p) => !p);
  }, []);

  useEffect(() => {
    if (!open) return;
    const update = () => {
      if (triggerRef.current) setRect(triggerRef.current.getBoundingClientRect());
    };
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: MouseEvent) => {
      if (
        triggerRef.current?.contains(e.target as Node) ||
        panelRef.current?.contains(e.target as Node)
      ) return;
      setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  const handleChange = useCallback((val: string) => {
    onChange(val);
    setOpen(false);
  }, [onChange]);

  const panelStyle: React.CSSProperties = rect
    ? { position: "fixed", top: rect.bottom + 6, left: rect.left, width: Math.max(rect.width, 160), zIndex: 9999 }
    : { display: "none" };

  const panel = open && mounted && rect ? createPortal(
    <div
      ref={panelRef}
      style={panelStyle}
      className="rounded-2xl border border-white/10 bg-[#0d0d0d] shadow-[0_20px_60px_rgba(0,0,0,0.95)] overflow-hidden"
    >
      <div
        className="max-h-52 overflow-y-auto py-1"
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => handleChange(opt.value)}
            className={`
              w-full text-left px-4 py-2.5 text-[13px] cursor-pointer
              transition-colors duration-100 flex items-center justify-between
              ${opt.value === value
                ? "text-white bg-white/[0.08]"
                : "text-white/45 hover:text-white hover:bg-white/[0.05]"
              }
            `}
          >
            <span>{opt.label}</span>
            {opt.value === value && (
              <svg className="h-3 w-3 text-white/40 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            )}
          </button>
        ))}
      </div>
    </div>,
    document.body,
  ) : null;

  return (
    <div className={`relative ${width} select-none`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={handleOpen}
        className={`
          w-full h-9 flex items-center justify-between gap-2 px-3 rounded-xl
          text-[12.5px] font-medium cursor-pointer transition-all duration-200
          ${isFiltered
            ? "border border-white/30 bg-white/[0.09] text-white shadow-[0_0_0_1px_rgba(255,255,255,0.07)]"
            : open
              ? "border border-white/18 bg-white/[0.06] text-white/70"
              : "border border-white/10 bg-white/[0.04] text-white/40 hover:border-white/18 hover:text-white/65 hover:bg-white/[0.06]"
          }
        `}
      >
        <span className="truncate leading-none text-left flex items-center gap-2">
          {isFiltered && <span className="w-1.5 h-1.5 rounded-full bg-white/50 shrink-0" />}
          {selected?.label ?? placeholder}
        </span>
        <svg
          className={`h-3 w-3 text-white/30 transition-transform duration-200 shrink-0 ${open ? "rotate-180" : ""}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      {panel}
    </div>
  );
});
Dropdown.displayName = "Dropdown";

// ─── Desktop skeleton card ───────────────────────────────────────────────────
const SkeletonCard = memo(({ index }: { index: number }) => (
  <div
    className="rounded-2xl overflow-hidden border border-white/[0.06] bg-white/[0.02]"
    style={{ animationDelay: `${index * 80}ms` }}
  >
    <div className="relative aspect-[3/2] overflow-hidden bg-white/[0.03]">
      <div className="skeleton-shimmer absolute inset-0" />
    </div>
    <div className="p-5 space-y-3">
      <div className="skeleton-shimmer h-3 w-20 rounded-full" />
      <div className="skeleton-shimmer h-5 w-3/4 rounded-full" />
    </div>
  </div>
));
SkeletonCard.displayName = "SkeletonCard";

// ─── Mobile list skeleton card ───────────────────────────────────────────────
const ListSkeletonCard = memo(({ index }: { index: number }) => (
  <div
    className="flex items-center gap-3 px-3 py-2.5 rounded-2xl border border-white/[0.06] bg-white/[0.02]"
    style={{ animationDelay: `${index * 60}ms` }}
  >
    <div className="skeleton-shimmer flex-none rounded-xl aspect-[3/2] w-20 md:aspect-square md:w-14" />
    <div className="flex-1 space-y-2">
      <div className="skeleton-shimmer h-3 w-2/3 rounded-full" />
      <div className="skeleton-shimmer h-2.5 w-1/3 rounded-full" />
    </div>
  </div>
));
ListSkeletonCard.displayName = "ListSkeletonCard";

// ─── Mobile list card ────────────────────────────────────────────────────────
const ListCard = memo(({
  album,
  index,
  isVisible,
}: {
  album: Album;
  index: number;
  isVisible: boolean;
}) => {
  const [user] = useUser();
  const [open, setOpen] = useState(false);

  // Lazy-load the thumbnail once it's near (or in) the viewport.
  // Shared hook so this behaves identically to the desktop AlbumCard,
  // and falls back to "always visible" on browsers without IO support.
  const { ref: thumbRef, visible: shouldLoad } = useLazyVisible();

  const handleClick = useCallback(() => {
    const isProtected = album.isauthentic === true;
    if (!isProtected) {
      if (album.albumUrl) window.open(album.albumUrl, "_blank", "noopener,noreferrer");
      return;
    }
    if (user) {
      if (album.albumUrl) window.open(album.albumUrl, "_blank", "noopener,noreferrer");
    } else {
      setOpen(true);
    }
  }, [user, album]);

  const date  = new Date(album.createdAt);
  const month = date.toLocaleString("en-US", { month: "short" });
  const day   = date.getDate();
  const year  = date.getFullYear();

  return (
    <>
      <div
        onClick={handleClick}
        className="flex items-center gap-3 px-3 py-2.5 rounded-2xl border border-white/[0.08] bg-white/[0.03] cursor-pointer active:scale-[0.985] transition-transform duration-150"
        style={{
          opacity: isVisible ? 1 : 0,
          transform: isVisible ? "translateX(0)" : "translateX(-10px)",
          transition: `opacity 0.3s ease ${index * 45}ms, transform 0.3s ease ${index * 45}ms`,
        }}
      >
        {/* Lazy thumbnail */}
        <div
          ref={thumbRef}
          className="relative flex-none rounded-xl overflow-hidden bg-white/[0.04] aspect-[3/2] w-20 md:aspect-square md:w-14"
        >
          {shouldLoad && album.thumbnailUrl ? (
            <img
              src={toDriveThumbnail(album.thumbnailUrl)}
              alt={album.name}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover object-center"
            />
          ) : (
            <div className="skeleton-shimmer absolute inset-0 rounded-xl" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-medium text-white/85 truncate">
            {album.name}
          </p>
          <p className="text-[11px] text-white/35">
            {month} {day}, {year}
          </p>
        </div>
      </div>

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
              href={`/login?redirectURL=${encodeURIComponent(window.location.pathname)}`}
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
ListCard.displayName = "ListCard";

// ─── Year section heading ─────────────────────────────────────────────────────
const YearHeading = memo(({ year, count }: { year: number; count: number }) => (
  <div className="flex items-center gap-5 mb-6 mt-4">
    <div className="flex items-baseline gap-3">
      <h2 className="text-[2.6rem] md:text-[3.2rem] font-serif leading-none tracking-tight text-white/90">
        {year}
      </h2>
      <span className="text-[11px] tracking-[0.35em] uppercase text-white/25 font-medium pb-1">
        {count} {count === 1 ? "album" : "albums"}
      </span>
    </div>
    <div className="flex-1 h-px bg-gradient-to-r from-white/[0.12] to-transparent" />
  </div>
));
YearHeading.displayName = "YearHeading";

// ─── Main component ───────────────────────────────────────────────────────────
export default function AlbumContent({
  albums,
  loading,
}: {
  albums: Album[];
  loading: boolean;
}) {
  const sectionRef  = useRef<HTMLElement | null>(null);
  const gridRef     = useRef<HTMLDivElement | null>(null);
  const headerRef   = useRef<HTMLDivElement | null>(null);
  // Tracked via state (callback ref) rather than a plain useRef.
  // The sentinel only exists in the DOM once `loading`/`cardsVisible`
  // flips to show real content — a plain ref's value changing doesn't
  // re-run an effect, so an observer set up against `sentinelRef.current`
  // before that point would attach to `null` and never fire again. Using
  // state means the effect below re-runs the instant the node mounts.
  const [sentinelEl, setSentinelEl] = useState<HTMLDivElement | null>(null);

  const [searchQuery,    setSearchQuery]    = useState<string>("");
  const [selectedYear,   setSelectedYear]   = useState<string>("all");
  const [selectedMonth,  setSelectedMonth]  = useState<string>("all");
  const [cardsVisible,   setCardsVisible]   = useState(false);
  const [searchFocused,  setSearchFocused]  = useState(false);
  // Pagination is by year — always show complete year sections
  const [visibleYearCount, setVisibleYearCount] = useState(INITIAL_YEAR_COUNT);

  // ── Initial card reveal ──────────────────────────────────────────────────
  useEffect(() => {
    if (albums.length > 0) {
      const id = setTimeout(() => setCardsVisible(true), 400);
      return () => clearTimeout(id);
    }
  }, [albums]);

  // ── Login toast ──────────────────────────────────────────────────────────
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("loggedin") === "true") {
      toast.success("You're logged in! You can now view the album.");
      window.history.replaceState({}, "", window.location.pathname);
    }
  }, []);

  // ── Reset on filter change ───────────────────────────────────────────────
  const prevFilter = useRef({ searchQuery, selectedYear, selectedMonth });
  useEffect(() => {
    const prev = prevFilter.current;
    const changed =
      prev.searchQuery   !== searchQuery   ||
      prev.selectedYear  !== selectedYear  ||
      prev.selectedMonth !== selectedMonth;

    if (changed) {
      setVisibleYearCount(INITIAL_YEAR_COUNT); // ← reset to first 3 years
      setCardsVisible(false);
      const id = setTimeout(() => setCardsVisible(true), 80);
      prevFilter.current = { searchQuery, selectedYear, selectedMonth };
      return () => clearTimeout(id);
    }
  }, [searchQuery, selectedYear, selectedMonth]);

  // ── Header animation ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!headerRef.current || loading) return;
    gsap.fromTo(
      headerRef.current.children,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.65, stagger: 0.1, ease: "power3.out", delay: 0.1 },
    );
  }, [loading]);

  // ── Infinite scroll sentinel — loads 2 more years per batch ─────────────
  useEffect(() => {
    if (!sentinelEl) return;

    const margin = window.innerWidth < 768 ? "200px" : "400px";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setVisibleYearCount((prev) => prev + 2);
        }
      },
      { rootMargin: margin }
    );

    observer.observe(sentinelEl);
    return () => observer.disconnect();
    // Re-run only when the sentinel DOM node itself changes (mounts when
    // `hasMore` first becomes true, unmounts to null when it becomes
    // false). One observer instance keeps firing on every subsequent
    // intersection — no need to recreate it per batch.
  }, [sentinelEl]);

  // ── Available year options for dropdown ──────────────────────────────────
  const availableYears = useMemo(() => {
    if (albums.length === 0) return [];
    const years = albums.map((a) => new Date(a.createdAt).getFullYear());
    const min = Math.min(...years);
    const max = Math.max(...years);
    const result: string[] = [];
    for (let y = max; y >= min; y--) result.push(String(y));
    return result;
  }, [albums]);

  // ── Filter operates on FULL dataset — never paginated ───────────────────
  const filteredAlbums = useMemo(() => {
    let filtered = albums;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter((a) => a.name.toLowerCase().includes(q));
    }
    if (selectedYear !== "all") {
      filtered = filtered.filter(
        (a) => new Date(a.createdAt).getFullYear() === Number(selectedYear)
      );
    }
    if (selectedMonth !== "all") {
      filtered = filtered.filter((a) => {
        const m = new Date(a.createdAt).toLocaleString("en-US", { month: "long" });
        return m === selectedMonth;
      });
    }
    return filtered;
  }, [albums, searchQuery, selectedYear, selectedMonth]);

  // ── Group ALL filtered albums by year (complete groups, never split) ─────
  const allAlbumsByYear = useMemo(() => {
    const map = new Map<number, Album[]>();
    for (const album of filteredAlbums) {
      const year = new Date(album.createdAt).getFullYear();
      if (!map.has(year)) map.set(year, []);
      map.get(year)!.push(album);
    }
    return Array.from(map.entries())
      .sort((a, b) => b[0] - a[0])
      .map(([year, yearAlbums]) => [
        year,
        [...yearAlbums].sort(
          (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        ),
      ] as [number, Album[]]);
  }, [filteredAlbums]);

  // ── Slice by year count — always shows complete year sections ────────────
  const albumsByYear = useMemo(
    () => allAlbumsByYear.slice(0, visibleYearCount),
    [allAlbumsByYear, visibleYearCount]
  );

  const hasMore = visibleYearCount < allAlbumsByYear.length;

  const hasActiveFilters =
    selectedYear !== "all" || selectedMonth !== "all" || searchQuery.trim() !== "";

  const clearFilters = useCallback(() => {
    setSearchQuery("");
    setSelectedYear("all");
    setSelectedMonth("all");
  }, []);

  let globalCardIndex = 0;

  return (
    <>
      <style>{`
        html { scroll-behavior: smooth; }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .skeleton-shimmer {
          position: relative; overflow: hidden;
          background: rgba(255,255,255,0.025); border-radius: 6px;
        }
        .skeleton-shimmer::after {
          content: ""; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.06) 50%, transparent 100%);
          animation: shimmer 1.8s infinite linear; will-change: transform;
        }
        .album-card-animate { contain: layout style; }
        .search-input-field:focus {
          border-color: rgba(255,255,255,0.32) !important;
          background: rgba(255,255,255,0.075) !important;
          box-shadow: 0 0 0 3px rgba(255,255,255,0.06), 0 0 28px rgba(255,255,255,0.04) !important;
        }
        .search-input-field.has-value {
          border-color: rgba(255,255,255,0.22);
          background: rgba(255,255,255,0.065);
        }
        .filter-toolbar::before {
          content: ""; position: absolute; top: 0; left: 15%; right: 15%; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          border-radius: 50%; pointer-events: none;
        }
        .kbd-badge {
          font-size: 10px; color: rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.055); border: 1px solid rgba(255,255,255,0.1);
          border-radius: 5px; padding: 2px 5px; font-family: ui-monospace, monospace;
          line-height: 1.4; user-select: none;
        }
        .year-section + .year-section { margin-top: 4rem; }
        @media (prefers-reduced-motion: reduce) {
          .album-card-animate { transition: none !important; opacity: 1 !important; transform: none !important; }
          .skeleton-shimmer::after { animation: none; }
        }
      `}</style>

      <section
        ref={sectionRef}
        className="relative min-h-screen bg-gradient-to-b from-black via-[#080808] to-black text-white pt-28 sm:pt-32 pb-32"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div ref={headerRef}>

            {/* ── Page title ── */}
            <div className="mb-16" style={{ opacity: 0 }}>
              <p className="text-[10px] tracking-[0.55em] uppercase text-white/25 mb-5 font-medium">
                PSOC — Photographic Society
              </p>
              <h1 className="text-5xl md:text-[5.5rem] font-serif leading-none tracking-tight">
                Visual Archives
              </h1>
            </div>

            {/* ── Filter toolbar ── */}
            <div className="mb-16" style={{ opacity: 0 }}>
              <div
                className="filter-toolbar relative rounded-[20px] border border-white/[0.09] bg-white/[0.025] p-4 sm:p-5 space-y-3"
                style={{ isolation: "isolate" }}
              >
                {/* Search */}
                <div className="relative group">
                  <div
                    className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 transition-colors duration-200"
                    style={{ color: searchFocused || searchQuery ? "rgba(255,255,255,0.45)" : "rgba(255,255,255,0.22)" }}
                  >
                    <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search albums by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setSearchFocused(false)}
                    className={`search-input-field w-full h-[46px] rounded-[14px] border bg-white/[0.05] pl-10 pr-24 text-[13.5px] text-white placeholder-white/20 outline-none transition-[border-color,background,box-shadow] duration-250 ${
                      searchQuery ? "has-value" : "border-white/[0.13]"
                    }`}
                  />
                  <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5">
                    {searchQuery ? (
                      <button
                        type="button"
                        onClick={() => setSearchQuery("")}
                        className="w-[22px] h-[22px] rounded-full bg-white/[0.09] hover:bg-white/[0.16] flex items-center justify-center transition-colors duration-150 cursor-pointer"
                      >
                        <svg className="h-2.5 w-2.5 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    ) : (
                      <>
                        <span className="kbd-badge">⌘</span>
                        <span className="kbd-badge">K</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="h-px bg-white/[0.055] rounded-full" />

                {/* Dropdowns row */}
                <div className="flex flex-wrap items-center gap-2">
                  <Dropdown
                    value={selectedYear}
                    onChange={setSelectedYear}
                    placeholder="Year"
                    width="w-32"
                    options={[
                      { label: "All years", value: "all" },
                      ...availableYears.map((y) => ({ label: y, value: y })),
                    ]}
                  />
                  <Dropdown
                    value={selectedMonth}
                    onChange={setSelectedMonth}
                    placeholder="Month"
                    width="w-36"
                    options={[
                      { label: "All months", value: "all" },
                      ...ALL_MONTHS.map((m) => ({ label: m, value: m })),
                    ]}
                  />
                  <div className="w-px h-4 bg-white/[0.08] mx-0.5" />
                  {!loading && (
                    <div className="flex items-center gap-1.5 px-2.5 h-7 rounded-full border border-white/[0.08] bg-white/[0.03]">
                      <span className="w-1.5 h-1.5 rounded-full bg-white/25" />
                      <span className="text-[11.5px] text-white/32 tabular-nums tracking-wide">
                        {filteredAlbums.length}{" "}{filteredAlbums.length === 1 ? "album" : "albums"}
                      </span>
                    </div>
                  )}
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="ml-auto flex items-center gap-1.5 px-2.5 h-7 rounded-full border border-white/[0.08] bg-transparent hover:border-white/[0.18] hover:bg-white/[0.04] text-[11.5px] text-white/30 hover:text-white/60 transition-all duration-200 cursor-pointer"
                    >
                      <svg className="h-2.5 w-2.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      Clear filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* ── Main content ── */}
          {loading || (albums.length > 0 && !cardsVisible) ? (
            <div className="space-y-16">
              <div>
                <div className="flex items-center gap-5 mb-6 mt-4">
                  <div className="skeleton-shimmer h-12 w-32 rounded-lg" />
                  <div className="flex-1 h-px bg-white/[0.06]" />
                </div>
                {/* Mobile skeleton */}
                <div className="md:hidden flex flex-col gap-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <ListSkeletonCard key={i} index={i} />
                  ))}
                </div>
                {/* Desktop skeleton */}
                <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <SkeletonCard key={i} index={i} />
                  ))}
                </div>
              </div>
            </div>

          ) : albumsByYear.length > 0 ? (
            <div ref={gridRef} className="space-y-0">
              {albumsByYear.map(([year, yearAlbums]) => (
                <div key={year} className="year-section">
                  <YearHeading year={year} count={yearAlbums.length} />

                  {/* ── MOBILE: vertical list ── */}
                  <div className="md:hidden flex flex-col gap-2 mb-2">
                    {yearAlbums.map((album) => {
                      const idx = globalCardIndex++;
                      return (
                        <ListCard
                          key={album.id}
                          album={album}
                          index={idx}
                          isVisible={cardsVisible}
                        />
                      );
                    })}
                  </div>

                  {/* ── DESKTOP: 3-col grid ── */}
                  <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                    {yearAlbums.map((album) => {
                      const idx = globalCardIndex++;
                      return (
                        <AlbumCard
                          key={album.id}
                          album={album}
                          index={idx}
                          isVisible={cardsVisible}
                        />
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* ── Infinite scroll sentinel ── */}
              {hasMore && (
                <>
                  <div ref={setSentinelEl} className="h-4" aria-hidden="true" />
                  <div className="mt-6">
                    {/* Mobile loading skeletons */}
                    <div className="md:hidden flex flex-col gap-2">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <ListSkeletonCard key={i} index={i} />
                      ))}
                    </div>
                    {/* Desktop loading skeletons */}
                    <div className="hidden md:grid grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <SkeletonCard key={i} index={i} />
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ── End of results ── */}
              {/* {!hasMore && allAlbumsByYear.length > INITIAL_YEAR_COUNT && (
                <p className="text-center text-white/15 text-xs tracking-[0.3em] uppercase py-16">
                  All {filteredAlbums.length} albums loaded
                </p>
              )} */}
            </div>

          ) : (
            <div className="text-center py-32">
              <p className="text-white/15 text-sm tracking-[0.3em] uppercase">
                No albums found
              </p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}