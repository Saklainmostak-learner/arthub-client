"use client";

import Image from "next/image";
import Link from "next/link";
import {
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import {
  ArrowLeft,
  BadgeCheck,
  CalendarDays,
  Loader2,
  Palette,
  Pencil,
  Send,
  ShoppingBag,
  Star,
  Trash2,
  User,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";

export default function ArtworkDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const id = params?.id;

  const [artwork, setArtwork] =
    useState(null);

  const [session, setSession] =
    useState(null);

  const [comments, setComments] =
    useState([]);

  const [purchases, setPurchases] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [isBuying, setIsBuying] =
    useState(false);

  const [isReviewSubmitting, setIsReviewSubmitting] =
    useState(false);

  const [deletingCommentId, setDeletingCommentId] =
    useState("");

  const [editingCommentId, setEditingCommentId] =
    useState("");

  const [commentText, setCommentText] =
    useState("");

  const [rating, setRating] =
    useState(5);

  const [editText, setEditText] =
    useState("");

  const [editRating, setEditRating] =
    useState(5);

  const [errorMessage, setErrorMessage] =
    useState("");

  const loadComments = async () => {
    try {
      const response = await fetch(
        `${API_URL}/comments/artwork/${id}`,
        {
          cache: "no-store",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Failed to load reviews."
        );
      }

      setComments(
        result.data || []
      );
    } catch (error) {
      console.error(
        "Load comments error:",
        error
      );
    }
  };

  useEffect(() => {
    const loadPage = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const response = await fetch(
          `${API_URL}/artworks/${id}`,
          {
            cache: "no-store",
          }
        );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Failed to load artwork."
          );
        }

        setArtwork(result.data);

        const { data } =
          await authClient.getSession();

        setSession(data || null);

        if (
          data?.user?.role === "user"
        ) {
          const purchasesResponse =
            await fetch(
              `${API_URL}/purchases/buyer/${encodeURIComponent(
                data.user.email
              )}`,
              {
                cache: "no-store",
                credentials: "include",
              }
            );

          const purchasesResult =
            await purchasesResponse.json();

          if (
            purchasesResponse.ok
          ) {
            setPurchases(
              purchasesResult.data ||
                []
            );
          }
        }

        await loadComments();
      } catch (error) {
        setErrorMessage(
          error.message ||
            "Unable to load artwork."
        );
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      loadPage();
    }
  }, [id]);

  const hasPurchased =
    useMemo(() => {
      return purchases.some(
        (purchase) =>
          purchase.artworkId ===
          id
      );
    }, [purchases, id]);

  const ownComment =
    useMemo(() => {
      if (!session?.user) {
        return null;
      }

      return (
        comments.find(
          (comment) =>
            comment.userEmail ===
            session.user.email
              ?.trim()
              .toLowerCase()
        ) || null
      );
    }, [
      comments,
      session,
    ]);

  const averageRating =
    useMemo(() => {
      if (!comments.length) {
        return 0;
      }

      const total =
        comments.reduce(
          (sum, item) =>
            sum +
            Number(
              item.rating || 0
            ),
          0
        );

      return (
        total /
        comments.length
      );
    }, [comments]);

  const handleBuyArtwork = async () => {
    if (!session?.user) {
      router.push("/login");
      return;
    }

    if (artwork?.sold) {
      toast.error(
        "This artwork has already been sold."
      );

      return;
    }

    if (
      session.user.role !==
      "user"
    ) {
      toast.error(
        "Only art collectors can purchase artworks."
      );

      return;
    }

    try {
      setIsBuying(true);

      const response = await fetch(
        `${API_URL}/purchases/create-checkout-session`,
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            artworkId:
              artwork._id,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to start checkout."
        );
      }

      window.location.href =
        result.url;
    } catch (error) {
      toast.error(
        error.message ||
          "Unable to start checkout."
      );
    } finally {
      setIsBuying(false);
    }
  };

  const handleSubmitReview = async (
    event
  ) => {
    event.preventDefault();

    if (!commentText.trim()) {
      toast.error(
        "Please write a review."
      );

      return;
    }

    try {
      setIsReviewSubmitting(
        true
      );

      const response = await fetch(
        `${API_URL}/comments`,
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            artworkId:
              artwork._id,

            comment:
              commentText,

            rating,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to add review."
        );
      }

      toast.success(
        "Review added successfully."
      );

      setCommentText("");
      setRating(5);

      await loadComments();
    } catch (error) {
      toast.error(
        error.message ||
          "Unable to add review."
      );
    } finally {
      setIsReviewSubmitting(
        false
      );
    }
  };

  const startEditing = (
    comment
  ) => {
    setEditingCommentId(
      comment._id
    );

    setEditText(
      comment.comment
    );

    setEditRating(
      Number(
        comment.rating
      )
    );
  };

  const cancelEditing = () => {
    setEditingCommentId("");
    setEditText("");
    setEditRating(5);
  };

  const handleUpdateReview = async (
    commentId
  ) => {
    if (!editText.trim()) {
      toast.error(
        "Review cannot be empty."
      );

      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/comments/${commentId}`,
        {
          method: "PUT",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            comment:
              editText,

            rating:
              editRating,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to update review."
        );
      }

      toast.success(
        "Review updated successfully."
      );

      cancelEditing();

      await loadComments();
    } catch (error) {
      toast.error(
        error.message ||
          "Unable to update review."
      );
    }
  };

  const handleDeleteReview = async (
    commentId
  ) => {
    try {
      setDeletingCommentId(
        commentId
      );

      const response = await fetch(
        `${API_URL}/comments/${commentId}`,
        {
          method: "DELETE",
          credentials: "include",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to delete review."
        );
      }

      toast.success(
        "Review deleted successfully."
      );

      await loadComments();
    } catch (error) {
      toast.error(
        error.message ||
          "Unable to delete review."
      );
    } finally {
      setDeletingCommentId("");
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f]">
        <Loader2
          size={26}
          className="animate-spin text-[#F97316]"
        />
      </main>
    );
  }

  if (!artwork) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-4 text-white">
        <div className="text-center">
          <Palette
            size={34}
            className="mx-auto text-[#F97316]"
          />

          <h1 className="mt-5 text-2xl font-bold">
            Artwork not found
          </h1>

          <p className="mt-3 text-slate-400">
            {errorMessage}
          </p>
        </div>
      </main>
    );
  }

  const isSold =
    artwork.sold === true;

  const uploadedDate =
    artwork.createdAt
      ? new Date(
          artwork.createdAt
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
    <main className="min-h-screen bg-[#07111f] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <Link
          href="/artworks"
          className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Artworks
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-2">
          <div className="relative aspect-[4/5] overflow-hidden rounded-3xl border border-white/10">
            <Image
              src={artwork.image}
              alt={artwork.title}
              fill
              priority
              className={`object-cover ${
                isSold
                  ? "opacity-70"
                  : ""
              }`}
            />

            {isSold && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-5 py-3 font-bold text-white shadow-xl">
                  <BadgeCheck
                    size={18}
                  />
                  SOLD
                </span>
              </div>
            )}
          </div>

          <div>
            <span className="rounded-full bg-[#F97316]/10 px-3 py-1 text-sm text-[#F97316]">
              {artwork.category}
            </span>

            <h1 className="mt-5 text-4xl font-bold sm:text-5xl">
              {artwork.title}
            </h1>

            <p className="mt-4 flex items-center gap-2 text-slate-400">
              <User size={17} />
              by{" "}
              <strong className="text-white">
                {
                  artwork.artistName
                }
              </strong>
            </p>

            <p className="mt-6 text-3xl font-bold text-[#F97316]">
              $
              {Number(
                artwork.price
              ).toFixed(2)}
            </p>

            <p className="mt-8 leading-7 text-slate-400">
              {artwork.description}
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <Palette
                  size={17}
                  className="text-[#F97316]"
                />

                <p className="mt-2 font-semibold">
                  {artwork.category}
                </p>
              </div>

              <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
                <CalendarDays
                  size={17}
                  className="text-[#F97316]"
                />

                <p className="mt-2 font-semibold">
                  {uploadedDate}
                </p>
              </div>
            </div>

            {isSold ? (
              <div className="mt-8 rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.07] p-5">
                <p className="flex items-center gap-2 font-semibold text-emerald-300">
                  <BadgeCheck
                    size={18}
                  />
                  This artwork has been sold
                </p>

                <p className="mt-2 text-sm text-slate-400">
                  This original piece is no longer available
                  for purchase.
                </p>
              </div>
            ) : (
              <button
                onClick={
                  handleBuyArtwork
                }
                disabled={isBuying}
                className="mt-8 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] py-4 font-semibold transition hover:opacity-90 disabled:opacity-60"
              >
                {isBuying ? (
                  <Loader2
                    size={18}
                    className="animate-spin"
                  />
                ) : (
                  <ShoppingBag
                    size={18}
                  />
                )}

                {isBuying
                  ? "Opening Checkout..."
                  : "Buy Artwork"}
              </button>
            )}
          </div>
        </div>

        {/* REVIEWS */}
        <section className="mt-16 border-t border-white/10 pt-12">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#F97316]">
                Collector Reviews
              </p>

              <h2 className="mt-3 text-3xl font-bold">
                What collectors say
              </h2>

              <p className="mt-3 text-sm text-slate-400">
                Reviews can only be submitted by verified
                buyers.
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0b1625] px-5 py-4">
              <div className="flex items-center gap-2">
                <Star
                  size={20}
                  fill="currentColor"
                  className="text-yellow-400"
                />

                <span className="text-xl font-bold">
                  {comments.length
                    ? averageRating.toFixed(
                        1
                      )
                    : "0.0"}
                </span>

                <span className="text-sm text-slate-500">
                  ({comments.length})
                </span>
              </div>
            </div>
          </div>

          {session?.user?.role ===
            "user" &&
            hasPurchased &&
            !ownComment && (
              <form
                onSubmit={
                  handleSubmitReview
                }
                className="mt-8 rounded-3xl border border-white/10 bg-[#0b1625] p-5 sm:p-7"
              >
                <h3 className="text-xl font-bold">
                  Write a review
                </h3>

                <p className="mt-2 text-sm text-emerald-300">
                  ✓ Verified purchase
                </p>

                <div className="mt-5">
                  <p className="mb-2 text-sm text-slate-300">
                    Rating
                  </p>

                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map(
                      (value) => (
                        <button
                          key={value}
                          type="button"
                          onClick={() =>
                            setRating(
                              value
                            )
                          }
                          className="transition hover:scale-110"
                        >
                          <Star
                            size={25}
                            fill={
                              value <=
                              rating
                                ? "currentColor"
                                : "none"
                            }
                            className={
                              value <=
                              rating
                                ? "text-yellow-400"
                                : "text-slate-600"
                            }
                          />
                        </button>
                      )
                    )}
                  </div>
                </div>

                <textarea
                  value={commentText}
                  onChange={(event) =>
                    setCommentText(
                      event.target.value
                    )
                  }
                  rows={5}
                  maxLength={600}
                  placeholder="Share your experience with this artwork..."
                  className="mt-5 w-full resize-none rounded-xl border border-white/10 bg-[#081321] px-4 py-3.5 text-sm leading-6 outline-none placeholder:text-slate-500 focus:border-[#F97316]/50"
                />

                <div className="mt-4 flex items-center justify-between gap-3">
                  <p className="text-xs text-slate-500">
                    {commentText.length}/600
                  </p>

                  <button
                    type="submit"
                    disabled={
                      isReviewSubmitting
                    }
                    className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-5 py-3 text-sm font-semibold disabled:opacity-60"
                  >
                    {isReviewSubmitting ? (
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                    ) : (
                      <Send size={16} />
                    )}

                    Submit Review
                  </button>
                </div>
              </form>
            )}

          {session?.user?.role ===
            "user" &&
            !hasPurchased && (
              <div className="mt-8 rounded-2xl border border-white/10 bg-white/[0.025] px-5 py-4 text-sm text-slate-400">
                Purchase this artwork to leave a verified
                review.
              </div>
            )}

          <div className="mt-8 space-y-4">
            {comments.length === 0 ? (
              <div className="rounded-3xl border border-dashed border-white/10 px-6 py-14 text-center">
                <Star
                  size={28}
                  className="mx-auto text-slate-600"
                />

                <h3 className="mt-4 font-bold">
                  No reviews yet
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  The first verified collector review will
                  appear here.
                </p>
              </div>
            ) : (
              comments.map(
                (comment) => {
                  const isOwner =
                    session?.user?.email
                      ?.trim()
                      .toLowerCase() ===
                    comment.userEmail;

                  const isEditing =
                    editingCommentId ===
                    comment._id;

                  const reviewDate =
                    comment.createdAt
                      ? new Date(
                          comment.createdAt
                        ).toLocaleDateString(
                          "en-US",
                          {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          }
                        )
                      : "";

                  return (
                    <article
                      key={
                        comment._id
                      }
                      className="rounded-2xl border border-white/10 bg-[#0d1928] p-5 sm:p-6"
                    >
                      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-bold">
                              {
                                comment.userName
                              }
                            </h3>

                            {comment.verifiedBuyer && (
                              <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-emerald-300">
                                Verified Buyer
                              </span>
                            )}
                          </div>

                          <p className="mt-1 text-xs text-slate-500">
                            {reviewDate}
                          </p>
                        </div>

                        <div className="flex items-center gap-1">
                          {[1, 2, 3, 4, 5].map(
                            (value) => (
                              <Star
                                key={
                                  value
                                }
                                size={
                                  15
                                }
                                fill={
                                  value <=
                                  comment.rating
                                    ? "currentColor"
                                    : "none"
                                }
                                className={
                                  value <=
                                  comment.rating
                                    ? "text-yellow-400"
                                    : "text-slate-600"
                                }
                              />
                            )
                          )}
                        </div>
                      </div>

                      {isEditing ? (
                        <div className="mt-5">
                          <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map(
                              (value) => (
                                <button
                                  key={
                                    value
                                  }
                                  type="button"
                                  onClick={() =>
                                    setEditRating(
                                      value
                                    )
                                  }
                                >
                                  <Star
                                    size={
                                      21
                                    }
                                    fill={
                                      value <=
                                      editRating
                                        ? "currentColor"
                                        : "none"
                                    }
                                    className={
                                      value <=
                                      editRating
                                        ? "text-yellow-400"
                                        : "text-slate-600"
                                    }
                                  />
                                </button>
                              )
                            )}
                          </div>

                          <textarea
                            value={
                              editText
                            }
                            onChange={(
                              event
                            ) =>
                              setEditText(
                                event
                                  .target
                                  .value
                              )
                            }
                            rows={4}
                            className="mt-4 w-full rounded-xl border border-white/10 bg-[#081321] px-4 py-3 text-sm outline-none"
                          />

                          <div className="mt-4 flex gap-3">
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateReview(
                                  comment._id
                                )
                              }
                              className="rounded-xl bg-[#F97316] px-4 py-2 text-sm font-semibold"
                            >
                              Save Changes
                            </button>

                            <button
                              type="button"
                              onClick={
                                cancelEditing
                              }
                              className="flex items-center gap-2 rounded-xl border border-white/10 px-4 py-2 text-sm"
                            >
                              <X size={15} />
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : (
                        <>
                          <p className="mt-5 text-sm leading-7 text-slate-300">
                            {
                              comment.comment
                            }
                          </p>

                          {isOwner && (
                            <div className="mt-5 flex gap-3 border-t border-white/10 pt-4">
                              <button
                                type="button"
                                onClick={() =>
                                  startEditing(
                                    comment
                                  )
                                }
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-slate-300 transition hover:bg-white/[0.05]"
                              >
                                <Pencil
                                  size={14}
                                />
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteReview(
                                    comment._id
                                  )
                                }
                                disabled={
                                  deletingCommentId ===
                                  comment._id
                                }
                                className="flex items-center gap-2 rounded-lg px-3 py-2 text-xs text-red-300 transition hover:bg-red-500/10 disabled:opacity-50"
                              >
                                {deletingCommentId ===
                                comment._id ? (
                                  <Loader2
                                    size={14}
                                    className="animate-spin"
                                  />
                                ) : (
                                  <Trash2
                                    size={14}
                                  />
                                )}

                                Delete
                              </button>
                            </div>
                          )}
                        </>
                      )}
                    </article>
                  );
                }
              )
            )}
          </div>
        </section>
      </div>
    </main>
  );
}