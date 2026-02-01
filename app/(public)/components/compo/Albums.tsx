"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

// Album data
const albums = [
  {
    id: 1,
    title: "Autumn Chronicles",
    description: "Capturing the golden hues and serene beauty of autumn across campus.",
    month: "December 2025",
    image: "/camera1.jpg",
    photoCount: 127,
  },
  {
    id: 2,
    title: "Urban Perspectives",
    description: "Street photography exploring the intersection of architecture and humanity.",
    month: "November 2025",
    image: "/camera1.jpg",
    photoCount: 89,
  },
  {
    id: 3,
    title: "Workshop Series",
    description: "Behind-the-scenes moments from our monthly photography workshops.",
    month: "October 2025",
    image: "/camera1.jpg",
    photoCount: 156,
  },
  {
    id: 4,
    title: "Evening Lights",
    description: "The magic hour captured in its most vibrant and dramatic moments.",
    month: "July 2025",
    image: "/camera1.jpg",
    photoCount: 92,
  },
  {
    id: 5,
    title: "Portraits",
    description: "Stories told through faces, expressions, and unguarded moments.",
    month: "June 2025",
    image: "/camera1.jpg",
    photoCount: 64,
  },
  {
    id: 6,
    title: "Campus Life",
    description: "Daily moments that define the BIT Mesra experience.",
    month: "May 2025",
    image: "/camera1.jpg",
    photoCount: 201,
  },
];

