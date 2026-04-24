"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useState, useCallback, memo, useEffect, useRef } from "react";
import { NAV_ITEMS, NavItem, Route } from "../../../../constants/routes";

/* -------------------------------------------------------------------------- */
/*                                 NAV LINK                                   */
/* -------------------------------------------------------------------------- */

const NavLink = memo(
  ({
    item,
    onRouteNav,
    onScrollNav,
    onClick,
    mobile = false,
  }: {
    item: NavItem;
    onRouteNav: (routeKey: NavItem["route"]) => void;
    onScrollNav: (targetId: string) => void;
    onClick?: () => void;
    mobile?: boolean;
  }) => {
    const handleClick = useCallback(() => {
      if (item.type === "route") onRouteNav(item.route);
      else if (item.targetId) onScrollNav(item.targetId);
      onClick?.();
    }, [item, onRouteNav, onScrollNav, onClick]);

    if (mobile) {
      return (
        <button
          onClick={handleClick}
          className="w-full text-left text-white/50 hover:text-white/90 transition-colors duration-200 py-4 text-[15px] font-light tracking-wide border-b border-white/[0.06] last:border-0 cursor-pointer"
        >
          {item.label}
        </button>
      );
    }

    return (
      <button
        onClick={handleClick}
        className="relative text-white/60 transition-all duration-300 ease-out hover:text-white/95 cursor-pointer group text-[13px] tracking-wide font-light"
      >
        {item.label}
        {/* Underline glow on hover */}
        <span className="absolute left-1/2 -bottom-1 h-px w-0 bg-gradient-to-r from-transparent via-white/60 to-transparent transition-all duration-400 group-hover:w-full group-hover:left-0" />
      </button>
    );
  }
);
NavLink.displayName = "NavLink";

/* -------------------------------------------------------------------------- */
/*                                   LOGO                                     */
/* -------------------------------------------------------------------------- */

const Logo = memo(() => (
  <Link
    href="/"
    className="relative w-[52px] h-[52px] sm:w-[58px] sm:h-[58px] group cursor-pointer flex-shrink-0 block"
  >
    <img
  src="/psoc-logo-white.png"
  alt="PSOC Logo"
  className="absolute inset-0 w-full h-full object-contain scale-125 transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-140 group-hover:opacity-0"
  />
    <img
      src="/camera-navbar2.png"
      alt="Camera"
      className="absolute inset-0 w-full h-full object-contain opacity-0 scale-75 transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:scale-100"
    />
  </Link>
));
Logo.displayName = "Logo";

/* -------------------------------------------------------------------------- */
/*                           TRANSITION OVERLAY                               */
/* -------------------------------------------------------------------------- */

const TransitionOverlay = memo(({ isTransitioning }: { isTransitioning: boolean }) => (
  <div
    className={`fixed inset-0 z-[100] pointer-events-none transition-all duration-300 ${
      isTransitioning
        ? "backdrop-blur-xl bg-black/40 opacity-100"
        : "backdrop-blur-none opacity-0"
    }`}
  />
));
TransitionOverlay.displayName = "TransitionOverlay";

/* -------------------------------------------------------------------------- */
/*                            HAMBURGER ICON                                  */
/* -------------------------------------------------------------------------- */

const HamburgerIcon = ({ open }: { open: boolean }) => (
  <div className="flex flex-col justify-center items-center w-5 h-4 gap-[5px]">
    <span
      className={`block h-[1.5px] bg-white/75 transition-all duration-300 origin-center ${
        open ? "w-5 rotate-45 translate-y-[6.5px]" : "w-5"
      }`}
    />
    <span
      className={`block h-[1.5px] bg-white/75 transition-all duration-300 ${
        open ? "w-0 opacity-0" : "w-4 opacity-100"
      }`}
    />
    <span
      className={`block h-[1.5px] bg-white/75 transition-all duration-300 origin-center ${
        open ? "w-5 -rotate-45 -translate-y-[6.5px]" : "w-5"
      }`}
    />
  </div>
);

