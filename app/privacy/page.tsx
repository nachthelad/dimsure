"use client"

import { Shield, Eye, Lock, Users, Database, Globe, UserCheck, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useLanguage } from "@/components/layout/language-provider"

export default function PrivacyPage() {
  const { t } = useLanguage()

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">{t("privacy.title")}</h1>
        <p className="text-xl text-muted-foreground">{t("privacy.subtitle")}</p>
        <Badge variant="outline" className="mt-4">
          {t("privacy.lastUpdated")} {new Date().toLocaleDateString()}
        </Badge>
      </div>

      <div className="space-y-8">
        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              {t("privacy.sections.introduction.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{t("privacy.sections.introduction.description1")}</p>
            <p className="text-muted-foreground">{t("privacy.sections.introduction.description2")}</p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              {t("privacy.sections.informationWeCollect.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">{t("privacy.sections.informationWeCollect.personalInfo.title")}</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  • <strong>Google Account Data:</strong>{" "}
                  {t("privacy.sections.informationWeCollect.personalInfo.googleAccount")}
                </li>
                <li>
                  • <strong>Username:</strong> {t("privacy.sections.informationWeCollect.personalInfo.username")}
                </li>
                <li>
                  • <strong>Product Contributions:</strong>{" "}
                  {t("privacy.sections.informationWeCollect.personalInfo.contributions")}
                </li>
                <li>
                  • <strong>User Interactions:</strong>{" "}
                  {t("privacy.sections.informationWeCollect.personalInfo.interactions")}
                </li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">{t("privacy.sections.informationWeCollect.automaticInfo.title")}</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  • <strong>Usage Data:</strong> {t("privacy.sections.informationWeCollect.automaticInfo.usageData")}
                </li>
                <li>
                  • <strong>Device Information:</strong>{" "}
                  {t("privacy.sections.informationWeCollect.automaticInfo.deviceInfo")}
                </li>
                <li>
                  • <strong>IP Address:</strong> {t("privacy.sections.informationWeCollect.automaticInfo.ipAddress")}
                </li>
                <li>
                  • <strong>Cookies:</strong> {t("privacy.sections.informationWeCollect.automaticInfo.cookies")}
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* How We Use Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              {t("privacy.sections.howWeUse.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                • <strong>Account Management:</strong> {t("privacy.sections.howWeUse.accountManagement")}
              </li>
              <li>
                • <strong>Service Provision:</strong> {t("privacy.sections.howWeUse.serviceProvision")}
              </li>
              <li>
                • <strong>Attribution:</strong> {t("privacy.sections.howWeUse.attribution")}
              </li>
              <li>
                • <strong>Communication:</strong> {t("privacy.sections.howWeUse.communication")}
              </li>
              <li>
                • <strong>Analytics:</strong> {t("privacy.sections.howWeUse.analytics")}
              </li>
              <li>
                • <strong>Security:</strong> {t("privacy.sections.howWeUse.security")}
              </li>
              <li>
                • <strong>Legal Compliance:</strong> {t("privacy.sections.howWeUse.legalCompliance")}
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              {t("privacy.sections.dataSharing.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-green-800 dark:text-green-200 font-semibold">
                {t("privacy.sections.dataSharing.noSelling")}
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">{t("privacy.sections.dataSharing.thirdPartyServices.title")}</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  • <strong>Google:</strong> {t("privacy.sections.dataSharing.thirdPartyServices.google")}
                </li>
                <li>
                  • <strong>Firebase:</strong> {t("privacy.sections.dataSharing.thirdPartyServices.firebase")}
                </li>
                <li>
                  • <strong>Vercel:</strong> {t("privacy.sections.dataSharing.thirdPartyServices.vercel")}
                </li>
                <li>
                  • <strong>Google AdSense:</strong> {t("privacy.sections.dataSharing.thirdPartyServices.adsense")}
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">{t("privacy.sections.dataSharing.publicInfo.title")}</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• {t("privacy.sections.dataSharing.publicInfo.username")}</li>
                <li>• {t("privacy.sections.dataSharing.publicInfo.productData")}</li>
                <li>• {t("privacy.sections.dataSharing.publicInfo.comments")}</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              {t("privacy.sections.dataSecurity.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                • <strong>Encryption:</strong> {t("privacy.sections.dataSecurity.encryption")}
              </li>
              <li>
                • <strong>Access Control:</strong> {t("privacy.sections.dataSecurity.accessControl")}
              </li>
              <li>
                • <strong>Google Security:</strong> {t("privacy.sections.dataSecurity.googleSecurity")}
              </li>
              <li>
                • <strong>Regular Updates:</strong> {t("privacy.sections.dataSecurity.regularUpdates")}
              </li>
              <li>
                • <strong>Data Minimization:</strong> {t("privacy.sections.dataSecurity.dataMinimization")}
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              {t("privacy.sections.yourRights.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">{t("privacy.sections.yourRights.accountManagement.title")}</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  • <strong>Access:</strong> {t("privacy.sections.yourRights.accountManagement.access")}
                </li>
                <li>
                  • <strong>Correction:</strong> {t("privacy.sections.yourRights.accountManagement.correction")}
                </li>
                <li>
                  • <strong>Deactivation:</strong> {t("privacy.sections.yourRights.accountManagement.deactivation")}
                </li>
                <li>
                  • <strong>Username Changes:</strong>{" "}
                  {t("privacy.sections.yourRights.accountManagement.usernameChanges")}
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">{t("privacy.sections.yourRights.dataControl.title")}</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  • <strong>Cookie Preferences:</strong>{" "}
                  {t("privacy.sections.yourRights.dataControl.cookiePreferences")}
                </li>
                <li>
                  • <strong>Marketing Opt-out:</strong> {t("privacy.sections.yourRights.dataControl.marketingOptOut")}
                </li>
                <li>
                  • <strong>Data Portability:</strong> {t("privacy.sections.yourRights.dataControl.dataPortability")}
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-200">
                <strong>Nota:</strong> {t("privacy.sections.yourRights.note")}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* International Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              {t("privacy.sections.internationalUsers.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">{t("privacy.sections.internationalUsers.gdprCompliance.title")}</h3>
              <p className="text-muted-foreground mb-2">
                {t("privacy.sections.internationalUsers.gdprCompliance.description")}
              </p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• {t("privacy.sections.internationalUsers.gdprCompliance.rightToBeForgotten")}</li>
                <li>• {t("privacy.sections.internationalUsers.gdprCompliance.dataPortability")}</li>
                <li>• {t("privacy.sections.internationalUsers.gdprCompliance.objectToProcessing")}</li>
                <li>• {t("privacy.sections.internationalUsers.gdprCompliance.withdrawConsent")}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">{t("privacy.sections.internationalUsers.ccpaCompliance.title")}</h3>
              <p className="text-muted-foreground mb-2">
                {t("privacy.sections.internationalUsers.ccpaCompliance.description")}
              </p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• {t("privacy.sections.internationalUsers.ccpaCompliance.knowInfo")}</li>
                <li>• {t("privacy.sections.internationalUsers.ccpaCompliance.deleteInfo")}</li>
                <li>• {t("privacy.sections.internationalUsers.ccpaCompliance.optOutSale")}</li>
                <li>• {t("privacy.sections.internationalUsers.ccpaCompliance.nonDiscrimination")}</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              {t("privacy.sections.cookies.title")}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">{t("privacy.sections.cookies.description")}</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">{t("privacy.sections.cookies.essential.title")}</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• {t("privacy.sections.cookies.essential.authState")}</li>
                  <li>• {t("privacy.sections.cookies.essential.security")}</li>
                  <li>• {t("privacy.sections.cookies.essential.basicFunctionality")}</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">{t("privacy.sections.cookies.analytics.title")}</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• {t("privacy.sections.cookies.analytics.usageStats")}</li>
                  <li>• {t("privacy.sections.cookies.analytics.performanceMonitoring")}</li>
                  <li>• {t("privacy.sections.cookies.analytics.featureOptimization")}</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Data Retention */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              {t("privacy.sections.dataRetention.title")}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                • <strong>Active Accounts:</strong> {t("privacy.sections.dataRetention.activeAccounts")}
              </li>
              <li>
                • <strong>Deactivated Accounts:</strong> {t("privacy.sections.dataRetention.deactivatedAccounts")}
              </li>
              <li>
                • <strong>Product Contributions:</strong> {t("privacy.sections.dataRetention.productContributions")}
              </li>
              <li>
                • <strong>Analytics Data:</strong> {t("privacy.sections.dataRetention.analyticsData")}
              </li>
              <li>
                • <strong>Legal Requirements:</strong> {t("privacy.sections.dataRetention.legalRequirements")}
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Changes to Policy */}
        <Card>
          <CardHeader>
            <CardTitle>{t("privacy.sections.changesToPolicy.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">{t("privacy.sections.changesToPolicy.description")}</p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>{t("privacy.sections.contact.title")}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{t("privacy.sections.contact.description")}</p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="font-semibold">{t("privacy.sections.contact.email")}</p>
              <p className="text-muted-foreground">{t("privacy.sections.contact.emailAddress")}</p>
              <p className="font-semibold mt-2">{t("privacy.sections.contact.subjectLine")}</p>
              <p className="text-muted-foreground">{t("privacy.sections.contact.subjectText")}</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
