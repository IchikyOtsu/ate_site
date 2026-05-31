import { NextResponse } from "next/server";

export async function POST() {
  const response = NextResponse.redirect(
    process.env.NEXT_PUBLIC_BASE_URL + "/"
  );
  response.cookies.delete("rp_session");
  return response;
}
