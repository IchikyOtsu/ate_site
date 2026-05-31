import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import CharacterStepper from "./CharacterStepper";

export default async function FormPage() {
  const session = await getSession();
  if (!session) redirect("/");

  const existing = await prisma.character.findUnique({
    where: { discord_id: session.discord_id },
  });
  if (existing) redirect("/dashboard");

  return (
    <main className="min-h-screen py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <CharacterStepper />
      </div>
    </main>
  );
}
