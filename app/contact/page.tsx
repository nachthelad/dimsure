"use client"

import { Mail, MessageSquare, Clock, MapPin } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useLanguage } from "@/components/layout/language-provider"
import { APP_CONSTANTS } from "@/lib/constants"

export default function ContactPage() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">{t("contact.title")}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("contact.subtitle")}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Contact Information */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="h-5 w-5 text-primary" />
                {t("contact.email.title")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-muted-foreground">{t("contact.email.description")}</p>
              <div className="p-4 bg-primary/10 rounded-lg">
                <a
                  href={`mailto:${APP_CONSTANTS.ADMIN_EMAIL}`}
                  className="text-primary font-semibold hover:underline text-lg"
                >
                  {APP_CONSTANTS.ADMIN_EMAIL}
                </a>
              </div>
              <p className="text-sm text-muted-foreground">{t("contact.email.responseTime")}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-primary" />
                {t("contact.responseTime.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("contact.responseTime.general")}</span>
                  <span className="font-medium">{t("contact.responseTime.generalTime")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("contact.responseTime.technical")}</span>
                  <span className="font-medium">{t("contact.responseTime.technicalTime")}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{t("contact.responseTime.business")}</span>
                  <span className="font-medium">{t("contact.responseTime.businessTime")}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* What to Contact Us About */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                {t("contact.helpWith.title")}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-sm">
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <strong>{t("contact.helpWith.technical.title")}</strong>{" "}
                    {t("contact.helpWith.technical.description")}
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <strong>{t("contact.helpWith.data.title")}</strong> {t("contact.helpWith.data.description")}
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <strong>{t("contact.helpWith.business.title")}</strong> {t("contact.helpWith.business.description")}
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <strong>{t("contact.helpWith.features.title")}</strong> {t("contact.helpWith.features.description")}
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="w-2 h-2 bg-primary rounded-full mt-2 flex-shrink-0"></span>
                  <div>
                    <strong>{t("contact.helpWith.content.title")}</strong> {t("contact.helpWith.content.description")}
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>{t("contact.quickActions.title")}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  (window.location.href = `mailto:${APP_CONSTANTS.ADMIN_EMAIL}?subject=Technical Issue - Dimsure`)
                }
              >
                <Mail className="h-4 w-4 mr-2" />
                {t("contact.quickActions.reportTechnical")}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  (window.location.href = `mailto:${APP_CONSTANTS.ADMIN_EMAIL}?subject=Feature Request - Dimsure`)
                }
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                {t("contact.quickActions.suggestFeature")}
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start"
                onClick={() =>
                  (window.location.href = `mailto:${APP_CONSTANTS.ADMIN_EMAIL}?subject=Business Inquiry - Dimsure`)
                }
              >
                <MapPin className="h-4 w-4 mr-2" />
                {t("contact.quickActions.businessInquiry")}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Additional Info */}
      <Card className="mt-8">
        <CardContent className="text-center py-8">
          <h3 className="text-lg font-semibold mb-4">{t("contact.communityProject.title")}</h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">{t("contact.communityProject.description")}</p>
        </CardContent>
      </Card>
    </div>
  )
}
