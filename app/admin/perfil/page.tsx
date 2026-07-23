import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getAdminAccess } from "../../admin-auth";
import PasswordProfile from "../../ui/PasswordProfile";

export const metadata: Metadata = { title: "Perfil | Orto Fernandes", description: "Perfil e segurança de acesso do Laboratório Orto Fernandes.", openGraph: { title: "Perfil | Orto Fernandes", description: "Perfil e segurança de acesso do Laboratório Orto Fernandes." }, twitter: { title: "Perfil | Orto Fernandes", description: "Perfil e segurança de acesso do Laboratório Orto Fernandes." } };
export const dynamic = "force-dynamic";

export default async function ProfilePage() {
  const access = await getAdminAccess();
  if (!access) redirect("/admin/login");
  if (access.id <= 0) redirect("/admin");
  return <PasswordProfile name={access.displayName} email={access.email} forced={access.mustChangePassword}/>;
}
