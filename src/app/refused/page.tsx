import Link from "next/link";

const REASONS: Record<string, { title: string; message: string }> = {
  not_member: {
    title: "Accès refusé",
    message:
      "Ton compte Discord n'est pas membre du serveur After The End. Rejoins le serveur avant de te connecter.",
  },
  oauth_denied: {
    title: "Connexion annulée",
    message: "Tu as refusé l'accès à ton compte Discord. Réessaie si c'est une erreur.",
  },
  server_error: {
    title: "Erreur serveur",
    message: "Une erreur inattendue s'est produite. Réessaie dans quelques instants.",
  },
};

export default async function RefusedPage({
  searchParams,
}: {
  searchParams: Promise<{ reason?: string }>;
}) {
  const { reason } = await searchParams;
  const content = REASONS[reason ?? ""] ?? REASONS.server_error;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center px-6">
      <div className="flex flex-col items-center gap-6 text-center max-w-md w-full">
        <div className="w-full border border-red-900/50 bg-red-950/20 px-8 py-10 flex flex-col items-center gap-5">
          <span className="text-red-600 text-4xl font-black">✕</span>
          <div className="space-y-2">
            <h1 className="text-xl font-black uppercase tracking-widest text-red-500">
              {content.title}
            </h1>
            <p className="text-[#9e9890] text-sm leading-relaxed">
              {content.message}
            </p>
          </div>
          <div className="w-full h-px bg-red-900/30" />
          <Link
            href="/"
            className="text-[#6b6560] hover:text-[#d4cfc8] text-xs uppercase tracking-widest transition-colors"
          >
            ← Retour
          </Link>
        </div>
      </div>
    </main>
  );
}
