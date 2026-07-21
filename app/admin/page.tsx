import { getAdminAccess } from "../admin-auth";
import { redirect } from "next/navigation";
import AdminPage from "../ui/AdminPage";
export const dynamic="force-dynamic";
export default async function Admin(){const access=await getAdminAccess();if(!access)redirect("/admin/login");if(access.mustChangePassword)redirect("/admin/perfil");return <AdminPage user={access.displayName} email={access.email} role={access.role}/>}
