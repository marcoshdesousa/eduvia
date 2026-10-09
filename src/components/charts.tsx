"use client";
// Gráficos de série única (cor primária validada nos temas claro e escuro).
// Linha 2px, marcadores r=4 com anel da cor da superfície, colunas até 24px com ponta arredondada,
// grade discreta de 1px, uma só escala, tooltip no hover e tabela com os dados para acessibilidade.
import { useEffect, useState } from "react";
import { useTheme } from "next-themes";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

type Colors = { primary: string; surface: string; border: string; muted: string; surface2: string };
const FALLBACK: Colors = { primary: "#fb923c", surface: "#12151c", border: "#252a35", muted: "#8b93a3", surface2: "#1a1e27" };

/** SVG não resolve var(--x) em atributos: lê as cores do tema atual (e relê ao trocar o tema). */
function useChartColors(): Colors {
  const { resolvedTheme } = useTheme();
  const [colors, setColors] = useState(FALLBACK);
  useEffect(() => {
    const css = getComputedStyle(document.documentElement);
    const v = (name: string, fb: string) => css.getPropertyValue(name).trim() || fb;
    setColors({
      primary: v("--primary", FALLBACK.primary),
      surface: v("--surface", FALLBACK.surface),
      border: v("--border", FALLBACK.border),
      muted: v("--muted", FALLBACK.muted),
      surface2: v("--surface-2", FALLBACK.surface2),
    });
  }, [resolvedTheme]);
  return colors;
}

type Point = { label: string; value: number | null };

/** Formatos de valor (strings, para poder vir de componentes de servidor). */
export type ValueFormat = "number" | "percent" | "minutes" | "grade";
const FORMATTERS: Record<ValueFormat, (v: number) => string> = {
  number: (v) => String(v),
  percent: (v) => `${v}%`,
  minutes: (v) => `${v} min`,
  grade: (v) => v.toFixed(1).replace(".", ","),
};

const axis = (c: Colors) => ({ stroke: c.muted, tick: { fill: c.muted, fontSize: 12 }, tickLine: false, axisLine: false }) as const;

function ChartTooltip({ active, payload, label, format }: { active?: boolean; payload?: { value: number }[]; label?: string; format: (v: number) => string }) {
  if (!active || !payload?.length || payload[0].value == null) return null;
  return (
    <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs shadow-lg">
      <div className="text-muted">{label}</div>
      <div className="mt-0.5 flex items-center gap-2 font-semibold text-foreground">
        <span className="size-2 rounded-full bg-primary" />
        {format(payload[0].value)}
      </div>
    </div>
  );
}

function DataTable({ data, format, valueLabel }: { data: Point[]; format: (v: number) => string; valueLabel: string }) {
  return (
    <details className="mt-2 text-xs text-muted">
      <summary className="cursor-pointer select-none">Ver dados em tabela</summary>
      <table className="mt-2 w-full">
        <thead>
          <tr className="text-left"><th className="py-1 font-medium">Período</th><th className="py-1 text-right font-medium">{valueLabel}</th></tr>
        </thead>
        <tbody>
          {data.map((d) => (
            <tr key={d.label} className="border-t border-border"><td className="py-1">{d.label}</td><td className="py-1 text-right">{d.value == null ? "—" : format(d.value)}</td></tr>
          ))}
        </tbody>
      </table>
    </details>
  );
}

export function TrendChart({ data, format: fmt = "number", domain, valueLabel = "Valor", height = 200 }: { data: Point[]; format?: ValueFormat; domain?: [number, number]; valueLabel?: string; height?: number }) {
  const format = FORMATTERS[fmt];
  const c = useChartColors();
  const AXIS = axis(c);
  return (
    <div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={c.border} strokeWidth={1} vertical={false} />
            <XAxis dataKey="label" {...AXIS} interval="preserveStartEnd" minTickGap={16} />
            <YAxis {...AXIS} domain={domain ?? [0, "auto"]} tickFormatter={(v) => format(v)} width={56} />
            <Tooltip content={<ChartTooltip format={format} />} cursor={{ stroke: c.muted, strokeWidth: 1 }} />
            <Area
              type="monotone"
              dataKey="value"
              connectNulls
              stroke={c.primary}
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              fill={c.primary}
              fillOpacity={0.1}
              dot={{ r: 4, fill: c.primary, fillOpacity: 1, stroke: c.surface, strokeWidth: 2 }}
              activeDot={{ r: 6, fill: c.primary, fillOpacity: 1, stroke: c.surface, strokeWidth: 2 }}
              isAnimationActive={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
      <DataTable data={data} format={format} valueLabel={valueLabel} />
    </div>
  );
}

export function ColumnChart({ data, format: fmt = "number", valueLabel = "Valor", height = 200 }: { data: Point[]; format?: ValueFormat; valueLabel?: string; height?: number }) {
  const format = FORMATTERS[fmt];
  const c = useChartColors();
  const AXIS = axis(c);
  return (
    <div>
      <div style={{ height }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 8, right: 16, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={c.border} strokeWidth={1} vertical={false} />
            <XAxis dataKey="label" {...AXIS} interval="preserveStartEnd" minTickGap={12} />
            <YAxis {...AXIS} tickFormatter={(v) => format(v)} width={56} allowDecimals={false} />
            <Tooltip content={<ChartTooltip format={format} />} cursor={{ fill: c.surface2 }} />
            <Bar dataKey="value" fill={c.primary} radius={[4, 4, 0, 0]} maxBarSize={24} isAnimationActive={false} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <DataTable data={data} format={format} valueLabel={valueLabel} />
    </div>
  );
}
