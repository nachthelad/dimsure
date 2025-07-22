"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";
import type { Locale } from "@/lib/i18n";
import { defaultLocale } from "@/lib/i18n";
import { getTranslation, interpolate } from "@/lib/translations/index";
import { getCookie, setCookie, COOKIE_NAMES } from "@/lib/cookies";

interface LanguageContextType {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: (key: string, values?: Record<string, string | number>) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({
  children,
  defaultLocale: initialLocale,
}: {
  children: ReactNode;
  defaultLocale?: Locale;
}) {
  const [locale, setLocaleState] = useState<Locale>(
    initialLocale || defaultLocale
  );

  // Load saved locale from localStorage and cookies on mount
  useEffect(() => {
    // Primero intentar desde cookie (prioridad para SSR)
    const cookieLocale = getCookie(COOKIE_NAMES.LANGUAGE) as Locale;
    if (cookieLocale && (cookieLocale === "en" || cookieLocale === "es")) {
      setLocaleState(cookieLocale);
      return;
    }

    // Si no hay cookie, intentar desde localStorage
    const savedLocale = localStorage.getItem("locale") as Locale;
    if (savedLocale && (savedLocale === "en" || savedLocale === "es")) {
      setLocaleState(savedLocale);
      // También guardar en cookie para futuras visitas
      setCookie(COOKIE_NAMES.LANGUAGE, savedLocale);
    }
  }, []);

  const setLocale = (newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem("locale", newLocale);
    setCookie(COOKIE_NAMES.LANGUAGE, newLocale);
  };

  const t = (key: string, values?: Record<string, string | number>) => {
    const translation = getTranslation(locale, key);
    return values ? interpolate(translation, values) : translation;
  };

  return (
    <LanguageContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}
