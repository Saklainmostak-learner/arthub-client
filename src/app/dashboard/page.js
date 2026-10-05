"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

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
      <main className="min-h-screen bg-[#07111f] px-4 py-16 text-white">
        <div className="mx-auto max-w-7xl">
          <p className="text-slate-400">Loading dashboard...</p>
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
        <div className="rounded-3xl border border-white/10 bg-[#0b1625] p-6 sm:p-8">
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
            <Link
              href="/artworks"
              className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-[#F97316]/40 hover:bg-white/[0.07]"
            >
              <h2 className="text-lg font-semibold">Browse Artworks</h2>
              <p className="mt-2 text-sm text-slate-400">
                Discover original artwork from independent artists.
              </p>
            </Link>

            {isArtist ? (
              <>
                <Link
                  href="/dashboard/add-artwork"
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-[#F97316]/40 hover:bg-white/[0.07]"
                >
                  <h2 className="text-lg font-semibold">Add Artwork</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    Publish a new artwork to the ArtHub marketplace.
                  </p>
                </Link>

                <Link
                  href="/dashboard/my-artworks"
                  className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 transition hover:border-[#F97316]/40 hover:bg-white/[0.07]"
                >
                  <h2 className="text-lg font-semibold">Manage Artworks</h2>
                  <p className="mt-2 text-sm text-slate-400">
                    View, update, or remove your published artworks.
                  </p>
                </Link>
              </>
            ) : (
              <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5">
                <h2 className="text-lg font-semibold">My Collection</h2>
                <p className="mt-2 text-sm text-slate-400">
                  Your purchased and collected artworks will appear here.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}