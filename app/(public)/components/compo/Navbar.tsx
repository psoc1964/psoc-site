"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback, useMemo, memo, useEffect } from "react";
import { NAV_ITEMS, NavItem, Route } from "../../../../constants/routes";

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
          className="w-full text-left text-white/55 hover:text-white transition-colors duration-200 py-4 text-[15px] font-light tracking-wide border-b border-white/[0.07] last:border-0 cursor-pointer"
        >
          {item.label}
        </button>
      );
    }

    return (
      <button
        onClick={handleClick}
        className="relative text-white/70 transition-all duration-300 ease-out hover:text-white hover:-translate-y-[1px] cursor-pointer group text-[13px] tracking-wide"
      >
        {item.label}
        <span className="absolute left-1/2 -bottom-1 h-px w-0 bg-white/70 transition-all duration-300 group-hover:w-full group-hover:left-0" />
      </button>
    );
  }
);
NavLink.displayName = "NavLink";

const Logo = memo(() => (
  <Link
    href="/"
    className="relative w-[52px] h-[52px] sm:w-[58px] sm:h-[58px] group cursor-pointer flex-shrink-0 block"
  >
    <img
      src="/psoc-logo-white.png"
      alt="PSOC Logo"
      className="absolute inset-0 w-full h-full object-contain transition-all duration-[600ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110 group-hover:opacity-0"
    />
    <img
      src="/camera-navbar.png"
      alt="Camera"
      className="absolute inset-0 w-full h-full object-contain opacity-0 scale-75 transition-all duration-[700ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:opacity-100 group-hover:scale-100"
    />
  </Link>
));
Logo.displayName = "Logo";

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

const HamburgerIcon = ({ open }: { open: boolean }) => (
  <div className="flex flex-col justify-center items-center w-5 h-4 gap-[5px]">
    <span className={`block h-[1.5px] bg-white/80 transition-all duration-300 origin-center ${open ? "w-5 rotate-45 translate-y-[6.5px]" : "w-5"}`} />
    <span className={`block h-[1.5px] bg-white/80 transition-all duration-300 ${open ? "w-0 opacity-0" : "w-4 opacity-100"}`} />
    <span className={`block h-[1.5px] bg-white/80 transition-all duration-300 origin-center ${open ? "w-5 -rotate-45 -translate-y-[6.5px]" : "w-5"}`} />
  </div>
);

export default function Navbar({
  visible,
  onNavigate,
}: {
  visible: boolean;
  onNavigate?: (targetId: string) => void;
}) {
  const router = useRouter();
  const [isRouteTransitioning, setIsRouteTransitioning] = useState(false);
  const [mobileOpen, setMobileOpen]                     = useState(false);
  const [scrolled, setScrolled]                         = useState(false);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [mobileOpen]);

  // Detect scroll — threshold at 24px so it triggers just after the user starts scrolling
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll(); // set initial state in case page loads mid-scroll
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleRouteNav = useCallback(
    (routeKey: NavItem["route"]) => {
      setIsRouteTransitioning(true);
      setMobileOpen(false);
      setTimeout(() => { router.push(Route[routeKey]); }, 300);
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

  const headerClassName = useMemo(
    () =>
      `fixed top-0 left-0 w-full z-50 transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      }`,
    [visible]
  );

  // Pill styles: at top → subtle pill, on scroll → stronger blur + dark bg + bottom border
  const pillScrollClass = scrolled && !mobileOpen
    ? "bg-black/60 backdrop-blur-2xl border-white/[0.10] shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
    : mobileOpen
      ? "bg-white/[0.06] backdrop-blur-md border-white/[0.14] rounded-b-none"
      : "bg-white/[0.05] backdrop-blur-md border-white/[0.12] shadow-[0_4px_24px_rgba(0,0,0,0.25)]";

  // Subtle bottom border line that fades in on scroll (acts as a separator from page content)
  const scrollBorderClass = scrolled && !mobileOpen
    ? "opacity-100"
    : "opacity-0";

  return (
    <>
      <TransitionOverlay isTransitioning={isRouteTransitioning} />

      {/* Mobile full-screen blur overlay */}
      <div
        className={`fixed inset-0 z-40 transition-all duration-500 ease-in-out md:hidden ${
          mobileOpen
            ? "opacity-100 pointer-events-auto backdrop-blur-2xl bg-black/60"
            : "opacity-0 pointer-events-none backdrop-blur-none"
        }`}
        onClick={() => setMobileOpen(false)}
      />

      <header className={headerClassName}>
        <div className="flex justify-center pt-1.5 sm:pt-2 px-4 sm:px-6">
          <div className="w-full max-w-3xl">

            {/* Pill container */}
            <div
              className={`relative transition-all duration-500 rounded-2xl border ${pillScrollClass}`}
            >
              {/* Top shimmer line — always present */}
              <div className="absolute top-0 inset-x-12 h-px bg-gradient-to-r from-transparent via-white/[0.15] to-transparent rounded-full pointer-events-none" />

              {/* Bottom separator — fades in on scroll */}
              <div
                className={`absolute bottom-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent pointer-events-none transition-opacity duration-500 ${scrollBorderClass}`}
              />

              <div className="px-5 sm:px-7 h-16 sm:h-[70px] flex items-center justify-between">
                <Logo />

                {/* Desktop nav */}
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
                  className="md:hidden relative z-50 p-2 text-white/70 hover:text-white transition-colors cursor-pointer"
                  onClick={() => setMobileOpen((p) => !p)}
                  aria-label={mobileOpen ? "Close menu" : "Open menu"}
                >
                  <HamburgerIcon open={mobileOpen} />
                </button>
              </div>
            </div>

            {/* Mobile dropdown — extends below pill */}
            <div
              className={`md:hidden transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] overflow-hidden rounded-b-2xl border-x border-b bg-white/[0.05] backdrop-blur-md ${
                mobileOpen
                  ? "max-h-[500px] opacity-100 border-white/[0.12]"
                  : "max-h-0 opacity-0 border-transparent"
              }`}
            >
              <nav className="flex flex-col px-5 sm:px-7 pt-1 pb-6">
                {NAV_ITEMS.map((item, i) => (
                  <div
                    key={item.label}
                    className={`transition-[transform,opacity] duration-[400ms] ease-in-out ${
                      mobileOpen ? "translate-y-0 opacity-100" : "-translate-y-1.5 opacity-0"
                    }`}
                    style={{
                      transitionDelay: mobileOpen ? `${i * 55}ms` : "0ms",
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