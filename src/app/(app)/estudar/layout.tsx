import { redirect } from "next/navigation";

/** O Eduvia agora é focado no ENEM: preparações próprias saíram. Quem abrir um link antigo vai para o Estudar ENEM. */
export default function Layout() {
  redirect("/enem");
}
