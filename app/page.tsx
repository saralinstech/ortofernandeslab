import type { Metadata } from "next";
import BioPage from "./ui/BioPage";
export const metadata: Metadata = { title: "Bio | Orto Fernandes", description: "Bio do Laboratório Orto Fernandes: aparelhos ortodônticos, atendimento e solicitações pelo WhatsApp.", openGraph: { title: "Bio | Orto Fernandes", description: "Bio do Laboratório Orto Fernandes: aparelhos ortodônticos, atendimento e solicitações pelo WhatsApp." }, twitter: { title: "Bio | Orto Fernandes", description: "Bio do Laboratório Orto Fernandes: aparelhos ortodônticos, atendimento e solicitações pelo WhatsApp." } };
export default function Home(){return <BioPage/>}
