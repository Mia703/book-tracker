import type { Metadata } from "next";
import "./colours.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Book Tracker",
  description: "A simple book tracker",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
