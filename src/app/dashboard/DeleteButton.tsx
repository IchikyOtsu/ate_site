"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton() {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await fetch("/api/characters", { method: "DELETE" });
    router.refresh();
  }

  if (confirm) {
    return (
      <div className="flex items-center gap-3">
        <span className="text-[#9e9890] text-xs">Supprimer définitivement ?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-red-500 hover:text-red-400 text-xs border border-red-900/50 hover:border-red-700 px-3 py-1 transition-colors disabled:opacity-40"
        >
          {loading ? "…" : "Confirmer"}
        </button>
        <button
          onClick={() => setConfirm(false)}
          className="text-[#6b6560] hover:text-[#d4cfc8] text-xs transition-colors"
        >
          Annuler
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirm(true)}
      className="text-[#6b6560] hover:text-red-500 text-xs border border-[#2a2520] hover:border-red-900/50 px-3 py-1 transition-colors uppercase tracking-widest"
    >
      Supprimer la fiche
    </button>
  );
}
