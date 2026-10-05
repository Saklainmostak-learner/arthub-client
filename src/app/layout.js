import "./globals.css";

import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";

export const metadata = {
  title: "ArtHub",
  description:
    "Discover and collect original artworks from talented independent artists.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" data-scroll-behavior="smooth">
      <body>
        <Navbar />

        {children}

        <Footer />
      </body>
    </html>
  );
}