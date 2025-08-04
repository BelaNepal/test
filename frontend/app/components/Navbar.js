"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isMounted, setIsMounted] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
      setMobileMenuOpen(false);
    }
  }, [pathname, isMounted]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  if (!isMounted) return null;

  if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
    return null;
  }

  return (
    <>
      {/* Custom CSS for tablet-specific styles */}
      <style>{`
        @media (min-width: 768px) and (max-width: 1024px) {
          .tablet-menu {
            font-size: 0.875rem;
            gap: 1rem;
            right: 1rem !important;
          }
        }
      `}</style>

      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 shadow-md transition-all duration-300 bg-[#1e2d4d] ${
          scrolled ? "h-[50px]" : "h-[80px]"
        }`}
      >
        <div className="relative flex items-center h-full px-4 sm:px-6 lg:px-10">
          {/* Left Logo */}
          <div className="flex items-center absolute left-4 top-1/2 -translate-y-1/2 md:relative md:top-auto md:translate-y-0">
            {/* Desktop Logo */}
            <div className="hidden md:block">
              <Link href="/">
                <img
                  src="/Logo-Bela.svg"
                  alt="Bela IMS Logo"
                  className={`w-auto transition-all duration-300 ${
                    scrolled ? "h-12" : "h-16"
                  }`}
                />
              </Link>
            </div>
            {/* Mobile Logo */}
            <div className="md:hidden">
              <Link href="/">
                <img
                  src="/Logo-Bela.svg"
                  alt="Bela IMS Logo"
                  className="h-8 w-auto transition-all duration-300"
                />
              </Link>
            </div>
          </div>

          {/* Centered Title */}
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 font-bold whitespace-nowrap transition-colors duration-300 ${
              scrolled ? "text-white" : "text-white"
            }`}
            style={{
              fontSize: scrolled ? "1.2rem" : "2rem",
            }}
          >
            <span className="text-base sm:text-xl md:text-2xl">
              Project - Bela IMS (Beta)
            </span>
          </div>

          {/* Mobile Toggle */}
          <button
            className={`md:hidden absolute right-4 p-2 z-20 transition-colors duration-300 ${
              scrolled || mobileMenuOpen ? "text-[#ef7e1a]" : "text-white"
            }`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>

          {/* Desktop Menu */}
          <div
            className={`hidden md:flex space-x-6 items-center absolute right-4 pr-4 transition-colors duration-300 text-white tablet-menu`}
          >
            <Link
              href="/"
              className={`hover:text-[#ef7e1a] transition hover:underline underline-offset-4 ${
                pathname === "/" ? "text-[#ef7e1a] font-semibold" : ""
              }`}
            >
              Home
            </Link>
            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className={`hover:text-[#ef7e1a] transition hover:underline underline-offset-4 ${
                    pathname === "/dashboard"
                      ? "text-[#ef7e1a] font-semibold"
                      : ""
                  }`}
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:text-red-600 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {pathname !== "/login" && (
                  <Link
                    href="/login"
                    className={`hover:text-[#ef7e1a] transition hover:underline underline-offset-4 ${
                      pathname === "/login"
                        ? "text-[#ef7e1a] font-semibold"
                        : ""
                    }`}
                  >
                    Login
                  </Link>
                )}
                <Link
                  href="/register"
                  className={`hover:text-[#ef7e1a] transition hover:underline underline-offset-4 ${
                    pathname === "/register"
                      ? "text-[#ef7e1a] font-semibold"
                      : ""
                  }`}
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown */}
      <div
        className={`md:hidden fixed left-0 w-full bg-white text-[#1e2d4d] shadow transition-all duration-300 px-4 py-4 space-y-4 text-base font-medium z-40 ${
          mobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-5 pointer-events-none"
        }`}
        style={{ top: scrolled ? "50px" : "80px" }}
      >
        <Link
          href="/"
          className={`block w-full py-2 hover:text-[#ef7e1a] transition ${
            pathname === "/" ? "text-[#ef7e1a] font-semibold" : ""
          }`}
          onClick={() => setMobileMenuOpen(false)}
        >
          Home
        </Link>
        {isLoggedIn ? (
          <>
            <Link
              href="/dashboard"
              className={`block w-full py-2 hover:text-[#ef7e1a] transition ${
                pathname === "/dashboard" ? "text-[#ef7e1a] font-semibold" : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="block w-full text-left py-2 text-red-500 hover:text-red-700 transition"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {pathname !== "/login" && (
              <Link
                href="/login"
                className={`block w-full py-2 hover:text-[#ef7e1a] transition ${
                  pathname === "/login" ? "text-[#ef7e1a] font-semibold" : ""
                }`}
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
            <Link
              href="/register"
              className={`block w-full py-2 hover:text-[#ef7e1a] transition ${
                pathname === "/register" ? "text-[#ef7e1a] font-semibold" : ""
              }`}
              onClick={() => setMobileMenuOpen(false)}
            >
              Register
            </Link>
          </>
        )}
      </div>

      {/* Bottom Ribbon */}
      <div
        className={`fixed left-0 right-0 h-[4px] bg-[#ef7e1a] transition-all duration-300 ${
          scrolled ? "top-[50px]" : "top-[80px]"
        }`}
        style={{ zIndex: 9999 }}
      />
    </>
  );
}
