"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";

interface Props {
  username: string;
  avatar: string | null;
  discordId: string;
}

export default function Navbar({ username, avatar, discordId }: Props) {
  const router = useRouter();

  async function handleLogout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
    router.refresh();
  }

  const avatarUrl = avatar
    ? `https://cdn.discordapp.com/avatars/${discordId}/${avatar}.png?size=64`
    : `https://cdn.discordapp.com/embed/avatars/0.png`;

  return (
    <nav className="border-b border-[#c0522a]/30 bg-[#1a1814] px-6 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <span className="text-[#c0522a] font-black tracking-[0.15em] uppercase">
          After The End
        </span>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Image
              src={avatarUrl}
              alt={username}
              width={28}
              height={28}
              className="rounded-full grayscale"
            />
            <span className="text-[#9e9890] text-sm">{username}</span>
          </div>

          <button
            onClick={handleLogout}
            className="text-[#6b6560] hover:text-[#d4cfc8] text-xs border border-[#6b6560]/30 hover:border-[#d4cfc8]/30 px-3 py-1 transition-colors uppercase tracking-wider"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}
