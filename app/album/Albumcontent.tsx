"use client";

import { useEffect, useRef, useState, useMemo, memo, useCallback } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------------------- */
/*                                  CONSTANTS                                 */
/* -------------------------------------------------------------------------- */

const ALL_MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December"
] as const;

const YEAR_START = 2020;
const YEAR_END = 2026;

type Album = {
  id: number;
  title: string;
  description: string;
  /** Format: "Month YYYY" */
  month: string;
  image: string;
  photoCount: number;
  tags: readonly string[];
};

// ---------------------------------------------------------------------------
// Album data
// ---------------------------------------------------------------------------
const ALBUMS: readonly Album[] = [
  {
    id: 1,
    title: "Autumn Chronicles",
    description:
      "Capturing the golden hues and serene beauty of autumn across campus.",
    month: "December 2025",
    image: "/camera1.jpg",
    photoCount: 127,
    tags: ["events", "campus"],
  },
  {
    id: 2,
    title: "Urban Perspectives",
    description:
      "Street photography exploring the intersection of architecture and humanity.",
    month: "November 2025",
    image: "/camera1.jpg",
    photoCount: 89,
    tags: ["events"],
  },
  {
    id: 3,
    title: "Workshop Series",
    description:
      "Behind-the-scenes moments from our monthly photography workshops.",
    month: "October 2025",
    image: "/camera1.jpg",
    photoCount: 156,
    tags: ["workshops"],
  },
  {
    id: 4,
    title: "Evening Lights",
    description:
      "The magic hour captured in its most vibrant and dramatic moments.",
    month: "July 2025",
    image: "/camera1.jpg",
    photoCount: 92,
    tags: ["events", "campus"],
  },
  {
    id: 5,
    title: "Portraits",
    description:
      "Stories told through faces, expressions, and unguarded moments.",
    month: "June 2025",
    image: "/camera1.jpg",
    photoCount: 64,
    tags: ["portraits"],
  },
  {
    id: 6,
    title: "Campus Life",
    description: "Daily moments that define the BIT Mesra experience.",
    month: "May 2025",
    image: "/camera1.jpg",
    photoCount: 201,
    tags: ["campus"],
  },
];

const FILTERS = ["all", "events", "workshops", "portraits", "campus"] as const;

/* -------------------------------------------------------------------------- */
/*                           FILTER BUTTON COMPONENT                          */
/* -------------------------------------------------------------------------- */

const FilterButton = memo(
  ({
    filter,
    isActive,
    onClick,
  }: {
    filter: string;
    isActive: boolean;
    onClick: (filter: string) => void;
  }) => {
    const handleClick = useCallback(() => {
      onClick(filter);
    }, [filter, onClick]);

    return (
      <button
        onClick={handleClick}
        aria-pressed={isActive}
        className={`relative px-4 md:px-5 py-2 text-xs tracking-wider uppercase font-medium rounded-full border transition-all duration-300 ${
          isActive
            ? "border-white text-white bg-white/5"
            : "border-white/20 text-white/50 hover:border-white/40 hover:text-white/70"
        }`}
      >
        {filter}
      </button>
    );
  }
);

FilterButton.displayName = "FilterButton";

/* -------------------------------------------------------------------------- */
/*                              ALBUM CARD                                    */
/* -------------------------------------------------------------------------- */

const AlbumCard = memo(
  ({
    album,
    index,
    isMobile,
  }: {
    album: typeof ALBUMS[number];
    index: number;
    isMobile: boolean;
  }) => (
    <div className="album-card group relative">
      <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 transition-all duration-500 hover:border-white/30">
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={album.image}
            alt={album.title}
            fill
            className="object-cover transition-all duration-700 group-hover:scale-110"
            priority={index < 3}
            quality={isMobile ? 75 : 85}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60" />
        </div>

        <div className="p-4 md:p-6 space-y-2">
          <span className="text-xs text-white/40">{album.month}</span>

          <h3 className="text-xl font-serif">{album.title}</h3>

          <p className="text-sm text-white/60 line-clamp-2">
            {album.description}
          </p>
        </div>
      </div>
    </div>
  )
);

