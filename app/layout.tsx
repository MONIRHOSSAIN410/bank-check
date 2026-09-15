import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bank Check Printer",
  description:
    "Print date, payee name and amount accurately onto pre-printed bank cheque paper.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
