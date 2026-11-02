import type { Metadata, Viewport } from "next";
import { Space_Grotesk, DM_Mono, Manrope } from "next/font/google";
import "./globals.css";
import { getPublicProfile } from "@/lib/supabase/server";

const display = Space_Grotesk({ subsets: ["latin"], variable: "--font-display", display: "swap" });
const body = Manrope({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const mono = DM_Mono({ subsets: ["latin"], weight: ["400", "500"], variable: "--font-mono", display: "swap" });

export async function generateMetadata(): Promise<Metadata> {
  const currentProfile = await getPublicProfile();
  return {
    metadataBase: new URL("https://example.com"), // TODO: ganti dengan domain Anda
    title: { default: `${currentProfile.name} — Developer & Creative Technologist`, template: `%s — ${currentProfile.name}` },
    description: currentProfile.tagline,
    openGraph: { title: `${currentProfile.name} — Developer & Creative Technologist`, description: currentProfile.tagline, type: "website", locale: "id_ID", images: [{ url: "/og-image.svg", width: 1200, height: 630, alt: `${currentProfile.name} portfolio` }] },
    twitter: { card: "summary_large_image", title: `${currentProfile.name} — Developer`, description: currentProfile.tagline, images: ["/og-image.svg"] },
    icons: { icon: "/favicon.svg" },
  };
}

export const viewport: Viewport = { themeColor: "#030504", colorScheme: "dark", width: "device-width", initialScale: 1 };

export const dynamic = "force-dynamic";

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const profile = await getPublicProfile();
  return <html lang="id" data-theme={profile.theme} suppressHydrationWarning><body className={`${display.variable} ${body.variable} ${mono.variable}`}>{children}</body></html>;
}
