import type { Metadata } from "next";
import CatalogPage from "../ui/CatalogPage";
const title = "Catálogo | Orto Fernandes";
const description = "Catálogo de aparelhos ortodônticos do Laboratório Orto Fernandes.";
// Fora do índice: a página mostra preços, que não devem aparecer em resultado
// de busca. Continua acessível por link direto.
export const metadata: Metadata = { title, description, robots: { index: false, follow: false }, openGraph: { title, description }, twitter: { title, description } };
export default function Catalogo(){return <CatalogPage/>}
