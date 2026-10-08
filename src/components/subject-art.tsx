/** Desenho de cada matéria (para o fundo escuro do modo vídeo): simples, nas cores do Eduvia. */
const ORANGE = "#fb923c";
const ORANGE2 = "#ea580c";
const CREAM = "#ffedd5";
const SKY = "#38bdf8";
const GREEN = "#4ade80";
const SLATE = "#475569";

const ART: Record<string, React.ReactNode> = {
  portugues: (
    <>
      <path d="M22 30h110a14 14 0 0 1 14 14v52a14 14 0 0 1-14 14H74l-26 22v-22H22A14 14 0 0 1 8 96V44a14 14 0 0 1 14-14z" fill={ORANGE} />
      <text x="77" y="88" textAnchor="middle" fontSize="44" fontWeight="800" fill="#0f172a" fontFamily="inherit">Aa</text>
      <path d="M150 112h40a10 10 0 0 1 10 10v30a10 10 0 0 1-10 10h-6v14l-16-14h-18a10 10 0 0 1-10-10v-30a10 10 0 0 1 10-10z" fill={SKY} />
      <circle cx="158" cy="137" r="4" fill="#0f172a" /><circle cx="170" cy="137" r="4" fill="#0f172a" /><circle cx="182" cy="137" r="4" fill="#0f172a" />
    </>
  ),
  literatura: (
    <>
      <path d="M20 60c30-10 55-8 80 6v100c-25-14-50-16-80-6z" fill={CREAM} />
      <path d="M180 60c-30-10-55-8-80 6v100c25-14 50-16 80-6z" fill="#fed7aa" />
      <g stroke={SLATE} strokeWidth="3" strokeLinecap="round"><path d="M36 84c16-4 32-3 48 3M36 102c16-4 32-3 48 3M36 120c16-4 32-3 48 3M116 87c16-6 32-7 48-3M116 105c16-6 32-7 48-3" /></g>
      <path d="M150 20c20 10 28 34 10 60l-14 20-4-6c-6-22-4-48 8-74z" fill={ORANGE} />
      <path d="M142 94l-10 26" stroke={ORANGE2} strokeWidth="4" strokeLinecap="round" />
    </>
  ),
  artes: (
    <>
      <path d="M100 24c46 0 82 30 82 68 0 24-18 30-34 26-14-4-22 6-18 18 6 18-10 34-34 30-42-6-78-38-78-74 0-38 36-68 82-68z" fill={CREAM} />
      <circle cx="62" cy="80" r="13" fill={ORANGE} /><circle cx="98" cy="56" r="13" fill={SKY} /><circle cx="138" cy="68" r="13" fill={GREEN} /><circle cx="56" cy="120" r="13" fill="#f472b6" />
      <path d="M180 150l-50-50 8-8 50 50z" fill={ORANGE2} />
      <path d="M126 96l-10 4 6-12z" fill="#0f172a" />
    </>
  ),
  ingles: (
    <>
      <rect x="16" y="34" width="168" height="104" rx="18" fill={SKY} />
      <path d="M60 138l-8 30 32-30z" fill={SKY} />
      <text x="100" y="104" textAnchor="middle" fontSize="48" fontWeight="800" fill="#0f172a" fontFamily="inherit">Hi!</text>
      <circle cx="168" cy="40" r="20" fill={ORANGE} />
      <text x="168" y="47" textAnchor="middle" fontSize="18" fontWeight="800" fill="#0f172a" fontFamily="inherit">EN</text>
    </>
  ),
  espanhol: (
    <>
      <rect x="16" y="34" width="168" height="104" rx="18" fill={ORANGE} />
      <path d="M140 138l8 30-32-30z" fill={ORANGE} />
      <text x="100" y="104" textAnchor="middle" fontSize="44" fontWeight="800" fill="#0f172a" fontFamily="inherit">¡Hola!</text>
      <circle cx="32" cy="40" r="20" fill="#facc15" />
      <text x="32" y="47" textAnchor="middle" fontSize="18" fontWeight="800" fill="#0f172a" fontFamily="inherit">ES</text>
    </>
  ),
  historia: (
    <>
      <path d="M100 18l86 38H14z" fill={ORANGE} />
      <rect x="20" y="58" width="160" height="12" fill={CREAM} />
      <g fill={CREAM}><rect x="32" y="76" width="18" height="70" /><rect x="72" y="76" width="18" height="70" /><rect x="110" y="76" width="18" height="70" /><rect x="150" y="76" width="18" height="70" /></g>
      <rect x="14" y="150" width="172" height="16" rx="3" fill={ORANGE2} />
      <circle cx="170" cy="30" r="12" fill="none" stroke={SKY} strokeWidth="4" /><path d="M170 23v7l5 4" stroke={SKY} strokeWidth="3" strokeLinecap="round" />
    </>
  ),
  geografia: (
    <>
      <circle cx="100" cy="96" r="70" fill={SKY} />
      <path d="M58 54c18-8 30 2 26 16-4 12 12 18 6 32-6 12-24 8-28 22-10-8-22-30-16-50 2-8 6-14 12-20zM118 40c22 4 40 18 48 40-14 0-18 12-28 10-12-2-10-18-22-20-8-2-6-24 2-30zM120 118c14-4 30 2 34 14-8 16-26 28-40 30 2-14-8-38 6-44z" fill={GREEN} />
      <path d="M30 96h140M100 26c-24 30-24 110 0 140M100 26c24 30 24 110 0 140" stroke="#0c4a6e" strokeWidth="2" fill="none" opacity=".35" />
      <path d="M160 20c-9 0-16 7-16 16 0 12 16 28 16 28s16-16 16-28c0-9-7-16-16-16z" fill={ORANGE} /><circle cx="160" cy="36" r="6" fill="#0f172a" />
    </>
  ),
  filosofia: (
    <>
      <path d="M100 22c-34 0-58 26-58 56 0 20 10 32 22 42v24h72v-24c12-10 22-22 22-42 0-30-24-56-58-56z" fill="#facc15" />
      <rect x="66" y="148" width="68" height="12" rx="6" fill={CREAM} /><rect x="74" y="164" width="52" height="10" rx="5" fill={CREAM} />
      <path d="M86 120V96l14 10 14-10v24" stroke={ORANGE2} strokeWidth="5" fill="none" strokeLinejoin="round" />
      <g stroke="#facc15" strokeWidth="5" strokeLinecap="round"><path d="M18 60l-12-6M182 60l12-6M30 22l-8-10M170 22l8-10" /></g>
    </>
  ),
  sociologia: (
    <>
      <circle cx="100" cy="58" r="22" fill={ORANGE} /><path d="M60 150c0-30 18-50 40-50s40 20 40 50z" fill={ORANGE} />
      <circle cx="44" cy="76" r="17" fill={SKY} /><path d="M12 158c0-24 14-40 32-40s32 16 32 40z" fill={SKY} />
      <circle cx="156" cy="76" r="17" fill={GREEN} /><path d="M124 158c0-24 14-40 32-40s32 16 32 40z" fill={GREEN} />
    </>
  ),
  biologia: (
    <>
      <path d="M40 160C30 90 70 40 160 30c10 90-40 136-120 130z" fill="#22c55e" />
      <path d="M44 156C80 120 110 84 150 40" stroke="#14532d" strokeWidth="5" fill="none" strokeLinecap="round" />
      <g stroke="#14532d" strokeWidth="3" strokeLinecap="round"><path d="M78 118l-18-6M98 94l-16-10M118 72l-10-14M88 108l14 10M108 84l16 6" /></g>
      <circle cx="166" cy="128" r="22" fill="none" stroke={SKY} strokeWidth="4" /><circle cx="166" cy="128" r="8" fill={ORANGE} />
    </>
  ),
  quimica: (
    <>
      <path d="M76 20h48v12h-6v40l46 78c6 12-2 24-16 24H52c-14 0-22-12-16-24l46-78V32h-6z" fill={CREAM} />
      <path d="M58 118h84l20 34c4 8-1 14-10 14H48c-9 0-14-6-10-14z" fill={ORANGE} />
      <circle cx="84" cy="140" r="7" fill={CREAM} /><circle cx="110" cy="128" r="5" fill={CREAM} /><circle cx="122" cy="148" r="6" fill={CREAM} />
      <circle cx="160" cy="44" r="10" fill={SKY} /><circle cx="176" cy="26" r="6" fill={SKY} /><circle cx="40" cy="60" r="7" fill={GREEN} />
    </>
  ),
  fisica: (
    <>
      <circle cx="100" cy="96" r="14" fill={ORANGE} />
      <g fill="none" stroke={SKY} strokeWidth="5"><ellipse cx="100" cy="96" rx="80" ry="28" /><ellipse cx="100" cy="96" rx="80" ry="28" transform="rotate(60 100 96)" /><ellipse cx="100" cy="96" rx="80" ry="28" transform="rotate(-60 100 96)" /></g>
      <circle cx="180" cy="96" r="7" fill={GREEN} /><circle cx="60" cy="27" r="7" fill="#facc15" /><circle cx="60" cy="165" r="7" fill={CREAM} />
    </>
  ),
  matematica: (
    <>
      <path d="M20 168L20 40 148 168z" fill={ORANGE} /><path d="M38 150V84l66 66z" fill="#1e293b" />
      <rect x="20" y="152" width="16" height="16" fill="none" stroke={CREAM} strokeWidth="3" />
      <text x="150" y="80" textAnchor="middle" fontSize="64" fontWeight="800" fill={SKY} fontFamily="inherit">π</text>
      <g stroke={CREAM} strokeWidth="5" strokeLinecap="round"><path d="M154 118v24M142 130h24M146 160h20" /></g>
    </>
  ),
  redacao: (
    <>
      <rect x="30" y="22" width="120" height="152" rx="10" fill={CREAM} />
      <g stroke={SLATE} strokeWidth="4" strokeLinecap="round"><path d="M50 52h80M50 74h80M50 96h80M50 118h56M50 140h40" /></g>
      <path d="M176 60l14 14-74 74-20 6 6-20z" fill={ORANGE} /><path d="M176 60l14 14 6-6c4-4 4-10 0-14s-10-4-14 0z" fill={ORANGE2} />
    </>
  ),
};

export function SubjectArt({ slug, className }: { slug: string; className?: string }) {
  return (
    <svg viewBox="0 0 200 190" className={className} aria-hidden="true">
      {ART[slug] ?? ART.portugues}
    </svg>
  );
}
