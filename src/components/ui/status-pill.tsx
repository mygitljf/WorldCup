export function StatusPill({ label }: Readonly<{ label: string }>) {
  return <span className="rounded-full bg-turf/10 px-3 py-1 text-xs font-black uppercase tracking-[0.18em] text-turf">{label}</span>
}
