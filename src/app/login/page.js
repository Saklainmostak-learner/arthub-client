"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";

import { authClient } from "@/lib/auth-client";

const LOGIN_IMAGE = "/login-image.png";

export default function LoginPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    setErrorMessage("");
    setIsLoading(true);

    const formData = new FormData(event.currentTarget);

    const email = formData.get("email");
    const password = formData.get("password");

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
      });

      if (error) {
        setErrorMessage(
          error.message || "Unable to sign in. Please check your details."
        );
        return;
      }

      if (data) {
        router.push("/dashboard");
        router.refresh();
      }
    } catch (error) {
      console.error("Login error:", error);

      setErrorMessage(
        "Something went wrong while signing in. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage("");

    try {
      await authClient.signIn.social({
        provider: "google",
        callbackURL: "http://localhost:3000/dashboard",
      });
    } catch (error) {
      console.error("Google login error:", error);

      setErrorMessage(
        "Google sign in could not be started. Please try again."
      );
    }
  };

  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1625] shadow-[0_30px_90px_rgba(0,0,0,0.32)] lg:min-h-[720px] lg:grid-cols-[0.9fr_1.1fr]">
        {/* Left Side */}
        <section className="flex items-center px-6 py-10 sm:px-10 lg:px-14">
          <div className="mx-auto w-full max-w-md">
            <Link href="/" className="inline-flex items-center">
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
                Continue discovering original artwork, managing your collection,
                and connecting with independent artists.
              </p>
            </div>

            {/* Google Login */}
            <button
              type="button"
              onClick={handleGoogleLogin}
              className="mt-8 flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.07]"
            >
              <FaGoogle size={17} />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="my-7 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />

              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                or
              </span>

              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="mb-5 rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {errorMessage}
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Email
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#081321] px-4 py-3.5 focus-within:border-[#F97316]/50">
                  <Mail size={18} className="shrink-0 text-slate-500" />

                  <input
                    id="email"
                    type="email"
                    name="email"
                    required
                    placeholder="you@example.com"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>

              <div>
                <div className="mb-2 flex items-center justify-between gap-3">
                  <label
                    htmlFor="password"
                    className="text-sm font-medium text-slate-300"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-medium text-[#F97316] transition hover:text-white"
                  >
                    Forgot password?
                  </button>
                </div>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#081321] px-4 py-3.5 focus-within:border-[#F97316]/50">
                  <LockKeyhole
                    size={18}
                    className="shrink-0 text-slate-500"
                  />

                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Enter your password"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword((current) => !current)}
                    className="text-slate-500 transition hover:text-white"
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
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

              <label className="flex cursor-pointer items-center gap-3 text-sm text-slate-400">
                <input
                  type="checkbox"
                  className="h-4 w-4 accent-[#F97316]"
                />
                Remember me
              </label>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoading ? "Signing In..." : "Sign In"}

                {!isLoading && <ArrowRight size={17} />}
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

        {/* Right Artwork Side */}
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
              Discover original work from independent artists and build a
              collection that feels personal.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}