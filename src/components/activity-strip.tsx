import type { Entry } from "@/lib/entry"

const DAYS = 14
const DAY_MS = 86_400_000

export function ActivityStrip({ entries }: { entries: Entry[] }) {
  const counts = new Array<number>(DAYS).fill(0)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  for (const e of entries) {
    const ago = Math.floor((today.getTime() + DAY_MS - e.createdAt) / DAY_MS) - 1
    if (ago >= 0 && ago < DAYS) counts[DAYS - 1 - ago]++
  }
  return (
    <div className="mb-6 flex items-end gap-1" aria-label="entries in the last two weeks">
      {counts.map((n, i) => (
        <div
          key={i}
          title={`${n} ${n === 1 ? "entry" : "entries"}`}
          className={`h-6 flex-1 rounded-sm ${
            n === 0 ? "bg-muted" : n === 1 ? "bg-primary/40" : n < 4 ? "bg-primary/70" : "bg-primary"
          }`}
        />
      ))}
    </div>
  )
}
