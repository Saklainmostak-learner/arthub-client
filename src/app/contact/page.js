import {
  Clock3,
  Mail,
  MapPin,
  MessageCircle,
} from "lucide-react";

export const metadata = {
  title: "Contact | ArtHub",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-[#07111f] px-4 py-16 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-[#F97316]">
            Contact ArtHub
          </p>

          <h1 className="mt-3 text-4xl font-bold tracking-tight sm:text-5xl">
            We&apos;d love to hear from you.
          </h1>

          <p className="mt-4 text-sm leading-7 text-slate-400 sm:text-base">
            Have a question about collecting, publishing
            artwork, your account, or the ArtHub platform?
            Reach out and we&apos;ll point you in the right
            direction.
          </p>
        </div>

        <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-4">
            <div className="rounded-2xl border border-white/10 bg-[#0d1928] p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F97316]/10 text-[#F97316]">
                <Mail size={20} />
              </div>

              <h2 className="mt-4 font-bold">
                Email
              </h2>

              <a
                href="mailto:support@arthub.example"
                className="mt-2 block text-sm text-slate-400 transition hover:text-[#F97316]"
              >
                support@arthub.example
              </a>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0d1928] p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F97316]/10 text-[#F97316]">
                <MapPin size={20} />
              </div>

              <h2 className="mt-4 font-bold">
                Location
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Bangladesh
              </p>
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#0d1928] p-5">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#F97316]/10 text-[#F97316]">
                <Clock3 size={20} />
              </div>

              <h2 className="mt-4 font-bold">
                Support Hours
              </h2>

              <p className="mt-2 text-sm text-slate-400">
                Sunday – Thursday
                <br />
                10:00 AM – 6:00 PM
              </p>
            </div>
          </div>

          <section className="rounded-[2rem] border border-white/10 bg-[#0b1625] p-6 sm:p-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#F97316]/10 text-[#F97316]">
              <MessageCircle size={22} />
            </div>

            <h2 className="mt-5 text-2xl font-bold">
              Send us a message
            </h2>

            <p className="mt-2 text-sm leading-6 text-slate-400">
              This form is provided for contact information
              collection. For direct support, you can also
              use the email address shown here.
            </p>

            <form
              action="mailto:support@arthub.example"
              method="post"
              encType="text/plain"
              className="mt-7 space-y-5"
            >
              <div>
                <label
                  htmlFor="contactName"
                  className="mb-2 block text-sm text-slate-300"
                >
                  Name
                </label>

                <input
                  id="contactName"
                  name="name"
                  type="text"
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#081321] px-4 py-3.5 text-sm text-white outline-none transition focus:border-[#F97316]/50"
                />
              </div>

              <div>
                <label
                  htmlFor="contactEmail"
                  className="mb-2 block text-sm text-slate-300"
                >
                  Email
                </label>

                <input
                  id="contactEmail"
                  name="email"
                  type="email"
                  required
                  className="w-full rounded-xl border border-white/10 bg-[#081321] px-4 py-3.5 text-sm text-white outline-none transition focus:border-[#F97316]/50"
                />
              </div>

              <div>
                <label
                  htmlFor="contactMessage"
                  className="mb-2 block text-sm text-slate-300"
                >
                  Message
                </label>

                <textarea
                  id="contactMessage"
                  name="message"
                  rows={6}
                  required
                  className="w-full resize-none rounded-xl border border-white/10 bg-[#081321] px-4 py-3.5 text-sm text-white outline-none transition focus:border-[#F97316]/50"
                />
              </div>

              <button
                type="submit"
                className="w-full rounded-xl bg-gradient-to-r from-[#8B5CF6] via-[#EC4899] to-[#F97316] px-5 py-3.5 text-sm font-semibold text-white transition hover:opacity-90"
              >
                Send Message
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  );
}