import type { Metadata } from "next";
import CatalogPage from "../ui/CatalogPage";
export const metadata: Metadata = { title: "Catálogo | Orto Fernandes", description: "Catálogo de aparelhos ortodônticos do Laboratório Orto Fernandes.", openGraph: { title: "Catálogo | Orto Fernandes", description: "Catálogo de aparelhos ortodônticos do Laboratório Orto Fernandes." }, twitter: { title: "Catálogo | Orto Fernandes", description: "Catálogo de aparelhos ortodônticos do Laboratório Orto Fernandes." } };
export default function Catalogo(){return <CatalogPage/>}
