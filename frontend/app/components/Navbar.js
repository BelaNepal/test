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
      {/* Navbar */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 shadow-md transition-all duration-300 ${
          scrolled ? "bg-[#1e2d4d]" : "bg-white"
        } ${scrolled ? "h-[50px]" : "h-[80px]"}`}
      >
        <div className="relative flex items-center justify-center h-full px-4 sm:px-6 lg:px-10">
          
          {/* Centered Logo */}
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 font-bold whitespace-nowrap transition-colors duration-300 ${
              scrolled ? "text-white" : "text-[#1e2d4d]"
            }`}
            style={{ fontSize: scrolled ? "1.2rem" : "1.6rem" }}
          >
            Project - Bela IMS (Beta)
          </div>

          {/* Mobile Toggle (Right) */}
          <button
            className={`md:hidden absolute right-4 p-2 z-20 ${
              scrolled ? "text-white" : "text-[#1e2d4d]"
            } transition-colors`}
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? "✕" : "☰"}
          </button>

          {/* Desktop Menu (Right aligned) */}
          <div
            className={`hidden md:flex space-x-6 items-center text-lg absolute right-4 ${
              scrolled ? "text-white" : "text-[#1e2d4d]"
            }`}
          >
            <Link href="/" className="hover:text-[#ef7e1a] transition">Home</Link>
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className="hover:text-[#ef7e1a] transition">Dashboard</Link>
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
                  <Link href="/login" className="hover:text-[#ef7e1a] transition">Login</Link>
                )}
                <Link href="/register" className="hover:text-[#ef7e1a] transition">Register</Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Dropdown Menu */}
      <div
        className={`md:hidden fixed left-0 w-full bg-white text-[#1e2d4d] shadow transition-all duration-300 px-4 py-4 space-y-4 text-base font-medium z-40 ${
          mobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-5 pointer-events-none"
        }`}
        style={{ top: scrolled ? "50px" : "80px" }}
      >
        <Link href="/" className="hover:text-[#ef7e1a] transition" onClick={() => setMobileMenuOpen(false)}>
          Home
        </Link>

        {isLoggedIn ? (
          <>
            <Link href="/dashboard" className="hover:text-[#ef7e1a] transition" onClick={() => setMobileMenuOpen(false)}>
              Dashboard
            </Link>
            <button
              onClick={() => {
                handleLogout();
                setMobileMenuOpen(false);
              }}
              className="text-red-500 hover:text-red-700 transition text-left"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            {pathname !== "/login" && (
              <Link href="/login" className="hover:text-[#ef7e1a] transition" onClick={() => setMobileMenuOpen(false)}>
                Login
              </Link>
            )}
            <Link href="/register" className="hover:text-[#ef7e1a] transition" onClick={() => setMobileMenuOpen(false)}>
              Register
            </Link>
          </>
        )}
      </div>
    </>
  );
}
