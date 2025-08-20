"use client";

import { APP_VERSION } from "@/lib/version";
import { cn } from "@/lib/utils";

interface AppVersionProps {
  className?: string;
}

export function AppVersion({ className }: AppVersionProps) {
  return (
    <div
      className={cn(
        "text-xs text-muted-foreground w-full text-center",
        className
      )}
    >
      v{APP_VERSION}
    </div>
  );
}
