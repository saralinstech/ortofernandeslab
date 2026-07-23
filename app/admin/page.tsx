import type { Metadata } from "next";
import { getAdminAccess } from "../admin-auth";
import { redirect } from "next/navigation";
import AdminPage from "../ui/AdminPage";
export const metadata: Metadata = { title: "Painel Admin | Orto Fernandes", description: "Painel administrativo do Laboratório Orto Fernandes para pedidos, produtos, clientes e equipe.", openGraph: { title: "Painel Admin | Orto Fernandes", description: "Painel administrativo do Laboratório Orto Fernandes para pedidos, produtos, clientes e equipe." }, twitter: { title: "Painel Admin | Orto Fernandes", description: "Painel administrativo do Laboratório Orto Fernandes para pedidos, produtos, clientes e equipe." } };
export const dynamic="force-dynamic";
export default async function Admin(){const access=await getAdminAccess();if(!access)redirect("/admin/login");if(access.mustChangePassword)redirect("/admin/perfil");return <AdminPage user={access.displayName} email={access.email} role={access.role}/>}
