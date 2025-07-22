import { Package, Target, Users, Zap, Mail } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Metadata } from "next";
import { getDictionary, getServerLocale } from "@/lib/translations";
import { headers } from "next/headers";

export async function generateMetadata(): Promise<Metadata> {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const locale = getServerLocale(cookieHeader, acceptLanguage);
  const dict = await getDictionary(locale);

  return {
    title: `${dict.about.title} — Dimsure`,
    description: dict.about.subtitle,
    openGraph: {
      title: dict.about.title,
      description: dict.about.subtitle,
      type: "website",
    },
  };
}

export default async function AboutPage() {
  const headersList = await headers();
  const cookieHeader = headersList.get("cookie") || "";
  const acceptLanguage = headersList.get("accept-language") || "";
  const locale = getServerLocale(cookieHeader, acceptLanguage);
  const dict = await getDictionary(locale);

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          {dict.about.title}
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          {dict.about.subtitle}
        </p>
      </div>

      {/* Mission Section */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Target className="h-6 w-6 text-primary" />
            {dict.about.mission.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {dict.about.mission.description1}
          </p>
          <p className="text-muted-foreground">
            {dict.about.mission.description2}{" "}
            <strong>{dict.about.mission.goal}</strong>
          </p>
        </CardContent>
      </Card>

      {/* Why It Matters */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
          {dict.about.whyMatters.title}
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {dict.about.whyMatters.ecommerce.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {dict.about.whyMatters.ecommerce.description}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {dict.about.whyMatters.logistics.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {dict.about.whyMatters.logistics.description}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {dict.about.whyMatters.consumers.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                {dict.about.whyMatters.consumers.description}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* How It Works */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Zap className="h-6 w-6 text-primary" />
            {dict.about.howItWorks.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">1</span>
              </div>
              <h3 className="font-semibold mb-2">
                {dict.about.howItWorks.step1.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {dict.about.howItWorks.step1.description}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">2</span>
              </div>
              <h3 className="font-semibold mb-2">
                {dict.about.howItWorks.step2.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {dict.about.howItWorks.step2.description}
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-primary font-bold">3</span>
              </div>
              <h3 className="font-semibold mb-2">
                {dict.about.howItWorks.step3.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {dict.about.howItWorks.step3.description}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Community */}
      <Card className="mb-12">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Users className="h-6 w-6 text-primary" />
            {dict.about.community.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            {dict.about.community.description1}
          </p>
          <p className="text-muted-foreground">
            {dict.about.community.description2}
          </p>
        </CardContent>
      </Card>

      {/* Get Involved */}
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl text-center">
            {dict.about.getInvolved.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-6">
          <p className="text-muted-foreground">
            {dict.about.getInvolved.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/add-product">
              <Button size="lg">
                <Package className="h-5 w-5 mr-2" />
                {dict.about.getInvolved.addProduct}
              </Button>
            </Link>
            <Link href="/contact">
              <Button variant="outline" size="lg">
                <Mail className="h-5 w-5 mr-2" />
                {dict.about.getInvolved.contactUs}
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
