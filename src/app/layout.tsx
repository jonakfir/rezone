import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rezone — AI-Powered Rezoning Opportunity Detection",
  description:
    "Find undervalued parcels with rezoning potential. AI-powered land intelligence for serious real estate investors.",
  icons: {
    icon: "/favicon.svg",
  },
  openGraph: {
    title: "Rezone — Find Land Before the Market Does",
    description:
      "AI-powered rezoning opportunity detection for serious real estate investors.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="bg-forest text-cream font-sans">{children}</body>
    </html>
  );
}
