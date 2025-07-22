// Helper para manejar cookies de manera consistente
export const COOKIE_NAMES = {
  LANGUAGE: "dimsure-language",
  THEME: "dimsure-theme",
  UNITS: "dimsure-units",
  NOTIFICATIONS: "dimsure-notifications",
  TUTORIAL_COMPLETED: "dimsure-tutorial-completed",
  VIEW_MODE: "dimsure-view-mode",
} as const;

export type CookieName = (typeof COOKIE_NAMES)[keyof typeof COOKIE_NAMES];

// Función para obtener cookie (cliente)
export function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(";").shift() || null;
  return null;
}

// Función para establecer cookie (cliente)
export function setCookie(name: string, value: string, days = 365): void {
  if (typeof document === "undefined") return;
  const expires = new Date();
  expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// Función para eliminar cookie (cliente)
export function deleteCookie(name: string): void {
  if (typeof document === "undefined") return;
  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
}

// Función para obtener cookie desde headers (servidor)
export function getCookieFromHeaders(
  cookieHeader: string,
  name: string
): string | null {
  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    if (key && value) acc[key] = value;
    return acc;
  }, {} as Record<string, string>);

  return cookies[name] || null;
}

// Función para parsear todas las cookies desde headers (servidor)
export function parseCookies(cookieHeader: string): Record<string, string> {
  if (!cookieHeader) return {};

  return cookieHeader.split(";").reduce((acc, cookie) => {
    const [key, value] = cookie.trim().split("=");
    if (key && value) acc[key] = value;
    return acc;
  }, {} as Record<string, string>);
}