export default function Album() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeFilter, setActiveFilter] = useState("all");

  useEffect(() => {
    if (!sectionRef.current) return;

    const ctx = gsap.context(() => {
      // Staggered album card reveals
      gsap.utils.toArray<HTMLElement>(".album-card").forEach((card, index) => {
        gsap.fromTo(
          card,
          {
            opacity: 0,
            y: 60,
            scale: 0.95,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 1.2,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top 85%",
              end: "top 60%",
              scrub: 1,
            },
          }
        );
      });

      // Floating doodles parallax
      gsap.utils.toArray<HTMLElement>(".doodle").forEach((doodle) => {
        const speed = doodle.getAttribute("data-speed") || "1";
        gsap.to(doodle, {
          y: -100 * parseFloat(speed),
          ease: "none",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top bottom",
            end: "bottom top",
            scrub: 1.5,
          },
        });
      });

      // Header animation
      gsap.fromTo(
        ".album-header",
        {
          opacity: 0,
          y: 40,
        },
        {
          opacity: 1,
          y: 0,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: ".album-header",
            start: "top 80%",
          },
        }
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="album"
      className="relative min-h-screen bg-gradient-to-b from-black via-[#0a0a0a] to-black text-white py-32 overflow-hidden"
    >
      {/* Subtle noise texture */}
      <div className="absolute inset-0 opacity-[0.015] pointer-events-none mix-blend-overlay">
        <div
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' /%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' /%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Photography Doodles - Floating Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Camera doodle - top right */}
        <div
          className="doodle absolute top-32 right-[10%] opacity-[0.03]"
          data-speed="0.8"
        >
          <svg width="120" height="120" viewBox="0 0 120 120" fill="none" stroke="white" strokeWidth="2">
            <rect x="20" y="40" width="80" height="50" rx="4" />
            <circle cx="60" cy="65" r="15" />
            <circle cx="60" cy="65" r="10" />
            <rect x="85" y="45" width="8" height="8" rx="1" />
            <path d="M40 40 L45 30 L55 30 L60 40" />
          </svg>
        </div>

        {/* Aperture doodle - left side */}
        <div
          className="doodle absolute top-[40%] left-[5%] opacity-[0.04]"
          data-speed="1.2"
        >
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="2">
            <circle cx="50" cy="50" r="35" />
            <path d="M50 15 L50 35 M50 65 L50 85 M15 50 L35 50 M65 50 L85 50" />
            <path d="M25 25 L38 38 M62 62 L75 75 M75 25 L62 38 M38 62 L25 75" />
          </svg>
        </div>

        {/* Film strip doodle - bottom left */}
        <div
          className="doodle absolute bottom-[20%] left-[15%] opacity-[0.03]"
          data-speed="0.6"
        >
          <svg width="140" height="80" viewBox="0 0 140 80" fill="none" stroke="white" strokeWidth="2">
            <rect x="10" y="10" width="120" height="60" rx="2" />
            <line x1="10" y1="20" x2="130" y2="20" />
            <line x1="10" y1="60" x2="130" y2="60" />
            <line x1="45" y1="10" x2="45" y2="70" />
            <line x1="70" y1="10" x2="70" y2="70" />
            <line x1="95" y1="10" x2="95" y2="70" />
            <rect x="5" y="15" width="6" height="6" />
            <rect x="5" y="35" width="6" height="6" />
            <rect x="5" y="55" width="6" height="6" />
            <rect x="129" y="15" width="6" height="6" />
            <rect x="129" y="35" width="6" height="6" />
            <rect x="129" y="55" width="6" height="6" />
          </svg>
        </div>

        {/* Focus frame doodle - top left */}
        <div
          className="doodle absolute top-[25%] left-[8%] opacity-[0.04]"
          data-speed="1"
        >
          <svg width="90" height="90" viewBox="0 0 90 90" fill="none" stroke="white" strokeWidth="2">
            <path d="M10 10 L30 10 M10 10 L10 30" />
            <path d="M80 10 L60 10 M80 10 L80 30" />
            <path d="M10 80 L30 80 M10 80 L10 60" />
            <path d="M80 80 L60 80 M80 80 L80 60" />
            <circle cx="45" cy="45" r="8" strokeDasharray="2 2" />
          </svg>
        </div>

        {/* Lens doodle - right side */}
        <div
          className="doodle absolute top-[60%] right-[12%] opacity-[0.03]"
          data-speed="0.9"
        >
          <svg width="110" height="110" viewBox="0 0 110 110" fill="none" stroke="white" strokeWidth="2">
            <circle cx="55" cy="55" r="40" />
            <circle cx="55" cy="55" r="30" />
            <circle cx="55" cy="55" r="20" />
            <circle cx="55" cy="55" r="10" />
            <path d="M15 55 L25 55 M85 55 L95 55" strokeOpacity="0.5" />
          </svg>
        </div>

        {/* Shutter doodle - bottom right */}
        <div
          className="doodle absolute bottom-[15%] right-[20%] opacity-[0.04]"
          data-speed="1.1"
        >
          <svg width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="white" strokeWidth="2">
            <circle cx="50" cy="50" r="35" />
            <path d="M50 15 L50 50 L35 35" />
            <path d="M50 15 L50 50 L65 35" />
            <path d="M50 85 L50 50 L35 65" />
            <path d="M50 85 L50 50 L65 65" />
            <path d="M15 50 L50 50 L35 35" />
            <path d="M85 50 L50 50 L65 35" />
          </svg>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        {/* Header */}
        <div className="album-header mb-20">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-px bg-white/20" />
            <span className="text-xs tracking-[0.35em] uppercase text-white/50">
              Our Collections
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-serif mb-6 leading-tight">
            Visual Archives
          </h1>

          <p className="text-white/60 text-lg max-w-2xl leading-relaxed">
            A curated collection of moments captured through our lens — from campus life
            to creative explorations, each album tells its own story.
          </p>

          {/* Filter Pills */}
          <div className="flex flex-wrap gap-3 mt-12">
            {["all", "events", "workshops", "portraits", "campus"].map((filter) => (
              <button
                key={filter}
                onClick={() => setActiveFilter(filter)}
                className={`group relative px-5 py-2 text-xs tracking-wider uppercase font-medium rounded-full border transition-all duration-300 ${
                  activeFilter === filter
                    ? "border-white text-white bg-white/5"
                    : "border-white/20 text-white/50 hover:border-white/40 hover:text-white/70"
                }`}
              >
                {filter}
                {activeFilter === filter && (
                  <div className="absolute inset-0 rounded-full bg-white/10 animate-pulse" />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Album Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 lg:gap-10">
          {albums.map((album, index) => (
            <div
              key={album.id}
              className="album-card group relative"
            >
              {/* Card Container */}
              <div className="relative overflow-hidden rounded-2xl bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-500 hover:border-white/30 hover:shadow-2xl hover:shadow-white/5">
                {/* Image */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={album.image}
                    alt={album.title}
                    fill
                    className="object-cover transition-all duration-700 group-hover:scale-110"
                  />
                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                  
                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-center justify-center">
                    <div className="flex items-center gap-2 text-sm font-medium">
                      <span>View Album</span>
                      <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>

                  {/* Photo Count Badge */}
                  <div className="absolute top-4 right-4 px-3 py-1.5 bg-black/70 backdrop-blur-md rounded-full text-xs font-medium border border-white/20">
                    {album.photoCount} photos
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-3">
                  <div className="flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/40">
                    <div className="w-2 h-2 rounded-full bg-white/40" />
                    <span>{album.month}</span>
                  </div>

                  <h3 className="text-2xl font-serif leading-tight group-hover:text-white/90 transition-colors">
                    {album.title}
                  </h3>

                  <p className="text-sm text-white/60 leading-relaxed line-clamp-2">
                    {album.description}
                  </p>

                  {/* Bottom Bar */}
                  <div className="pt-4 flex items-center justify-between border-t border-white/10">
                    <button className="text-xs font-medium text-white/70 hover:text-white transition-colors flex items-center gap-1.5">
                      <span>Explore</span>
                      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </button>

                    <div className="flex items-center gap-1.5 text-white/40">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span className="text-xs">Save</span>
                    </div>
                  </div>
                </div>

                {/* Subtle corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-bl from-white/10 to-transparent rounded-2xl" />
                </div>
              </div>

              {/* Card number - Large background */}
              <div className="absolute -top-8 -right-6 text-[8rem] font-bold text-white/[0.02] leading-none pointer-events-none select-none z-0">
                {String(index + 1).padStart(2, '0')}
              </div>
            </div>
          ))}
        </div>

        {/* Load More Section */}
        <div className="mt-20 flex flex-col items-center gap-6">
          <div className="w-px h-20 bg-gradient-to-b from-white/20 to-transparent" />
          
          <button className="group relative px-8 py-4 text-sm font-medium text-white rounded-full border border-white/20 hover:border-white/40 transition-all duration-300 overflow-hidden">
            <span className="relative z-10 flex items-center gap-2">
              Load More Albums
              <svg className="w-4 h-4 transition-transform group-hover:translate-y-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
              </svg>
            </span>
            
            {/* Hover background */}
            <div className="absolute inset-0 bg-white/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-500 origin-left" />
          </button>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black to-transparent pointer-events-none" />
    </section>
  );
}