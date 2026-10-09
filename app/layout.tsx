import ConnectionGate from "./connection-gate";
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Prospeva Business Portal",
  description:
    "Financial operations portal for approved Prospeva organizations.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased"><ConnectionGate />{children}</body>
    </html>
  );
}
