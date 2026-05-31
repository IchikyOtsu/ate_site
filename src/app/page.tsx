import { getSession } from "@/lib/session";
import { getDiscordAuthUrl } from "@/lib/discord";
import { redirect } from "next/navigation";

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

        <a
          href={authUrl}
          className="flex items-center gap-3 bg-[#5865F2] hover:bg-[#4752c4] text-white px-8 py-3 font-bold tracking-wide transition-colors uppercase text-sm"
        >
          <DiscordIcon />
          Se connecter avec Discord
        </a>

        <p className="text-[#6b6560] text-xs">
          Réservé aux membres du serveur Discord
        </p>
      </div>
    </main>
  );
}

function DiscordIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 71 55" fill="none">
      <path
        d="M60.1 4.9A58.6 58.6 0 0 0 45.7.7a40.8 40.8 0 0 0-1.8 3.7 54.2 54.2 0 0 0-16.3 0A40 40 0 0 0 25.8.7 58.5 58.5 0 0 0 11.4 5C1.6 19.5-1 33.6.3 47.5a59 59 0 0 0 18 9.1 44 44 0 0 0 3.8-6.2 38.4 38.4 0 0 1-6-2.9l1.5-1.1a42.1 42.1 0 0 0 36 0l1.5 1.1a38.4 38.4 0 0 1-6 2.9 43.7 43.7 0 0 0 3.8 6.2 58.8 58.8 0 0 0 18-9.1c1.5-15.7-2.6-29.7-10.8-42.5ZM23.7 39.1c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.5 0 6.4 3.2 6.3 7.2 0 4-2.8 7.2-6.3 7.2Zm23.6 0c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.5 0 6.4 3.2 6.3 7.2 0 4-2.8 7.2-6.3 7.2Z"
        fill="currentColor"
      />
    </svg>
  );
}
