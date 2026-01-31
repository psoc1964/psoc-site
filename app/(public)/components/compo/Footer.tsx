"use client";

import { Linkedin, Instagram, Facebook, Mail, MapPin } from "lucide-react";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    if (!footerRef.current) return;

    const ctx = gsap.context(() => {
      // Simple reveal animation on scroll
      gsap.fromTo(
        footerRef.current,
        {
          y: 60,
          opacity: 0,
        },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          ease: "power3.out",
          scrollTrigger: {
            trigger: footerRef.current,
            start: "top 90%",
          },
        }
      );

      // Stagger animation for footer content
      if (footerRef.current) {
        const elements = footerRef.current.querySelectorAll(".footer-item");
        if (elements.length > 0) {
          gsap.fromTo(
            elements,
            {
              y: 30,
              opacity: 0,
            },
            {
              y: 0,
              opacity: 1,
              duration: 0.8,
              stagger: 0.1,
              ease: "power3.out",
              scrollTrigger: {
                trigger: footerRef.current,
                start: "top 85%",
              },
            }
          );
        }
      }
    }, footerRef);

    return () => ctx.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="relative overflow-hidden bg-[#0b0d0c] text-white"
    >
      {/* Simple Gradient Background - Lighter */}
      <div className="absolute inset-0 opacity-5 bg-gradient-to-br from-purple-500/20 via-blue-500/20 to-cyan-500/20" />

      {/* Top Border - Cinematic Line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      {/* Camera Element Doodles - SVG */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
        {/* Camera Icon - Top Right */}
        <svg className="absolute top-20 right-10 w-32 h-32" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
          <rect x="20" y="35" width="60" height="40" rx="4" />
          <circle cx="50" cy="55" r="12" />
          <circle cx="50" cy="55" r="8" />
          <rect x="25" y="30" width="15" height="8" rx="2" />
          <circle cx="72" cy="42" r="2" fill="currentColor" />
        </svg>

        {/* Lens Icon - Bottom Left */}
        <svg className="absolute bottom-32 left-16 w-28 h-28" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
          <circle cx="50" cy="50" r="30" />
          <circle cx="50" cy="50" r="22" />
          <circle cx="50" cy="50" r="14" />
          <circle cx="50" cy="50" r="8" />
          <path d="M 35 35 L 28 28 M 65 35 L 72 28 M 65 65 L 72 72 M 35 65 L 28 72" />
        </svg>

        {/* Film Roll - Middle Right */}
        <svg className="absolute top-1/2 right-20 w-24 h-24 -translate-y-1/2" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
          <rect x="30" y="20" width="40" height="60" rx="2" />
          <line x1="30" y1="30" x2="70" y2="30" />
          <line x1="30" y1="40" x2="70" y2="40" />
          <line x1="30" y1="50" x2="70" y2="50" />
          <line x1="30" y1="60" x2="70" y2="60" />
          <line x1="30" y1="70" x2="70" y2="70" />
          <circle cx="25" cy="25" r="3" fill="currentColor" />
          <circle cx="75" cy="25" r="3" fill="currentColor" />
          <circle cx="25" cy="75" r="3" fill="currentColor" />
          <circle cx="75" cy="75" r="3" fill="currentColor" />
        </svg>

        {/* Aperture - Top Left */}
        <svg className="absolute top-24 left-1/4 w-20 h-20" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
          <circle cx="50" cy="50" r="35" />
          <path d="M 50 15 L 50 35 M 85 50 L 65 50 M 50 85 L 50 65 M 15 50 L 35 50" />
          <path d="M 73 27 L 60 40 M 73 73 L 60 60 M 27 73 L 40 60 M 27 27 L 40 40" />
        </svg>

        {/* Tripod - Bottom Right */}
        <svg className="absolute bottom-20 right-1/3 w-20 h-20" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="0.5">
          <line x1="50" y1="20" x2="50" y2="50" />
          <line x1="50" y1="50" x2="30" y2="80" />
          <line x1="50" y1="50" x2="70" y2="80" />
          <circle cx="30" cy="80" r="2" fill="currentColor" />
          <circle cx="70" cy="80" r="2" fill="currentColor" />
          <rect x="45" y="15" width="10" height="8" rx="1" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-12 lg:px-16">
        
        {/* Top Section - Brand & Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-16 py-20 md:py-24">
          
          {/* Brand Column */}
          <div className="footer-item lg:col-span-2 space-y-6">
            <div className="space-y-4">
              <div className="inline-block">
                <h3 className="text-4xl md:text-5xl font-serif mb-3 bg-gradient-to-br from-white via-white/95 to-white/70 bg-clip-text text-transparent">
                  PSOC
                </h3>
                <div className="h-[2px] w-16 bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-500 rounded-full" />
              </div>
              
              <p className="text-white/60 text-sm md:text-base max-w-md leading-relaxed">
                The Photographic Society of BIT Mesra — where moments become timeless memories through the art of visual storytelling.
              </p>
            </div>

            {/* Social Icons - Optimized */}
            <div className="flex gap-3">
              <a
                href="https://www.linkedin.com/company/photographic-society-bit-mesra/posts/?feedView=all"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-105 hover:-translate-y-1"
              >
                <Linkedin size={18} className="transition-transform duration-300 group-hover:scale-110" />
              </a>
              
              <a
                href="https://www.instagram.com/psoc.bitm/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-105 hover:-translate-y-1"
              >
                <Instagram size={18} className="transition-transform duration-300 group-hover:scale-110" />
              </a>
              
              <a
                href="https://www.facebook.com/psocbitm/"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center transition-all duration-300 hover:bg-white/10 hover:border-white/30 hover:scale-105 hover:-translate-y-1"
              >
                <Facebook size={18} className="transition-transform duration-300 group-hover:scale-110" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="footer-item space-y-4">
            <h4 className="text-[10px] tracking-[0.35em] uppercase text-white/40 font-semibold mb-6">
              Quick Links
            </h4>
            <ul className="space-y-3">
              <li>
                <a 
                  href="#about" 
                  className="text-white/60 hover:text-white text-sm transition-all duration-300 inline-flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-white/60 group-hover:w-4 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">About Us</span>
                </a>
              </li>
              <li>
                <a 
                  href="#events" 
                  className="text-white/60 hover:text-white text-sm transition-all duration-300 inline-flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-white/60 group-hover:w-4 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Events</span>
                </a>
              </li>
              <li>
                <a 
                  href="#gallery" 
                  className="text-white/60 hover:text-white text-sm transition-all duration-300 inline-flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-white/60 group-hover:w-4 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Gallery</span>
                </a>
              </li>
              <li>
                <a 
                  href="#team" 
                  className="text-white/60 hover:text-white text-sm transition-all duration-300 inline-flex items-center gap-2 group"
                >
                  <span className="w-0 h-px bg-white/60 group-hover:w-4 transition-all duration-300" />
                  <span className="group-hover:translate-x-1 transition-transform duration-300">Our Team</span>
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="footer-item space-y-4">
            <h4 className="text-[10px] tracking-[0.35em] uppercase text-white/40 font-semibold mb-6">
              Get in Touch
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-white/60 text-sm group transition-colors duration-300 hover:text-white">
                <MapPin size={16} className="mt-0.5 flex-shrink-0" />
                <span className="leading-relaxed">
                  BIT Mesra, Ranchi<br />Jharkhand, India
                </span>
              </li>
              <li className="flex items-center gap-3 text-white/60 text-sm group transition-colors duration-300 hover:text-white">
                <Mail size={16} className="flex-shrink-0" />
                <a href="mailto:psoc@bitmesra.ac.in" className="hover:underline underline-offset-4">
                  psoc@bitmesra.ac.in
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Divider Line */}
        <div className="h-px w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* Bottom Section */}
        <div className="footer-item py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/40 text-xs md:text-sm order-2 md:order-1">
            © {new Date().getFullYear()} PSOC · Photographic Society, Birla Institute of Technology, Mesra
          </p>

          <div className="flex items-center gap-6 text-xs text-white/40 order-1 md:order-2">
            <a 
              href="#privacy" 
              className="hover:text-white transition-colors duration-300 relative group"
            >
              Privacy Policy
              <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
            </a>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <a 
              href="#terms" 
              className="hover:text-white transition-colors duration-300 relative group"
            >
              Terms of Service
              <span className="absolute bottom-0 left-0 w-0 h-px bg-white group-hover:w-full transition-all duration-300" />
            </a>
          </div>
        </div>
      </div>

      {/* Bottom Glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-px">
        <div className="h-full w-full bg-gradient-to-r from-transparent via-purple-500/30 to-transparent blur-sm" />
      </div>
    </footer>
  );
}