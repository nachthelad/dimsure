"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useLanguage } from "@/components/layout/language-provider";

export function LanguageToggle() {
  const { locale, setLocale } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="language-toggle" className="text-sm font-medium">
        EN
      </Label>
      <Switch
        id="language-toggle"
        checked={locale === "es"}
        onCheckedChange={(checked) => setLocale(checked ? "es" : "en")}
      />
      <Label htmlFor="language-toggle" className="text-sm font-medium">
        ES
      </Label>
    </div>
  );
}
