import type { Entry } from "@/lib/entry"

export function toMarkdown(entries: Entry[]): string {
  const lines = ["# daylog export", ""]
  for (const e of entries) {
    const date = new Date(e.createdAt).toISOString().slice(0, 10)
    lines.push(`## ${e.title || "untitled"} · ${date}`)
    lines.push("")
    if (e.body) {
      lines.push(e.body)
      lines.push("")
    }
  }
  return lines.join("\n")
}

export function toJson(entries: Entry[]): string {
  return JSON.stringify(entries, null, 2)
}

export function downloadText(filename: string, text: string, mime = "text/plain") {
  const url = URL.createObjectURL(new Blob([text], { type: mime }))
  const a = document.createElement("a")
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
