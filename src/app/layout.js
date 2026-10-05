import Navbar from "@/components/shared/Navbar";
import "./globals.css";

export const metadata = {
  title: "ArtHub",
  description: "Discover and collect original artworks from talented artists.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navbar/>
        {children}</body>
    </html>
  );
}