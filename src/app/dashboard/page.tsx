import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Navbar from "@/components/Navbar";

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/");

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        username={session.discord_username}
        avatar={session.avatar}
        discordId={session.discord_id}
      />
      <main className="flex-1 flex items-center justify-center">
        <p className="text-[#8b7355] italic">Portail en construction…</p>
      </main>
    </div>
  );
}
