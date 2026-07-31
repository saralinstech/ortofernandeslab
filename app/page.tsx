import type { Metadata } from "next";
import LandingPage from "./ui/LandingPage";
const title = "Laboratório Orto Fernandes | Aparelhos ortodônticos sob medida";
const description = "Aparelhos ortodônticos confeccionados sob medida para dentistas e clínicas, com busca e entrega em Belém e região. Solicite um orçamento pelo WhatsApp.";
export const metadata: Metadata = { title, description, openGraph: { title, description }, twitter: { title, description } };
export default function Home(){return <LandingPage/>}
