"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useCallback, useMemo, memo } from "react";
import { NAV_ITEMS, NavItem, Route } from "../../../../constants/routes";

// Memoized NavLink component to prevent unnecessary re-renders
const NavLink = memo(
  ({
    item,
    onRouteNav,
    onScrollNav,
  }: {
    item: NavItem;
    onRouteNav: (routeKey: NavItem["route"]) => void;
    onScrollNav: (targetId: string) => void;
  }) => {
    const handleClick = useCallback(() => {
      if (item.type === "route") {
        onRouteNav(item.route);
      } else if (item.targetId) {
        onScrollNav(item.targetId);
      }
    }, [item, onRouteNav, onScrollNav]);

    return (
      <button
        onClick={handleClick}
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
    );
  },
);

NavLink.displayName = "NavLink";

// Memoized Logo component
const Logo = memo(() => (
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
));

Logo.displayName = "Logo";

// Memoized TransitionOverlay component
const TransitionOverlay = memo(
  ({ isTransitioning }: { isTransitioning: boolean }) => (
    <div
      className={`fixed inset-0 z-[100] pointer-events-none transition-all duration-300 ${
        isTransitioning
          ? "backdrop-blur-xl bg-black/40 opacity-100"
          : "backdrop-blur-none opacity-0"
      }`}
    />
  ),
);

TransitionOverlay.displayName = "TransitionOverlay";

export default function Navbar({
  visible,
  onNavigate,
}: {
  visible: boolean;
  onNavigate?: (targetId: string) => void;
}) {
  const router = useRouter();
  const [isRouteTransitioning, setIsRouteTransitioning] = useState(false);

  // Memoized route navigation handler - EXACTLY like original
  const handleRouteNav = useCallback(
    (routeKey: NavItem["route"]) => {
      // Start transition
      setIsRouteTransitioning(true);

      // Navigate after blur effect
      setTimeout(() => {
        router.push(Route[routeKey]);
      }, 300);
    },
    [router],
  );

  // Memoized scroll navigation handler
  const handleScrollNav = useCallback(
    (targetId: string) => {
      onNavigate?.(targetId);
    },
    [onNavigate],
  );

  // Memoize header className to prevent recalculation
  const headerClassName = useMemo(
    () =>
      `fixed top-0 left-0 w-full z-40 transition-opacity duration-700 ${
        visible ? "opacity-100" : "opacity-0 pointer-events-none"
      } bg-black/40 backdrop-blur border-b border-white/10`,
    [visible],
  );

  return (
    <>
      <TransitionOverlay isTransitioning={isRouteTransitioning} />

      <header className={headerClassName}>
        <div className="max-w-7xl mx-auto px-8 lg:px-16 h-16 flex items-center justify-between">
          <Logo />

          {/* NAV LINKS */}
          <nav className="flex gap-10 text-sm">
            {NAV_ITEMS.map((item) => (
              <NavLink
                key={item.label}
                item={item}
                onRouteNav={handleRouteNav}
                onScrollNav={handleScrollNav}
              />
            ))}
          </nav>
        </div>
      </header>
    </>
  );
}
