import type { Metadata } from "next";
import LandingPage from "./ui/LandingPage";

const title = "Laboratório Ortodôntico em Belém | Orto Fernandes";
const description = "Laboratório ortodôntico em Belém: aparelhos fixos, removíveis, ortopédicos e placas confeccionados sob medida para dentistas e clínicas, com busca e entrega. Peça um orçamento pelo WhatsApp.";

export const metadata: Metadata = {
  title,
  description,
  keywords: ["laboratório ortodôntico","laboratório ortodôntico Belém","aparelho ortodôntico sob medida","aparelho fixo","aparelho removível","contenção ortodôntica","placa miorrelaxante","expansor palatino","laboratório para dentistas","Orto Fernandes"],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  openGraph: { type: "website", url: "/", siteName: "Laboratório Orto Fernandes", locale: "pt_BR", title, description },
  twitter: { card: "summary_large_image", title, description },
};

// Dados estruturados apontam só para a raiz: bio e catálogo ficam fora da busca.
const dadosEstruturados = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  name: "Laboratório Orto Fernandes",
  description,
  image: "/og.png",
  logo: "/logo-orto.jpg",
  telephone: "+5591983160016",
  sameAs: ["https://instagram.com/ortofernandeslab"],
  priceRange: "$$",
  areaServed: { "@type": "City", name: "Belém", containedInPlace: { "@type": "State", name: "Pará" } },
  address: { "@type": "PostalAddress", addressLocality: "Belém", addressRegion: "PA", addressCountry: "BR" },
  knowsAbout: ["Aparelhos ortodônticos fixos","Aparelhos ortodônticos removíveis","Aparelhos ortopédicos funcionais","Placas e contenções"],
  contactPoint: { "@type": "ContactPoint", contactType: "Atendimento", telephone: "+5591983160016", availableLanguage: "Portuguese" },
};

export default function Home(){
  return <>
    <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(dadosEstruturados) }}/>
    <LandingPage/>
  </>;
}
