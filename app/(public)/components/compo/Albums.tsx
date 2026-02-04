"use client";

import {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
  memo,
} from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

/* ─────────────────────────────────────────────
   TYPES
   ───────────────────────────────────────────── */

interface Album {
  id: number;
  title: string;
  description: string;
  month: string;
  image: string;
  photoCount: number;
  category: FilterKey;
}

type FilterKey = "all" | "events" | "workshops" | "portraits" | "campus";

/* ─────────────────────────────────────────────
   STATIC DATA – module-level, frozen.
   ───────────────────────────────────────────── */

const ALBUMS: readonly Album[] = Object.freeze([
  {
    id: 1,
    title: "Autumn Chronicles",
    description: "Capturing the golden hues and serene beauty of autumn across campus.",
    month: "December 2025",
    image: "/camera1.jpg",
    photoCount: 127,
    category: "campus",
  },
  {
    id: 2,
    title: "Urban Perspectives",
    description: "Street photography exploring the intersection of architecture and humanity.",
    month: "November 2025",
    image: "/camera1.jpg",
    photoCount: 89,
    category: "events",
  },
  {
    id: 3,
    title: "Workshop Series",
    description: "Behind-the-scenes moments from our monthly photography workshops.",
    month: "October 2025",
    image: "/camera1.jpg",
    photoCount: 156,
    category: "workshops",
  },
  {
    id: 4,
    title: "Evening Lights",
    description: "The magic hour captured in its most vibrant and dramatic moments.",
    month: "July 2025",
    image: "/camera1.jpg",
    photoCount: 92,
    category: "events",
  },
  {
    id: 5,
    title: "Portraits",
    description: "Stories told through faces, expressions, and unguarded moments.",
    month: "June 2025",
    image: "/camera1.jpg",
    photoCount: 64,
    category: "portraits",
  },
  {
    id: 6,
    title: "Campus Life",
    description: "Daily moments that define the BIT Mesra experience.",
    month: "May 2025",
    image: "/camera1.jpg",
    photoCount: 201,
    category: "campus",
  },
]) as Album[];

const FILTERS: readonly FilterKey[] = Object.freeze([
  "all",
  "events",
  "workshops",
  "portraits",
  "campus",
]) as FilterKey[];

/* ─────────────────────────────────────────────
   FILTER PILL
   ───────────────────────────────────────────── */

interface FilterPillProps {
  label: string;
  isActive: boolean;
  onClick: () => void;
}

const FilterPill = memo<FilterPillProps>(({ label, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`
      relative px-4 sm:px-6 py-2 sm:py-2.5 rounded-full text-xs sm:text-sm font-medium
      transition-all duration-300 whitespace-nowrap touch-manipulation uppercase tracking-wide
      ${
        isActive
          ? "text-white shadow-lg shadow-purple-500/50"
          : "text-gray-400 hover:text-gray-200 border border-gray-700"
      }
    `}
  >
    {label}
    {isActive && (
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full -z-10" />
    )}
  </button>
));

FilterPill.displayName = "FilterPill";

/* ─────────────────────────────────────────────
   ALBUM CARD
   ───────────────────────────────────────────── */

interface AlbumCardProps {
  album: Album;
  index: number;
}

