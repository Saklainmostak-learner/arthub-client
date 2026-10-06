"use client";

import {
  useEffect,
  useState,
} from "react";

import {
  Check,
  Crown,
  Loader2,
  Sparkles,
  Star,
  X,
} from "lucide-react";

import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";

const plans = [
  {
    id: "free",
    name: "Free",
    price: 0,
    icon: Star,

    description:
      "Everything you need to begin exploring ArtHub.",

    features: [
      "Browse all artworks",
      "Save favorites",
      "Purchase original artwork",
      "Basic marketplace access",
    ],
  },

  {
    id: "pro",
    name: "Pro",
    price: 9,
    icon: Sparkles,

    description:
      "For active ArtHub members who want more.",

    features: [
      "Everything in Free",
      "Pro member status",
      "Priority marketplace experience",
      "Extended collection features",
      "Early feature access",
    ],
  },

  {
    id: "premium",
    name: "Premium",
    price: 19,
    icon: Crown,

    description:
      "The complete ArtHub membership experience.",

    features: [
      "Everything in Pro",
      "Premium member status",
      "Priority support",
      "Advanced marketplace benefits",
      "Premium feature access",
    ],
  },
];

export default function PricingPage() {
  const [session, setSession] =
    useState(null);

  const [currentPlan, setCurrentPlan] =
    useState("free");

  const [isLoading, setIsLoading] =
    useState(true);

  const [checkoutPlan, setCheckoutPlan] =
    useState("");

  const [isCanceling, setIsCanceling] =
    useState(false);

  useEffect(() => {
    const loadSubscription = async () => {
      try {
        const { data } =
          await authClient.getSession();

        setSession(
          data || null
        );

        if (
          !data?.user ||
          data.user.role ===
            "admin"
        ) {
          return;
        }

        const response = await fetch(
          `${API_URL}/subscriptions/me`,
          {
            credentials: "include",
            cache: "no-store",
          }
        );

        const result =
          await response.json();

        if (response.ok) {
          setCurrentPlan(
            result.data?.plan ||
              "free"
          );
        }
      } catch (error) {
        console.error(
          "Subscription load error:",
          error
        );
      } finally {
        setIsLoading(false);
      }
    };

    loadSubscription();
  }, []);

  const handleSubscribe = async (
    plan
  ) => {
    if (!session?.user) {
      window.location.href =
        "/login";

      return;
    }

    if (
      session.user.role ===
      "admin"
    ) {
      toast.error(
        "Admin accounts do not use subscription plans."
      );

      return;
    }

    if (plan === "free") {
      return;
    }

    try {
      setCheckoutPlan(plan);

      const response = await fetch(
        `${API_URL}/subscriptions/create-checkout-session`,
        {
          method: "POST",

          credentials: "include",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            plan,
          }),
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to start subscription checkout."
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
      setCheckoutPlan("");
    }
  };

  const handleCancel = async () => {
    try {
      setIsCanceling(true);

      const response = await fetch(
        `${API_URL}/subscriptions/cancel`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const result =
        await response.json();

      if (!response.ok) {
        throw new Error(
          result.message ||
            "Unable to cancel subscription."
        );
      }

      setCurrentPlan("free");

      toast.success(
        "Subscription canceled. You are now on the Free plan."
      );
    } catch (error) {
      toast.error(
        error.message ||
          "Unable to cancel subscription."
      );
    } finally {
      setIsCanceling(false);
    }
  };

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#07111f]">
        <Loader2
          className="animate-spin text-[#F97316]"
        />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mx-auto max-w-3xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#F97316]">
            ArtHub Membership
          </p>

          <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Choose the plan that fits you.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
            Start free and upgrade whenever you want.
            Paid plans are billed monthly through Stripe.
          </p>

          {session?.user &&
            session.user.role !==
              "admin" && (
              <p className="mt-5 text-sm text-slate-300">
                Current plan:{" "}
                <span className="font-bold capitalize text-[#F97316]">
                  {currentPlan}
                </span>
              </p>
            )}
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {plans.map((plan) => {
            const Icon =
              plan.icon;

            const isCurrent =
              currentPlan ===
              plan.id;

            const isPremium =
              plan.id ===
              "premium";

            return (
              <article
                key={plan.id}
                className={`relative rounded-[2rem] border p-6 sm:p-8 ${
                  isPremium
                    ? "border-[#F97316]/50 bg-gradient-to-b from-[#F97316]/10 to-[#0d1928]"
                    : "border-white/10 bg-[#0d1928]"
                }`}
              >
                {isPremium && (
                  <span className="absolute right-5 top-5 rounded-full bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-3 py-1 text-[10px] font-bold uppercase tracking-wider">
                    Most Complete
                  </span>
                )}

                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F97316]/10 text-[#F97316]">
                  <Icon size={22} />
                </div>

                <h2 className="mt-6 text-2xl font-bold">
                  {plan.name}
                </h2>

                <p className="mt-3 min-h-12 text-sm leading-6 text-slate-400">
                  {
                    plan.description
                  }
                </p>

                <div className="mt-6 flex items-end gap-2">
                  <span className="text-4xl font-bold">
                    ${plan.price}
                  </span>

                  {plan.price >
                    0 && (
                    <span className="pb-1 text-sm text-slate-500">
                      / month
                    </span>
                  )}
                </div>

                <div className="mt-7 space-y-3">
                  {plan.features.map(
                    (feature) => (
                      <div
                        key={
                          feature
                        }
                        className="flex items-start gap-3 text-sm text-slate-300"
                      >
                        <Check
                          size={17}
                          className="mt-0.5 shrink-0 text-emerald-400"
                        />

                        {feature}
                      </div>
                    )
                  )}
                </div>

                <button
                  type="button"
                  disabled={
                    isCurrent ||
                    Boolean(
                      checkoutPlan
                    )
                  }
                  onClick={() =>
                    handleSubscribe(
                      plan.id
                    )
                  }
                  className={`mt-8 flex w-full items-center justify-center gap-2 rounded-xl px-5 py-3.5 text-sm font-semibold transition ${
                    isCurrent
                      ? "cursor-default border border-emerald-400/20 bg-emerald-500/10 text-emerald-300"
                      : plan.id ===
                          "free"
                        ? "border border-white/10 text-white"
                        : "bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] text-white hover:opacity-90"
                  } disabled:opacity-70`}
                >
                  {checkoutPlan ===
                  plan.id ? (
                    <>
                      <Loader2
                        size={16}
                        className="animate-spin"
                      />
                      Opening Checkout...
                    </>
                  ) : isCurrent ? (
                    <>
                      <Check
                        size={16}
                      />
                      Current Plan
                    </>
                  ) : plan.id ===
                    "free" ? (
                    "Free Plan"
                  ) : (
                    `Choose ${plan.name}`
                  )}
                </button>
              </article>
            );
          })}
        </div>

        {session?.user &&
          session.user.role !==
            "admin" &&
          currentPlan !==
            "free" && (
            <div className="mt-10 rounded-2xl border border-red-500/10 bg-red-500/[0.04] p-5 text-center">
              <p className="text-sm text-slate-400">
                Want to return to the Free plan?
              </p>

              <button
                type="button"
                onClick={
                  handleCancel
                }
                disabled={
                  isCanceling
                }
                className="mt-4 inline-flex items-center gap-2 rounded-xl border border-red-500/20 px-5 py-3 text-sm font-semibold text-red-300 transition hover:bg-red-500/10"
              >
                {isCanceling ? (
                  <Loader2
                    size={16}
                    className="animate-spin"
                  />
                ) : (
                  <X size={16} />
                )}

                Cancel Paid Subscription
              </button>
            </div>
          )}
      </div>
    </main>
  );
}