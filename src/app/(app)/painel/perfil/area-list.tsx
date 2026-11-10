"use client";
import { useTransition } from "react";
import { MapPin, X } from "lucide-react";
import { removeArea } from "../actions";

export function AreaList({ areas }: { areas: { id: string; uf: string; city: string }[] }) {
  const [pending, start] = useTransition();
  return (
    <ul className="flex flex-wrap gap-2">
      {areas.map((a) => (
        <li key={a.id} className="inline-flex items-center gap-1 rounded-full border border-border bg-surface-2 py-1 pl-3 pr-1 text-sm">
          <MapPin size={14} className="text-accent" /> {a.city}/{a.uf}
          {areas.length > 1 && (
            <button
              type="button"
              disabled={pending}
              onClick={() => start(async () => void (await removeArea(a.id)))}
              className="rounded-full p-1 text-muted hover:bg-border hover:text-foreground"
              aria-label={`Remover ${a.city}`}
            >
              <X size={14} />
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}
