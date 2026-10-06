"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Loader2,
  ShoppingBag,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function MyCollectionPage() {
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [purchases, setPurchases] = useState([]);

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadCollection = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const { data } = await authClient.getSession();

        if (!data?.user) {
          router.push("/login");
          return;
        }

        if (data.user.role !== "user") {
          router.push("/dashboard");
          return;
        }

        setSession(data);

        const response = await fetch(
          `http://localhost:5000/purchases/buyer/${encodeURIComponent(
            data.user.email
          )}`,
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to load your collection."
          );
        }

        setPurchases(result.data || []);
      } catch (error) {
        console.error(
          "Load collection error:",
          error
        );

        setErrorMessage(
          error.message ||
            "Unable to load your collection."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadCollection();
  }, [router]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-4 text-white">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2
            size={20}
            className="animate-spin text-[#F97316]"
          />
          Loading your collection...
        </div>
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#F97316]">
            Collector Space
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            My Collection
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Explore the original artworks you have
            purchased through ArtHub.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-white/10 bg-[#0b1625] p-5">
          <p className="text-sm text-slate-400">
            Collector
          </p>

          <p className="mt-1 font-semibold text-white">
            {session.user.name}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {session.user.email}
          </p>
        </div>

        {errorMessage && (
          <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </div>
        )}

        {!errorMessage &&
          purchases.length === 0 && (
            <div className="mt-10 rounded-3xl border border-dashed border-white/10 bg-white/[0.025] px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#F97316]/10 text-[#F97316]">
                <ShoppingBag size={25} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-white">
                Your collection is empty
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                Browse original artworks and purchase a
                piece to start building your personal
                collection.
              </p>

              <Link
                href="/artworks"
                className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-5 py-3 text-sm font-semibold text-white"
              >
                Browse Artworks
              </Link>
            </div>
          )}

        {!errorMessage &&
          purchases.length > 0 && (
            <>
              <p className="mt-10 text-sm text-slate-400">
                You own{" "}
                <span className="font-semibold text-white">
                  {purchases.length}
                </span>{" "}
                {purchases.length === 1
                  ? "artwork"
                  : "artworks"}
              </p>

              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                {purchases.map((purchase) => {
                  const purchaseDate =
                    purchase.purchasedAt
                      ? new Date(
                          purchase.purchasedAt
                        ).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          }
                        )
                      : "Unknown";

                  return (
                    <article
                      key={purchase._id}
                      className="rounded-2xl border border-white/10 bg-[#0d1928] p-5"
                    >
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F97316]/10 text-[#F97316]">
                        <ShoppingBag size={21} />
                      </div>

                      <h2 className="mt-5 text-xl font-bold text-white">
                        {purchase.artworkTitle}
                      </h2>

                      <p className="mt-2 text-sm text-slate-400">
                        by {purchase.artistName}
                      </p>

                      <p className="mt-5 text-2xl font-bold text-[#F97316]">
                        $
                        {Number(
                          purchase.amount
                        ).toFixed(2)}
                      </p>

                      <div className="mt-5 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-slate-500">
                        <CalendarDays size={15} />
                        Purchased {purchaseDate}
                      </div>
                    </article>
                  );
                })}
              </div>
            </>
          )}
      </div>
    </main>
  );
}