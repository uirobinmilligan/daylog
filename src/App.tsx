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
  const [dark, setDark] = useLocalStorage<boolean>("daylog.theme", false)
  const [editingId, setEditingId] = useState<string | null>(null)

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark)
  }, [dark])

  function saveEntry() {
    if (!title.trim() && !body.trim()) return
    if (editingId) {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === editingId ? { ...e, title: title.trim(), body: body.trim() } : e,
        ),
      )
    } else {
      setEntries((prev) => [
        { id: crypto.randomUUID(), title: title.trim(), body: body.trim(), createdAt: Date.now() },
        ...prev,
      ])
    }
    setEditingId(null)
    setTitle("")
    setBody("")
  }

  function startEdit(entry: Entry) {
    setEditingId(entry.id)
    setTitle(entry.title)
    setBody(entry.body)
  }

  return (
    <main className="mx-auto min-h-screen max-w-xl px-4 py-10">
      <div className="mb-1 flex items-center justify-between">
        <h1 className="text-2xl font-semibold tracking-tight">daylog</h1>
        <Button variant="outline" size="sm" onClick={() => setDark((d) => !d)}>
          {dark ? "Light" : "Dark"}
        </Button>
      </div>
      <p className="text-muted-foreground mb-6 text-sm">
        one note a day, keep the fog away
        {entries.length > 0 && <span className="text-xs"> · {entries.length} saved</span>}
      </p>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-base">
            {editingId ? "Edit entry" : "New entry"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault()
              saveEntry()
            }}
          >
            <Input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Title (optional)"
            />
            <Textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") saveEntry()
              }}
              placeholder="What happened today?"
              rows={3}
            />
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={!title.trim() && !body.trim()}
                className="w-full sm:w-auto"
              >
                {editingId ? "Save changes" : "Save entry"}
              </Button>
              {editingId && (
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => {
                    setEditingId(null)
                    setTitle("")
                    setBody("")
                  }}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
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
                    onClick={() => startEdit(entry)}
                  >
                    Edit
                  </Button>
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
