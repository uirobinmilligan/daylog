import { formatEntryDate, type Entry } from "@/lib/entry"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type EntryCardProps = {
  entry: Entry
  onEdit: () => void
  onDelete: () => void
}

export function EntryCard({ entry, onEdit, onDelete }: EntryCardProps) {
  return (
    <Card>
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
              onClick={onEdit}
            >
              Edit
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-muted-foreground h-7 px-2 text-xs"
              onClick={onDelete}
            >
              Delete
            </Button>
          </div>
        </div>
      </CardHeader>
      {entry.body && <CardContent className="text-sm">{entry.body}</CardContent>}
    </Card>
  )
}
