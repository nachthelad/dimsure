import { getTranslation } from "@/lib/translations";
import { defaultLocale } from "@/lib/i18n";

export default function HeroSection({ lang }: { lang?: string }) {
  const locale = lang || defaultLocale;
  const t = (key: string) => getTranslation(locale, key);
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl md:text-5xl font-bold text-foreground mb-3">
        {t("home.hero.title")}
        <br />
        <span className="text-primary">{t("home.hero.titleHighlight")}</span>
      </h1>
      <p className="text-lg md:text-md text-muted-foreground mb-6 max-w-2xl mx-auto">
        {t("home.hero.subtitle")}
      </p>
    </div>
  );
} 