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
  UserRound,
} from "lucide-react";
import { FaGoogle } from "react-icons/fa";
import toast from "react-hot-toast";

import { authClient } from "@/lib/auth-client";

const REGISTER_IMAGE = "/register-image.png";

export default function RegisterPage() {
  const router = useRouter();

  const [showPassword, setShowPassword] =
    useState(false);

  const [
    showConfirmPassword,
    setShowConfirmPassword,
  ] = useState(false);

  const [role, setRole] =
    useState("user");

  const [isSubmitting, setIsSubmitting] =
    useState(false);

  const [isGoogleLoading, setIsGoogleLoading] =
    useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const formData =
      new FormData(event.currentTarget);

    const name = String(
      formData.get("name") || ""
    ).trim();

    const email = String(
      formData.get("email") || ""
    )
      .trim()
      .toLowerCase();

    const password = String(
      formData.get("password") || ""
    );

    const confirmPassword = String(
      formData.get("confirmPassword") || ""
    );

    if (!name) {
      toast.error(
        "Please enter your full name."
      );
      return;
    }

    if (!email) {
      toast.error(
        "Please enter your email."
      );
      return;
    }

    if (password.length < 6) {
      toast.error(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (!/[A-Z]/.test(password)) {
      toast.error(
        "Password must contain at least one uppercase letter."
      );
      return;
    }

    if (!/[a-z]/.test(password)) {
      toast.error(
        "Password must contain at least one lowercase letter."
      );
      return;
    }

    if (
      password !== confirmPassword
    ) {
      toast.error(
        "Passwords do not match."
      );
      return;
    }

    try {
      setIsSubmitting(true);

      const { data, error } =
        await authClient.signUp.email({
          name,
          email,
          password,
          role,
        });

      if (error) {
        throw new Error(
          error.message ||
            "Unable to create your account."
        );
      }

      if (!data) {
        throw new Error(
          "Account creation did not complete."
        );
      }

      toast.success(
        "Account created successfully."
      );

      router.push("/dashboard");
      router.refresh();
    } catch (error) {
      console.error(
        "Register error:",
        error
      );

      toast.error(
        error.message ||
          "Something went wrong while creating your account."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleRegister =
    async () => {
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
              "Google sign up could not be started."
          );
        }
      } catch (error) {
        console.error(
          "Google register error:",
          error
        );

        toast.error(
          error.message ||
            "Google sign up could not be started."
        );

        setIsGoogleLoading(false);
      }
    };

  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0b1625] shadow-[0_30px_90px_rgba(0,0,0,0.32)] lg:grid-cols-[0.95fr_1.05fr]">
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

            <div className="mt-8">
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#F97316]">
                Join ArtHub
              </p>

              <h1 className="mt-3 text-4xl font-bold tracking-tight text-white sm:text-5xl">
                Create your account
              </h1>

              <p className="mt-4 text-sm leading-6 text-slate-400">
                Join as a collector or artist and become
                part of a growing marketplace for original
                artwork.
              </p>
            </div>

            <button
              type="button"
              onClick={
                handleGoogleRegister
              }
              disabled={
                isGoogleLoading
              }
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-4 py-3.5 text-sm font-semibold text-white transition hover:border-white/20 hover:bg-white/[0.07] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isGoogleLoading ? (
                <Loader2
                  size={17}
                  className="animate-spin"
                />
              ) : (
                <FaGoogle
                  size={17}
                />
              )}

              {isGoogleLoading
                ? "Opening Google..."
                : "Continue with Google"}
            </button>

            <div className="my-6 flex items-center gap-4">
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
                    autoComplete="name"
                    placeholder="Enter your full name"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />
                </div>
              </div>

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
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="Create a password"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (current) =>
                          !current
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
                      <EyeOff
                        size={18}
                      />
                    ) : (
                      <Eye
                        size={18}
                      />
                    )}
                  </button>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Minimum 6 characters with at least one
                  uppercase and one lowercase letter.
                </p>
              </div>

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
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    name="confirmPassword"
                    required
                    minLength={6}
                    autoComplete="new-password"
                    placeholder="Confirm your password"
                    className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (current) =>
                          !current
                      )
                    }
                    className="text-slate-500 transition hover:text-white"
                    aria-label={
                      showConfirmPassword
                        ? "Hide confirm password"
                        : "Show confirm password"
                    }
                  >
                    {showConfirmPassword ? (
                      <EyeOff
                        size={18}
                      />
                    ) : (
                      <Eye
                        size={18}
                      />
                    )}
                  </button>
                </div>
              </div>

              <div>
                <p className="mb-2 text-sm font-medium text-slate-300">
                  Join as
                </p>

                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setRole("user")
                    }
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
                    onClick={() =>
                      setRole("artist")
                    }
                    className={`rounded-xl border px-4 py-3 text-sm font-semibold transition ${
                      role === "artist"
                        ? "border-[#F97316]/50 bg-[#F97316]/10 text-[#F97316]"
                        : "border-white/10 bg-white/[0.03] text-slate-300 hover:border-white/20"
                    }`}
                  >
                    Artist
                  </button>
                </div>

                <input
                  type="hidden"
                  name="role"
                  value={role}
                />
              </div>

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

              <button
                type="submit"
                disabled={
                  isSubmitting
                }
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isSubmitting ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight
                      size={17}
                    />
                  </>
                )}
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
              Whether you create or collect, ArtHub gives
              you a place to discover, connect, and grow.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}