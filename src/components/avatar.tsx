import { isAvatarId } from "@/lib/avatars";
import { cn } from "@/lib/utils";

/** Foto de perfil: o personagem escolhido ou, sem escolha, a inicial do nome. */
export function Avatar({ id, name, size = 32, className }: { id?: string | null; name: string; size?: number; className?: string }) {
  if (isAvatarId(id)) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={`/avatars/${id}.svg`} alt="" width={size} height={size} className={cn("shrink-0 rounded-full", className)} style={{ width: size, height: size }} />;
  }
  return (
    <span
      className={cn("grid shrink-0 place-items-center rounded-full bg-primary/15 font-semibold text-primary", className)}
      style={{ width: size, height: size, fontSize: Math.max(11, size * 0.42) }}
      aria-hidden
    >
      {name.trim().charAt(0).toUpperCase() || "?"}
    </span>
  );
}
