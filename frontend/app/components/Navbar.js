"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";

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

  if (!isMounted || (isLoggedIn && ["/login", "/register"].includes(pathname))) {
    return null;
  }

  return (
    <>
      <style>{`
        @keyframes logoFadeScale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        .animate-logo {
          animation: logoFadeScale 1s ease-out forwards;
        }

        @keyframes runDot {
          0% {
            left: -10px;
            opacity: 0;
          }
          10% {
            opacity: 1;
          }
          50% {
            left: 50%;
            opacity: 1;
          }
          90% {
            opacity: 1;
          }
          100% {
            left: 100%;
            opacity: 0;
          }
        }

        .ribbon-dot {
          position: absolute;
          top: 0;
          width: 10px;
          height: 4px;
          background-color: #fff;
          border-radius: 50%;
          box-shadow: 0 0 8px #ef7e1a;
          animation: runDot 2s linear infinite;
        }

        @media (min-width: 768px) and (max-width: 1024px) {
          .tablet-menu {
            font-size: 0.875rem;
            gap: 1rem;
            right: 1rem !important;
          }
        }
      `}</style>

      <nav
        className={`fixed top-0 left-0 w-full z-50 bg-[#1e2d4d] shadow-md transition-all duration-300 ${
          scrolled ? "h-[50px]" : "h-[80px]"
        }`}
      >
        <div className="relative flex items-center h-full px-4 sm:px-6 lg:px-10">
          {/* Logo */}
          <div className="flex items-center absolute left-4 top-1/2 -translate-y-1/2 md:relative md:top-auto md:translate-y-0">
            <Link href="/">
              <Image
                src="/Logo-Bela.svg"
                alt="Bela IMS Logo"
                width={160}
                height={64}
                className={`w-auto transition-all duration-300 animate-logo ${
                  scrolled ? "h-12" : "h-16"
                }`}
                priority
              />
            </Link>
          </div>

          {/* Title */}
          <div
            className={`absolute left-1/2 transform -translate-x-1/2 font-bold whitespace-nowrap transition-colors duration-300 text-white`}
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
            <NavLink href="/" label="Home" active={pathname === "/"} />
            {isLoggedIn ? (
              <>
                <NavLink
                  href="/dashboard"
                  label="Dashboard"
                  active={pathname === "/dashboard"}
                />
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
                  <NavLink
                    href="/login"
                    label="Login"
                    active={pathname === "/login"}
                  />
                )}
                <NavLink
                  href="/register"
                  label="Register"
                  active={pathname === "/register"}
                />
              </>
            )}
          </div>
        </div>

        {/* Ribbon inside navbar */}
        <div className="absolute left-0 right-0 h-[4px] bg-[#ef7e1a] overflow-hidden transition-[top] duration-300 ease-in-out bottom-0">
          <div className="ribbon-dot" />
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`md:hidden fixed left-0 w-full bg-white text-[#1e2d4d] shadow transition-all duration-300 px-4 py-4 space-y-4 text-base font-medium z-40 ${
          mobileMenuOpen
            ? "opacity-100 translate-y-0"
            : "opacity-0 -translate-y-5 pointer-events-none"
        }`}
        style={{ top: scrolled ? "50px" : "80px" }}
      >
        <MobileLink
          href="/"
          label="Home"
          active={pathname === "/"}
          onClick={() => setMobileMenuOpen(false)}
        />
        {isLoggedIn ? (
          <>
            <MobileLink
              href="/dashboard"
              label="Dashboard"
              active={pathname === "/dashboard"}
              onClick={() => setMobileMenuOpen(false)}
            />
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
              <MobileLink
                href="/login"
                label="Login"
                active={pathname === "/login"}
                onClick={() => setMobileMenuOpen(false)}
              />
            )}
            <MobileLink
              href="/register"
              label="Register"
              active={pathname === "/register"}
              onClick={() => setMobileMenuOpen(false)}
            />
          </>
        )}
      </div>
    </>
  );
}

// 🔗 Reusable Link Components
function NavLink({ href, label, active }) {
  return (
    <Link
      href={href}
      className={`hover:text-[#ef7e1a] transition hover:underline underline-offset-4 ${
        active ? "text-[#ef7e1a] font-semibold" : ""
      }`}
    >
      {label}
    </Link>
  );
}

function MobileLink({ href, label, active, onClick }) {
  return (
    <Link
      href={href}
      className={`block w-full py-2 hover:text-[#ef7e1a] transition ${
        active ? "text-[#ef7e1a] font-semibold" : ""
      }`}
      onClick={onClick}
    >
      {label}
    </Link>
  );
}
