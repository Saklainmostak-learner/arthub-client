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
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";

export default function MyArtworksPage() {
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [artworks, setArtworks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deletingId, setDeletingId] = useState("");
  const [artworkToDelete, setArtworkToDelete] =
    useState(null);

  useEffect(() => {
    const loadPage = async () => {
      try {
        setIsLoading(true);

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
          `${API_URL}/artworks`,
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
            artwork.artistEmail
              ?.trim()
              .toLowerCase() ===
            data.user.email
              ?.trim()
              .toLowerCase()
        );

        setArtworks(ownArtworks);
      } catch (error) {
        console.error(
          "Failed to load artist artworks:",
          error
        );

        toast.error(
          error.message ||
            "Unable to load your artworks."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadPage();
  }, [router]);

  const openDeleteModal = (artwork) => {
    if (artwork.sold === true) {
      toast.error(
        "Sold artworks cannot be deleted."
      );

      return;
    }

    setArtworkToDelete(artwork);
  };

  const closeDeleteModal = () => {
    if (deletingId) {
      return;
    }

    setArtworkToDelete(null);
  };

  const handleDelete = async () => {
    if (!artworkToDelete) {
      return;
    }

    try {
      setDeletingId(
        artworkToDelete._id
      );

      const response = await fetch(
        `${API_URL}/artworks/${artworkToDelete._id}`,
        {
          method: "DELETE",
          credentials: "include",
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
            item._id !==
            artworkToDelete._id
        )
      );

      toast.success(
        "Artwork deleted successfully."
      );

      setArtworkToDelete(null);
    } catch (error) {
      console.error(
        "Delete artwork error:",
        error
      );

      toast.error(
        error.message ||
          "Something went wrong while deleting the artwork."
      );
    } finally {
      setDeletingId("");
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
    <>
      <main className="min-h-screen bg-[#07111f] px-4 py-10 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to Dashboard
          </Link>

          <div className="mt-8 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#F97316]">
                Artist Studio
              </p>

              <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
                Manage Artworks
              </h1>
            </div>

            <Link
              href="/dashboard/add-artwork"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-5 py-3 text-sm font-semibold"
            >
              <Plus size={17} />
              Add Artwork
            </Link>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {artworks.map((artwork) => {
              const isSold =
                artwork.sold === true;

              return (
                <article
                  key={artwork._id}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1928]"
                >
                  <div className="relative aspect-[4/5]">
                    <Image
                      src={artwork.image}
                      alt={artwork.title}
                      fill
                      className={`object-cover ${
                        isSold
                          ? "opacity-70"
                          : ""
                      }`}
                    />

                    {isSold && (
                      <span className="absolute bottom-3 left-3 flex items-center gap-1 rounded-full bg-emerald-500 px-3 py-1 text-xs font-bold">
                        <BadgeCheck size={14} />
                        SOLD
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <h2 className="font-bold">
                      {artwork.title}
                    </h2>

                    <p className="mt-2 text-[#F97316]">
                      $
                      {Number(
                        artwork.price
                      ).toFixed(2)}
                    </p>

                    <div className="mt-5 grid grid-cols-2 gap-3">
                      {isSold ? (
                        <>
                          <button
                            disabled
                            className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-600"
                          >
                            <Edit3
                              className="mx-auto"
                              size={15}
                            />
                          </button>

                          <button
                            disabled
                            className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-600"
                          >
                            <Trash2
                              className="mx-auto"
                              size={15}
                            />
                          </button>
                        </>
                      ) : (
                        <>
                          <Link
                            href={`/dashboard/my-artworks/${artwork._id}/edit`}
                            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 px-3 py-2.5 text-xs"
                          >
                            <Edit3 size={15} />
                            Edit
                          </Link>

                          <button
                            onClick={() =>
                              openDeleteModal(
                                artwork
                              )
                            }
                            className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 px-3 py-2.5 text-xs text-red-300"
                          >
                            <Trash2 size={15} />
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      </main>

      {artworkToDelete && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-3xl border border-white/10 bg-[#0d1928] p-6 text-white">
            <div className="flex justify-between">
              <Trash2 className="text-red-400" />

              <button
                onClick={
                  closeDeleteModal
                }
              >
                <X />
              </button>
            </div>

            <h2 className="mt-6 text-2xl font-bold">
              Delete artwork?
            </h2>

            <p className="mt-3 text-sm text-slate-400">
              Delete{" "}
              <strong className="text-white">
                {
                  artworkToDelete.title
                }
              </strong>
              ?
            </p>

            <div className="mt-7 grid grid-cols-2 gap-3">
              <button
                onClick={
                  closeDeleteModal
                }
                className="rounded-xl border border-white/10 px-4 py-3"
              >
                Cancel
              </button>

              <button
                onClick={
                  handleDelete
                }
                disabled={Boolean(
                  deletingId
                )}
                className="rounded-xl bg-red-500 px-4 py-3"
              >
                {deletingId
                  ? "Deleting..."
                  : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}