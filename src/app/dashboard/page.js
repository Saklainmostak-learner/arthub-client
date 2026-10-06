"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Palette,
  Plus,
  ShoppingBag,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function DashboardPage() {
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadSession = async () => {
      try {
        const { data } = await authClient.getSession();

        if (!data?.user) {
          router.push("/login");
          return;
        }

        setSession(data);
      } catch (error) {
        console.error("Failed to load session:", error);
        router.push("/login");
      } finally {
        setIsLoading(false);
      }
    };

    loadSession();
  }, [router]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-4 text-white">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2
            size={20}
            className="animate-spin text-[#F97316]"
          />
          Loading dashboard...
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  const user = session.user;
  const isArtist = user.role === "artist";

  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-[2rem] border border-white/10 bg-[#0b1625] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#F97316]">
            ArtHub Dashboard
          </p>

          <h1 className="mt-3 text-3xl font-bold sm:text-4xl">
            Welcome, {user.name}
          </h1>

          <p className="mt-3 text-slate-400">
            Signed in as{" "}
            <span className="font-semibold text-white">
              {isArtist ? "Artist" : "Art Collector"}
            </span>
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {/* Browse Artworks */}
            <Link
              href="/artworks"
              className="block cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#F97316]/40 hover:bg-white/[0.07]"
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F97316]/10 text-[#F97316]">
                <Palette size={21} />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-white">
                Browse Artworks
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Discover original artwork from independent artists.
              </p>
            </Link>

            {isArtist ? (
              <>
                {/* Add Artwork */}
                <Link
                  href="/dashboard/add-artwork"
                  className="block cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#F97316]/40 hover:bg-white/[0.07]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F97316]/10 text-[#F97316]">
                    <Plus size={21} />
                  </div>

                  <h2 className="mt-4 text-lg font-semibold text-white">
                    Add Artwork
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    Publish a new artwork to the ArtHub marketplace.
                  </p>
                </Link>

                {/* Manage Artworks */}
                <Link
                  href="/dashboard/my-artworks"
                  className="block cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#F97316]/40 hover:bg-white/[0.07]"
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F97316]/10 text-[#F97316]">
                    <Palette size={21} />
                  </div>

                  <h2 className="mt-4 text-lg font-semibold text-white">
                    Manage Artworks
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    View, update, or remove your published artworks.
                  </p>
                </Link>
              </>
            ) : (
              /* My Collection */
              <Link
                href="/dashboard/my-collection"
                className="block cursor-pointer rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition duration-300 hover:-translate-y-1 hover:border-[#F97316]/40 hover:bg-white/[0.07]"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F97316]/10 text-[#F97316]">
                  <ShoppingBag size={21} />
                </div>

                <h2 className="mt-4 text-lg font-semibold text-white">
                  My Collection
                </h2>

                <p className="mt-2 text-sm leading-6 text-slate-400">
                  View the original artworks you have purchased
                  through ArtHub.
                </p>

                <p className="mt-4 text-xs font-semibold text-[#F97316]">
                  View Collection →
                </p>
              </Link>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}