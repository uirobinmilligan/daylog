export type Entry = {
  id: string
  title: string
  body: string
  createdAt: number
}

export function formatEntryDate(ts: number): string {
  return new Date(ts).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    weekday: "short",
  })
}
