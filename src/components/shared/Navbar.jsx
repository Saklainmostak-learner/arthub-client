"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, X } from "lucide-react";

export default function Navbar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    {
      name: "Home",
      href: "/",
    },
    {
      name: "Browse Artworks",
      href: "/artworks",
    },
    {
      name: "Dashboard",
      href: "/dashboard",
    },
  ];

  const isActiveRoute = (href) => {
    if (href === "/") {
      return pathname === "/";
    }

    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#07111f]/70 backdrop-blur-xl">
      <nav className="mx-auto flex h-[76px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link
          href="/"
          onClick={() => setIsOpen(false)}
          className="flex items-center"
          aria-label="ArtHub home"
        >
          <Image
            src="/arthub-logo-nav.png"
            alt="ArtHub logo"
            width={145}
            height={42}
            priority
            className="h-9 w-auto object-contain"
          />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden items-center gap-9 md:flex">
          {navLinks.map((link) => {
            const active = isActiveRoute(link.href);

            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative py-2 text-sm font-medium transition-colors duration-200 ${
                  active ? "text-[#F97316]" : "text-slate-300 hover:text-white"
                }`}
              >
                {link.name}

                {active && (
                  <span className="absolute bottom-0 left-0 h-0.5 w-full rounded-full bg-[#F97316]" />
                )}
              </Link>
            );
          })}
        </div>

        {/* Desktop Login */}
        <div className="hidden md:flex md:items-center">
          <Link
            href="/login"
            className="rounded-full border border-[#F97316]/70 px-6 py-2.5 text-sm font-semibold text-white transition-all duration-200 hover:bg-[#F97316]"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button
          type="button"
          onClick={() => setIsOpen((current) => !current)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 text-white transition hover:bg-white/10 md:hidden"
          aria-label="Toggle navigation menu"
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={23} /> : <Menu size={23} />}
        </button>
      </nav>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="border-t border-white/10 bg-[#07111f] md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-5">
            {navLinks.map((link) => {
              const active = isActiveRoute(link.href);

              return (
                <Link
                  key={link.name}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className={`rounded-xl px-4 py-3 text-sm font-medium transition ${
                    active
                      ? "bg-[#F97316]/10 text-[#F97316]"
                      : "text-slate-300 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}

            <Link
              href="/login"
              onClick={() => setIsOpen(false)}
              className="mt-3 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-4 py-3 text-center text-sm font-semibold text-white transition hover:opacity-90"
            >
              Login
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
