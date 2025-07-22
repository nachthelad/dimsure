import { en } from "./en";
import { es } from "./es";
import {
  getCookieFromHeaders,
  parseCookies,
  COOKIE_NAMES,
} from "@/lib/cookies";

export const translations = { en, es } as const;

export type TranslationKey = keyof typeof translations.en;
export type NestedTranslationKey<T> = T extends object
  ? {
      [K in keyof T]: T[K] extends object
        ? `${string & K}.${NestedTranslationKey<T[K]>}`
        : string & K;
    }[keyof T]
  : never;

export function getTranslation(locale: string, key: string): string {
  const keys = key.split(".");
  let value: any =
    translations[locale as keyof typeof translations] || translations.en;

  for (const k of keys) {
    value = value?.[k];
    if (value === undefined) {
      // Fallback to English
      value = translations.en;
      for (const fallbackKey of keys) {
        value = value?.[fallbackKey];
        if (value === undefined) return key;
      }
      break;
    }
  }

  return typeof value === "string" ? value : key;
}

export function interpolate(
  text: string,
  values: Record<string, string | number>
): string {
  return text.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return values[key]?.toString() || match;
  });
}

export async function getDictionary(locale: string) {
  const validLocale = locale as keyof typeof translations;
  return translations[validLocale] || translations.en;
}

// Versión síncrona para casos donde no necesitas async
export function getDictionarySync(locale: string) {
  const validLocale = locale as keyof typeof translations;
  return translations[validLocale] || translations.en;
}

// Función para detectar idioma desde headers (solo para usuarios no logueados)
export function detectLocale(headers: Headers): string {
  const acceptLanguage = headers.get("accept-language") || "";

  // Parsear Accept-Language header para obtener preferencias ordenadas
  const languages = acceptLanguage
    .split(",")
    .map((lang) => {
      const [language, quality = "1"] = lang.trim().split(";q=");
      return {
        language: language.split("-")[0], // Tomar solo el código principal (en, es)
        quality: parseFloat(quality),
      };
    })
    .sort((a, b) => b.quality - a.quality); // Ordenar por calidad

  // Buscar el primer idioma soportado
  for (const { language } of languages) {
    if (language === "en") return "en";
    if (language === "es") return "es";
  }

  // Fallback a inglés como idioma principal
  return "en";
}

// Función para obtener el idioma correcto (usuario logueado o navegador)
export function getLocale(userLanguage?: string, headers?: Headers): string {
  // Si el usuario está logueado y tiene idioma configurado, usarlo
  if (userLanguage && (userLanguage === "en" || userLanguage === "es")) {
    return userLanguage;
  }

  // Si no está logueado, detectar del navegador
  if (headers) {
    return detectLocale(headers);
  }

  // Fallback a inglés
  return "en";
}

// Función para obtener el idioma del usuario logueado desde Firestore
export async function getUserLanguage(
  userId: string
): Promise<string | undefined> {
  try {
    const { getUserPreferences } = await import("@/lib/firestore");
    const preferences = await getUserPreferences(userId);
    return preferences.language || undefined;
  } catch (error) {
    console.error("Error getting user language:", error);
    return undefined;
  }
}

// Función para obtener idioma desde cookies (funciona en servidor y cliente)
export function getLanguageFromCookie(
  cookieHeader?: string
): string | undefined {
  if (!cookieHeader) return undefined;

  return getCookieFromHeaders(cookieHeader, COOKIE_NAMES.LANGUAGE) || undefined;
}

// Función mejorada para detectar idioma en servidor
export function getServerLocale(
  cookieHeader?: string,
  acceptLanguage?: string
): string {
  // 1. Primero intentar desde cookie
  const cookieLanguage = getLanguageFromCookie(cookieHeader);
  if (cookieLanguage && (cookieLanguage === "en" || cookieLanguage === "es")) {
    return cookieLanguage;
  }

  // 2. Si no hay cookie, detectar del navegador
  if (acceptLanguage) {
    const languages = acceptLanguage
      .split(",")
      .map((lang) => {
        const [language, quality = "1"] = lang.trim().split(";q=");
        return {
          language: language.split("-")[0],
          quality: parseFloat(quality),
        };
      })
      .sort((a, b) => b.quality - a.quality);

    for (const { language } of languages) {
      if (language === "en") return "en";
      if (language === "es") return "es";
    }
  }

  // 3. Fallback a inglés
  return "en";
}
