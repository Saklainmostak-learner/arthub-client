"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  Edit3,
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";

export default function MyArtworksPage() {
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [artworks, setArtworks] = useState([]);

  const [isSessionLoading, setIsSessionLoading] =
    useState(true);

  const [isLoading, setIsLoading] =
    useState(true);

  const [deletingId, setDeletingId] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  const [successMessage, setSuccessMessage] =
    useState("");

  useEffect(() => {
    const loadPage = async () => {
      try {
        setIsSessionLoading(true);
        setErrorMessage("");

        const { data } =
          await authClient.getSession();

        if (!data?.user) {
          router.push("/login");
          return;
        }

        if (data.user.role !== "artist") {
          router.push("/dashboard");
          return;
        }

        setSession(data);

        const response = await fetch(
          "http://localhost:5000/artworks",
          {
            cache: "no-store",
          }
        );

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to load artworks."
          );
        }

        const ownArtworks = (
          result.data || []
        ).filter(
          (artwork) =>
            artwork.artistEmail ===
            data.user.email
        );

        setArtworks(ownArtworks);
      } catch (error) {
        console.error(
          "Failed to load artist artworks:",
          error
        );

        setErrorMessage(
          error.message ||
            "Unable to load your artworks."
        );
      } finally {
        setIsLoading(false);
        setIsSessionLoading(false);
      }
    };

    loadPage();
  }, [router]);

  const handleDelete = async (artwork) => {
    setErrorMessage("");
    setSuccessMessage("");

    if (artwork.sold === true) {
      setErrorMessage(
        "Sold artworks cannot be deleted."
      );
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this artwork?"
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(artwork._id);

      const response = await fetch(
        `http://localhost:5000/artworks/${artwork._id}`,
        {
          method: "DELETE",
        }
      );

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to delete artwork."
        );
      }

      setArtworks((previous) =>
        previous.filter(
          (item) =>
            item._id !== artwork._id
        )
      );

      setSuccessMessage(
        "Artwork deleted successfully."
      );
    } catch (error) {
      console.error(
        "Delete artwork error:",
        error
      );

      setErrorMessage(
        error.message ||
          "Something went wrong while deleting the artwork."
      );
    } finally {
      setDeletingId("");
    }
  };

  if (
    isSessionLoading ||
    isLoading
  ) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-4">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2
            size={20}
            className="animate-spin text-[#F97316]"
          />
          Loading your artworks...
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

        <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#F97316]">
              Artist Studio
            </p>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Manage Artworks
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              View and manage the artworks you
              have published on ArtHub.
            </p>
          </div>

          <Link
            href="/dashboard/add-artwork"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-5 py-3 text-sm font-semibold text-white transition hover:opacity-90"
          >
            <Plus size={17} />
            Add Artwork
          </Link>
        </div>

        {successMessage && (
          <div className="mt-8 rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
            {successMessage}
          </div>
        )}

        {errorMessage && (
          <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </div>
        )}

        <div className="mt-8 rounded-2xl border border-white/10 bg-[#0b1625] p-5">
          <p className="text-sm text-slate-400">
            Published as
          </p>

          <p className="mt-1 font-semibold text-white">
            {session.user.name}
          </p>

          <p className="mt-1 text-sm text-slate-500">
            {session.user.email}
          </p>
        </div>

        {artworks.length === 0 ? (
          <div className="mt-10 rounded-3xl border border-dashed border-white/10 bg-white/[0.025] px-6 py-16 text-center">
            <h2 className="text-xl font-bold text-white">
              No artworks published yet
            </h2>

            <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
              Start building your artist
              collection by publishing your
              first artwork.
            </p>

            <Link
              href="/dashboard/add-artwork"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-5 py-3 text-sm font-semibold text-white"
            >
              <Plus size={17} />
              Publish Artwork
            </Link>
          </div>
        ) : (
          <>
            <p className="mt-10 text-sm text-slate-400">
              You have{" "}
              <span className="font-semibold text-white">
                {artworks.length}
              </span>{" "}
              {artworks.length === 1
                ? "artwork"
                : "artworks"}
            </p>

            <div className="mt-5 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {artworks.map((artwork) => {
                const isSold =
                  artwork.sold === true;

                return (
                  <article
                    key={artwork._id}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1928]"
                  >
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#081321]">
                      <Image
                        src={artwork.image}
                        alt={artwork.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className={`object-cover ${
                          isSold
                            ? "opacity-70"
                            : ""
                        }`}
                      />

                      <span className="absolute left-3 top-3 rounded-full border border-white/10 bg-black/45 px-3 py-1 text-[11px] font-medium text-white backdrop-blur">
                        {artwork.category}
                      </span>

                      {isSold && (
                        <span className="absolute bottom-3 left-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-300/30 bg-emerald-500/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.15em] text-white">
                          <BadgeCheck size={14} />
                          Sold
                        </span>
                      )}
                    </div>

                    <div className="p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h2 className="truncate text-base font-bold text-white">
                            {artwork.title}
                          </h2>

                          <p className="mt-1 text-sm text-slate-400">
                            $
                            {Number(
                              artwork.price
                            ).toFixed(2)}
                          </p>
                        </div>

                        {isSold && (
                          <span className="shrink-0 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] text-emerald-300">
                            Sold
                          </span>
                        )}
                      </div>

                      {isSold ? (
                        <>
                          <div className="mt-5 rounded-xl border border-emerald-500/15 bg-emerald-500/[0.06] px-4 py-3">
                            <p className="flex items-center gap-2 text-xs font-semibold text-emerald-300">
                              <BadgeCheck size={15} />
                              Artwork sold
                            </p>

                            <p className="mt-1 text-xs leading-5 text-slate-500">
                              Sold artworks can no
                              longer be edited or
                              deleted.
                            </p>
                          </div>

                          <div className="mt-4 grid grid-cols-2 gap-3">
                            <button
                              type="button"
                              disabled
                              className="flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 text-xs font-semibold text-slate-600"
                            >
                              <Edit3 size={15} />
                              Edit
                            </button>

                            <button
                              type="button"
                              disabled
                              className="flex cursor-not-allowed items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2.5 text-xs font-semibold text-slate-600"
                            >
                              <Trash2 size={15} />
                              Delete
                            </button>
                          </div>
                        </>
                      ) : (
                        <div className="mt-5 grid grid-cols-2 gap-3">
                          <Link
                            href={`/dashboard/my-artworks/${artwork._id}/edit`}
                            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-xs font-semibold text-white transition hover:border-[#F97316]/40 hover:bg-[#F97316]/10"
                          >
                            <Edit3 size={15} />
                            Edit
                          </Link>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                artwork
                              )
                            }
                            disabled={
                              deletingId ===
                              artwork._id
                            }
                            className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 px-3 py-2.5 text-xs font-semibold text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                          >
                            {deletingId ===
                            artwork._id ? (
                              <Loader2
                                size={15}
                                className="animate-spin"
                              />
                            ) : (
                              <Trash2
                                size={15}
                              />
                            )}

                            {deletingId ===
                            artwork._id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      )}
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