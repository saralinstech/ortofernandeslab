import { requireChatGPTUser } from "../chatgpt-auth";
import AdminPage from "../ui/AdminPage";
export const dynamic="force-dynamic";
export default async function Admin(){const user=await requireChatGPTUser("/admin");return <AdminPage user={user.displayName}/>}
