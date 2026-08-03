import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";
import { headers } from "next/headers";
import "./globals.css";
import "./admin.css";
import "./bio.css";
import "./catalog.css";
import "./landing.css";
import "./photo-viewer.css";

const manrope = Manrope({ variable: "--font-sans", subsets: ["latin"] });
const playfair = Playfair_Display({ variable: "--font-display", subsets: ["latin"] });

export async function generateMetadata(): Promise<Metadata> {
  const requestHeaders = await headers();
  const host = requestHeaders.get("x-forwarded-host") ?? requestHeaders.get("host") ?? "localhost:3000";
  const protocol = requestHeaders.get("x-forwarded-proto") ?? (host.startsWith("localhost") ? "http" : "https");
  const base = new URL(`${protocol}://${host}`);
  return {
    metadataBase: base,
    title: "Orto Fernandes | Laboratório Ortodôntico e Ortopédico",
    description: "Peça aparelhos ortodônticos e ortopédicos funcionais com agilidade, qualidade e atendimento próximo.",
    icons: { icon: "/favicon.svg" },
    openGraph: { title: "Laboratório Orto Fernandes", description: "Aparelhos ortodônticos e ortopédicos funcionais sob medida, em Belém.", images: [{ url: new URL("/og.png", base).toString(), width: 1728, height: 909 }] },
    twitter: { card: "summary_large_image", title: "Laboratório Orto Fernandes", description: "Aparelhos ortodônticos e ortopédicos funcionais sob medida, em Belém.", images: [new URL("/og.png", base).toString()] },
  };
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="pt-BR"><body className={`${manrope.variable} ${playfair.variable}`}>{children}</body></html>;
}
