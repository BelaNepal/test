"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

const LayoutContext = createContext({
  navbarHeight: 80,
  collapsed: false,
  isMobile: false,
  mobileOpen: false,
  setCollapsed: () => {},
  setMobileOpen: () => {},
});

export function LayoutProvider({ children }) {
  const [navbarHeight, setNavbarHeight] = useState(80);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Scroll shrink effect
  useEffect(() => {
    const handleScroll = () => {
      setNavbarHeight(window.scrollY > 50 ? 50 : 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Resize handler
  const handleResize = useCallback(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    setCollapsed(mobile);
    setMobileOpen(false);
  }, []);

  useEffect(() => {
    handleResize(); // initial
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return (
    <LayoutContext.Provider
      value={{
        navbarHeight,
        collapsed,
        isMobile,
        mobileOpen,
        setCollapsed,
        setMobileOpen,
      }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  return useContext(LayoutContext);
}
