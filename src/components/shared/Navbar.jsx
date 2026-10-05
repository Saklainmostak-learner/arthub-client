"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  ChevronDown,
  LayoutDashboard,
  LogOut,
  Menu,
  UserCircle,
  X,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [session, setSession] = useState(null);
  const [isSessionLoading, setIsSessionLoading] = useState(true);

  const profileRef = useRef(null);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data } = await authClient.getSession();
        setSession(data || null);
      } catch (error) {
        console.error("Failed to load navbar session:", error);
        setSession(null);
      } finally {
        setIsSessionLoading(false);
      }
    };

    loadSession();
  }, [pathname]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const navLinks = [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "Browse Artworks",
      href: "/artworks",
    },
    {
      label: "Dashboard",
      href: "/dashboard",
    },
  ];

  const isActive = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  const handleLogout = async () => {
    try {
      await authClient.signOut();

      setSession(null);
      setIsProfileOpen(false);
      setIsMobileMenuOpen(false);

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const user = session?.user;

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#1f2937]/90 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          className="flex shrink-0 items-center"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <Image
            src="/arthub-logo-nav.png"
            alt="ArtHub"
            width={130}
            height={42}
            priority
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => {
            const active = isActive(link.href);

            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative py-2 text-sm font-medium transition ${
                  active
                    ? "text-[#F97316]"
                    : "text-slate-300 hover:text-white"
                }`}
              >
                {link.label}

                {active && (
                  <span className="absolute inset-x-0 -bottom-1 h-0.5 rounded-full bg-[#F97316]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop Auth Area */}
        <div className="hidden md:block">
          {isSessionLoading ? (
            <div className="h-10 w-24 animate-pulse rounded-full bg-white/10" />
          ) : user ? (
            <div ref={profileRef} className="relative">
              <button
                type="button"
                onClick={() => setIsProfileOpen((current) => !current)}
                className="flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.05] px-3 py-2 text-sm text-white transition hover:bg-white/[0.08]"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-[#8B5CF6] via-[#EC4899] to-[#F97316] font-semibold text-white">
                  {user.name?.charAt(0)?.toUpperCase() || "U"}
                </div>

                <span className="max-w-32 truncate font-medium">
                  {user.name}
                </span>

                <ChevronDown
                  size={16}
                  className={`transition ${
                    isProfileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isProfileOpen && (
                <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-2xl border border-white/10 bg-[#0b1625] shadow-2xl">
                  <div className="border-b border-white/10 px-4 py-4">
                    <p className="truncate text-sm font-semibold text-white">
                      {user.name}
                    </p>

                    <p className="mt-1 truncate text-xs text-slate-400">
                      {user.email}
                    </p>

                    <span className="mt-2 inline-flex rounded-full border border-[#F97316]/30 bg-[#F97316]/10 px-2.5 py-1 text-xs font-medium capitalize text-[#F97316]">
                      {user.role || "user"}
                    </span>
                  </div>

                  <div className="p-2">
                    <Link
                      href="/dashboard"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                    >
                      <LayoutDashboard size={17} />
                      Dashboard
                    </Link>

                    <button
                      type="button"
                      onClick={handleLogout}
                      className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm text-red-300 transition hover:bg-red-500/10 hover:text-red-200"
                    >
                      <LogOut size={17} />
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <Link
              href="/login"
              className="rounded-full border border-[#F97316]/50 px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-[#F97316] hover:text-white"
            >
              Login
            </Link>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() =>
            setIsMobileMenuOpen((current) => !current)
          }
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-white transition hover:bg-white/[0.06] md:hidden"
          aria-label="Toggle navigation"
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="border-t border-white/10 bg-[#07111f] px-4 pb-5 pt-4 md:hidden">
          <div className="mx-auto max-w-7xl space-y-2">
            {navLinks.map((link) => {
              const active = isActive(link.href);

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#F97316]/10 text-[#F97316]"
                      : "text-slate-300 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="pt-3">
              {isSessionLoading ? (
                <div className="h-12 w-full animate-pulse rounded-xl bg-white/10" />
              ) : user ? (
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-3">
                  <div className="flex items-center gap-3 px-1 py-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-[#8B5CF6] via-[#EC4899] to-[#F97316] font-semibold text-white">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </div>

                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-white">
                        {user.name}
                      </p>

                      <p className="truncate text-xs text-slate-400">
                        {user.email}
                      </p>
                    </div>
                  </div>

                  <Link
                    href="/dashboard"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="mt-2 flex items-center gap-3 rounded-xl px-3 py-3 text-sm text-slate-300 transition hover:bg-white/[0.06] hover:text-white"
                  >
                    <UserCircle size={18} />
                    Dashboard
                  </Link>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm text-red-300 transition hover:bg-red-500/10"
                  >
                    <LogOut size={18} />
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  href="/login"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-4 py-3 text-center text-sm font-semibold text-white"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}