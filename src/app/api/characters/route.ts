import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const schema = z.object({
  nom: z.string().min(2).max(60),
  age: z.number().int().min(1).max(150),
  genre: z.enum(["Homme", "Femme"]),
  faction: z.string().min(1).max(80),
  corporation: z.string().max(80),
  grade: z.string().min(1).max(80),
  description: z.string().min(20).max(3000),
  psychologie: z.string().min(20).max(3000),
  historique: z.string().min(20).max(3000),
  combat: z.number().int().min(1).max(5),
  survie: z.number().int().min(1).max(5),
  diplomatie: z.number().int().min(1).max(5),
  technique: z.number().int().min(1).max(5),
});

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const existing = await prisma.character.findUnique({
    where: { discord_id: session.discord_id },
  });
  if (existing) {
    return NextResponse.json({ error: "Fiche déjà soumise" }, { status: 409 });
  }

  const body = await request.json();
  const parsed = schema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Données invalides", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  await prisma.character.create({
    data: {
      discord_id: session.discord_id,
      discord_username: session.discord_username,
      ...parsed.data,
    },
  });

  return NextResponse.json({ success: true }, { status: 201 });
}

export async function DELETE() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  await prisma.character.deleteMany({
    where: { discord_id: session.discord_id },
  });

  return NextResponse.json({ success: true });
}
