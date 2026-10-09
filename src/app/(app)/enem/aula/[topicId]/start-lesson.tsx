"use client";
import { useState, useTransition } from "react";
import { Clock, PlayCircle } from "lucide-react";
import { startEnemLessonAction } from "@/app/actions/enem";
import { Button } from "@/components/ui/button";
import { MinutesPicker } from "../../../estudar/[plannedId]/minutes-picker";

/** "Quanto tempo você tem agora?" e o botão que prepara a aula (texto + 10 questões do ENEM) e abre. */
export function StartLesson({ topicId, options, suggested, resume }: { topicId: string; options: readonly number[]; suggested: number; resume?: boolean }) {
  const [minutes, setMinutes] = useState(suggested);
  const [error, setError] = useState<string | null>(null);
  const [pending, start] = useTransition();
  return (
    <div className="space-y-3">
      <p className="flex items-center gap-2 font-semibold"><Clock size={18} className="text-primary" /> Quanto tempo você tem agora?</p>
      <MinutesPicker options={options} value={minutes} onChange={setMinutes} />
      {resume && <p className="text-sm text-muted">Você abriu esta aula há um tempo e não terminou: ela recomeça com outras questões.</p>}
      <Button
        size="lg"
        className="w-full"
        disabled={pending}
        onClick={() =>
          start(async () => {
            const r = await startEnemLessonAction(topicId, minutes);
            if (r?.error) setError(r.error);
          })
        }
      >
        <PlayCircle size={18} /> {pending ? "Preparando a aula..." : `Começar aula de ${minutes} min`}
      </Button>
      {error && <p className="text-sm text-danger">{error}</p>}
    </div>
  );
}
