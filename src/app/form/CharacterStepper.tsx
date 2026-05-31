"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import StarRating from "@/components/StarRating";

type Faction = "Les Résurgents" | "Les Éveillés";
type Genre = "Homme" | "Femme";

const GRADES: Record<Faction, string[]> = {
  "Les Résurgents": ["Ordonné", "Sergent d'arme", "Chevalier", "Paladin", "Commandeur", "Maître"],
  "Les Éveillés": [],
};

interface Skills {
  combat: number;
  survie: number;
  diplomatie: number;
  technique: number;
}

export default function CharacterStepper() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [faction, setFaction] = useState<Faction | null>(null);
  const [genre, setGenre] = useState<Genre | null>(null);

  return (
    <div className="space-y-8">
      <StepIndicator step={step} />
      {step === 1 && (
        <FactionStep
          selected={faction}
          onSelect={(f) => { setFaction(f); setStep(2); }}
        />
      )}
      {step === 2 && (
        <GenreStep
          selected={genre}
          onSelect={(g) => { setGenre(g); setStep(3); }}
          onBack={() => setStep(1)}
        />
      )}
      {step === 3 && faction && genre && (
        <FormStep
          faction={faction}
          genre={genre}
          onBack={() => setStep(2)}
        />
      )}
    </div>
  );
}

