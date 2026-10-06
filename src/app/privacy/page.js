import {
  Cookie,
  Database,
  LockKeyhole,
  ShieldCheck,
} from "lucide-react";

export const metadata = {
  title: "Privacy Policy | ArtHub",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="rounded-[2rem] border border-white/10 bg-[#0b1625] p-6 sm:p-10">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#F97316]/10 text-[#F97316]">
            <ShieldCheck size={26} />
          </div>

          <p className="mt-6 text-sm font-semibold uppercase tracking-[0.28em] text-[#F97316]">
            Privacy Policy
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            Your privacy matters.
          </h1>

          <p className="mt-5 text-sm leading-7 text-slate-400">
            This page explains how ArtHub handles basic
            account and marketplace information used to
            provide authentication, artwork publishing,
            favorites, and purchase functionality.
          </p>

          <div className="mt-10 space-y-6">
            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <Database
                  size={20}
                  className="text-[#F97316]"
                />

                <h2 className="text-xl font-bold">
                  Information We Store
                </h2>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                ArtHub may store information such as your
                name, email address, account role,
                authentication records, published artworks,
                favorite artwork references, and purchase
                history needed to operate the platform.
              </p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <LockKeyhole
                  size={20}
                  className="text-[#F97316]"
                />

                <h2 className="text-xl font-bold">
                  Authentication
                </h2>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Account authentication is handled through
                Better Auth. Google sign-in may also be
                available through Google OAuth. Passwords
                should never be exposed through the public
                client application.
              </p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <Cookie
                  size={20}
                  className="text-[#F97316]"
                />

                <h2 className="text-xl font-bold">
                  Sessions and Cookies
                </h2>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                ArtHub may use session cookies or related
                authentication technologies to keep users
                signed in and provide role-based access to
                platform features.
              </p>
            </section>

            <section className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
              <div className="flex items-center gap-3">
                <ShieldCheck
                  size={20}
                  className="text-[#F97316]"
                />

                <h2 className="text-xl font-bold">
                  Payments
                </h2>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-400">
                Payments are processed through Stripe.
                ArtHub does not need to store full payment
                card details in its own database.
              </p>
            </section>
          </div>

          <p className="mt-8 text-xs leading-6 text-slate-500">
            Last updated: October 2026. This privacy page
            is provided for the ArtHub marketplace project.
          </p>
        </div>
      </div>
    </main>
  );
}