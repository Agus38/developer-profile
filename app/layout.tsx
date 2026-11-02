import type { Metadata, Viewport } from "next";
import { Space_Grotesk, DM_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { profile } from "@/data/profile";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL("https://example.com"), // TODO: ganti dengan domain Anda
  title: { default: `${profile.name} — Developer & Creative Technologist`, template: `%s — ${profile.name}` },
  description: profile.tagline,
  openGraph: { title: `${profile.name} — Developer & Creative Technologist`, description: profile.tagline, type: "website", locale: "id_ID", images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: `${profile.name} portfolio` }] },
  twitter: { card: "summary_large_image", title: `${profile.name} — Developer`, description: profile.tagline, images: ["/og-image.svg"] },
  icons: { icon: "/favicon.svg" },
};

export const viewport: Viewport = { themeColor: "#030504", colorScheme: "dark", width: "device-width", initialScale: 1 };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id" data-theme={profile.theme} suppressHydrationWarning><body className={`${display.variable} ${body.variable} ${mono.variable}`}>{children}</body></html>;
}
