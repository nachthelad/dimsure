"use client"

import { Package, Target, Users, Zap, Mail } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { useLanguage } from "@/components/layout/language-provider"

export default function AboutPage() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">{t("about.title")}</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("about.subtitle")}</p>
      </div>

      {/* Mission Section */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Target className="h-6 w-6 text-primary" />
            {t("about.mission.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{t("about.mission.description1")}</p>
          <p className="text-muted-foreground">
            {t("about.mission.description2")} <strong>{t("about.mission.goal")}</strong>
          </p>
        </CardContent>
      </Card>

      {/* Why It Matters */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">{t("about.whyMatters.title")}</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("about.whyMatters.ecommerce.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t("about.whyMatters.ecommerce.description")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("about.whyMatters.logistics.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t("about.whyMatters.logistics.description")}</p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">{t("about.whyMatters.consumers.title")}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{t("about.whyMatters.consumers.description")}</p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Zap className="h-6 w-6 text-primary" />
            {t("about.howItWorks.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">{t("about.howItWorks.step1.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("about.howItWorks.step1.description")}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">{t("about.howItWorks.step2.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("about.howItWorks.step2.description")}</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">{t("about.howItWorks.step3.title")}</h3>
              <p className="text-sm text-muted-foreground">{t("about.howItWorks.step3.description")}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Users className="h-6 w-6 text-primary" />
            {t("about.community.title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">{t("about.community.description1")}</p>
          <p className="text-muted-foreground">{t("about.community.description2")}</p>
        </CardContent>
      </Card>

      {/* Get Involved */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">{t("about.getInvolved.title")}</CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground">{t("about.getInvolved.description")}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/add-product">
              <Button size="lg">
                <Package className="h-5 w-5 mr-2" />
                {t("about.getInvolved.addProduct")}
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                <Mail className="h-5 w-5 mr-2" />
                {t("about.getInvolved.contactUs")}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
