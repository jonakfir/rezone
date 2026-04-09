import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rezone — AI-Powered Rezoning Opportunity Detection",
  description: "Find land before the market does. AI-powered rezoning opportunity detection for serious real estate investors.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="bg-forest text-cream font-sans">{children}</body>
    </html>
  );
}
