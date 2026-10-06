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
  const [isLoading, setIsLoading] =
    useState(true);
  const [removingId, setRemovingId] =
    useState("");
  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    const loadFavorites = async () => {
      try {
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
            credentials: "include",
          }
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message
          );
        }

        setFavorites(
          result.data || []
        );
      } catch (error) {
        setErrorMessage(
          error.message ||
            "Unable to load favorites."
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
      setRemovingId(
        favorite._id
      );

      const response = await fetch(
        `${API_URL}/favorites/${favorite.artworkId}/${encodeURIComponent(
          session.user.email
        )}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message
        );
      }

      setFavorites((previous) =>
        previous.filter(
          (item) =>
            item._id !==
            favorite._id
        )
      );
    } catch (error) {
      setErrorMessage(
        error.message
      );
    } finally {
      setRemovingId("");
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f]">
        <Loader2 className="animate-spin text-[#F97316]" />
      </main>
    );
  }

  if (!session?.user) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-10 text-white">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-sm text-slate-400"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <h1 className="mt-8 text-4xl font-bold">
          My Favorites
        </h1>

        {errorMessage && (
          <div className="mt-8 rounded-xl bg-red-500/10 p-4 text-red-300">
            {errorMessage}
          </div>
        )}

        {!errorMessage &&
          favorites.length === 0 && (
            <div className="mt-10 rounded-3xl border border-dashed border-white/10 py-16 text-center">
              <Heart className="mx-auto text-pink-400" />

              <h2 className="mt-4 text-xl font-bold">
                No favorites yet
              </h2>
            </div>
          )}

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {favorites.map(
            (favorite) => {
              const isSold =
                favorite.sold ===
                true;

              return (
                <article
                  key={
                    favorite._id
                  }
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1928]"
                >
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={
                        favorite.image
                      }
                      alt={
                        favorite.title
                      }
                      fill
                      className="object-cover"
                    />

                    {isSold && (
                      <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs">
                        <BadgeCheck
                          size={14}
                        />
                        SOLD
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h2 className="font-bold">
                      {
                        favorite.title
                      }
                    </h2>

                    <p className="mt-1 text-sm text-slate-400">
                      by{" "}
                      {
                        favorite.artistName
                      }
                    </p>

                    <p className="mt-4 text-[#F97316]">
                      $
                      {Number(
                        favorite.price
                      ).toFixed(2)}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <Link
                        href={`/artworks/${favorite.artworkId}`}
                        className="flex items-center justify-center rounded-xl border border-white/10 p-3 text-xs"
                      >
                        View Details
                      </Link>

                      <button
                        onClick={() =>
                          handleRemoveFavorite(
                            favorite
                          )
                        }
                        disabled={
                          removingId ===
                          favorite._id
                        }
                        className="rounded-xl border border-pink-500/20 p-3 text-xs text-pink-300"
                      >
                        {removingId ===
                        favorite._id
                          ? "Removing..."
                          : "Remove"}
                      </button>
                    </div>
                  </div>
                </article>
              );
            }
          )}
        </div>
      </div>
    </main>
  );
}