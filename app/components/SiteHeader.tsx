"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const navItems = [
  { href: "#services", label: "Services", sectionId: "services" },
  { href: "#approach", label: "Approach", sectionId: "approach" },
];

export default function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("top");
  const navRef = useRef<HTMLElement | null>(null);
  const navLinksRef = useRef<HTMLDivElement | null>(null);
  const indicatorRef = useRef<HTMLSpanElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement | null>(null);
  const activeSectionRef = useRef("top");
  const indicatorFrameRef = useRef(0);
  const indicatorImmediateRef = useRef(false);

  const positionIndicator = useCallback((target: HTMLAnchorElement | null, immediate: boolean) => {
    const indicator = indicatorRef.current;
    if (!indicator || !target) {
      if (indicator) indicator.dataset.visible = "false";
      return;
    }

    const isMobile = window.matchMedia("(max-width: 760px)").matches;
    const inset = isMobile ? 14 : 15;
    const x = target.offsetLeft + (isMobile ? 5 : inset);
    const y = target.offsetTop + (isMobile ? inset : target.offsetHeight - 6);
    const scaleX = isMobile ? 1 : Math.max((target.offsetWidth - inset * 2) / 2, 1);
    const scaleY = isMobile ? Math.max((target.offsetHeight - inset * 2) / 2, 1) : 1;

    indicator.dataset.immediate = String(immediate);
    indicator.style.setProperty("--nav-indicator-x", `${x}px`);
    indicator.style.setProperty("--nav-indicator-y", `${y}px`);
    indicator.style.setProperty("--nav-indicator-scale-x", String(scaleX));
    indicator.style.setProperty("--nav-indicator-scale-y", String(scaleY));
    indicator.dataset.visible = "true";

    if (immediate) {
      window.requestAnimationFrame(() => {
        if (indicatorRef.current === indicator) indicator.dataset.immediate = "false";
      });
    }
  }, []);

  const scheduleIndicator = useCallback((immediate = false) => {
    indicatorImmediateRef.current ||= immediate;
    if (indicatorFrameRef.current) return;

    indicatorFrameRef.current = window.requestAnimationFrame(() => {
      indicatorFrameRef.current = 0;
      const shouldPositionImmediately = indicatorImmediateRef.current;
      indicatorImmediateRef.current = false;
      const target =
        navLinksRef.current?.querySelector<HTMLAnchorElement>(
          `[data-section-id="${activeSectionRef.current}"]`,
        ) ?? null;

      positionIndicator(target, shouldPositionImmediately);
    });
  }, [positionIndicator]);

  const setCurrentSection = useCallback((sectionId: string, immediate = false) => {
    if (activeSectionRef.current === sectionId) {
      if (immediate) scheduleIndicator(true);
      return;
    }

    activeSectionRef.current = sectionId;
    setActiveSection(sectionId);
    scheduleIndicator(immediate);
  }, [scheduleIndicator]);

  useEffect(() => {
    const expandedNav = window.matchMedia("(min-width: 761px)");
    const closeAtDesktop = (event: MediaQueryListEvent | MediaQueryList) => {
      if (event.matches) setIsMenuOpen(false);
    };

    closeAtDesktop(expandedNav);
    expandedNav.addEventListener("change", closeAtDesktop);
    return () => expandedNav.removeEventListener("change", closeAtDesktop);
  }, []);

  useEffect(() => {
    const sections = ["top", ...navItems.map((item) => item.sectionId), "booking"]
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    let animationFrame = 0;

    const updateActiveSection = () => {
      animationFrame = 0;
      const headerBottom = navRef.current?.getBoundingClientRect().bottom ?? 72;
      const activationLine = Math.max(headerBottom + 24, Math.min(window.innerHeight * 0.32, 240));
      let currentSection = "top";

      for (const section of sections) {
        if (section.getBoundingClientRect().top <= activationLine) {
          currentSection = section.id;
        } else {
          break;
        }
      }

      setCurrentSection(currentSection);
    };

    const scheduleUpdate = () => {
      if (animationFrame) return;
      animationFrame = window.requestAnimationFrame(updateActiveSection);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
    window.addEventListener("hashchange", scheduleUpdate);

    return () => {
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      window.removeEventListener("hashchange", scheduleUpdate);
    };
  }, [setCurrentSection]);

  useEffect(() => {
    const container = navLinksRef.current;
    if (!container) return;

    let disposed = false;
    const initialSection = window.location.hash.slice(1);
    if ([...navItems.map((item) => item.sectionId), "booking"].includes(initialSection)) {
      setCurrentSection(initialSection, true);
    }
    const handleGeometryChange = () => scheduleIndicator(true);
    const resizeObserver = typeof ResizeObserver === "undefined" ? null : new ResizeObserver(handleGeometryChange);

    resizeObserver?.observe(container);
    container.querySelectorAll("a[data-section-id]").forEach((link) => resizeObserver?.observe(link));
    window.addEventListener("resize", handleGeometryChange);
    document.fonts.addEventListener("loadingdone", handleGeometryChange);
    void document.fonts.ready.then(() => {
      if (!disposed) handleGeometryChange();
    });
    handleGeometryChange();

    return () => {
      disposed = true;
      resizeObserver?.disconnect();
      window.removeEventListener("resize", handleGeometryChange);
      document.fonts.removeEventListener("loadingdone", handleGeometryChange);
      if (indicatorFrameRef.current) window.cancelAnimationFrame(indicatorFrameRef.current);
    };
  }, [scheduleIndicator, setCurrentSection]);

  useEffect(() => {
    if (!isMenuOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.requestAnimationFrame(() => firstMenuLinkRef.current?.focus());

    const closeOnOutsidePointer = (event: PointerEvent) => {
      if (!navRef.current?.contains(event.target as Node)) setIsMenuOpen(false);
    };
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", closeOnOutsidePointer);
    document.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("pointerdown", closeOnOutsidePointer);
      document.removeEventListener("keydown", closeOnEscape);
    };
  }, [isMenuOpen]);

  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className="site-header">
      <nav
        className={`site-nav ${isMenuOpen ? "is-menu-open" : ""}`}
        aria-label="Primary navigation"
        ref={navRef}
      >
        <a
          className="brand-lockup"
          href="#top"
          aria-label="Mountain Mixology home"
          onClick={() => {
            setCurrentSection("top");
            closeMenu();
          }}
        >
          <span className="brand-monogram" aria-hidden="true">MM</span>
          <span className="brand-copy">
            <strong>Mountain Mixology</strong>
            <span>Canmore cocktail catering</span>
          </span>
        </a>

        <div className="nav-links" id="primary-menu" data-open={isMenuOpen} ref={navLinksRef}>
          {navItems.map((item, index) => (
            <a
              href={item.href}
              key={item.href}
              ref={index === 0 ? firstMenuLinkRef : undefined}
              data-section-id={item.sectionId}
              aria-current={activeSection === item.sectionId ? "location" : undefined}
              onClick={() => {
                setCurrentSection(item.sectionId);
                closeMenu();
              }}
            >
              {item.label}
            </a>
          ))}
          <a
            className="nav-mobile-cta"
            href="#booking"
            aria-current={activeSection === "booking" ? "location" : undefined}
            onClick={() => {
              setCurrentSection("booking");
              closeMenu();
            }}
          >
            Book Event
          </a>
          <span className="nav-link-indicator" data-visible="false" aria-hidden="true" ref={indicatorRef} />
        </div>

        <div className="nav-actions">
          <a
            className="nav-cta"
            href="#booking"
            aria-current={activeSection === "booking" ? "location" : undefined}
            onClick={() => setCurrentSection("booking")}
          >
            Book Event
          </a>
          <button
            className="menu-toggle"
            ref={menuButtonRef}
            type="button"
            aria-label={isMenuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-controls="primary-menu"
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((current) => !current)}
          >
            <span aria-hidden="true" />
            <span aria-hidden="true" />
            <span aria-hidden="true" />
          </button>
        </div>
      </nav>
    </header>
  );
}
