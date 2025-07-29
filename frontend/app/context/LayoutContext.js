"use client";

import { createContext, useContext, useState, useEffect, useCallback } from "react";

// Default values for the context
const LayoutContext = createContext({
  navbarHeight: 80,
  collapsed: false,
  isMobile: false,
  setCollapsed: () => {},
});

export function LayoutProvider({ children }) {
  const [navbarHeight, setNavbarHeight] = useState(80);
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Update navbar height based on scroll
  useEffect(() => {
    const handleScroll = () => {
      setNavbarHeight(window.scrollY > 50 ? 50 : 80);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Track screen size and auto-collapse sidebar on mobile
  const handleResize = useCallback(() => {
    const mobile = window.innerWidth < 768;
    setIsMobile(mobile);
    setCollapsed(mobile);
  }, []);

  useEffect(() => {
    handleResize(); // Run once on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [handleResize]);

  return (
    <LayoutContext.Provider
      value={{ navbarHeight, collapsed, isMobile, setCollapsed }}
    >
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  return useContext(LayoutContext);
}