function StepIndicator({ step }: { step: number }) {
  const steps = ["Faction", "Genre", "Fiche"];
  return (
    <div className="flex items-center gap-0">
      {steps.map((label, i) => {
        const n = i + 1;
        const active = n === step;
        const done = n < step;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center gap-1">
              <div className={`w-7 h-7 flex items-center justify-center text-xs font-black border transition-colors ${
                active ? "border-[#c0522a] text-[#c0522a] bg-[#c0522a]/10"
                : done ? "border-[#c0522a]/40 text-[#c0522a]/40 bg-transparent"
                : "border-[#2a2520] text-[#4a4540]"
              }`}>
                {done ? "✓" : n}
              </div>
              <span className={`text-xs uppercase tracking-widest ${active ? "text-[#9e9890]" : "text-[#4a4540]"}`}>
                {label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`w-16 h-px mx-2 mb-5 ${done ? "bg-[#c0522a]/40" : "bg-[#2a2520]"}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

function FactionStep({ selected, onSelect }: { selected: Faction | null; onSelect: (f: Faction) => void }) {
  return (
    <div className="space-y-6">
      <StepTitle>Choisissez votre faction</StepTitle>
      <div className="grid grid-cols-2 gap-4">
        {(["Les Résurgents", "Les Éveillés"] as Faction[]).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => onSelect(f)}
            className={`group border transition-all duration-200 flex flex-col items-center gap-4 p-6 ${
              selected === f
                ? "border-[#c0522a] bg-[#c0522a]/10"
                : "border-[#2a2520] bg-[#12100e] hover:border-[#c0522a]/50 hover:bg-[#1a1814]"
            }`}
          >
            {/* Placeholder image */}
            <div className="w-full aspect-[4/3] bg-[#1a1814] border border-[#2a2520] flex items-center justify-center">
              <span className="text-[#3a3530] text-xs uppercase tracking-widest">Image à venir</span>
            </div>
            <span className={`font-black uppercase tracking-widest text-sm ${
              selected === f ? "text-[#c0522a]" : "text-[#9e9890] group-hover:text-[#d4cfc8]"
            }`}>
              {f}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}

function GenreStep({ selected, onSelect, onBack }: {
  selected: Genre | null;
  onSelect: (g: Genre) => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-6">
      <StepTitle>Choisissez le genre de votre personnage</StepTitle>
      <div className="grid grid-cols-2 gap-4">
        {(["Homme", "Femme"] as Genre[]).map((g) => (
          <button
            key={g}
            type="button"
            onClick={() => onSelect(g)}
            className={`group border transition-all duration-200 flex flex-col items-center gap-4 p-6 ${
              selected === g
                ? "border-[#c0522a] bg-[#c0522a]/10"
                : "border-[#2a2520] bg-[#12100e] hover:border-[#c0522a]/50 hover:bg-[#1a1814]"
            }`}
          >
            <div className="w-full aspect-[4/3] bg-[#1a1814] border border-[#2a2520] flex items-center justify-center">
              <span className="text-[#3a3530] text-xs uppercase tracking-widest">Image à venir</span>
            </div>
            <span className={`font-black uppercase tracking-widest text-sm ${
              selected === g ? "text-[#c0522a]" : "text-[#9e9890] group-hover:text-[#d4cfc8]"
            }`}>
              {g}
            </span>
          </button>
        ))}
      </div>
      <BackButton onClick={onBack} />
    </div>
  );
}

function FormStep({ faction, genre, onBack }: { faction: Faction; genre: Genre; onBack: () => void }) {
  const router = useRouter();
  const [skills, setSkills] = useState<Skills>({ combat: 1, survie: 1, diplomatie: 1, technique: 1 });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const grades = GRADES[faction];

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErrors({});

    const fd = new FormData(e.currentTarget);
    const data = {
      nom: (fd.get("nom") as string).trim(),
      age: parseInt(fd.get("age") as string, 10),
      genre,
      faction,
      corporation: "",
      grade: (fd.get("grade") as string).trim(),
      description: (fd.get("description") as string).trim(),
      psychologie: (fd.get("psychologie") as string).trim(),
      historique: (fd.get("historique") as string).trim(),
      ...skills,
    };

    const errs: Record<string, string> = {};
    if (data.nom.length < 2) errs.nom = "Minimum 2 caractères.";
    if (isNaN(data.age) || data.age < 1 || data.age > 150) errs.age = "Âge invalide (1–150).";
    if (!data.grade) errs.grade = "Choisissez un grade.";
    if (data.description.length < 20) errs.description = "Minimum 20 caractères.";
    if (data.psychologie.length < 20) errs.psychologie = "Minimum 20 caractères.";
    if (data.historique.length < 20) errs.historique = "Minimum 20 caractères.";

    if (Object.keys(errs).length > 0) { setErrors(errs); return; }

    setSubmitting(true);
    try {
      const res = await fetch("/api/characters", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) {
        router.push("/dashboard");
        router.refresh();
      } else {
        const json = await res.json();
        setErrors({ _global: json.error ?? "Erreur inconnue." });
      }
    } catch {
      setErrors({ _global: "Erreur réseau. Réessaie." });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="space-y-6">
      <StepTitle>Remplissez votre fiche</StepTitle>

      {/* Récap verrouillé */}
      <div className="flex gap-3">
        <LockedBadge label="Faction" value={faction} />
        <LockedBadge label="Genre" value={genre} />
      </div>

      <div className="border border-[#2a2520] bg-[#12100e] p-8">
        <form onSubmit={handleSubmit} className="space-y-10">
          {errors._global && (
            <div className="border border-red-900/50 bg-red-950/20 text-red-400 px-4 py-3 text-sm">
              {errors._global}
            </div>
          )}

          {/* IDENTITÉ */}
          <section className="space-y-5">
            <SectionTitle>Identité</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Field label="Nom" error={errors.nom} required>
                <input name="nom" type="text" placeholder="Nom du personnage" className={inputCls(errors.nom)} />
              </Field>
              <Field label="Âge" error={errors.age} required>
                <input name="age" type="number" min={1} max={150} placeholder="Ex : 34" className={inputCls(errors.age)} />
              </Field>
              <Field label="Grade" error={errors.grade} required className="sm:col-span-2">
                <select name="grade" disabled={grades.length === 0} className={selectCls(errors.grade, grades.length === 0)}>
                  <option value="">
                    {grades.length === 0 ? "— Aucun grade disponible pour cette faction —" : "— Choisir —"}
                  </option>
                  {grades.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </Field>
            </div>
          </section>

          {/* DESCRIPTIONS */}
          <section className="space-y-5">
            <SectionTitle>Descriptions</SectionTitle>
            <Field label="Description" error={errors.description} required hint="Apparence, comportement général — min. 20 caractères">
              <textarea name="description" rows={4} placeholder="Grande silhouette abîmée par les années..." className={`${inputCls(errors.description)} resize-none`} />
            </Field>
            <Field label="Psychologie" error={errors.psychologie} required hint="Traits de personnalité, forces, faiblesses — min. 20 caractères">
              <textarea name="psychologie" rows={4} placeholder="Méfiant de nature mais loyal envers ses alliés..." className={`${inputCls(errors.psychologie)} resize-none`} />
            </Field>
            <Field label="Historique" error={errors.historique} required hint="Passé, origines, événements marquants — min. 20 caractères">
              <textarea name="historique" rows={5} placeholder="Né dans les ruines de l'ancienne ville..." className={`${inputCls(errors.historique)} resize-none`} />
            </Field>
          </section>

          {/* COMPÉTENCES */}
          <section className="space-y-5">
            <SectionTitle>Compétences</SectionTitle>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(["combat", "survie", "diplomatie", "technique"] as const).map((skill) => (
                <div key={skill} className="flex items-center justify-between border border-[#2a2520] bg-[#1a1814] px-4 py-3">
                  <span className="text-[#9e9890] text-xs uppercase tracking-widest">
                    {skill.charAt(0).toUpperCase() + skill.slice(1)}
                  </span>
                  <StarRating name={skill} value={skills[skill]} onChange={(v) => setSkills((s) => ({ ...s, [skill]: v }))} />
                </div>
              ))}
            </div>
            <p className="text-[#6b6560] text-xs">
              Total : {Object.values(skills).reduce((a, b) => a + b, 0)} / 20 points
            </p>
          </section>

          <button
            type="submit"
            disabled={submitting}
            className="w-full bg-[#c0522a] hover:bg-[#e0693a] disabled:opacity-40 disabled:cursor-not-allowed text-white font-black py-3 uppercase tracking-widest transition-colors text-sm"
          >
            {submitting ? "Envoi…" : "Soumettre la fiche"}
          </button>
        </form>
      </div>

      <BackButton onClick={onBack} />
    </div>
  );
}

function StepTitle({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <h1 className="text-2xl font-black uppercase tracking-[0.1em] text-[#d4cfc8]">{children}</h1>
      <div className="h-px bg-[#c0522a]/20 mt-3" />
    </div>
  );
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[#c0522a] text-xs uppercase tracking-[0.3em] font-black">{children}</span>
      <div className="flex-1 h-px bg-[#c0522a]/20" />
    </div>
  );
}

function LockedBadge({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-2 border border-[#2a2520] bg-[#12100e] px-3 py-2">
      <span className="text-[#6b6560] text-xs uppercase tracking-widest">{label} :</span>
      <span className="text-[#c0522a] text-xs font-black uppercase">{value}</span>
      <span className="text-[#3a3530] text-xs ml-1">🔒</span>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="text-[#6b6560] hover:text-[#d4cfc8] text-xs uppercase tracking-widest transition-colors flex items-center gap-2"
    >
      ← Retour
    </button>
  );
}

function Field({ label, error, hint, required, className, children }: {
  label: string; error?: string; hint?: string; required?: boolean; className?: string; children: React.ReactNode;
}) {
  return (
    <div className={`space-y-1.5 ${className ?? ""}`}>
      <label className="block text-[#9e9890] text-xs uppercase tracking-widest">
        {label}{required && <span className="text-[#c0522a] ml-1">*</span>}
      </label>
      {hint && <p className="text-[#6b6560] text-xs italic">{hint}</p>}
      {children}
      {error && <p className="text-red-500 text-xs">{error}</p>}
    </div>
  );
}

function inputCls(error?: string) {
  return `w-full bg-[#1a1814] border ${
    error ? "border-red-800" : "border-[#2a2520] focus:border-[#c0522a]/50"
  } text-[#d4cfc8] placeholder-[#4a4540] px-3 py-2 text-sm outline-none transition-colors`;
}

function selectCls(error?: string, disabled?: boolean) {
  return `w-full bg-[#1a1814] border ${
    error ? "border-red-800" : "border-[#2a2520] focus:border-[#c0522a]/50"
  } text-[#d4cfc8] px-3 py-2 text-sm outline-none transition-colors ${disabled ? "opacity-40 cursor-not-allowed" : ""}`;
}
