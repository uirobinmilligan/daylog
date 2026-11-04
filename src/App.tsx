import { useEffect, useState } from "react"
import { useLocalStorage } from "@/hooks/use-local-storage"
import { formatEntryDate, type Entry } from "@/lib/entry"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

export default function App() {
  const [entries, setEntries] = useLocalStorage<Entry[]>("daylog.entries", [])
  const [title, setTitle] = useState("")
  const [body, setBody] = useState("")
  const [dark, setDark] = useState(false)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  function addEntry() {
    const text = title.trim() || body.trim()
    if (!text) return
    setEntries((prev) => [
      { id: crypto.randomUUID(), title: title.trim(), body: body.trim(), createdAt: Date.now() },
      ...prev,
    ])
    setTitle("")
    setBody("")
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl px-4 py-10">
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">daylog</h1>
        <Button variant="outline" size="sm" onClick={() => setDark((d) => !d)}>
          {dark ? "Light" : "Dark"}
        </Button>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">one note a day, keep the fog away</p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">New entry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title (optional)"
          />
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="What happened today?"
            rows={3}
          />
          <Button onClick={addEntry} className="w-full sm:w-auto">
            Save entry
          </Button>
        </CardContent>
      </Card>

      <div className="space-y-3">
        {entries.length === 0 && (
          <p className="text-muted-foreground py-8 text-center text-sm">
            No entries yet — write the first one.
          </p>
        )}
        {entries.map((entry) => (
          <Card key={entry.id}>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-base">
                  {entry.title || entry.body.slice(0, 40)}
                </CardTitle>
                <div className="flex items-center gap-1">
                  <p className="text-muted-foreground text-xs">
                    {formatEntryDate(entry.createdAt)}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground h-7 px-2 text-xs"
                    onClick={() => setEntries((prev) => prev.filter((e) => e.id !== entry.id))}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardHeader>
            {entry.body && <CardContent className="text-sm">{entry.body}</CardContent>}
          </Card>
        ))}
      </div>
    </main>
  )
}
