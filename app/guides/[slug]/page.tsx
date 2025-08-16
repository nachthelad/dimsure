import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, User, ArrowLeft, Share2 } from "lucide-react";
import { SchemaScript } from "@/components/seo/schema-script";

// This would typically come from a CMS or database
const guides = {
  "accurate-product-measurement": {
    title: "How to Measure Product Dimensions Accurately",
    description:
      "Learn professional techniques for measuring products to ensure accurate packaging and shipping calculations.",
    category: "Measurement",
    readTime: "5 min read",
    author: "Dimsure Team",
    publishedAt: "2024-01-15",
    content: `
# How to Measure Product Dimensions Accurately

Accurate product measurements are crucial for optimizing packaging, reducing shipping costs, and improving customer satisfaction. This comprehensive guide will teach you professional measurement techniques.

## Why Accurate Measurements Matter

- **Cost Savings**: Proper measurements can reduce shipping costs by up to 30%
- **Customer Satisfaction**: Accurate size information reduces returns
- **Inventory Management**: Better space utilization in warehouses
- **Packaging Optimization**: Right-sized packaging reduces waste

## Essential Tools

1. **Digital Calipers** - For precise measurements (±0.1mm accuracy)
2. **Steel Ruler** - For larger items
3. **Measuring Tape** - For oversized products
4. **Digital Scale** - For weight measurements

## Step-by-Step Measurement Process

### 1. Prepare Your Workspace
- Clean, flat surface
- Good lighting
- Remove all packaging materials
- Have measurement tools ready

### 2. Identify the Orientation
- **Length**: Longest dimension
- **Width**: Second longest dimension  
- **Height**: Shortest dimension (usually vertical)

### 3. Measure Each Dimension
- Measure at the widest points
- Include any protruding parts
- Round up to the nearest millimeter
- Take multiple measurements for accuracy

### 4. Document Everything
- Record all three dimensions
- Note any special characteristics
- Take photos for reference
- Include weight if relevant

## Common Mistakes to Avoid

- Measuring compressed packaging instead of actual product
- Ignoring protruding elements (handles, antennas, etc.)
- Not accounting for irregular shapes
- Rounding down instead of up
- Measuring only one sample of variable products

## Best Practices for Different Product Types

### Electronics
- Include cables and accessories
- Measure with protective cases if applicable
- Account for ventilation requirements

### Clothing & Textiles
- Measure when laid flat
- Consider compression for soft goods
- Account for seasonal variations

### Fragile Items
- Include protective packaging in measurements
- Consider minimum safe packaging requirements
- Factor in cushioning materials

## Quality Control Tips

1. **Double-check measurements** - Measure twice, record once
2. **Cross-reference** - Compare with manufacturer specifications
3. **Community verification** - Submit to platforms like Dimsure for validation
4. **Regular calibration** - Ensure your tools are accurate

## Conclusion

Accurate product measurement is a skill that improves with practice. By following these professional techniques, you'll contribute to better logistics efficiency and cost optimization across the supply chain.

Remember: When in doubt, measure again. Accuracy today saves money tomorrow.
    `,
  },
  // Add other guides here...
};

interface GuidePageProps {
  params: {
    slug: string;
  };
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const guide = guides[params.slug as keyof typeof guides];

  if (!guide) {
    return {
      title: "Guide Not Found | Dimsure",
    };
  }

  return {
    title: `${guide.title} | Dimsure Guides`,
    description: guide.description,
    keywords: `${guide.category.toLowerCase()}, packaging, logistics, product measurement, shipping optimization`,
    openGraph: {
      title: guide.title,
      description: guide.description,
      type: "article",
      publishedTime: guide.publishedAt,
      authors: [guide.author],
    },
    twitter: {
      card: "summary_large_image",
      title: guide.title,
      description: guide.description,
    },
  };
}

export default function GuidePage({ params }: GuidePageProps) {
  const guide = guides[params.slug as keyof typeof guides];

  if (!guide) {
    notFound();
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.description,
    author: {
      "@type": "Person",
      name: guide.author,
    },
    publisher: {
      "@type": "Organization",
      name: "Dimsure",
      logo: {
        "@type": "ImageObject",
        url: "https://dimsure.online/android-chrome-512x512.png",
      },
    },
    datePublished: guide.publishedAt,
    dateModified: guide.publishedAt,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `https://dimsure.online/guides/${params.slug}`,
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

        {/* Article Header */}
        <header className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Badge variant="secondary">{guide.category}</Badge>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {guide.readTime}
              </div>
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                {guide.author}
              </div>
            </div>
          </div>

          <h1 className="text-4xl font-bold text-foreground mb-4">
            {guide.title}
          </h1>

          <p className="text-xl text-muted-foreground mb-6">
            {guide.description}
          </p>

          {/* Share Button */}
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: guide.title,
                  text: guide.description,
                  url: window.location.href,
                });
              } else {
                navigator.clipboard.writeText(window.location.href);
              }
            }}
          >
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
        </header>

        {/* Article Content */}
        <Card>
          <CardContent className="p-8">
            <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {guide.content}
              </ReactMarkdown>
            </div>
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
