"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const navItems = [
  { label: "Home", href: "/#home", type: "scroll", targetId: "home" },
  { label: "Album", href: "/album", type: "route" },
  { label: "About Us", href: "/#about", type: "scroll", targetId: "about" },
];

export default function Navbar({ 
  visible, 
  onNavigate 
}: { 
  visible: boolean; 
  onNavigate?: (targetId: string) => void;
}) {
  const router = useRouter();
  const [isRouteTransitioning, setIsRouteTransitioning] = useState(false);

  const handleRouteNav = (href: string) => {
    // Start transition
    setIsRouteTransitioning(true);
    
    // Navigate after blur effect
    setTimeout(() => {
      router.push(href);
    }, 300);
  };

  return (
    <>
      {/* Route transition overlay */}
      <div
        className={`fixed inset-0 z-[100] pointer-events-none transition-all duration-300 ${
          isRouteTransitioning
            ? "backdrop-blur-xl bg-black/40 opacity-100"
            : "backdrop-blur-none opacity-0"
        }`}
      />

      <header
        className={`fixed top-0 left-0 w-full z-40 transition-opacity duration-700 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        } bg-black/40 backdrop-blur border-b border-white/10`}
      >
        <div className="max-w-7xl mx-auto px-8 lg:px-16 h-16 flex items-center justify-between">
          {/* LOGO */}
          <Link href="/" className="relative w-[68px] h-[68px] group cursor-pointer">
            <Image
              src="/psoc-logo-white.png"
              alt="PSOC Logo"
              fill
              priority
              className="
                object-contain
                transition-all
                duration-[600ms]
                ease-[cubic-bezier(0.22,1,0.36,1)]
                group-hover:scale-110
                group-hover:opacity-0
              "
            />

            <Image
              src="/camera-navbar.png"
              alt="Camera"
              fill
              className="
                object-contain
                opacity-0
                scale-75
                transition-all
                duration-[700ms]
                ease-[cubic-bezier(0.22,1,0.36,1)]
                group-hover:opacity-100
                group-hover:scale-100
              "
            />
          </Link>

          {/* NAV LINKS */}
          <nav className="flex gap-10 text-sm">
            {navItems.map((item) =>
              item.type === "route" ? (
                <button
                  key={item.label}
                  onClick={() => handleRouteNav(item.href)}
                  className="
                    relative
                    text-white/70
                    transition-all
                    duration-300
                    ease-out
                    hover:text-white
                    hover:-translate-y-[1px]
                    group
                  "
                >
                  {item.label}
                  <span className="absolute left-1/2 -bottom-1 h-[1px] w-0 bg-white transition-all duration-300 group-hover:w-full group-hover:left-0" />
                </button>
              ) : (
                <button
                  key={item.label}
                  onClick={() => {
                    if (onNavigate && item.targetId) {
                      onNavigate(item.targetId);
                    }
                  }}
                  className="
                    relative
                    text-white/70
                    transition-all
                    duration-300
                    ease-out
                    hover:text-white
                    hover:-translate-y-[1px]
                    group
                  "
                >
                  {item.label}
                  <span className="absolute left-1/2 -bottom-1 h-[1px] w-0 bg-white transition-all duration-300 group-hover:w-full group-hover:left-0" />
                </button>
              )
            )}
          </nav>
        </div>
      </header>
    </>
  );
}