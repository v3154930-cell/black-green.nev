import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Black Green New — современный чайный магазин",
  description:
    "Новый storefront Black-Green: чай, чайные напитки, посуда и подарки с живым контентным слоем.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-[var(--bg-base)] text-[var(--text-primary)]">
        <div className="framed-layout hidden xl:block fixed inset-0 -z-10" aria-hidden />
        <div className="frame-inner min-h-screen flex flex-col px-4 sm:px-6 lg:px-10">
          {children}
        </div>
      </body>
    </html>
  );
}
