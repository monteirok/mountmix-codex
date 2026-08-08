import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import { Cormorant_Garamond, Inter } from "next/font/google";
import "./globals.css";

const display = Cormorant_Garamond({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const sans = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export async function generateMetadata(): Promise<Metadata> {
  const headerStore = await headers();
  const host = headerStore.get("x-forwarded-host") ?? headerStore.get("host") ?? "localhost:3000";
  const protocol =
    headerStore.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const metadataBase = new URL(`${protocol}://${host}`);

  return {
    metadataBase,
    title: "Mountain Mixology | Premium Cocktail Catering in Canmore",
    description:
      "Premium mobile cocktail catering for weddings, private events, retreats, and corporate gatherings in Canmore, Banff, Kananaskis, and the Bow Valley.",
    applicationName: "Mountain Mixology",
    category: "Cocktail catering",
    keywords: [
      "Canmore cocktail catering",
      "mobile bar Canmore",
      "Banff wedding bartender",
      "Bow Valley event bar",
      "Mountain Mixology",
    ],
    icons: {
      icon: "/favicon.svg",
      shortcut: "/favicon.svg",
    },
    openGraph: {
      title: "Mountain Mixology",
      description: "Premium cocktail catering in Canmore and the Bow Valley.",
      type: "website",
      url: metadataBase,
      images: [
        {
          url: "/og-v2.png",
          width: 1728,
          height: 910,
          alt: "Mountain Mixology cocktail catering in the Canadian Rockies.",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: "Mountain Mixology",
      description: "Premium cocktail catering in Canmore and the Bow Valley.",
      images: ["/og-v2.png"],
    },
  };
}

export const viewport: Viewport = {
  colorScheme: "light dark",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#102d25" },
    { media: "(prefers-color-scheme: dark)", color: "#091713" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-CA">
      <body className={`${display.variable} ${sans.variable}`}>{children}</body>
    </html>
  );
}
