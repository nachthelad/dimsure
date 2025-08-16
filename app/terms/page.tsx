"use client";

import {
  FileText,
  Users,
  Shield,
  AlertTriangle,
  Scale,
  Gavel,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
const CONTACT_EMAIL = "nachthelad.dev@gmail.com";

export default function TermsPage() {
  const lastUpdated = new Date().toLocaleDateString();

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Terms of Service
        </h1>
        <p className="text-xl text-muted-foreground">
          The rules and guidelines for using Dimsure.
        </p>
        <Badge variant="outline" className="mt-4">
          Last Updated: {lastUpdated}
        </Badge>
      </div>

      <div className="space-y-8">
        {/* Acceptance of Terms */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              1. Acceptance of Terms
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              By accessing and using Dimsure ("the Service"), you accept and
              agree to be bound by the terms and provision of this agreement.
            </p>
            <p className="text-muted-foreground">
              If you do not agree to abide by the above, please do not use this
              service.
            </p>
          </CardContent>
        </Card>

        {/* Description of Service */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              2. Description of Service
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Dimsure is a community-powered database that provides product
              dimension information for packaging and logistics purposes.
            </p>
            <p className="text-muted-foreground">
              The Service allows users to:
            </p>
            <ul className="space-y-2 text-muted-foreground ml-4">
              <li>• Search for product dimensions</li>
              <li>• Contribute product dimension data</li>
              <li>• Edit and improve existing product information</li>
              <li>• Participate in community discussions and disputes</li>
            </ul>
          </CardContent>
        </Card>

        {/* User Accounts and Responsibilities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              3. User Accounts and Responsibilities
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">Account Registration</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  • You must provide accurate and complete information when
                  creating an account
                </li>
                <li>
                  • You are responsible for maintaining the security of your
                  account
                </li>
                <li>
                  • You must notify us immediately of any unauthorized use of
                  your account
                </li>
                <li>• One person may not maintain more than one account</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">User Conduct</h3>
              <p className="text-muted-foreground mb-2">You agree not to:</p>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Submit false, inaccurate, or misleading information</li>
                <li>• Violate any applicable laws or regulations</li>
                <li>• Harass, abuse, or harm other users</li>
                <li>• Attempt to gain unauthorized access to the Service</li>
                <li>
                  • Use automated tools to access or interact with the Service
                </li>
                <li>• Submit spam or irrelevant content</li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Content and Data */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Scale className="h-5 w-5 text-primary" />
              4. Content and Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="font-semibold mb-3">User-Generated Content</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• You retain ownership of content you submit</li>
                <li>
                  • By submitting content, you grant us a license to use,
                  display, and distribute it
                </li>
                <li>
                  • You are responsible for ensuring you have the right to
                  submit content
                </li>
                <li>• We may remove content that violates these terms</li>
              </ul>
            </div>

            <Separator />

            <div>
              <h3 className="font-semibold mb-3">Data Accuracy</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Users should strive to provide accurate measurements</li>
                <li>• We encourage community verification of data</li>
                <li>
                  • We are not responsible for the accuracy of user-submitted
                  data
                </li>
                <li>
                  • Users should verify critical measurements independently
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Intellectual Property */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Gavel className="h-5 w-5 text-primary" />
              5. Intellectual Property
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              The Service and its original content, features, and functionality
              are owned by Dimsure and are protected by international copyright,
              trademark, patent, trade secret, and other intellectual property
              laws.
            </p>
            <p className="text-muted-foreground">
              Product names, brands, and trademarks mentioned in the database
              remain the property of their respective owners.
            </p>
          </CardContent>
        </Card>

        {/* Privacy and Data Protection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              6. Privacy and Data Protection
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              Your privacy is important to us. Please review our Privacy Policy,
              which also governs your use of the Service, to understand our
              practices.
            </p>
            <p className="text-muted-foreground">
              By using our Service, you agree to the collection and use of
              information in accordance with our Privacy Policy.
            </p>
          </CardContent>
        </Card>

        {/* Disclaimers and Limitations */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-primary" />
              7. Disclaimers and Limitations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-yellow-50 dark:bg-yellow-950 p-4 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <p className="text-yellow-800 dark:text-yellow-200 font-semibold mb-2">
                Important Disclaimer
              </p>
              <p className="text-yellow-800 dark:text-yellow-200 text-sm">
                The information provided on Dimsure is for general informational
                purposes only. While we strive for accuracy, we make no
                warranties about the completeness, reliability, or accuracy of
                this information.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-3">Limitation of Liability</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>
                  • The Service is provided "as is" without warranties of any
                  kind
                </li>
                <li>
                  • We are not liable for any damages arising from use of the
                  Service
                </li>
                <li>
                  • Users should verify critical measurements independently
                </li>
                <li>
                  • We do not guarantee the availability or reliability of the
                  Service
                </li>
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Termination */}
        <Card>
          <CardHeader>
            <CardTitle>8. Termination</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We may terminate or suspend your account and access to the Service
              immediately, without prior notice or liability, for any reason,
              including breach of these Terms.
            </p>
            <p className="text-muted-foreground">
              You may terminate your account at any time by contacting us or
              using the account deactivation feature.
            </p>
          </CardContent>
        </Card>

        {/* Changes to Terms */}
        <Card>
          <CardHeader>
            <CardTitle>9. Changes to Terms</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              We reserve the right to modify these terms at any time. We will
              notify users of significant changes via email or through the
              Service.
            </p>
            <p className="text-muted-foreground">
              Your continued use of the Service after changes constitutes
              acceptance of the new terms.
            </p>
          </CardContent>
        </Card>

        {/* Governing Law */}
        <Card>
          <CardHeader>
            <CardTitle>10. Governing Law</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              These Terms shall be governed by and construed in accordance with
              the laws of Argentina, without regard to its conflict of law
              provisions.
            </p>
          </CardContent>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <CardTitle>11. Contact Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-muted-foreground">
              If you have any questions about these Terms of Service, please
              contact us:
            </p>
            <div className="bg-muted/50 p-4 rounded-lg">
              <p className="font-semibold">Email:</p>
              <p className="text-muted-foreground">{CONTACT_EMAIL}</p>
              <p className="font-semibold mt-2">Subject Line:</p>
              <p className="text-muted-foreground">
                "Terms of Service Question - Dimsure"
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