/* -------------------------------------------------------------------------- */
/*                               MAIN NAVBAR                                  */
/* -------------------------------------------------------------------------- */

export default function Navbar({
  visible,
  onNavigate,
}: {
  visible: boolean;
  onNavigate?: (targetId: string) => void;
}) {
  const router = useRouter();
  const [isRouteTransitioning, setIsRouteTransitioning] = useState(false);
  const pathname = usePathname();                         // ← add this
useEffect(() => {                                       // ← add this
  setIsRouteTransitioning(false);
}, [pathname]);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);

  /* Lock body scroll when mobile menu is open */
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  /* Detect scroll to deepen glass on scroll */
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

 const handleRouteNav = useCallback(
  (routeKey: NavItem["route"]) => {
    const target = Route[routeKey];
    setIsRouteTransitioning(true);
    setMobileOpen(false);

    if (window.location.pathname === target) {
      setTimeout(() => {
        router.refresh();
        setIsRouteTransitioning(false); // clears navbar blur
      }, 300);
    } else {
      setTimeout(() => { router.push(target); }, 300);
    }
  },
  [router]
);

  const handleScrollNav = useCallback(
    (targetId: string) => {
      onNavigate?.(targetId);
      setMobileOpen(false);
    },
    [onNavigate]
  );

  return (
    <>
      <style>{`
        /* ── Pill glass surface ── */
        .nav-pill {
          /* Base layer: semi-transparent frosted white */
          background: rgba(255, 255, 255, 0.07);
          backdrop-filter: blur(28px) saturate(180%) brightness(1.08);
          -webkit-backdrop-filter: blur(28px) saturate(180%) brightness(1.08);

          /* Layered border: top-edge highlight + outer subtle stroke */
          border: 1px solid rgba(255, 255, 255, 0.13);

          /* iPhone-style multi-layer shadow */
          box-shadow:
            /* outer ambient */
            0 8px 32px rgba(0, 0, 0, 0.35),
            /* close soft drop */
            0 2px 8px  rgba(0, 0, 0, 0.22),
            /* top inner highlight (light hitting top edge) */
            inset 0 1px 0 rgba(255, 255, 255, 0.18),
            /* bottom inner shadow (depth) */
            inset 0 -1px 0 rgba(0, 0, 0, 0.12);

          transition: background 0.35s ease, box-shadow 0.35s ease, border-color 0.35s ease;
        }

        /* Deepen glass once user scrolls */
        .nav-pill.scrolled {
          background: rgba(15, 15, 20, 0.55);
          backdrop-filter: blur(32px) saturate(200%) brightness(1.05);
          -webkit-backdrop-filter: blur(32px) saturate(200%) brightness(1.05);
          border-color: rgba(255, 255, 255, 0.10);
          box-shadow:
            0 12px 48px rgba(0, 0, 0, 0.55),
            0 4px 12px  rgba(0, 0, 0, 0.35),
            inset 0 1px 0 rgba(255, 255, 255, 0.14),
            inset 0 -1px 0 rgba(0, 0, 0, 0.18);
        }

        /* Pill open state (mobile menu expanded) */
        .nav-pill.menu-open {
          border-bottom-left-radius: 0 !important;
          border-bottom-right-radius: 0 !important;
          border-bottom-color: rgba(255, 255, 255, 0.04);
        }

        /* ── Mobile dropdown glass ── */
        .nav-dropdown {
          background: rgba(12, 12, 18, 0.72);
          backdrop-filter: blur(32px) saturate(180%);
          -webkit-backdrop-filter: blur(32px) saturate(180%);
          border: 1px solid rgba(255, 255, 255, 0.10);
          border-top: none;
          box-shadow:
            0 20px 60px rgba(0, 0, 0, 0.6),
            0 8px 24px  rgba(0, 0, 0, 0.4),
            inset 0 -1px 0 rgba(255, 255, 255, 0.04);
        }

        /* ── Noise texture overlay for extra realism ── */
        .nav-pill::after,
        .nav-dropdown::after {
          content: "";
          position: absolute;
          inset: 0;
          border-radius: inherit;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E");
          background-size: 160px 160px;
          opacity: 0.022;
          pointer-events: none;
          mix-blend-mode: overlay;
        }
      `}</style>

      <TransitionOverlay isTransitioning={isRouteTransitioning} />

      {/* Mobile backdrop */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ease-in-out md:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto backdrop-blur-2xl bg-black/50"
            : "opacity-0 pointer-events-none backdrop-blur-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      {/* ── FIXED HEADER ── */}
      <header
        ref={headerRef}
        style={{ position: "fixed", top: 0, left: 0, right: 0, zIndex: 50 }}
        className={`transition-opacity duration-700 ${
          visible ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="flex justify-center pt-2 sm:pt-3 px-4 sm:px-6">
          <div className="w-full max-w-3xl">

            {/* ── PILL ── */}
            <div
              className={`nav-pill relative rounded-2xl ${scrolled ? "scrolled" : ""} ${
                mobileOpen ? "menu-open" : ""
              }`}
            >
              {/* Top specular highlight — mimics glass catching light */}
              <div
                className="absolute top-0 left-8 right-8 h-px pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.30) 30%, rgba(255,255,255,0.45) 50%, rgba(255,255,255,0.30) 70%, transparent 100%)",
                  borderRadius: "50%",
                }}
              />

              {/* Inner content row */}
              <div className="px-5 sm:px-7 h-16 sm:h-[70px] flex items-center justify-between relative z-10">
                <Logo />

                {/* Desktop nav links */}
                <nav className="hidden md:flex gap-8 lg:gap-10">
                  {NAV_ITEMS.map((item) => (
                    <NavLink
                      key={item.label}
                      item={item}
                      onRouteNav={handleRouteNav}
                      onScrollNav={handleScrollNav}
                    />
                  ))}
                </nav>

                {/* Mobile hamburger */}
                <button
                  className="md:hidden relative z-50 p-2 text-white/60 hover:text-white transition-colors cursor-pointer"
                  onClick={() => setMobileOpen((p) => !p)}
                  aria-label={mobileOpen ? "Close menu" : "Open menu"}
                >
                  <HamburgerIcon open={mobileOpen} />
                </button>
              </div>
            </div>

            {/* ── MOBILE DROPDOWN ── */}
            <div
              className={`nav-dropdown md:hidden relative overflow-hidden rounded-b-2xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                mobileOpen
                  ? "max-h-[480px] opacity-100"
                  : "max-h-0 opacity-0 pointer-events-none"
              }`}
            >
              {/* Bottom specular line */}
              <div
                className="absolute bottom-0 left-8 right-8 h-px pointer-events-none"
                style={{
                  background:
                    "linear-gradient(90deg, transparent, rgba(255,255,255,0.08), transparent)",
                }}
              />

              <nav className="flex flex-col px-5 sm:px-7 pt-1 pb-7 relative z-10">
                {NAV_ITEMS.map((item, i) => (
                  <div
                    key={item.label}
                    className="transition-[transform,opacity] ease-in-out"
                    style={{
                      transitionDuration: "380ms",
                      transitionDelay: mobileOpen ? `${i * 50}ms` : "0ms",
                      opacity: mobileOpen ? 1 : 0,
                      transform: mobileOpen ? "translateY(0)" : "translateY(-8px)",
                    }}
                  >
                    <NavLink
                      item={item}
                      onRouteNav={handleRouteNav}
                      onScrollNav={handleScrollNav}
                      mobile
                    />
                  </div>
                ))}
              </nav>
            </div>

          </div>
        </div>
      </header>
    </>
  );
}