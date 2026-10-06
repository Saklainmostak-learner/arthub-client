import "./globals.css";
import { Toaster } from "react-hot-toast";

export const metadata = {
  title: "ArtHub",
  description:
    "A creative marketplace for original artworks and independent artists.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        {children}

        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#0d1928",
              color: "#ffffff",
              border: "1px solid rgba(255,255,255,0.1)",
            },
          }}
        />
      </body>
    </html>
  );
}