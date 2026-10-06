"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Heart,
  Loader2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";

export default function FavoritesPage() {
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [removingId, setRemovingId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadFavorites = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const { data } =
          await authClient.getSession();

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
          `${API_URL}/favorites/${encodeURIComponent(
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
              "Failed to load favorites."
          );
        }

        setFavorites(result.data || []);
      } catch (error) {
        console.error(
          "Load favorites error:",
          error
        );

        setErrorMessage(
          error.message ||
            "Unable to load your favorites."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadFavorites();
  }, [router]);

  const handleRemoveFavorite = async (
    favorite
  ) => {
    try {
      setRemovingId(favorite._id);
      setErrorMessage("");

      const response = await fetch(
        `${API_URL}/favorites/${favorite.artworkId}/${encodeURIComponent(
          session.user.email
        )}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to remove favorite."
        );
      }

      setFavorites((previous) =>
        previous.filter(
          (item) =>
            item._id !== favorite._id
        )
      );
    } catch (error) {
      console.error(
        "Remove favorite error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Unable to remove favorite."
      );
    } finally {
      setRemovingId("");
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-4 text-white">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2
            size={20}
            className="animate-spin text-[#F97316]"
          />
          Loading favorites...
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
            My Favorites
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Keep track of the artworks you love and
            revisit them anytime.
          </p>
        </div>

        {errorMessage && (
          <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </div>
        )}

        {!errorMessage &&
          favorites.length === 0 && (
            <div className="mt-10 rounded-3xl border border-dashed border-white/10 bg-white/[0.025] px-6 py-16 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-pink-500/10 text-pink-400">
                <Heart size={25} />
              </div>

              <h2 className="mt-5 text-xl font-bold text-white">
                No favorites yet
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                Tap the heart icon on any artwork to save it
                here.
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
          favorites.length > 0 && (
            <>
              <p className="mt-10 text-sm text-slate-400">
                You have{" "}
                <span className="font-semibold text-white">
                  {favorites.length}
                </span>{" "}
                {favorites.length === 1
                  ? "favorite"
                  : "favorites"}
              </p>

              <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {favorites.map((favorite) => {
                  const isSold =
                    favorite.sold === true;

                  return (
                    <article
                      key={favorite._id}
                      className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1928]"
                    >
                      <div className="relative aspect-[4/5] overflow-hidden bg-[#0b1625]">
                        <Image
                          src={favorite.image}
                          alt={favorite.title}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className={`object-cover ${
                            isSold
                              ? "opacity-70"
                              : ""
                          }`}
                        />

                        <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
                          {favorite.category}
                        </span>

                        {isSold && (
                          <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-500/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white">
                            <BadgeCheck size={14} />
                            Sold
                          </span>
                        )}
                      </div>

                      <div className="p-4">
                        <h2 className="text-base font-bold text-white">
                          {favorite.title}
                        </h2>

                        <p className="mt-1 text-sm text-slate-400">
                          by {favorite.artistName}
                        </p>

                        <p className="mt-4 font-bold text-[#F97316]">
                          $
                          {Number(
                            favorite.price
                          ).toFixed(2)}
                        </p>

                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <Link
                            href={`/artworks/${favorite.artworkId}`}
                            className="flex items-center justify-center rounded-xl border border-white/10 px-3 py-2.5 text-xs font-semibold text-white transition hover:border-[#F97316]/40 hover:bg-[#F97316]/10"
                          >
                            View Details
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleRemoveFavorite(
                                favorite
                              )
                            }
                            disabled={
                              removingId ===
                              favorite._id
                            }
                            className="flex items-center justify-center gap-2 rounded-xl border border-pink-500/20 px-3 py-2.5 text-xs font-semibold text-pink-300 transition hover:bg-pink-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {removingId ===
                            favorite._id ? (
                              <Loader2
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <Heart
                                size={15}
                                fill="currentColor"
                              />
                            )}

                            Remove
                          </button>
                        </div>
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