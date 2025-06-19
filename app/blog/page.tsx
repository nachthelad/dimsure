import { BookOpen, Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function BlogPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Dimsure Blog</h1>
        <p className="text-xl text-muted-foreground">
          Articles and tips about packaging, logistics and Dimsure updates.
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
            <BookOpen className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Coming Soon</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">We're working on bringing you valuable content about:</p>
          <div className="grid md:grid-cols-3 gap-4 mt-6">
            <div className="p-4 bg-muted/50 rounded-lg">
              <BookOpen className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Best Practices</h3>
              <p className="text-xs text-muted-foreground mt-1">Packaging and measurement guides</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <Calendar className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Industry Updates</h3>
              <p className="text-xs text-muted-foreground mt-1">Latest logistics and shipping news</p>
            </div>
            <div className="p-4 bg-muted/50 rounded-lg">
              <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
              <h3 className="font-semibold text-sm">Platform News</h3>
              <p className="text-xs text-muted-foreground mt-1">Dimsure feature updates and announcements</p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-6">
            Stay tuned for expert articles, community spotlights, and platform updates.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
