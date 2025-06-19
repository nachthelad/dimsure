"use client"

import { Shield, Clock, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { APP_CONSTANTS } from "@/lib/constants"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-xl text-muted-foreground">Your privacy and data protection are important to us.</p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 p-4 bg-primary/10 rounded-full w-fit">
            <Shield className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl">Coming Soon</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground">
            We're currently finalizing our comprehensive Privacy Policy to ensure full transparency about how we
            collect, use, and protect your personal information.
          </p>

          <div className="bg-muted/50 p-6 rounded-lg text-left">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              What we're working on:
            </h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>• Data collection and usage policies</li>
              <li>• Cookie and tracking information</li>
              <li>• User rights and data control</li>
              <li>• Third-party service integrations</li>
              <li>• GDPR and CCPA compliance</li>
            </ul>
          </div>

          <div className="border-l-4 border-primary pl-4 text-left">
            <p className="text-sm text-muted-foreground">
              <strong>Current commitment:</strong> We only collect essential information needed to provide our service
              and never sell your personal data to third parties.
            </p>
          </div>

          <div className="pt-4">
            <p className="text-sm text-muted-foreground mb-4">
              Have questions about our privacy practices? Contact us:
            </p>
            <Button
              variant="outline"
              onClick={() =>
                (window.location.href = `mailto:${APP_CONSTANTS.ADMIN_EMAIL}?subject=Privacy Policy Question - Dimsure`)
              }
            >
              <Mail className="h-4 w-4 mr-2" />
              Contact Us About Privacy
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
