"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Search,
  Package,
  Users,
  Shield,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const faqData = [
  {
    category: "General",
    icon: HelpCircle,
    questions: [
      {
        question: "What is Dimsure?",
        answer:
          "Dimsure is a community-powered database that provides accurate product dimension information for packaging, logistics, and e-commerce purposes. Our goal is to help businesses and individuals make informed decisions about product sizing and packaging optimization.",
      },
      {
        question: "How accurate are the product dimensions?",
        answer:
          "Our community-verified dimensions are typically accurate within 1-2mm. Each measurement includes a confidence score based on community verification, source reliability, and the number of contributors. We encourage multiple measurements from different users to ensure accuracy.",
      },
      {
        question: "Is Dimsure free to use?",
        answer:
          "Yes, Dimsure is completely free to use. You can search for product dimensions, contribute new measurements, and access all features without any cost. We're supported by community contributions and advertising.",
      },
      {
        question: "Can I use this data for commercial purposes?",
        answer:
          "Yes, our database is designed to help businesses optimize their packaging and logistics. However, we recommend verifying critical measurements independently, especially for high-value or precision applications.",
      },
    ],
  },
  {
    category: "Contributing",
    icon: Package,
    questions: [
      {
        question: "How do I contribute product dimensions?",
        answer:
          "Simply create an account using your Google login, search for a product, and click 'Add Product' if it doesn't exist, or 'Edit' to improve existing data. All contributions are reviewed by our community for accuracy.",
      },
      {
        question: "What measurement standards do you use?",
        answer:
          "We support both metric (mm, cm, m) and imperial (inches, feet) measurements. All data is stored in millimeters for consistency and converted for display based on your preference settings.",
      },
      {
        question: "How should I measure products?",
        answer:
          "Measure the outer dimensions of the product's packaging or the product itself if unpackaged. Use length × width × height format, where length is the longest dimension. Include any protruding parts or handles in your measurements.",
      },
      {
        question: "Can I edit existing product information?",
        answer:
          "Yes, registered users can suggest edits to existing products. Changes go through a community review process to ensure accuracy. If there are disputes about measurements, our community voting system helps resolve them.",
      },
    ],
  },
  {
    category: "Community",
    icon: Users,
    questions: [
      {
        question: "How does the community verification work?",
        answer:
          "When multiple users contribute measurements for the same product, we calculate an average and assign a confidence score. Users can also vote on the accuracy of measurements and report discrepancies.",
      },
      {
        question: "What happens if there are measurement disputes?",
        answer:
          "Our dispute system allows users to challenge measurements with evidence. The community can vote on disputes, and if enough votes are gathered, the measurement can be updated or flagged for review.",
      },
      {
        question: "How do I report incorrect information?",
        answer:
          "You can report incorrect measurements by clicking the 'Report' button on any product page, or by creating a dispute with evidence of the correct measurements. Our community moderators review all reports.",
      },
      {
        question: "Can I see who contributed measurements?",
        answer:
          "Contributors are identified by their chosen usernames to maintain accountability while protecting privacy. You can see contribution history and reputation scores for transparency.",
      },
    ],
  },
  {
    category: "Privacy & Security",
    icon: Shield,
    questions: [
      {
        question: "What information do you collect?",
        answer:
          "We collect basic Google account information (name, email) for authentication, and track your contributions to the database. We also use cookies for analytics and advertising. See our Privacy Policy for full details.",
      },
      {
        question: "How do you protect my data?",
        answer:
          "We use industry-standard security measures including HTTPS encryption, secure authentication through Google, and regular security updates. Your personal information is never sold to third parties.",
      },
      {
        question: "Can I delete my account?",
        answer:
          "Yes, you can deactivate your account at any time through your profile settings. Your contributions will remain in the database (anonymized) to preserve the community's work, but your personal information will be removed.",
      },
      {
        question: "Do you use cookies?",
        answer:
          "Yes, we use essential cookies for functionality, analytics cookies to improve our service (with your consent), and advertising cookies for relevant ads (with your consent). You can manage your cookie preferences at any time.",
      },
    ],
  },
];

export default function FAQPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [openItems, setOpenItems] = useState<string[]>([]);

  const toggleItem = (id: string) => {
    setOpenItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const filteredFAQ = faqData
    .map((category) => ({
      ...category,
      questions: category.questions.filter(
        (q) =>
          q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
          q.answer.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    }))
    .filter((category) => category.questions.length > 0);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Find answers to common questions about using Dimsure, contributing
          data, and our community guidelines.
        </p>
      </div>

      {/* Search */}
      <div className="mb-8">
        <div className="relative max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search FAQ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* FAQ Categories */}
      <div className="space-y-8">
        {filteredFAQ.map((category) => (
          <Card key={category.category}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <category.icon className="h-5 w-5 text-primary" />
                {category.category}
                <Badge variant="secondary" className="ml-auto">
                  {category.questions.length} questions
                </Badge>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {category.questions.map((faq, index) => {
                const itemId = `${category.category}-${index}`;
                const isOpen = openItems.includes(itemId);

                return (
                  <Collapsible key={index}>
                    <CollapsibleTrigger
                      onClick={() => toggleItem(itemId)}
                      className="flex items-center justify-between w-full p-4 text-left bg-muted/50 rounded-lg hover:bg-muted/70 transition-colors"
                    >
                      <span className="font-medium">{faq.question}</span>
                      {isOpen ? (
                        <ChevronUp className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-4 w-4 text-muted-foreground" />
                      )}
                    </CollapsibleTrigger>
                    <CollapsibleContent className="px-4 py-3 text-muted-foreground">
                      {faq.answer}
                    </CollapsibleContent>
                  </Collapsible>
                );
              })}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* No Results */}
      {filteredFAQ.length === 0 && searchTerm && (
        <Card className="text-center py-12">
          <CardContent>
            <HelpCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No results found</h3>
            <p className="text-muted-foreground mb-4">
              We couldn't find any questions matching "{searchTerm}".
            </p>
            <p className="text-sm text-muted-foreground">
              Try different keywords or{" "}
              <a href="/contact" className="text-primary hover:underline">
                contact us
              </a>{" "}
              if you need help.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Contact CTA */}
      <Card className="mt-12">
        <CardContent className="text-center py-8">
          <h3 className="text-lg font-semibold mb-4">Still have questions?</h3>
          <p className="text-muted-foreground mb-6">
            Can't find what you're looking for? Our team is here to help.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/contact"
              className="inline-flex items-center justify-center px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Contact Support
            </a>
            <a
              href="/add-product"
              className="inline-flex items-center justify-center px-4 py-2 border border-border rounded-md hover:bg-muted/50 transition-colors"
            >
              Start Contributing
            </a>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
