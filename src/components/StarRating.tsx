"use client";

import { useState } from "react";

interface Props {
  name: string;
  value: number;
  onChange: (value: number) => void;
}

export default function StarRating({ name, value, onChange }: Props) {
  const [hovered, setHovered] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => {
        const filled = star <= (hovered || value);
        return (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            onMouseEnter={() => setHovered(star)}
            onMouseLeave={() => setHovered(0)}
            className={`text-2xl transition-colors leading-none ${
              filled ? "text-[#c0522a]" : "text-[#3a3530]"
            } hover:text-[#e0693a]`}
            aria-label={`${star} étoile${star > 1 ? "s" : ""}`}
          >
            ★
          </button>
        );
      })}
      <input type="hidden" name={name} value={value} />
    </div>
  );
}
