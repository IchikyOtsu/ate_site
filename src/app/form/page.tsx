import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CharacterForm from "./CharacterForm";

export default async function FormPage() {
  const session = await getSession();
  if (!session) redirect("/");

  const existing = await prisma.character.findUnique({
    where: { discord_id: session.discord_id },
  });
  if (existing) redirect("/dashboard");

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-[0.15em] text-[#c0522a]">
            Fiche de personnage
          </h1>
          <p className="text-[#6b6560] text-sm mt-1">
            Une seule fiche par compte. Elle sera examinée par les modérateurs.
          </p>
        </div>
        <div className="border border-[#2a2520] bg-[#12100e] p-8">
          <CharacterForm />
        </div>
      </div>
    </main>
  );
}