AlbumCard.displayName = "AlbumCard";

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function AlbumContent() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef = useRef<HTMLDivElement | null>(null);

  const [activeFilter, setActiveFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  const isMobile = useMemo(() => {
    if (typeof window === "undefined") return false;
    return window.innerWidth < 768;
  }, []);

  /* ----------------------------- YEARS + MONTHS ---------------------------- */

  const availableYears = useMemo(() => {
    const years: string[] = [];

    for (let y = YEAR_END; y >= YEAR_START; y--) {
      years.push(String(y));
    }

    return years;
  }, []);

  const availableMonths = useMemo(() => ALL_MONTHS, []);

  /* ------------------------------ FILTER LOGIC ----------------------------- */

  const filteredAlbums = useMemo(() => {
    let filtered = ALBUMS;

    if (activeFilter !== "all") {
      filtered = filtered.filter((a) =>
        (a.tags as readonly string[]).includes(activeFilter)
      );
    }

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((a) =>
        a.title.toLowerCase().startsWith(query)
      );
    }

    if (selectedYear !== "all") {
      filtered = filtered.filter((a) => a.month.includes(selectedYear));
    }

    if (selectedMonth !== "all") {
      filtered = filtered.filter((a) =>
        a.month.startsWith(selectedMonth)
      );
    }

    return filtered;
  }, [activeFilter, searchQuery, selectedYear, selectedMonth]);

  /* -------------------------------------------------------------------------- */

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white py-32"
    >
      <div className="max-w-7xl mx-auto px-6">
        {/* HEADER */}
        <h1 className="text-6xl font-serif mb-10">Visual Archives</h1>

        {/* FILTER PILLS */}
        <div className="flex flex-wrap gap-3 mb-10">
          {FILTERS.map((filter) => (
            <FilterButton
              key={filter}
              filter={filter}
              isActive={activeFilter === filter}
              onClick={setActiveFilter}
            />
          ))}
        </div>

        {/* SEARCH + DATE FILTERS */}
        <div className="mb-12 space-y-6">
          {/* Search Bar */}
          <div className="relative w-full max-w-xl">
              <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search events by name (type 'b' for Bitotsav)…"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full rounded-lg border border-white/10 bg-white/5 px-11 pr-11 py-3 text-sm md:text-base text-white placeholder-white/40 shadow-sm backdrop-blur-sm outline-none transition-all duration-300 focus:border-white/40 focus:bg-white/10"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/80 transition-colors"
                  aria-label="Clear search"
                >
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
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


          {/* Year + Month dropdowns */}
          <div className="flex w-full max-w-2xl flex-col gap-4 sm:flex-row md:gap-6">
            {/* Year Filter */}
            <div className="flex-1">
              <label
                htmlFor="year-filter"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-white/60"
              >
                Filter by year
              </label>
              <div className="relative">
                <select
                  id="year-filter"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-sm md:text-base text-white shadow-sm backdrop-blur-sm outline-none transition-all duration-300 hover:border-white/30 focus:border-white/40 focus:bg-white/10"
                >
                  <option value="all" className="bg-black text-white">
                    All years
                  </option>
                  {availableYears.map((y) => (
                    <option
                      key={y}
                      value={y}
                      className="bg-black text-white"
                    >
                      {y}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white/50">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            {/* Month Filter */}
            <div className="flex-1">
              <label
                htmlFor="month-filter"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-white/60"
              >
                Filter by month
              </label>
              <div className="relative">
                <select
                  id="month-filter"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-sm md:text-base text-white shadow-sm backdrop-blur-sm outline-none transition-all duration-300 hover:border-white/30 focus:border-white/40 focus:bg-white/10"
                >
                  <option value="all" className="bg-black text-white">
                    All months
                  </option>
                  {availableMonths.map((m) => (
                    <option
                      key={m}
                      value={m}
                      className="bg-black text-white"
                    >
                      {m}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white/50">
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* GRID */}
        {filteredAlbums.length > 0 ? (
          <div
            ref={gridRef}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {filteredAlbums.map((album, index) => (
              <AlbumCard
                key={album.id}
                album={album}
                index={index}
                isMobile={isMobile}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 text-white/50">
            No albums found
          </div>
        )}
      </div>
    </section>
  );
}