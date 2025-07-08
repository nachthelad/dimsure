"use client"
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/language-provider";

export default function NotFound() {
  const { t } = useLanguage();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background px-4">
      <div className="w-full max-w-md flex flex-col items-center">
        <div className="mb-8">
          <Image
            src="/images/404.jpg"
            alt={t("notFound.imageAlt")}
            width={320}
            height={320}
            className="rounded-lg shadow-lg object-contain"
            priority
          />
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-2 text-center">{t("notFound.title")}</h1>
        <p className="text-muted-foreground mb-6 text-center">
          {t("notFound.description")}
        </p>
        <Link href="/">
          <Button className="bg-primary hover:bg-primary/90" size="lg">
            {t("notFound.backToHome")}
          </Button>
        </Link>
      </div>
    </div>
  );
} 