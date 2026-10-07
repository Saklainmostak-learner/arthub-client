"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

const LOGIN_IMAGE = "/login-image.png";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(false);

  const [isGoogleLoading, setIsGoogleLoading] =
    useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData =
      new FormData(event.currentTarget);

    const email = String(
      formData.get("email") || ""
    )
      .trim()
      .toLowerCase();

    const password = String(
      formData.get("password") || ""
    );

    if (!email || !password) {
      toast.error(
        "Please enter your email and password."
      );
      return;
    }

    try {
      setIsLoading(true);

      const { data, error } =
        await authClient.signIn.email({
          email,
          password,
        });

      if (error) {
        throw new Error(
          error.message ||
            "Unable to sign in."
        );
      }

      if (!data) {
        throw new Error(
          "Sign in did not complete."
        );
      }

      toast.success(
        "Signed in successfully."
      );

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      toast.error(
        error.message ||
          "Unable to sign in. Please check your details."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setIsGoogleLoading(true);

      const { error } =
        await authClient.signIn.social({
          provider: "google",
          callbackURL: "/dashboard",
        });

      if (error) {
        throw new Error(
          error.message ||
            "Google sign in could not be started."
        );
      }
    } catch (error) {
      console.error(
        "Google login error:",
        error
      );

      toast.error(
        error.message ||
          "Google sign in could not be started."
      );

      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1625] shadow-[0_30px_90px_rgba(0,0,0,0.32)] lg:min-h-[720px] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="flex items-center px-6 py-10 sm:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-md">
            <Link
              href="/"
              className="inline-flex items-center"
            >
              <Image
                src="/arthub-logo-nav.png"
                alt="ArtHub"
                width={145}
                height={42}
                priority
                className="h-10 w-auto object-contain"
              />
            </Link>

            <div className="mt-10">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#F97316]">
                Welcome Back
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Sign in to ArtHub
              </h1>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                Continue discovering original artwork,
                managing your collection, and connecting
                with independent artists.
              </p>
            </div>

            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <FaGoogle size={17} />
              )}

              {isGoogleLoading
                ? "Opening Google..."
                : "Continue with Google"}
            </button>

            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />

              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                or
              </span>

              <div className="h-px flex-1 bg-white/10" />
            </div>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#081321] px-4 py-3.5 focus-within:border-[#F97316]/50">
                  <Mail
                    size={18}
                    className="shrink-0 text-slate-500"
                  />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Password
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#081321] px-4 py-3.5 focus-within:border-[#F97316]/50">
                  <LockKeyhole
                    size={18}
                    className="shrink-0 text-slate-500"
                  />

                  <input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    name="password"
                    required
                    autoComplete="current-password"
                    placeholder="Enter your password"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) => !current
                      )
                    }
                    className="text-slate-500 transition hover:text-white"
                    aria-label={
                      showPassword
                        ? "Hide password"
                        : "Show password"
                    }
                  >
                    {showPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={17} />
                  </>
                )}
              </button>
            </form>

            <p className="mt-7 text-center text-sm text-slate-400">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-semibold text-[#F97316] transition hover:text-white"
              >
                Create one
              </Link>
            </p>
          </div>
        </section>

        <section className="relative hidden overflow-hidden bg-[#050b14] lg:block">
          <Image
            src={LOGIN_IMAGE}
            alt="Contemporary artwork displayed on ArtHub"
            fill
            priority
            sizes="55vw"
            className="object-cover object-top"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#07111f]/95 via-[#07111f]/20 to-black/5" />

          <div className="absolute inset-x-0 bottom-0 p-10 xl:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#F97316]">
              Art lives here
            </p>

            <h2 className="mt-3 max-w-lg text-4xl font-bold leading-tight text-white xl:text-5xl">
              Find art that stays with you.
            </h2>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-200">
              Discover original work from independent
              artists and build a collection that feels
              personal.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}