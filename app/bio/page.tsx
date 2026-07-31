import type { Metadata } from "next";
import BioPage from "../ui/BioPage";
const title = "Bio | Orto Fernandes";
const description = "Bio do Laboratório Orto Fernandes: aparelhos ortodônticos, atendimento e solicitações pelo WhatsApp.";
// Fora do índice: a busca deve chegar pela landing, não por aqui.
export const metadata: Metadata = { title, description, robots: { index: false, follow: false }, openGraph: { title, description }, twitter: { title, description } };
export default function Bio(){return <BioPage/>}
