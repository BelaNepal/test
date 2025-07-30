"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
    setMobileMenuOpen(false); // close menu on route change
  }, [pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    router.push("/");
  };

  if (isLoggedIn && (pathname === "/login" || pathname === "/register")) {
    return null;
  }

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 bg-white shadow-md transition-all duration-300 ${
          scrolled ? "h-[50px]" : "h-[80px]"
        }`}
      >
        <div className="flex items-center justify-between h-full px-4 sm:px-6 lg:px-10">
          {/* Logo */}
          <div
            className="text-blue-700 font-bold whitespace-nowrap"
            style={{ fontSize: scrolled ? "1.2rem" : "1.6rem" }}
          >
            Project - Bela IMS (Beta)
          </div>

          {/* Hamburger - Mobile Only */}
          <button
            className="md:hidden p-2 text-gray-700 focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            ☰
          </button>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-6 items-center text-lg">
            <Link href="/" className="hover:text-blue-600 transition">
              Home
            </Link>

            {isLoggedIn ? (
              <>
                <Link
                  href="/dashboard"
                  className="hover:text-blue-600 transition"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                {pathname !== "/login" && (
                  <Link
                    href="/login"
                    className="hover:text-blue-600 transition"
                  >
                    Login
                  </Link>
                )}
                <Link
                  href="/register"
                  className="hover:text-blue-600 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Mobile Menu (below navbar) */}
      <div
        className={`md:hidden bg-white border-t shadow-sm px-4 py-2 flex flex-col space-y-3 text-lg transition-all duration-300 transform ${
          mobileMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-4 opacity-0 pointer-events-none"
        }`}
        style={{ marginTop: scrolled ? "50px" : "80px" }}
      >
        <Link
          href="/"
          className="hover:text-blue-600 transition"
          onClick={() => setMobileMenuOpen(false)}
        >
          Home
        </Link>

        {isLoggedIn ? (
          <>
            <Link
              href="/dashboard"
              className="hover:text-blue-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
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
              <Link
                href="/login"
                className="hover:text-blue-600 transition"
                onClick={() => setMobileMenuOpen(false)}
              >
                Login
              </Link>
            )}
            <Link
              href="/register"
              className="hover:text-blue-600 transition"
              onClick={() => setMobileMenuOpen(false)}
            >
              Register
            </Link>
          </>
        )}
      </div>
    </>
  );
}
