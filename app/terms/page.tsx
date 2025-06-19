"use client"

import { FileText, Clock, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { APP_CONSTANTS } from "@/lib/constants"

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Terms of Service</h1>
        <p className="text-xl text-muted-foreground">The rules and guidelines for using Dimsure.</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
            <FileText className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Coming Soon</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground">
            We're preparing comprehensive Terms of Service that clearly outline the rights and responsibilities of all
            Dimsure users and contributors.
          </p>

          <div className="bg-muted/50 p-6 rounded-lg text-left">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              What will be covered:
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• User account responsibilities</li>
              <li>• Content contribution guidelines</li>
              <li>• Data accuracy and liability</li>
              <li>• Community behavior standards</li>
              <li>• Intellectual property rights</li>
              <li>• Service availability and limitations</li>
            </ul>
          </div>

          <div className="border-l-4 border-primary pl-4 text-left">
            <p className="text-sm text-muted-foreground">
              <strong>Current guidelines:</strong> Please contribute accurate data, respect other users, and use the
              platform responsibly. Detailed terms will be available soon.
            </p>
          </div>

          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Questions about our terms or need clarification on usage?
            </p>
            <Button
              variant="outline"
              onClick={() =>
                (window.location.href = `mailto:${APP_CONSTANTS.ADMIN_EMAIL}?subject=Terms of Service Question - Dimsure`)
              }
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact Us About Terms
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