const AlbumCard = memo<AlbumCardProps>(({ album, index }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      className="album-card group relative"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Shell */}
      <div className="relative bg-zinc-900/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-zinc-800/50 hover:border-purple-500/30 transition-all duration-500 h-full">
        {/* Image area */}
        <div className="relative w-full aspect-[4/3] sm:aspect-video overflow-hidden">
          <Image
            src={album.image}
            alt={album.title}
            fill
            className={`object-cover transition-transform duration-700 ${
              hovered ? "scale-110" : "scale-100"
            }`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
          {/* Bottom gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

          {/* Hover / tap CTA */}
          <div
            className={`absolute inset-0 flex items-center justify-center transition-opacity duration-300 ${
              hovered ? "opacity-100" : "opacity-0"
            }`}
          >
            <div className="px-4 sm:px-6 py-2 sm:py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 text-white text-xs sm:text-sm font-medium">
              View Album
            </div>
          </div>

          {/* Photo-count badge */}
          <div className="absolute top-3 sm:top-4 right-3 sm:right-4 px-2 sm:px-3 py-1 sm:py-1.5 bg-black/60 backdrop-blur-sm rounded-full border border-white/10">
            <span className="text-[10px] sm:text-xs text-white font-medium">
              {album.photoCount} photos
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4 sm:p-6 space-y-2 sm:space-y-3">
          <div className="text-[10px] sm:text-xs text-purple-400 font-medium uppercase tracking-wider">
            {album.month}
          </div>
          <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-white group-hover:text-purple-400 transition-colors duration-300">
            {album.title}
          </h3>
          <p className="text-xs sm:text-sm text-gray-400 line-clamp-2">
            {album.description}
          </p>
        </div>

        {/* Bottom bar */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 border-t border-zinc-800/50 flex items-center justify-between">
          <button className="text-xs sm:text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors touch-manipulation">
            Explore
          </button>
          <button className="text-xs sm:text-sm text-gray-400 hover:text-gray-300 transition-colors touch-manipulation">
            Save
          </button>
        </div>

        {/* Corner glow */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

        {/* Background index number */}
        <div className="absolute bottom-4 sm:bottom-6 right-4 sm:right-6 text-5xl sm:text-6xl lg:text-7xl font-black text-white/5 select-none pointer-events-none">
          {String(index + 1).padStart(2, "0")}
        </div>
      </div>
    </div>
  );
});

AlbumCard.displayName = "AlbumCard";

/* ─────────────────────────────────────────────
   ROOT
   ───────────────────────────────────────────── */

export default function Album() {
  const sectionRef = useRef<HTMLElement>(null);
  const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
  const [searchQuery, setSearchQuery] = useState("");

  /* ── GSAP – runs once, every trigger self-kills ── */
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.utils.toArray<HTMLElement>(".album-card").forEach((card) => {
        gsap.fromTo(
          card,
          { opacity: 0, y: 60, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 88%",
              end: "top 65%",
              scrub: 1,
              once: true,
            },
          }
        );
      });

      gsap.fromTo(
        ".album-header",
        { opacity: 0, y: 40 },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".album-header",
            start: "top 85%",
            once: true,
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  /* ── Stable filter setter ── */
  const handleFilterClick = useCallback(
    (f: FilterKey) => setActiveFilter(f),
    []
  );

  /* ── Stable search handler ── */
  const handleSearchChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(e.target.value);
    },
    []
  );

  /* ── Clear search ── */
  const clearSearch = useCallback(() => {
    setSearchQuery("");
  }, []);

  /* ── Filtered albums based on category and search ── */
  const filteredAlbums = useMemo(() => {
    let filtered = [...ALBUMS];

    // Filter by category
    if (activeFilter !== "all") {
      filtered = filtered.filter((album) => album.category === activeFilter);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (album) =>
          album.title.toLowerCase().includes(query) ||
          album.description.toLowerCase().includes(query) ||
          album.month.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [activeFilter, searchQuery]);

  /* Pills – rebuilds only when activeFilter changes */
  const pills = useMemo(
    () =>
      FILTERS.map((f) => (
        <FilterPill
          key={f}
          label={f.charAt(0).toUpperCase() + f.slice(1)}
          isActive={activeFilter === f}
          onClick={() => handleFilterClick(f)}
        />
      )),
    [activeFilter, handleFilterClick]
  );

  /* Cards – rebuilds when filteredAlbums changes */
  const cards = useMemo(
    () =>
      filteredAlbums.map((album, i) => (
        <AlbumCard key={album.id} album={album} index={i} />
      )),
    [filteredAlbums]
  );

  /* ── Render ── */
  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-black py-12 sm:py-16 lg:py-24 px-4 sm:px-6 lg:px-8 overflow-hidden"
    >
      {/* Noise */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none bg-[url('/noise.png')] bg-repeat" />

      {/* Content */}
      <div className="relative max-w-7xl mx-auto z-10">
        {/* Header */}
        <div className="album-header text-center mb-8 sm:mb-12 lg:mb-16 space-y-3 sm:space-y-4">
          <div className="inline-block px-3 sm:px-4 py-1 sm:py-1.5 bg-purple-500/10 border border-purple-500/20 rounded-full">
            <span className="text-xs sm:text-sm text-purple-400 font-medium">
              Our Collections
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-6xl font-black text-white">
            Visual Archives
          </h2>
          <p className="text-sm sm:text-base lg:text-lg text-gray-400 max-w-2xl mx-auto px-4">
            A curated collection of moments captured through our lens — from
            campus life to creative explorations, each album tells its own
            story.
          </p>
        </div>

        {/* Search Bar - ENHANCED VISIBILITY & Z-INDEX */}
        <div className="mb-8 sm:mb-10 max-w-2xl mx-auto relative z-20">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search albums by title, description, or month..."
              className="w-full px-6 py-4 pl-14 pr-12 bg-zinc-900/90 backdrop-blur-md border-2 border-zinc-700 rounded-full text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/70 focus:ring-2 focus:ring-purple-500/30 transition-all duration-300 text-base shadow-2xl"
              autoComplete="off"
            />
            {/* Search Icon */}
            <svg
              className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            {/* Clear Button */}
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 text-gray-400 hover:text-white transition-colors touch-manipulation bg-zinc-700/70 hover:bg-zinc-600 rounded-full z-10"
                aria-label="Clear search"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-10 sm:mb-12 px-2 relative z-10">
          {pills}
        </div>

        {/* Results count */}
        {(searchQuery || activeFilter !== "all") && (
          <div className="text-center mb-8">
            <p className="text-sm text-gray-400">
              Showing <span className="text-white font-semibold">{filteredAlbums.length}</span> of{" "}
              <span className="text-white font-semibold">{ALBUMS.length}</span> albums
              {searchQuery && (
                <span className="ml-2">
                  for <span className="text-purple-400 font-medium">&quot;{searchQuery}&quot;</span>
                </span>
              )}
            </p>
          </div>
        )}

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 mb-12">
          {cards.length > 0 ? (
            cards
          ) : (
            <div className="col-span-full text-center py-20">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl text-white font-bold mb-3">
                No albums found
              </h3>
              <p className="text-base text-gray-400 mb-8 max-w-md mx-auto">
                Try adjusting your search or filter criteria to find what you&apos;re looking for.
              </p>
              <button
                onClick={() => {
                  setSearchQuery("");
                  setActiveFilter("all");
                }}
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white rounded-full font-medium transition-all duration-300 hover:scale-105 touch-manipulation shadow-lg shadow-purple-500/50"
              >
                Clear All Filters
              </button>
            </div>
          )}
        </div>

        {/* Load More */}
        {filteredAlbums.length > 0 && filteredAlbums.length >= 6 && (
          <div className="text-center">
            <button className="px-8 py-4 bg-zinc-800/80 backdrop-blur-sm border-2 border-zinc-700/50 hover:border-purple-500/50 rounded-full text-white font-medium transition-all duration-300 hover:scale-105 touch-manipulation shadow-xl">
              Load More Albums
            </button>
          </div>
        )}
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}