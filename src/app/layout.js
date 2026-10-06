import "./globals.css";

import { Toaster } from "react-hot-toast";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export const metadata = {
  title: "ArtHub",
  description:
    "A creative marketplace for original artworks and independent artists.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar />

        {children}

        <Footer />

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,

            style: {
              background: "#0d1928",
              color: "#ffffff",
              border:
                "1px solid rgba(255,255,255,0.1)",
            },

            success: {
              iconTheme: {
                primary: "#F97316",
                secondary: "#ffffff",
              },
            },

            error: {
              iconTheme: {
                primary: "#ef4444",
                secondary: "#ffffff",
              },
            },
          }}
        />
      </body>
    </html>
  );
}