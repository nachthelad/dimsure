import { ThumbsUp, User, Calendar, MessageSquare } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useUnit } from "./unit-provider"

interface AlternativeDimensionsProps {
  alternatives: Array<{
    id: string
    dimensions: { length: number; width: number; height: number }
    submittedBy: string
    votes: number
    submittedDate: string
    note?: string
  }>
}

export function AlternativeDimensions({ alternatives }: AlternativeDimensionsProps) {
  const { unit, convertDimension } = useUnit()

  const formatDimension = (value: number) => {
    const converted = convertDimension(value, "mm")
    return converted.toFixed(1)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Alternative Dimensions</CardTitle>
        <p className="text-sm text-muted-foreground">Community-submitted alternative measurements for this product.</p>
      </CardHeader>
      <CardContent className="space-y-6">
        {alternatives.map((alt, index) => (
          <div key={alt.id}>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="text-lg font-semibold">
                  {formatDimension(alt.dimensions.length)} × {formatDimension(alt.dimensions.width)} ×{" "}
                  {formatDimension(alt.dimensions.height)} {unit}
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant="outline" className="flex items-center gap-1">
                    <ThumbsUp className="h-3 w-3" />
                    {alt.votes}
                  </Badge>
                  <Button variant="outline" size="sm">
                    <ThumbsUp className="h-4 w-4 mr-1" />
                    Vote
                  </Button>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <User className="h-3 w-3" />
                  <span>@{alt.submittedBy}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="h-3 w-3" />
                  <span>{new Date(alt.submittedDate).toLocaleDateString()}</span>
                </div>
              </div>

              {alt.note && (
                <div className="bg-muted/50 p-3 rounded-lg">
                  <div className="flex items-start gap-2">
                    <MessageSquare className="h-4 w-4 text-muted-foreground mt-0.5" />
                    <p className="text-sm text-muted-foreground">{alt.note}</p>
                  </div>
                </div>
              )}
            </div>
            {index < alternatives.length - 1 && <Separator className="mt-6" />}
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
