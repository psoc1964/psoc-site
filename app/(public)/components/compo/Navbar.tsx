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
        {/* LOGO → CAMERA MORPH WITH UNIFORM GLASS LIGHT */}
        <div
          className="relative w-[68px] h-[68px] group cursor-pointer"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            e.currentTarget.style.setProperty("--x", `${x}px`);
            e.currentTarget.style.setProperty("--y", `${y}px`);
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.setProperty("--x", "50%");
            e.currentTarget.style.setProperty("--y", "50%");
          }}
        >
          {/* PSOC LOGO */}
          <Image
            src="/Psoc logo white.png"
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

          {/* CAMERA ICON */}
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

          {/* UNIFORM GLASS LIGHT (NO CIRCLE SHAPE) */}
          <div
            className="
              absolute
              inset-0
              rounded-full
              pointer-events-none
              opacity-0
              group-hover:opacity-100
              transition-opacity
              duration-500
              blur-[6px]
            "
            style={{
              background: `
                linear-gradient(
                  120deg,
                  rgba(255,255,255,0.08),
                  rgba(255,255,255,0.02),
                  rgba(255,255,255,0.06)
                ),
                radial-gradient(
                  900px 700px at var(--x, 50%) var(--y, 50%),
                  rgba(255,255,255,0.12),
                  transparent 75%
                )
              `,
            }}
          />
        </div>

        {/* NAV LINKS */}
        <nav className="flex gap-10 text-sm">
  {navItems.map((item) => (
    <a
      key={item.label}
      href={item.href}
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

      {/* UNDERLINE */}
      <span
        className="
          pointer-events-none
          absolute
          left-1/2
          -bottom-1
          h-[1px]
          w-0
          bg-white
          transition-all
          duration-300
          ease-out
          group-hover:w-full
          group-hover:left-0
        "
      />
    </a>
  ))}
</nav>

      </div>
    </header>
  );
}
