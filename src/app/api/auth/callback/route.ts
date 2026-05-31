import { NextRequest, NextResponse } from "next/server";
import { exchangeCode, getDiscordUser, isGuildMember } from "@/lib/discord";
import { createSession, getSessionCookieOptions } from "@/lib/session";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const base = process.env.NEXT_PUBLIC_BASE_URL!;

  if (error || !code) {
    return NextResponse.redirect(`${base}/?error=oauth_denied`);
  }

  try {
    const { access_token } = await exchangeCode(code);
    const user = await getDiscordUser(access_token);

    const isMember = await isGuildMember(access_token, process.env.DISCORD_GUILD_ID!);
    if (!isMember) {
      return NextResponse.redirect(`${base}/?error=not_member`);
    }

    const sessionToken = await createSession({
      discord_id: user.id,
      discord_username: user.username,
      avatar: user.avatar,
    });

    const { name, options } = getSessionCookieOptions();
    const response = NextResponse.redirect(`${base}/dashboard`);
    response.cookies.set(name, sessionToken, options);

    return response;
  } catch (err) {
    console.error("OAuth callback error:", err);
    return NextResponse.redirect(`${base}/?error=server_error`);
  }
}
