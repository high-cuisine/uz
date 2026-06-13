import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "UZBank",
  description: "Ваш банк в кармане",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ru">
      <body style={{ margin: 0, padding: 0 }}>{children}</body>
    </html>
  );
}
