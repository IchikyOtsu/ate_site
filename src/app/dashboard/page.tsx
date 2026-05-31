import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import DeleteButton from "./DeleteButton";

const SKILL_LABELS = ["combat", "survie", "diplomatie", "technique"] as const;

export default async function DashboardPage() {
  const session = await getSession();
  if (!session) redirect("/");

  const character = await prisma.character.findUnique({
    where: { discord_id: session.discord_id },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar
        username={session.discord_username}
        avatar={session.avatar}
        discordId={session.discord_id}
      />

      {/* Background image layer */}
      <div className="relative flex-1">
        <div
          className="absolute inset-0 bg-center bg-no-repeat"
          style={{ backgroundImage: "url('/bg-dashboard.png')", backgroundSize: "cover", backgroundAttachment: "fixed" }}
        />
        {/* dark overlay so content stays readable */}
        <div className="absolute inset-0 bg-[#0e0c0a]/75" />

        <main className="relative z-10 py-10 px-4">
          <div className="max-w-3xl mx-auto">
            {character ? (
              <CharacterSheet character={character} />
            ) : (
              <EmptyState />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center gap-6 py-24 text-center">
      <p className="text-[#6b6560] text-sm uppercase tracking-widest">
        Aucune fiche enregistrée
      </p>
      <Link
        href="/form"
        className="bg-[#c0522a] hover:bg-[#e0693a] text-white font-black px-8 py-3 uppercase tracking-widest text-sm transition-colors"
      >
        Créer ma fiche
      </Link>
    </div>
  );
}

function CharacterSheet({ character }: {
  character: {
    nom: string; age: number; genre: string; faction: string; corporation: string; grade: string;
    description: string; psychologie: string; historique: string;
    combat: number; survie: number; diplomatie: number; technique: number;
    status: string; created_at: Date; image_data: Uint8Array | null;
  };
}) {
  return (
    <div className="space-y-8">
      {/* En-tête */}
      <div className="flex items-start justify-between gap-4 border-b border-[#2a2520] pb-6">
        <div className="flex items-center gap-4">
          {character.image_data && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src="/api/avatar"
              alt="Avatar"
              className="w-16 h-16 object-cover border border-[#2a2520] flex-shrink-0"
            />
          )}
          <div>
            <h1 className="text-3xl font-black uppercase tracking-[0.1em] text-[#d4cfc8]">
              {character.nom}
            </h1>
            <p className="text-[#6b6560] text-xs uppercase tracking-widest mt-1">
              {character.grade} — {character.faction}
            </p>
          </div>
        </div>
        <StatusBadge status={character.status} />
      </div>

      {/* Identité */}
      <Section title="Identité">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <InfoField label="Âge" value={`${character.age} ans`} />
          <InfoField label="Genre" value={character.genre} />
          <InfoField label="Faction" value={character.faction} />
          <InfoField label="Grade" value={character.grade} />
        </div>
      </Section>

      {/* Compétences */}
      <Section title="Compétences">
        <div className="grid grid-cols-2 gap-3">
          {SKILL_LABELS.map((skill) => (
            <div key={skill} className="flex items-center justify-between border border-[#2a2520] bg-black/40 px-4 py-3">
              <span className="text-[#9e9890] text-xs uppercase tracking-widest">
                {skill.charAt(0).toUpperCase() + skill.slice(1)}
              </span>
              <Stars value={character[skill]} />
            </div>
          ))}
        </div>
      </Section>

      {/* Descriptions */}
      <Section title="Description">
        <p className="text-[#9e9890] text-sm leading-relaxed whitespace-pre-wrap">{character.description}</p>
      </Section>
      <Section title="Psychologie">
        <p className="text-[#9e9890] text-sm leading-relaxed whitespace-pre-wrap">{character.psychologie}</p>
      </Section>
      <Section title="Historique">
        <p className="text-[#9e9890] text-sm leading-relaxed whitespace-pre-wrap">{character.historique}</p>
      </Section>

      <div className="flex items-center justify-between pt-2">
        <p className="text-[#4a4540] text-xs">
          Soumis le {character.created_at.toLocaleDateString("fr-FR")}
        </p>
        <DeleteButton />
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <span className="text-[#c0522a] text-xs uppercase tracking-[0.3em] font-black">{title}</span>
        <div className="flex-1 h-px bg-[#c0522a]/20" />
      </div>
      {children}
    </div>
  );
}

function InfoField({ label, value }: { label: string; value: string }) {
  return (
    <div className="space-y-1">
      <p className="text-[#6b6560] text-xs uppercase tracking-widest">{label}</p>
      <p className="text-[#d4cfc8] text-sm">{value}</p>
    </div>
  );
}

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= value ? "text-[#c0522a]" : "text-[#3a3530]"}>★</span>
      ))}
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  const styles: Record<string, string> = {
    pending: "border-amber-800/50 text-amber-500 bg-amber-950/20",
    approved: "border-green-800/50 text-green-500 bg-green-950/20",
    rejected: "border-red-800/50 text-red-500 bg-red-950/20",
  };
  const labels: Record<string, string> = {
    pending: "En attente",
    approved: "Approuvée",
    rejected: "Refusée",
  };
  return (
    <span className={`border px-3 py-1 text-xs uppercase tracking-widest ${styles[status] ?? styles.pending}`}>
      {labels[status] ?? status}
    </span>
  );
}
