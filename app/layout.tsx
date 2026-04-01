import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Werkwoordlab",
  description: "Oefen werkwoordspelling met duidelijke stappen en gerichte feedback."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl">
      <body>{children}</body>
    </html>
  );
}
