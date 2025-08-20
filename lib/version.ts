import pkg from "../package.json" assert { type: "json" };

export const APP_VERSION: string =
  process.env.NEXT_PUBLIC_APP_VERSION || (pkg as { version: string }).version;

export const BUILD_ENV: "production" | "development" | "test" =
  (process.env.NODE_ENV as any) || "development";

export const BUILD_COMMIT: string | undefined =
  process.env.NEXT_PUBLIC_GIT_COMMIT || undefined;
