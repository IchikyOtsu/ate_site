"use client";

import { useState } from "react";

export default function LoginButton({ authUrl }: { authUrl: string }) {
  const [loading, setLoading] = useState(false);

  function handleClick() {
    setLoading(true);
  }

  return (
    <a
      href={authUrl}
      onClick={handleClick}
      className="flex items-center gap-3 bg-[#5865F2] hover:bg-[#4752c4] text-white px-8 py-3 font-bold tracking-wide transition-colors uppercase text-sm min-w-[280px] justify-center"
    >
      {loading ? (
        <>
          <Spinner />
          Connexion en cours…
        </>
      ) : (
        <>
          <DiscordIcon />
          Se connecter avec Discord
        </>
      )}
    </a>
  );
}

function Spinner() {
  return (
    <svg
      className="w-5 h-5 animate-spin"
      viewBox="0 0 24 24"
      fill="none"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      />
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8v8H4z"
      />
    </svg>
  );
}

function DiscordIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 71 55" fill="none">
      <path
        d="M60.1 4.9A58.6 58.6 0 0 0 45.7.7a40.8 40.8 0 0 0-1.8 3.7 54.2 54.2 0 0 0-16.3 0A40 40 0 0 0 25.8.7 58.5 58.5 0 0 0 11.4 5C1.6 19.5-1 33.6.3 47.5a59 59 0 0 0 18 9.1 44 44 0 0 0 3.8-6.2 38.4 38.4 0 0 1-6-2.9l1.5-1.1a42.1 42.1 0 0 0 36 0l1.5 1.1a38.4 38.4 0 0 1-6 2.9 43.7 43.7 0 0 0 3.8 6.2 58.8 58.8 0 0 0 18-9.1c1.5-15.7-2.6-29.7-10.8-42.5ZM23.7 39.1c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.5 0 6.4 3.2 6.3 7.2 0 4-2.8 7.2-6.3 7.2Zm23.6 0c-3.5 0-6.4-3.2-6.4-7.2s2.8-7.2 6.4-7.2c3.5 0 6.4 3.2 6.3 7.2 0 4-2.8 7.2-6.3 7.2Z"
        fill="currentColor"
      />
    </svg>
  );
}
