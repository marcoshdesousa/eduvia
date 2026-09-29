import { redirect } from "next/navigation";
import { requireReadyUser } from "@/lib/session";

export default async function Page() {
  const user = await requireReadyUser();
  redirect(`/u/${user.handle}`);
}
