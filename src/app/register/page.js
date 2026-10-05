"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  LockKeyhole,
  Mail,
  UserRound,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";

const REGISTER_IMAGE = "/register-image.png";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [role, setRole] = useState("user");

  const handleSubmit = (event) => {
    event.preventDefault();

    // Better Auth registration logic will be connected later.
  };

  const handleGoogleRegister = () => {
    // Google OAuth registration will be connected later.
  };

  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1625] shadow-[0_30px_90px_rgba(0,0,0,0.32)] lg:grid-cols-[0.95fr_1.05fr]">
        {/* Left Side - Register Form */}
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

            <div className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#F97316]">
                Join ArtHub
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Create your account
              </h1>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                Join as a collector or artist and become part of a growing
                marketplace for original artwork.
              </p>
            </div>

            {/* Google Register */}
            <button
              type="button"
              onClick={handleGoogleRegister}
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.07]"
            >
              <FaGoogle size={17} />
              Continue with Google
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-4">
              <div className="h-px flex-1 bg-white/10" />

              <span className="text-xs uppercase tracking-[0.2em] text-slate-500">
                or
              </span>

              <div className="h-px flex-1 bg-white/10" />
            </div>

            {/* Register Form */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Full Name */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Full Name
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#081321] px-4 py-3.5 focus-within:border-[#F97316]/50">
                  <UserRound
                    size={18}
                    className="shrink-0 text-slate-500"
                  />

                  <input
                    id="name"
                    type="text"
                    name="name"
                    required
                    placeholder="Enter your full name"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>

              {/* Email */}
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

              {/* Password */}
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
                    type={showPassword ? "text" : "password"}
                    name="password"
                    required
                    placeholder="Create a password"
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

              {/* Confirm Password */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="mb-2 block text-sm font-medium text-slate-300"
                >
                  Confirm Password
                </label>

                <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-[#081321] px-4 py-3.5 focus-within:border-[#F97316]/50">
                  <LockKeyhole
                    size={18}
                    className="shrink-0 text-slate-500"
                  />

                  <input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    required
                    placeholder="Confirm your password"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword((current) => !current)
                    }
                    className="text-slate-500 transition hover:text-white"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff size={18} />
                    ) : (
                      <Eye size={18} />
                    )}
                  </button>
                </div>
              </div>

              {/* Role Selection */}
              <div>
                <p className="mb-2 text-sm font-medium text-slate-300">
                  Join as
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setRole("user")}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      role === "user"
                        ? "border-[#F97316]/50 bg-[#F97316]/10 text-[#F97316]"
                        : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20"
                    }`}
                  >
                    Art Collector
                  </button>

                  <button
                    type="button"
                    onClick={() => setRole("artist")}
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      role === "artist"
                        ? "border-[#F97316]/50 bg-[#F97316]/10 text-[#F97316]"
                        : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20"
                    }`}
                  >
                    Artist
                  </button>
                </div>

                <input type="hidden" name="role" value={role} />
              </div>

              {/* Terms */}
              <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-slate-400">
                <input
                  type="checkbox"
                  required
                  className="mt-1 h-4 w-4 accent-[#F97316]"
                />

                <span>
                  I agree to the{" "}
                  <Link
                    href="/privacy"
                    className="font-medium text-[#F97316] hover:text-white"
                  >
                    Privacy Policy
                  </Link>{" "}
                  and platform terms.
                </span>
              </label>

              {/* Submit */}
              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Create Account
                <ArrowRight size={17} />
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-400">
              Already have an account?{" "}
              <Link
                href="/login"
                className="font-semibold text-[#F97316] transition hover:text-white"
              >
                Sign in
              </Link>
            </p>
          </div>
        </section>

        {/* Right Side - Artwork */}
        <section className="relative hidden min-h-[860px] overflow-hidden bg-[#050b14] lg:block">
          <Image
            src={REGISTER_IMAGE}
            alt="Contemporary artwork displayed on ArtHub"
            fill
            priority
            sizes="50vw"
            className="object-cover object-top"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#07111f]/95 via-[#07111f]/20 to-black/5" />

          <div className="absolute inset-x-0 bottom-0 p-10 xl:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#F97316]">
              Create without limits
            </p>

            <h2 className="mt-3 max-w-lg text-4xl font-bold leading-tight text-white xl:text-5xl">
              Share your art. Build your collection.
            </h2>

            <p className="mt-4 max-w-md text-sm leading-6 text-slate-200">
              Whether you create or collect, ArtHub gives you a place to
              discover, connect, and grow.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}