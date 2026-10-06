"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  DollarSign,
  Loader2,
  ShoppingBag,
  TrendingUp,
  User,
} from "lucide-react";

import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";

export default function SalesHistoryPage() {
  const router = useRouter();

  const [session, setSession] =
    useState(null);

  const [sales, setSales] =
    useState([]);

  const [totalRevenue, setTotalRevenue] =
    useState(0);

  const [isLoading, setIsLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    const loadSales = async () => {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const { data } =
          await authClient.getSession();

        if (!data?.user) {
          router.push("/login");
          return;
        }

        if (
          data.user.role !==
          "artist"
        ) {
          router.push(
            "/dashboard"
          );

          return;
        }

        setSession(data);

        const response = await fetch(
          `${API_URL}/purchases/artist/${encodeURIComponent(
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
            result.message ||
              "Failed to load sales."
          );
        }

        setSales(
          result.data || []
        );

        setTotalRevenue(
          Number(
            result.totalRevenue || 0
          )
        );
      } catch (error) {
        console.error(
          "Load sales error:",
          error
        );

        setErrorMessage(
          error.message ||
            "Unable to load sales history."
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSales();
  }, [router]);

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f]">
        <div className="flex items-center gap-3 text-slate-400">
          <Loader2
            size={20}
            className="animate-spin text-[#F97316]"
          />

          Loading sales history...
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
            Artist Studio
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Sales History
          </h1>

          <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
            Track sold artworks, revenue,
            buyers, and purchase dates.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          <div className="rounded-2xl border border-white/10 bg-[#0d1928] p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F97316]/10 text-[#F97316]">
              <ShoppingBag
                size={20}
              />
            </div>

            <p className="mt-5 text-sm text-slate-400">
              Total Sales
            </p>

            <p className="mt-1 text-3xl font-bold">
              {sales.length}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0d1928] p-5">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/10 text-emerald-400">
              <DollarSign
                size={20}
              />
            </div>

            <p className="mt-5 text-sm text-slate-400">
              Total Revenue
            </p>

            <p className="mt-1 text-3xl font-bold text-emerald-300">
              $
              {totalRevenue.toFixed(
                2
              )}
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0d1928] p-5 sm:col-span-2 lg:col-span-1">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-500/10 text-purple-300">
              <TrendingUp
                size={20}
              />
            </div>

            <p className="mt-5 text-sm text-slate-400">
              Average Sale
            </p>

            <p className="mt-1 text-3xl font-bold">
              $
              {sales.length
                ? (
                    totalRevenue /
                    sales.length
                  ).toFixed(2)
                : "0.00"}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="mt-8 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {errorMessage}
          </div>
        )}

        {!errorMessage &&
          sales.length === 0 && (
            <div className="mt-10 rounded-3xl border border-dashed border-white/10 bg-white/[0.025] px-6 py-16 text-center">
              <ShoppingBag
                size={28}
                className="mx-auto text-[#F97316]"
              />

              <h2 className="mt-5 text-xl font-bold">
                No sales yet
              </h2>

              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-slate-400">
                Sold artworks will appear
                here once collectors purchase
                your work.
              </p>
            </div>
          )}

        {!errorMessage &&
          sales.length > 0 && (
            <div className="mt-10 overflow-hidden rounded-3xl border border-white/10 bg-[#0b1625]">
              <div className="border-b border-white/10 px-5 py-5 sm:px-6">
                <h2 className="text-xl font-bold">
                  Recent Sales
                </h2>
              </div>

              <div className="divide-y divide-white/10">
                {sales.map(
                  (sale) => {
                    const saleDate =
                      sale.purchasedAt
                        ? new Date(
                            sale.purchasedAt
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
                        key={
                          sale._id
                        }
                        className="grid gap-5 px-5 py-5 sm:px-6 lg:grid-cols-[1.4fr_1fr_0.7fr_1fr] lg:items-center"
                      >
                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                            Artwork
                          </p>

                          <p className="mt-1 font-bold text-white">
                            {
                              sale.artworkTitle
                            }
                          </p>

                          <Link
                            href={`/artworks/${sale.artworkId}`}
                            className="mt-2 inline-block text-xs font-medium text-[#F97316] transition hover:text-white"
                          >
                            View Artwork →
                          </Link>
                        </div>

                        <div>
                          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-500">
                            <User size={13} />
                            Buyer
                          </p>

                          <p className="mt-1 text-sm text-white">
                            {sale.buyerName ||
                              "Collector"}
                          </p>

                          <p className="mt-1 text-xs text-slate-500">
                            {sale.buyerEmail}
                          </p>
                        </div>

                        <div>
                          <p className="text-xs uppercase tracking-[0.16em] text-slate-500">
                            Amount
                          </p>

                          <p className="mt-1 text-lg font-bold text-emerald-300">
                            $
                            {Number(
                              sale.amount
                            ).toFixed(
                              2
                            )}
                          </p>
                        </div>

                        <div>
                          <p className="flex items-center gap-2 text-xs uppercase tracking-[0.16em] text-slate-500">
                            <CalendarDays
                              size={13}
                            />
                            Sold
                          </p>

                          <p className="mt-1 text-sm text-slate-300">
                            {saleDate}
                          </p>
                        </div>
                      </article>
                    );
                  }
                )}
              </div>
            </div>
          )}
      </div>
    </main>
  );
}