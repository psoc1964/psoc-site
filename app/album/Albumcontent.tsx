"use client";

import { useEffect, useRef, useState, useMemo, memo, useCallback } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useLazyQuery } from "@apollo/client";
import { GET_PUBLISHED_ALBUMS } from "@/lib/queries";
import { convertDriveThumbnail } from "../(private)/lib/utils";

gsap.registerPlugin(ScrollTrigger);

/* -------------------------------------------------------------------------- */
/*                                  CONSTANTS                                 */
/* -------------------------------------------------------------------------- */

const ALL_MONTHS = [
  "January","February","March","April","May","June",
  "July","August","September","October","November","December",
] as const;

const YEAR_START = 2020;
const YEAR_END   = 2026;

type Album = {
  id:            number;
  name:          string;
  albumUrl?:     string;
  thumbnailUrl?: string;
  isPublished:   boolean;
  createdAt:     string;
};

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
  ({ album, index }: { album: Album; index: number }) => {
    const dateLabel = new Date(album.createdAt).toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });

    return (
      <div className="album-card group relative">
        <div className="relative overflow-hidden rounded-2xl bg-white/5 border border-white/10 transition-all duration-500 hover:border-white/30">
          <div className="relative aspect-[4/3] overflow-hidden">
            <img
              src={convertDriveThumbnail(album.thumbnailUrl ?? "") || "/fallback.jpg"}
              alt={album.name}
              className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110"
              loading={index < 3 ? "eager" : "lazy"}
              onError={(e) => {
              (e.currentTarget as HTMLImageElement).src = "/fallback.jpg";
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60" />
          </div>

          <div className="p-4 md:p-6 space-y-2">
            <span className="text-xs text-white/40">{dateLabel}</span>
            <h3 className="text-xl font-serif">{album.name}</h3>
          </div>
        </div>
      </div>
    );
  }
);
AlbumCard.displayName = "AlbumCard";

/* -------------------------------------------------------------------------- */
/*                              MAIN COMPONENT                                */
/* -------------------------------------------------------------------------- */

export default function AlbumContent() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const gridRef    = useRef<HTMLDivElement | null>(null);

  const [activeFilter,  setActiveFilter]  = useState<string>("all");
  const [searchQuery,   setSearchQuery]   = useState<string>("");
  const [selectedYear,  setSelectedYear]  = useState<string>("all");
  const [selectedMonth, setSelectedMonth] = useState<string>("all");

  /* ------------------------------ FETCH DATA ------------------------------ */

  const [fetchAlbums, { data, loading, error }] = useLazyQuery(GET_PUBLISHED_ALBUMS, {
  fetchPolicy: "network-only",
 });

  useEffect(() => {
    void fetchAlbums();
  }, [fetchAlbums]);

  const albums: Album[] = useMemo(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => (data as any)?.getPublishedAlbums ?? [],
    [data]
  );

  /* ----------------------------- YEARS + MONTHS --------------------------- */

  const availableYears = useMemo(() => {
    const years: string[] = [];
    for (let y = YEAR_END; y >= YEAR_START; y--) years.push(String(y));
    return years;
  }, []);

  /* ------------------------------ FILTER LOGIC ---------------------------- */

  const filteredAlbums = useMemo(() => {
    let filtered = albums;

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((a) =>
        a.name.toLowerCase().startsWith(query)
      );
    }

    if (selectedYear !== "all") {
      filtered = filtered.filter(
        (a) => new Date(a.createdAt).getFullYear() === Number(selectedYear)
      );
    }

    if (selectedMonth !== "all") {
      filtered = filtered.filter((a) => {
        const month = new Date(a.createdAt).toLocaleString("en-US", {
          month: "long",
        });
        return month === selectedMonth;
      });
    }

    return filtered;
  }, [albums, searchQuery, selectedYear, selectedMonth]);

  /* ------------------------------ LOADING / ERROR ------------------------- */

  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-white/50 text-lg">
      Loading albums...
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-black flex items-center justify-center text-red-400 text-lg">
      Error: {error.message}
    </div>
  );

  /* ------------------------------------------------------------------------ */

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
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search albums by name..."
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
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Year + Month dropdowns */}
          <div className="flex w-full max-w-2xl flex-col gap-4 sm:flex-row md:gap-6">

            {/* Year Filter */}
            <div className="flex-1">
              <label htmlFor="year-filter"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-white/60">
                Filter by year
              </label>
              <div className="relative">
                <select
                  id="year-filter"
                  value={selectedYear}
                  onChange={(e) => setSelectedYear(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-sm md:text-base text-white shadow-sm backdrop-blur-sm outline-none transition-all duration-300 hover:border-white/30 focus:border-white/40 focus:bg-white/10"
                >
                  <option value="all" className="bg-black text-white">All years</option>
                  {availableYears.map((y) => (
                    <option key={y} value={y} className="bg-black text-white">{y}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white/50">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Month Filter */}
            <div className="flex-1">
              <label htmlFor="month-filter"
                className="mb-2 block text-xs font-medium uppercase tracking-[0.16em] text-white/60">
                Filter by month
              </label>
              <div className="relative">
                <select
                  id="month-filter"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 pr-10 text-sm md:text-base text-white shadow-sm backdrop-blur-sm outline-none transition-all duration-300 hover:border-white/30 focus:border-white/40 focus:bg-white/10"
                >
                  <option value="all" className="bg-black text-white">All months</option>
                  {ALL_MONTHS.map((m) => (
                    <option key={m} value={m} className="bg-black text-white">{m}</option>
                  ))}
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-white/50">
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* GRID */}
        {filteredAlbums.length > 0 ? (
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAlbums.map((album, index) => (
              <AlbumCard key={album.id} album={album} index={index} />
            ))}
          </div>
        ) : (
          <div className="text-center py-32 text-white/50">No albums found</div>
        )}

      </div>
    </section>
  );
}