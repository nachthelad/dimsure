"use client"

import { Shield, Eye, Lock, Users, Database, Globe, UserCheck, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-xl text-muted-foreground">Your privacy and data protection are important to us.</p>
        <Badge variant="outline" className="mt-4">
          Last updated: {new Date().toLocaleDateString()}
        </Badge>
      </div>

      <div className="space-y-8">
        {/* Introduction */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              Introduction
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Dimsure ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how
              we collect, use, disclose, and safeguard your information when you use our website and services.
            </p>
            <p className="text-muted-foreground">
              By using Dimsure, you agree to the collection and use of information in accordance with this policy.
            </p>
          </CardContent>
        </Card>

        {/* Information We Collect */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="h-5 w-5 text-primary" />
              Information We Collect
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Personal Information</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  • <strong>Google Account Data:</strong> Name, email address, and profile picture when you sign in with
                  Google
                </li>
                <li>
                  • <strong>Username:</strong> Custom username you choose for your public profile
                </li>
                <li>
                  • <strong>Product Contributions:</strong> Product data, dimensions, and descriptions you submit
                </li>
                <li>
                  • <strong>User Interactions:</strong> Likes, views, comments, and other platform activities
                </li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">Automatically Collected Information</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  • <strong>Usage Data:</strong> Pages visited, time spent, and user interactions
                </li>
                <li>
                  • <strong>Device Information:</strong> Browser type, operating system, and device identifiers
                </li>
                <li>
                  • <strong>IP Address:</strong> For security and analytics purposes
                </li>
                <li>
                  • <strong>Cookies:</strong> To enhance your experience and remember preferences
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
              How We Use Your Information
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                • <strong>Account Management:</strong> Create and manage your user account
              </li>
              <li>
                • <strong>Service Provision:</strong> Enable you to contribute and access product dimension data
              </li>
              <li>
                • <strong>Attribution:</strong> Display your contributions with your chosen username
              </li>
              <li>
                • <strong>Communication:</strong> Send important updates about our service
              </li>
              <li>
                • <strong>Analytics:</strong> Understand usage patterns to improve our platform
              </li>
              <li>
                • <strong>Security:</strong> Protect against fraud and unauthorized access
              </li>
              <li>
                • <strong>Legal Compliance:</strong> Meet legal obligations and enforce our terms
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Data Sharing */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              How We Share Your Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
              <p className="text-green-800 dark:text-green-200 font-semibold">
                🛡️ We DO NOT sell your personal data to third parties.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Third-Party Services</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  • <strong>Google:</strong> Authentication services and analytics
                </li>
                <li>
                  • <strong>Firebase:</strong> Database and hosting services
                </li>
                <li>
                  • <strong>Vercel:</strong> Website hosting and deployment
                </li>
                <li>
                  • <strong>Google AdSense:</strong> Advertising services (anonymized data only)
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Public Information</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Your username and product contributions are publicly visible</li>
                <li>• Product data you submit becomes part of our public database</li>
                <li>• Comments and interactions on products are publicly displayed</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Data Security */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Data Security
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                • <strong>Encryption:</strong> All data is encrypted in transit and at rest
              </li>
              <li>
                • <strong>Access Control:</strong> Limited access to personal data on a need-to-know basis
              </li>
              <li>
                • <strong>Google Security:</strong> We leverage Google's enterprise-grade security infrastructure
              </li>
              <li>
                • <strong>Regular Updates:</strong> Security measures are continuously updated and monitored
              </li>
              <li>
                • <strong>Data Minimization:</strong> We only collect data necessary for our services
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Your Rights */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCheck className="h-5 w-5 text-primary" />
              Your Rights and Choices
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Account Management</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  • <strong>Access:</strong> View and download your personal data
                </li>
                <li>
                  • <strong>Correction:</strong> Update or correct your information
                </li>
                <li>
                  • <strong>Deactivation:</strong> Deactivate your account (data preserved for reactivation)
                </li>
                <li>
                  • <strong>Username Changes:</strong> Modify your public username
                </li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Data Control</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  • <strong>Cookie Preferences:</strong> Manage cookie settings in your browser
                </li>
                <li>
                  • <strong>Marketing Opt-out:</strong> Unsubscribe from promotional communications
                </li>
                <li>
                  • <strong>Data Portability:</strong> Request a copy of your data in a portable format
                </li>
              </ul>
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
              <p className="text-blue-800 dark:text-blue-200">
                <strong>Note:</strong> Product contributions may remain in our database even after account deactivation
                to maintain data integrity for the community. Your username will be anonymized if you choose to
                permanently delete your account.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* International Users */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5 text-primary" />
              International Users
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-3">GDPR Compliance (EU Users)</h3>
              <p className="text-muted-foreground mb-2">
                If you are located in the European Union, you have additional rights under GDPR:
              </p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Right to be forgotten (data deletion)</li>
                <li>• Right to data portability</li>
                <li>• Right to object to processing</li>
                <li>• Right to withdraw consent</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold mb-3">CCPA Compliance (California Users)</h3>
              <p className="text-muted-foreground mb-2">California residents have the right to:</p>
              <ul className="space-y-1 text-muted-foreground">
                <li>• Know what personal information is collected</li>
                <li>• Delete personal information</li>
                <li>• Opt-out of the sale of personal information</li>
                <li>• Non-discrimination for exercising privacy rights</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Cookies */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Cookies and Tracking
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">We use cookies and similar technologies to enhance your experience:</p>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <h4 className="font-semibold mb-2">Essential Cookies</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Authentication state</li>
                  <li>• Security features</li>
                  <li>• Basic functionality</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold mb-2">Analytics Cookies</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Usage statistics</li>
                  <li>• Performance monitoring</li>
                  <li>• Feature optimization</li>
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
              Data Retention
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2 text-muted-foreground">
              <li>
                • <strong>Active Accounts:</strong> Data retained while account is active
              </li>
              <li>
                • <strong>Deactivated Accounts:</strong> Personal data preserved for potential reactivation
              </li>
              <li>
                • <strong>Product Contributions:</strong> Retained indefinitely for community benefit
              </li>
              <li>
                • <strong>Analytics Data:</strong> Aggregated data retained for up to 26 months
              </li>
              <li>
                • <strong>Legal Requirements:</strong> Some data may be retained longer for legal compliance
              </li>
            </ul>
          </CardContent>
        </Card>

        {/* Changes to Policy */}
        <Card>
          <CardHeader>
            <CardTitle>Changes to This Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new
              Privacy Policy on this page and updating the "Last updated" date. You are advised to review this Privacy
              Policy periodically for any changes.
            </p>
          </CardContent>
        </Card>

        {/* Contact */}
        <Card>
          <CardHeader>
            <CardTitle>Contact Us</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              If you have any questions about this Privacy Policy or our data practices, please contact us:
            </p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="font-semibold">Email:</p>
              <p className="text-muted-foreground">privacy@dimsure.com</p>
              <p className="font-semibold mt-2">Subject Line:</p>
              <p className="text-muted-foreground">Privacy Policy Question - Dimsure</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
