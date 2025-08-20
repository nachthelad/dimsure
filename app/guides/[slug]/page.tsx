import { Metadata } from "next";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, ArrowLeft } from "lucide-react";
import { SchemaScript } from "@/components/seo/schema-script";
import { ShareButton } from "@/components/features/share-button";
import { GuideHeaderClient } from "@/components/features/guide-header-client";
import { GuideContentClient } from "@/components/features/guide-content-client";

interface GuidePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const slug = params.slug;
  const readable = slug
    .split("-")
    .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
    .join(" ");
  const description =
    "Expert guides on packaging, logistics, and product measurement.";
  return {
    title: `${readable} | Dimsure Guides`,
    description,
    openGraph: { title: readable, description, type: "article" },
    twitter: { card: "summary_large_image", title: readable, description },
  };
}

export function generateStaticParams() {
  return [];
}

export const dynamicParams = true;
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function GuidePage({ params }: GuidePageProps) {
  const slug = params.slug;

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: slug
      .split("-")
      .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
      .join(" "),
    description:
      "Expert guide on packaging, logistics, and product measurement.",
    author: {
      "@type": "Person",
      name: "Dimsure Team",
    },
    publisher: {
      "@type": "Organization",
      name: "Dimsure",
      logo: {
        "@type": "ImageObject",
        url: "https://dimsure.online/android-chrome-512x512.png",
      },
    },
    datePublished: undefined,
    dateModified: undefined,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://dimsure.online/guides/${slug}`,
    },
  };

  return (
    <>
      <SchemaScript schema={articleSchema} />

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <Link
            href="/guides"
            className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Guides
          </Link>
        </nav>

        {/* Article Header - client fetch ensures exact title casing from DB */}
        <GuideHeaderClient
          slug={slug}
          fallback={
            <header className="mb-8">
              <div className="flex items-center gap-4 mb-4">
                <Badge variant="secondary">{"Guide"}</Badge>
                <div className="flex items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {""}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {"Dimsure Team"}
                  </div>
                </div>
              </div>
              <h1 className="text-4xl font-bold text-foreground mb-4">
                {slug
                  .split("-")
                  .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
                  .join(" ")}
              </h1>
              <p className="text-xl text-muted-foreground mb-6">
                {
                  "Expert guides and best practices for packaging and logistics."
                }
              </p>
              <ShareButton
                title={slug
                  .split("-")
                  .map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1) : w))
                  .join(" ")}
                description={
                  "Expert guides and best practices for packaging and logistics."
                }
              />
            </header>
          }
        />

        {/* Article Content */}
        <Card>
          <CardContent className="p-8">
            {/* Client-fetched content (from Firestore) */}
            <GuideContentClient slug={slug} />
          </CardContent>
        </Card>

        {/* CTA Section */}
        <Card className="mt-12">
          <CardContent className="text-center py-8">
            <h3 className="text-xl font-bold mb-4">
              Ready to Put This Into Practice?
            </h3>
            <p className="text-muted-foreground mb-6">
              Start optimizing your packaging and logistics with accurate
              product dimension data.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/search">
                <Button size="lg">Search Product Dimensions</Button>
              </Link>
              <Link href="/add-product">
                <Button variant="outline" size="lg">
                  Contribute Data
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  );
}
