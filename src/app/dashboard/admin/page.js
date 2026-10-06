"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  ArrowLeft,
  DollarSign,
  ImageIcon,
  Loader2,
  Palette,
  ReceiptText,
  ShieldCheck,
  Trash2,
  Users,
} from "lucide-react";

import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [session, setSession] =
    useState(null);

  const [activeTab, setActiveTab] =
    useState("users");

  const [stats, setStats] =
    useState(null);

  const [users, setUsers] =
    useState([]);

  const [artworks, setArtworks] =
    useState([]);

  const [transactions, setTransactions] =
    useState([]);

  const [isLoading, setIsLoading] =
    useState(true);

  const [actionId, setActionId] =
    useState("");

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
        data.user.role !==
        "admin"
      ) {
        router.push(
          "/dashboard"
        );
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
            credentials: "include",
            cache: "no-store",
          }
        ),

        fetch(
          `${API_URL}/admin/users`,
          {
            credentials: "include",
            cache: "no-store",
          }
        ),

        fetch(
          `${API_URL}/admin/artworks`,
          {
            credentials: "include",
            cache: "no-store",
          }
        ),

        fetch(
          `${API_URL}/admin/transactions`,
          {
            credentials: "include",
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
          statsResult.message
        );
      }

      if (!usersResponse.ok) {
        throw new Error(
          usersResult.message
        );
      }

      if (!artworksResponse.ok) {
        throw new Error(
          artworksResult.message
        );
      }

      if (!transactionsResponse.ok) {
        throw new Error(
          transactionsResult.message
        );
      }

      setStats(
        statsResult.data
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

  const handleRoleChange = async (
    userId,
    role
  ) => {
    try {
      setActionId(
        userId
      );

      const response = await fetch(
        `${API_URL}/admin/users/${userId}/role`,
        {
          method: "PATCH",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            role,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message
        );
      }

      setUsers((previous) =>
        previous.map((user) =>
          user._id === userId
            ? {
                ...user,
                role,
              }
            : user
        )
      );

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

  const handleDeleteUser = async (
    userId
  ) => {
    try {
      setActionId(
        userId
      );

      const response = await fetch(
        `${API_URL}/admin/users/${userId}`,
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
          result.message
        );
      }

      setUsers((previous) =>
        previous.filter(
          (user) =>
            user._id !== userId
        )
      );

      toast.success(
        "User deleted."
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

  const handleDeleteArtwork = async (
    artworkId
  ) => {
    try {
      setActionId(
        artworkId
      );

      const response = await fetch(
        `${API_URL}/admin/artworks/${artworkId}`,
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
          result.message
        );
      }

      setArtworks((previous) =>
        previous.filter(
          (artwork) =>
            artwork._id !==
            artworkId
        )
      );

      toast.success(
        "Artwork deleted."
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

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f] text-white">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2
            className="animate-spin text-[#F97316]"
          />

          Loading admin dashboard...
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
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft size={17} />
          Back to Dashboard
        </Link>

        <div className="mt-8">
          <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#F97316]">
            Administration
          </p>

          <h1 className="mt-3 text-4xl font-bold sm:text-5xl">
            Admin Dashboard
          </h1>

          <p className="mt-4 text-slate-400">
            Manage users, artworks,
            transactions, and platform activity.
          </p>
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
              icon={ReceiptText}
              label="Transactions"
              value={
                stats.totalTransactions
              }
            />

            <StatCard
              icon={DollarSign}
              label="Revenue"
              value={`$${Number(
                stats.totalRevenue
              ).toFixed(2)}`}
            />
          </div>
        )}

        {stats && (
          <div className="mt-5 flex flex-wrap gap-3 text-xs">
            <span className="rounded-full bg-white/[0.05] px-3 py-2 text-slate-300">
              Collectors:{" "}
              {stats.totalCollectors}
            </span>

            <span className="rounded-full bg-white/[0.05] px-3 py-2 text-slate-300">
              Artists:{" "}
              {stats.totalArtists}
            </span>

            <span className="rounded-full bg-white/[0.05] px-3 py-2 text-slate-300">
              Admins:{" "}
              {stats.totalAdmins}
            </span>

            <span className="rounded-full bg-white/[0.05] px-3 py-2 text-slate-300">
              Sold Artworks:{" "}
              {stats.soldArtworks}
            </span>
          </div>
        )}

        <div className="mt-10 flex flex-wrap gap-3">
          {[
            "users",
            "artworks",
            "transactions",
          ].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() =>
                setActiveTab(tab)
              }
              className={`rounded-xl px-5 py-3 text-sm font-semibold capitalize transition ${
                activeTab === tab
                  ? "bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316]"
                  : "border border-white/10 bg-white/[0.03] text-slate-300"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {activeTab === "users" && (
          <section className="mt-6 space-y-4">
            {users.map((user) => (
              <article
                key={user._id}
                className="grid gap-5 rounded-2xl border border-white/10 bg-[#0d1928] p-5 lg:grid-cols-[1.5fr_1fr_auto] lg:items-center"
              >
                <div>
                  <p className="font-bold">
                    {user.name ||
                      "Unnamed User"}
                  </p>

                  <p className="mt-1 text-sm text-slate-400">
                    {user.email}
                  </p>
                </div>

                <select
                  value={
                    user.role ||
                    "user"
                  }
                  disabled={
                    actionId ===
                    user._id
                  }
                  onChange={(
                    event
                  ) =>
                    handleRoleChange(
                      user._id,
                      event.target
                        .value
                    )
                  }
                  className="rounded-xl border border-white/10 bg-[#081321] px-4 py-3 text-sm outline-none"
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

                <button
                  type="button"
                  onClick={() =>
                    handleDeleteUser(
                      user._id
                    )
                  }
                  disabled={
                    actionId ===
                    user._id
                  }
                  className="flex items-center justify-center gap-2 rounded-xl border border-red-500/20 px-4 py-3 text-sm text-red-300"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </article>
            ))}
          </section>
        )}

        {activeTab ===
          "artworks" && (
          <section className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {artworks.map(
              (artwork) => (
                <article
                  key={
                    artwork._id
                  }
                  className="overflow-hidden rounded-2xl border border-white/10 bg-[#0d1928]"
                >
                  <div className="relative aspect-[4/5] bg-[#081321]">
                    <Image
                      src={
                        artwork.image
                      }
                      alt={
                        artwork.title
                      }
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="p-4">
                    <p className="font-bold">
                      {
                        artwork.title
                      }
                    </p>

                    <p className="mt-1 text-sm text-slate-400">
                      by{" "}
                      {
                        artwork.artistName
                      }
                    </p>

                    <p className="mt-3 font-bold text-[#F97316]">
                      $
                      {Number(
                        artwork.price
                      ).toFixed(2)}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteArtwork(
                          artwork._id
                        )
                      }
                      disabled={
                        actionId ===
                        artwork._id
                      }
                      className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/20 px-4 py-3 text-sm text-red-300"
                    >
                      <Trash2
                        size={16}
                      />
                      Delete Artwork
                    </button>
                  </div>
                </article>
              )
            )}
          </section>
        )}

        {activeTab ===
          "transactions" && (
          <section className="mt-6 space-y-4">
            {transactions.map(
              (transaction) => (
                <article
                  key={
                    transaction._id
                  }
                  className="grid gap-5 rounded-2xl border border-white/10 bg-[#0d1928] p-5 lg:grid-cols-4"
                >
                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Artwork
                    </p>

                    <p className="mt-1 font-bold">
                      {
                        transaction.artworkTitle
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Artist
                    </p>

                    <p className="mt-1 text-sm">
                      {
                        transaction.artistName
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Buyer
                    </p>

                    <p className="mt-1 text-sm">
                      {
                        transaction.buyerEmail
                      }
                    </p>
                  </div>

                  <div>
                    <p className="text-xs uppercase tracking-wider text-slate-500">
                      Amount
                    </p>

                    <p className="mt-1 font-bold text-emerald-300">
                      $
                      {Number(
                        transaction.amount
                      ).toFixed(2)}
                    </p>
                  </div>
                </article>
              )
            )}
          </section>
        )}
      </div>
    </main>
  );
}

function StatCard({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#0d1928] p-5">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F97316]/10 text-[#F97316]">
        <Icon size={20} />
      </div>

      <p className="mt-5 text-sm text-slate-400">
        {label}
      </p>

      <p className="mt-1 text-3xl font-bold">
        {value}
      </p>
    </div>
  );
}