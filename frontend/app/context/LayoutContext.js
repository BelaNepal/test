// context/LayoutContext.tsx
"use client";

import { createContext, useContext, useState, useEffect } from "react";

const LayoutContext = createContext({ navbarHeight: 80 });

export function LayoutProvider({ children }) {
  const [navbarHeight, setNavbarHeight] = useState(80);

  useEffect(() => {
    const handleScroll = () => {
      setNavbarHeight(window.scrollY > 50 ? 50 : 80);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <LayoutContext.Provider value={{ navbarHeight }}>
      {children}
    </LayoutContext.Provider>
  );
}

export function useLayout() {
  return useContext(LayoutContext);
}
