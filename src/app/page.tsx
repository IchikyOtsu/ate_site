import { getSession } from "@/lib/session";
import { getDiscordAuthUrl } from "@/lib/discord";
import { redirect } from "next/navigation";
import LoginButton from "@/components/LoginButton";

export default async function HomePage() {
  const session = await getSession();
  if (session) redirect("/dashboard");

  const authUrl = getDiscordAuthUrl();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-8 text-center max-w-md">
        <div className="space-y-1">
          <h1 className="text-5xl font-black tracking-[0.15em] uppercase text-[#c0522a]">
            After The End
          </h1>
          <p className="text-[#6b6560] text-xs tracking-[0.3em] uppercase">
            Serveur Roleplay
          </p>
        </div>

        <div className="w-full h-px bg-[#c0522a]/30" />

        <p className="text-[#9e9890] text-sm">
          Connecte-toi avec ton compte Discord pour accéder au portail.
        </p>

        <LoginButton authUrl={authUrl} />

        <p className="text-[#6b6560] text-xs">
          Réservé aux membres du serveur Discord
        </p>
      </div>
    </main>
  );
}
