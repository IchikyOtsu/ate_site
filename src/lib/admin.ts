import { getSession } from "./session";
import { prisma } from "./prisma";

export async function isAdmin(): Promise<boolean> {
  const session = await getSession();
  if (!session) return false;

  const userRole = await prisma.userRole.findUnique({
    where: { discord_id: session.discord_id },
  });

  return userRole?.role === "admin";
}
