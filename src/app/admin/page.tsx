import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/admin";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import Navbar from "@/components/Navbar";
import Link from "next/link";

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

export default async function AdminPage() {
  const session = await getSession();
  if (!session) redirect("/");
  if (!(await isAdmin())) redirect("/dashboard");

  const characters = await prisma.character.findMany({
    orderBy: { created_at: "desc" },
    select: {
      discord_id: true,
      discord_username: true,
      nom: true,
      faction: true,
      grade: true,
      genre: true,
      status: true,
      created_at: true,
    },
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar username={session.discord_username} avatar={session.avatar} discordId={session.discord_id} />
      <main className="flex-1 py-10 px-4">
        <div className="max-w-5xl mx-auto space-y-6">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-2xl font-black uppercase tracking-[0.1em] text-[#d4cfc8]">Panel admin</h1>
              <p className="text-[#6b6560] text-xs mt-1">{characters.length} fiche{characters.length > 1 ? "s" : ""} enregistrée{characters.length > 1 ? "s" : ""}</p>
            </div>
          </div>

          <div className="border border-[#2a2520] overflow-hidden">
            {characters.length === 0 ? (
              <p className="text-[#6b6560] text-sm py-12 text-center uppercase tracking-widest">Aucune fiche</p>
            ) : (
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#2a2520] bg-[#12100e]">
                    {["Personnage", "Discord", "Faction", "Grade", "Genre", "Statut", "Date"].map((h) => (
                      <th key={h} className="text-left text-[#6b6560] text-xs uppercase tracking-widest px-4 py-3 font-normal">
                        {h}
                      </th>
                    ))}
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {characters.map((c, i) => (
                    <tr
                      key={c.discord_id}
                      className={`border-b border-[#2a2520] hover:bg-[#1a1814] transition-colors ${i % 2 === 0 ? "bg-[#0e0c0a]" : "bg-[#12100e]"}`}
                    >
                      <td className="px-4 py-3 font-black text-[#d4cfc8] uppercase tracking-wide">{c.nom}</td>
                      <td className="px-4 py-3 text-[#9e9890]">{c.discord_username}</td>
                      <td className="px-4 py-3 text-[#9e9890]">{c.faction}</td>
                      <td className="px-4 py-3 text-[#9e9890]">{c.grade}</td>
                      <td className="px-4 py-3 text-[#9e9890]">{c.genre}</td>
                      <td className="px-4 py-3">
                        <span className={`border px-2 py-0.5 text-xs uppercase tracking-widest ${STATUS_STYLES[c.status] ?? STATUS_STYLES.pending}`}>
                          {STATUS_LABELS[c.status] ?? c.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#6b6560] text-xs">
                        {c.created_at.toLocaleDateString("fr-FR")}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Link
                          href={`/admin/${c.discord_id}`}
                          className="text-[#c0522a] hover:text-[#e0693a] text-xs uppercase tracking-widest transition-colors"
                        >
                          Inspecter →
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
