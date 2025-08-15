"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import Script from "next/script";
import { CONFIG } from "@/lib/config";

type AdSenseAdProps = {
  adSlotId?: string;
  className?: string;
  style?: CSSProperties;
  adFormat?: string;
  fullWidthResponsive?: boolean;
  /**
   * Minimum content length (in characters) required to render the ad.
   * Use to avoid ads on thin/low-value content.
   */
  minContentLength?: number;
  /** Actual content length to evaluate against minContentLength. */
  contentLength?: number;
};

export function AdSenseAd({
  adSlotId,
  className,
  style,
  adFormat = "auto",
  fullWidthResponsive = true,
  minContentLength = 600,
  contentLength,
}: AdSenseAdProps) {
  const insRef = useRef<HTMLModElement | null>(null);
  const [canShow, setCanShow] = useState(false);

  const hasSufficientContent = useMemo(() => {
    if (typeof contentLength !== "number") return true;
    return contentLength >= minContentLength;
  }, [contentLength, minContentLength]);

  useEffect(() => {
    try {
      const consentRaw =
        typeof window !== "undefined"
          ? localStorage.getItem("cookie-consent")
          : null;
      const consent = consentRaw ? JSON.parse(consentRaw) : null;
      const marketingAllowed = Boolean(consent?.marketing);
      setCanShow(
        marketingAllowed &&
          hasSufficientContent &&
          Boolean(adSlotId) &&
          Boolean(CONFIG.ANALYTICS.GOOGLE_ADSENSE_ID)
      );
    } catch {
      setCanShow(false);
    }
  }, [hasSufficientContent, adSlotId]);

  useEffect(() => {
    if (!canShow) return;
    const attemptPush = () => {
      try {
        (window as any).adsbygoogle = (window as any).adsbygoogle || [];
        (window as any).adsbygoogle.push({});
      } catch {
        // no-op
      }
    };
    // Delay push slightly to ensure script load
    const id = window.setTimeout(attemptPush, 250);
    return () => window.clearTimeout(id);
  }, [canShow, adSlotId]);

  if (!canShow) return null;

  return (
    <>
      <Script
        id="adsbygoogle-lib"
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${CONFIG.ANALYTICS.GOOGLE_ADSENSE_ID}`}
        strategy="afterInteractive"
        crossOrigin="anonymous"
      />
      <ins
        ref={insRef as any}
        className={`adsbygoogle${className ? ` ${className}` : ""}`}
        style={{ display: "block", minHeight: 90, ...(style || {}) }}
        data-ad-client={CONFIG.ANALYTICS.GOOGLE_ADSENSE_ID}
        data-ad-slot={adSlotId}
        data-ad-format={adFormat}
        data-full-width-responsive={fullWidthResponsive ? "true" : "false"}
      />
    </>
  );
}
