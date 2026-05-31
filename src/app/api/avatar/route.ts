import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getSession();
  if (!session) return new Response(null, { status: 401 });

  const character = await prisma.character.findUnique({
    where: { discord_id: session.discord_id },
    select: { image_data: true },
  });

  if (!character?.image_data) return new Response(null, { status: 404 });

  const bytes = character.image_data;

  // Detect image type from magic bytes
  let contentType = "image/png";
  if (bytes[0] === 0xff && bytes[1] === 0xd8) contentType = "image/jpeg";
  else if (bytes[0] === 0x47 && bytes[1] === 0x49) contentType = "image/gif";
  else if (bytes[0] === 0x52 && bytes[1] === 0x49) contentType = "image/webp";

  return new Response(bytes, {
    headers: {
      "Content-Type": contentType,
      "Cache-Control": "public, max-age=3600",
    },
  });
}
