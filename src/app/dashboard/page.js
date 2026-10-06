"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Heart,
  Loader2,
  Palette,
  Plus,
  ShoppingBag,
  Store,
  TrendingUp,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
  const router = useRouter();

  const [session, setSession] =
    useState(null);

  const [isLoading, setIsLoading] =
    useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data } =
          await authClient.getSession();

        if (!data?.user) {
          router.push("/login");
          return;
        }

        setSession(data);
      } catch (error) {
        console.error(
          "Dashboard session error:",
          error
        );

        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, [router]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f]">
        <Loader2
          className="animate-spin text-[#F97316]"
        />
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user =
    session.user;

  const isArtist =
    user.role === "artist";

  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#F97316]">
            {isArtist
              ? "Artist Studio"
              : "Collector Space"}
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Dashboard
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Welcome back,{" "}
            <span className="font-semibold text-white">
              {user.name}
            </span>
            .
          </p>
        </div>

        <div className="mt-10 rounded-2xl border border-white/10 bg-[#0b1625] p-5">
          <p className="text-sm text-slate-400">
            Signed in as
          </p>

          <p className="mt-1 font-semibold">
            {user.name}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {user.email}
          </p>

          <span className="mt-4 inline-flex rounded-full border border-[#F97316]/20 bg-[#F97316]/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-[#F97316]">
            {isArtist
              ? "Artist"
              : "Art Collector"}
          </span>
        </div>

        {isArtist ? (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <Link
              href="/artworks"
              className="rounded-2xl border border-white/10 bg-[#0d1928] p-6 transition hover:-translate-y-1 hover:border-[#F97316]/30"
            >
              <Palette
                className="text-[#F97316]"
              />

              <h2 className="mt-5 text-lg font-bold">
                Browse Artworks
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Explore artworks from the
                ArtHub community.
              </p>
            </Link>

            <Link
              href="/dashboard/add-artwork"
              className="rounded-2xl border border-white/10 bg-[#0d1928] p-6 transition hover:-translate-y-1 hover:border-[#F97316]/30"
            >
              <Plus
                className="text-[#F97316]"
              />

              <h2 className="mt-5 text-lg font-bold">
                Add Artwork
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Publish a new original piece.
              </p>
            </Link>

            <Link
              href="/dashboard/my-artworks"
              className="rounded-2xl border border-white/10 bg-[#0d1928] p-6 transition hover:-translate-y-1 hover:border-[#F97316]/30"
            >
              <Store
                className="text-[#F97316]"
              />

              <h2 className="mt-5 text-lg font-bold">
                Manage Artworks
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Edit and manage your published
                work.
              </p>
            </Link>

            <Link
              href="/dashboard/sales"
              className="rounded-2xl border border-white/10 bg-[#0d1928] p-6 transition hover:-translate-y-1 hover:border-emerald-400/30"
            >
              <TrendingUp
                className="text-emerald-400"
              />

              <h2 className="mt-5 text-lg font-bold">
                Sales History
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Track sales, buyers, and
                revenue.
              </p>
            </Link>
          </div>
        ) : (
          <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            <Link
              href="/artworks"
              className="rounded-2xl border border-white/10 bg-[#0d1928] p-6 transition hover:-translate-y-1 hover:border-[#F97316]/30"
            >
              <Palette
                className="text-[#F97316]"
              />

              <h2 className="mt-5 text-lg font-bold">
                Browse Artworks
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Discover original artwork from
                independent artists.
              </p>
            </Link>

            <Link
              href="/dashboard/favorites"
              className="rounded-2xl border border-white/10 bg-[#0d1928] p-6 transition hover:-translate-y-1 hover:border-pink-400/30"
            >
              <Heart
                className="text-pink-400"
              />

              <h2 className="mt-5 text-lg font-bold">
                My Favorites
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Revisit artwork you saved.
              </p>
            </Link>

            <Link
              href="/dashboard/my-collection"
              className="rounded-2xl border border-white/10 bg-[#0d1928] p-6 transition hover:-translate-y-1 hover:border-emerald-400/30"
            >
              <ShoppingBag
                className="text-emerald-400"
              />

              <h2 className="mt-5 text-lg font-bold">
                My Collection
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                View artworks you purchased.
              </p>
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}