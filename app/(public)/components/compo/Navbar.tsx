"use client";

import Image from "next/image";

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Album", href: "#album" },
  { label: "About Us", href: "#about" },
];

export default function Navbar({ visible }: { visible: boolean }) {
  return (
    <header
      className={`fixed top-0 left-0 w-full z-40 transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      } bg-black/40 backdrop-blur border-b border-white/10`}
    >
      <div className="max-w-7xl mx-auto px-8 lg:px-16 h-16 flex items-center justify-between">
        {/* LOGO SLOT (TARGET) */}
        <div id="navbar-logo">
          <Image
            src="/Psoc logo white.png"
            alt="PSOC Logo"
            width={68}
            height={68}
            priority
          />
        </div>

        <nav className="flex gap-10 text-sm text-white/80">
          {navItems.map((item) => (
            <a key={item.label} href={item.href} className="hover:text-white">
              {item.label}
            </a>
          ))}
        </nav>
      </div>
    </header>
  );
}
