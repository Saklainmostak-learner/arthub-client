"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  AlertTriangle,
  ArrowLeft,
  DollarSign,
  Loader2,
  Palette,
  ReceiptText,
  ShieldCheck,
  Trash2,
  Users,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [activeTab, setActiveTab] = useState("users");

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [artworks, setArtworks] = useState([]);
  const [transactions, setTransactions] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [actionId, setActionId] =
    useState("");

  const [
    confirmation,
    setConfirmation,
  ] = useState(null);

  const loadAdminData = async () => {
    try {
      setIsLoading(true);

      const { data } =
        await authClient.getSession();

      if (!data?.user) {
        router.push("/login");
        return;
      }

      if (
        data.user.role !== "admin"
      ) {
        router.push("/dashboard");
        return;
      }

      setSession(data);

      const [
        statsResponse,
        usersResponse,
        artworksResponse,
        transactionsResponse,
      ] = await Promise.all([
        fetch(
          `${API_URL}/admin/stats`,
          {
            credentials:
              "include",
            cache: "no-store",
          }
        ),

        fetch(
          `${API_URL}/admin/users`,
          {
            credentials:
              "include",
            cache: "no-store",
          }
        ),

        fetch(
          `${API_URL}/admin/artworks`,
          {
            credentials:
              "include",
            cache: "no-store",
          }
        ),

        fetch(
          `${API_URL}/admin/transactions`,
          {
            credentials:
              "include",
            cache: "no-store",
          }
        ),
      ]);

      const [
        statsResult,
        usersResult,
        artworksResult,
        transactionsResult,
      ] = await Promise.all([
        statsResponse.json(),
        usersResponse.json(),
        artworksResponse.json(),
        transactionsResponse.json(),
      ]);

      if (!statsResponse.ok) {
        throw new Error(
          statsResult.message ||
            "Failed to load platform statistics."
        );
      }

      if (!usersResponse.ok) {
        throw new Error(
          usersResult.message ||
            "Failed to load users."
        );
      }

      if (!artworksResponse.ok) {
        throw new Error(
          artworksResult.message ||
            "Failed to load artworks."
        );
      }

      if (
        !transactionsResponse.ok
      ) {
        throw new Error(
          transactionsResult.message ||
            "Failed to load transactions."
        );
      }

      setStats(
        statsResult.data || null
      );

      setUsers(
        usersResult.data || []
      );

      setArtworks(
        artworksResult.data || []
      );

      setTransactions(
        transactionsResult.data ||
          []
      );
    } catch (error) {
      console.error(
        "Admin load error:",
        error
      );

      toast.error(
        error.message ||
          "Unable to load admin dashboard."
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [router]);

  const isCurrentAdmin = (
    user
  ) => {
    if (
      !session?.user ||
      !user
    ) {
      return false;
    }

    const sessionId =
      String(
        session.user.id || ""
      );

    const databaseId =
      String(
        user._id || ""
      );

    const sessionEmail =
      session.user.email
        ?.trim()
        .toLowerCase();

    const databaseEmail =
      user.email
        ?.trim()
        .toLowerCase();

    return (
      (sessionId &&
        databaseId &&
        sessionId ===
          databaseId) ||
      (sessionEmail &&
        databaseEmail &&
        sessionEmail ===
          databaseEmail)
    );
  };

  const refreshStats =
    async () => {
      try {
        const response =
          await fetch(
            `${API_URL}/admin/stats`,
            {
              credentials:
                "include",
              cache:
                "no-store",
            }
          );

        const result =
          await response.json();

        if (response.ok) {
          setStats(
            result.data || null
          );
        }
      } catch (error) {
        console.error(
          "Refresh stats error:",
          error
        );
      }
    };

  const handleRoleChange =
    async (user, role) => {
      if (
        isCurrentAdmin(user)
      ) {
        toast.error(
          "Your admin account is protected."
        );

        return;
      }

      try {
        setActionId(
          user._id
        );

        const response =
          await fetch(
            `${API_URL}/admin/users/${user._id}/role`,
            {
              method: "PATCH",

              credentials:
                "include",

              headers: {
                "Content-Type":
                  "application/json",
              },

              body:
                JSON.stringify({
                  role,
                }),
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to update user role."
          );
        }

        setUsers(
          (previous) =>
            previous.map(
              (item) =>
                item._id ===
                user._id
                  ? {
                      ...item,
                      role,
                    }
                  : item
            )
        );

        await refreshStats();

        toast.success(
          "User role updated."
        );
      } catch (error) {
        toast.error(
          error.message ||
            "Unable to update role."
        );
      } finally {
        setActionId("");
      }
    };

  const requestDeleteUser = (
    user
  ) => {
    if (
      isCurrentAdmin(user)
    ) {
      toast.error(
        "Your admin account is protected."
      );

      return;
    }

    setConfirmation({
      type: "user",

      id: user._id,

      title:
        "Delete this user?",

      description:
        `You are about to permanently delete ${
          user.name ||
          user.email
        }. This action cannot be undone.`,

      item: user,
    });
  };

  const requestDeleteArtwork = (
    artwork
  ) => {
    setConfirmation({
      type: "artwork",

      id: artwork._id,

      title:
        "Delete this artwork?",

      description:
        `You are about to permanently delete "${artwork.title}". This action cannot be undone.`,

      item: artwork,
    });
  };

  const cancelConfirmation =
    () => {
      if (actionId) {
        return;
      }

      setConfirmation(null);
    };

  const confirmDeleteUser =
    async (user) => {
      try {
        setActionId(
          user._id
        );

        const response =
          await fetch(
            `${API_URL}/admin/users/${user._id}`,
            {
              method: "DELETE",

              credentials:
                "include",
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to delete user."
          );
        }

        setUsers(
          (previous) =>
            previous.filter(
              (item) =>
                item._id !==
                user._id
            )
        );

        await refreshStats();

        toast.success(
          "User deleted."
        );

        setConfirmation(
          null
        );
      } catch (error) {
        toast.error(
          error.message ||
            "Unable to delete user."
        );
      } finally {
        setActionId("");
      }
    };

  const confirmDeleteArtwork =
    async (artwork) => {
      try {
        setActionId(
          artwork._id
        );

        const response =
          await fetch(
            `${API_URL}/admin/artworks/${artwork._id}`,
            {
              method: "DELETE",

              credentials:
                "include",
            }
          );

        const result =
          await response.json();

        if (!response.ok) {
          throw new Error(
            result.message ||
              "Unable to delete artwork."
          );
        }

        setArtworks(
          (previous) =>
            previous.filter(
              (item) =>
                item._id !==
                artwork._id
            )
        );

        await refreshStats();

        toast.success(
          "Artwork deleted."
        );

        setConfirmation(
          null
        );
      } catch (error) {
        toast.error(
          error.message ||
            "Unable to delete artwork."
        );
      } finally {
        setActionId("");
      }
    };

  const handleConfirmedAction =
    async () => {
      if (!confirmation) {
        return;
      }

      if (
        confirmation.type ===
        "user"
      ) {
        await confirmDeleteUser(
          confirmation.item
        );

        return;
      }

      if (
        confirmation.type ===
        "artwork"
      ) {
        await confirmDeleteArtwork(
          confirmation.item
        );
      }
    };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] px-4 text-white">
        <div className="flex items-center gap-3 text-sm text-slate-400">
          <Loader2
            size={20}
            className="animate-spin text-[#F97316]"
          />

          Loading admin
          dashboard...
        </div>
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
            className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white"
          >
            <ArrowLeft
              size={17}
            />

            Back to Dashboard
          </Link>

          <div className="mt-8">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#F97316]">
                Administration
              </p>

              <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-emerald-300">
                <ShieldCheck
                  size={13}
                />

                Secure Admin
                Area
              </span>
            </div>

            <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
              Admin Dashboard
            </h1>

            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
              Manage ArtHub
              users, roles,
              artworks,
              transactions, and
              platform activity
              from one protected
              workspace.
            </p>
          </div>

          <div className="mt-8 rounded-2xl border border-[#F97316]/20 bg-[#F97316]/[0.05] p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#F97316]/10 text-[#F97316]">
                <ShieldCheck
                  size={20}
                />
              </div>

              <div>
                <p className="font-semibold text-white">
                  Signed in as
                  Administrator
                </p>

                <p className="mt-1 text-sm text-slate-400">
                  {
                    session.user
                      .name
                  }{" "}
                  ·{" "}
                  {
                    session.user
                      .email
                  }
                </p>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Your current admin
                  account is protected
                  from accidental role
                  changes and deletion.
                </p>
              </div>
            </div>
          </div>

          {stats && (
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <StatCard
                icon={Users}
                label="Total Users"
                value={
                  stats.totalUsers
                }
              />

              <StatCard
                icon={Palette}
                label="Total Artworks"
                value={
                  stats.totalArtworks
                }
              />

              <StatCard
                icon={
                  ReceiptText
                }
                label="Transactions"
                value={
                  stats.totalTransactions
                }
              />

              <StatCard
                icon={
                  DollarSign
                }
                label="Revenue"
                value={`$${Number(
                  stats.totalRevenue ||
                    0
                ).toFixed(2)}`}
              />
            </div>
          )}

          {stats && (
            <div className="mt-5 flex flex-wrap gap-3 text-xs">
              <StatusBadge>
                Collectors:{" "}
                {
                  stats.totalCollectors
                }
              </StatusBadge>

              <StatusBadge>
                Artists:{" "}
                {
                  stats.totalArtists
                }
              </StatusBadge>

              <StatusBadge>
                Admins:{" "}
                {
                  stats.totalAdmins
                }
              </StatusBadge>

              <StatusBadge>
                Sold Artworks:{" "}
                {
                  stats.soldArtworks
                }
              </StatusBadge>
            </div>
          )}

          <div className="mt-10 flex flex-wrap gap-3">
            {[
              {
                id: "users",
                label: `Users (${users.length})`,
              },

              {
                id: "artworks",
                label: `Artworks (${artworks.length})`,
              },

              {
                id: "transactions",
                label: `Transactions (${transactions.length})`,
              },
            ].map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() =>
                  setActiveTab(
                    tab.id
                  )
                }
                className={`rounded-xl px-5 py-3 text-sm font-semibold transition ${
                  activeTab ===
                  tab.id
                    ? "bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] text-white shadow-lg"
                    : "border border-white/10 bg-white/[0.03] text-slate-300 hover:bg-white/[0.06]"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab ===
            "users" && (
            <section className="mt-6 space-y-4">
              {users.length ===
              0 ? (
                <EmptyState
                  title="No users found"
                  description="Registered users will appear here."
                />
              ) : (
                users.map(
                  (user) => {
                    const currentAdmin =
                      isCurrentAdmin(
                        user
                      );

                    const busy =
                      actionId ===
                      user._id;

                    return (
                      <article
                        key={
                          user._id
                        }
                        className={`rounded-2xl border p-5 transition ${
                          currentAdmin
                            ? "border-[#F97316]/25 bg-[#F97316]/[0.04]"
                            : "border-white/10 bg-[#0d1928]"
                        }`}
                      >
                        <div className="grid gap-5 lg:grid-cols-[1.5fr_1fr_auto] lg:items-center">
                          <div>
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="font-bold">
                                {user.name ||
                                  "Unnamed User"}
                              </p>

                              {currentAdmin && (
                                <span className="inline-flex items-center gap-1 rounded-full border border-[#F97316]/20 bg-[#F97316]/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-[#F97316]">
                                  <ShieldCheck
                                    size={
                                      12
                                    }
                                  />

                                  Protected
                                  Admin
                                </span>
                              )}
                            </div>

                            <p className="mt-1 text-sm text-slate-400">
                              {
                                user.email
                              }
                            </p>

                            <p className="mt-2 text-xs capitalize text-slate-500">
                              Current
                              role:{" "}
                              <span className="font-semibold text-slate-300">
                                {user.role ===
                                "user"
                                  ? "Collector"
                                  : user.role ||
                                    "Collector"}
                              </span>
                            </p>
                          </div>

                          {currentAdmin ? (
                            <div className="flex items-center gap-2 rounded-xl border border-[#F97316]/20 bg-[#081321] px-4 py-3 text-sm text-[#F97316]">
                              <ShieldCheck
                                size={
                                  16
                                }
                              />

                              Administrator
                            </div>
                          ) : (
                            <select
                              value={
                                user.role ||
                                "user"
                              }
                              disabled={
                                busy
                              }
                              onChange={(
                                event
                              ) =>
                                handleRoleChange(
                                  user,
                                  event
                                    .target
                                    .value
                                )
                              }
                              className="rounded-xl border border-white/10 bg-[#081321] px-4 py-3 text-sm text-white outline-none transition focus:border-[#F97316]/50 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              <option value="user">
                                Collector
                              </option>

                              <option value="artist">
                                Artist
                              </option>

                              <option value="admin">
                                Admin
                              </option>
                            </select>
                          )}

                          {currentAdmin ? (
                            <button
                              type="button"
                              disabled
                              className="flex items-center justify-center gap-2 rounded-xl border border-emerald-400/15 bg-emerald-500/[0.05] px-4 py-3 text-sm font-medium text-emerald-300"
                            >
                              <ShieldCheck
                                size={
                                  16
                                }
                              />

                              Protected
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                requestDeleteUser(
                                  user
                                )
                              }
                              disabled={
                                busy
                              }
                              className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 px-4 py-3 text-sm text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {busy ? (
                                <Loader2
                                  size={
                                    16
                                  }
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2
                                  size={
                                    16
                                  }
                                />
                              )}

                              {busy
                                ? "Working..."
                                : "Delete"}
                            </button>
                          )}
                        </div>
                      </article>
                    );
                  }
                )
              )}
            </section>
          )}

          {activeTab ===
            "artworks" && (
            <section className="mt-6">
              {artworks.length ===
              0 ? (
                <EmptyState
                  title="No artworks found"
                  description="Published artworks will appear here."
                />
              ) : (
                <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                  {artworks.map(
                    (
                      artwork
                    ) => {
                      const busy =
                        actionId ===
                        artwork._id;

                      return (
                        <article
                          key={
                            artwork._id
                          }
                          className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1928]"
                        >
                          <div className="relative aspect-[4/5] overflow-hidden bg-[#081321]">
                            <Image
                              src={
                                artwork.image
                              }
                              alt={
                                artwork.title ||
                                "Artwork"
                              }
                              fill
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                              className="object-cover"
                            />

                            {artwork.sold ===
                              true && (
                              <span className="absolute bottom-3 left-3 rounded-full bg-emerald-500 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-white">
                                Sold
                              </span>
                            )}
                          </div>

                          <div className="p-4">
                            <p className="truncate font-bold">
                              {
                                artwork.title
                              }
                            </p>

                            <p className="mt-1 truncate text-sm text-slate-400">
                              by{" "}
                              {
                                artwork.artistName
                              }
                            </p>

                            <div className="mt-4 flex items-center justify-between gap-3">
                              <p className="font-bold text-[#F97316]">
                                $
                                {Number(
                                  artwork.price ||
                                    0
                                ).toFixed(
                                  2
                                )}
                              </p>

                              <span className="rounded-full border border-white/10 px-2.5 py-1 text-[10px] text-slate-400">
                                {artwork.category ||
                                  "Artwork"}
                              </span>
                            </div>

                            <Link
                              href={`/artworks/${artwork._id}`}
                              className="mt-5 flex w-full items-center justify-center rounded-xl border border-white/10 px-4 py-3 text-sm font-semibold text-white transition hover:bg-white/[0.05]"
                            >
                              View
                              Artwork
                            </Link>

                            <button
                              type="button"
                              onClick={() =>
                                requestDeleteArtwork(
                                  artwork
                                )
                              }
                              disabled={
                                busy
                              }
                              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 px-4 py-3 text-sm text-red-300 transition hover:bg-red-500/10 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              {busy ? (
                                <Loader2
                                  size={
                                    16
                                  }
                                  className="animate-spin"
                                />
                              ) : (
                                <Trash2
                                  size={
                                    16
                                  }
                                />
                              )}

                              {busy
                                ? "Deleting..."
                                : "Delete Artwork"}
                            </button>
                          </div>
                        </article>
                      );
                    }
                  )}
                </div>
              )}
            </section>
          )}

          {activeTab ===
            "transactions" && (
            <section className="mt-6">
              {transactions.length ===
              0 ? (
                <EmptyState
                  title="No transactions found"
                  description="Completed marketplace transactions will appear here."
                />
              ) : (
                <div className="space-y-4">
                  {transactions.map(
                    (
                      transaction
                    ) => {
                      const date =
                        transaction.purchasedAt
                          ? new Date(
                              transaction.purchasedAt
                            ).toLocaleDateString(
                              "en-US",
                              {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              }
                            )
                          : "Unknown";

                      return (
                        <article
                          key={
                            transaction._id
                          }
                          className="grid gap-5 rounded-2xl border border-white/10 bg-[#0d1928] p-5 sm:p-6 lg:grid-cols-5 lg:items-center"
                        >
                          <TransactionColumn
                            label="Artwork"
                            value={
                              transaction.artworkTitle ||
                              "Untitled Artwork"
                            }
                          />

                          <TransactionColumn
                            label="Artist"
                            value={
                              transaction.artistName ||
                              "Unknown Artist"
                            }
                            subvalue={
                              transaction.artistEmail
                            }
                          />

                          <TransactionColumn
                            label="Buyer"
                            value={
                              transaction.buyerName ||
                              "Collector"
                            }
                            subvalue={
                              transaction.buyerEmail
                            }
                          />

                          <TransactionColumn
                            label="Amount"
                            value={`$${Number(
                              transaction.amount ||
                                0
                            ).toFixed(
                              2
                            )}`}
                            highlight
                          />

                          <TransactionColumn
                            label="Date"
                            value={
                              date
                            }
                          />
                        </article>
                      );
                    }
                  )}
                </div>
              )}
            </section>
          )}
        </div>
      </main>

      {confirmation && (
        <ConfirmationModal
          confirmation={
            confirmation
          }
          isWorking={
            actionId ===
            confirmation.id
          }
          onCancel={
            cancelConfirmation
          }
          onConfirm={
            handleConfirmedAction
          }
        />
      )}
    </>
  );
}

function ConfirmationModal({
  confirmation,
  isWorking,
  onCancel,
  onConfirm,
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 px-4 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-[2rem] border border-white/10 bg-[#0b1625] p-6 shadow-[0_30px_100px_rgba(0,0,0,0.6)] sm:p-7">
        <div className="flex items-start justify-between gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 text-red-300">
            <AlertTriangle
              size={22}
            />
          </div>

          <button
            type="button"
            onClick={onCancel}
            disabled={isWorking}
            aria-label="Close confirmation"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-slate-400 transition hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            <X size={18} />
          </button>
        </div>

        <h2 className="mt-6 text-2xl font-bold text-white">
          {
            confirmation.title
          }
        </h2>

        <p className="mt-3 text-sm leading-7 text-slate-400">
          {
            confirmation.description
          }
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={isWorking}
            className="rounded-xl border border-white/10 px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-white/[0.05] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isWorking}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-red-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isWorking ? (
              <>
                <Loader2
                  size={16}
                  className="animate-spin"
                />

                Deleting...
              </>
            ) : (
              <>
                <Trash2
                  size={16}
                />

                Confirm Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1928] p-5 transition hover:border-[#F97316]/20">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F97316]/10 text-[#F97316]">
        <Icon size={20} />
      </div>

      <p className="mt-5 text-sm text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-3xl font-bold text-white">
        {value}
      </p>
    </div>
  );
}

function StatusBadge({
  children,
}) {
  return (
    <span className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-2 text-slate-300">
      {children}
    </span>
  );
}

function EmptyState({
  title,
  description,
}) {
  return (
    <div className="rounded-3xl border border-dashed border-white/10 bg-white/[0.02] px-6 py-16 text-center">
      <ShieldCheck
        size={28}
        className="mx-auto text-slate-600"
      />

      <h2 className="mt-4 text-lg font-bold text-white">
        {title}
      </h2>

      <p className="mt-2 text-sm text-slate-500">
        {description}
      </p>
    </div>
  );
}

function TransactionColumn({
  label,
  value,
  subvalue,
  highlight = false,
}) {
  return (
    <div className="min-w-0">
      <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        {label}
      </p>

      <p
        className={`mt-1 truncate text-sm font-semibold ${
          highlight
            ? "text-emerald-300"
            : "text-white"
        }`}
      >
        {value}
      </p>

      {subvalue && (
        <p className="mt-1 truncate text-xs text-slate-500">
          {subvalue}
        </p>
      )}
    </div>
  );
}