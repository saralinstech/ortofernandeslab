import { requireChatGPTUser } from "../chatgpt-auth";
import { getAdminAccess } from "../admin-auth";
import { redirect } from "next/navigation";
import AdminPage from "../ui/AdminPage";
export const dynamic="force-dynamic";
export default async function Admin(){await requireChatGPTUser("/admin");const access=await getAdminAccess();if(!access)redirect("/");return <AdminPage user={access.displayName} email={access.email} role={access.role}/>}
