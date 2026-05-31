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
    <nav className="border-b border-[#c9a84c]/20 bg-black/60 backdrop-blur-sm px-6 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <span className="text-[#c9a84c] font-bold tracking-widest text-lg">
          ATE RP
        </span>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <Image
              src={avatarUrl}
              alt={username}
              width={32}
              height={32}
              className="rounded-full"
            />
            <span className="text-[#e8d5a3] text-sm">{username}</span>
          </div>

          <button
            onClick={handleLogout}
            className="text-[#8b7355] hover:text-[#f5e6c8] text-sm border border-[#8b7355]/30 hover:border-[#f5e6c8]/30 px-3 py-1 transition-colors"
          >
            Déconnexion
          </button>
        </div>
      </div>
    </nav>
  );
}
