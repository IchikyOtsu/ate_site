import { redirect, notFound } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import Navbar from "@/components/Navbar";
import Link from "next/link";

const SKILL_LABELS = ["combat", "survie", "diplomatie", "technique"] as const;

const STATUS_STYLES: Record<string, string> = {
  pending:  "border-amber-800/50 text-amber-500 bg-amber-950/20",
  approved: "border-green-800/50 text-green-500 bg-green-950/20",
  rejected: "border-red-800/50  text-red-500  bg-red-950/20",
};
const STATUS_LABELS: Record<string, string> = {
  pending: "En attente",
  approved: "Approuvée",
  rejected: "Refusée",
};

export default async function AdminInspectPage({
  params,
}: {
  params: Promise<{ discordId: string }>;
}) {
  const session = await getSession();
  if (!session) redirect("/");
  if (!(await isAdmin())) redirect("/dashboard");

  const { discordId } = await params;

  const character = await prisma.character.findUnique({
    where: { discord_id: discordId },
  });
  if (!character) notFound();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar username={session.discord_username} avatar={session.avatar} discordId={session.discord_id} admin />
      <main className="flex-1 py-10 px-4">
        <div className="max-w-3xl mx-auto space-y-8">

          {/* Navigation */}
          <Link href="/admin" className="text-[#6b6560] hover:text-[#d4cfc8] text-xs uppercase tracking-widest transition-colors flex items-center gap-2">
            ← Retour au panel
          </Link>

          {/* En-tête */}
          <div className="flex items-start justify-between gap-4 border-b border-[#2a2520] pb-6">
            <div>
              <p className="text-[#6b6560] text-xs uppercase tracking-widest mb-1">{character.discord_username}</p>
              <h1 className="text-3xl font-black uppercase tracking-[0.1em] text-[#d4cfc8]">{character.nom}</h1>
              <p className="text-[#6b6560] text-xs uppercase tracking-widest mt-1">
                {character.grade} — {character.faction} — {character.genre}
              </p>
            </div>
            <span className={`border px-3 py-1 text-xs uppercase tracking-widest ${STATUS_STYLES[character.status] ?? STATUS_STYLES.pending}`}>
              {STATUS_LABELS[character.status] ?? character.status}
            </span>
          </div>

          {/* Identité */}
          <Section title="Identité">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <InfoField label="Âge"         value={`${character.age} ans`} />
              <InfoField label="Genre"       value={character.genre} />
              <InfoField label="Faction"     value={character.faction} />
              <InfoField label="Grade"       value={character.grade} />
            </div>
          </Section>

          {/* Compétences */}
          <Section title="Compétences">
            <div className="grid grid-cols-2 gap-3">
              {SKILL_LABELS.map((skill) => (
                <div key={skill} className="flex items-center justify-between border border-[#2a2520] bg-[#1a1814] px-4 py-3">
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

          <p className="text-[#4a4540] text-xs">
            Soumis le {character.created_at.toLocaleDateString("fr-FR")} — ID Discord : {character.discord_id}
          </p>
        </div>
      </main>
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
