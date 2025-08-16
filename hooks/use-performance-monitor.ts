import { useEffect } from "react";

interface PerformanceMetrics {
  imageLoadTime?: number;
  pageLoadTime?: number;
  firstContentfulPaint?: number;
  largestContentfulPaint?: number;
}

export function usePerformanceMonitor() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Monitor Core Web Vitals
    const observer = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.entryType === "largest-contentful-paint") {
          console.log("LCP:", entry.startTime);
          // Track LCP for analytics
          if ((window as any).gtag) {
            (window as any).gtag("event", "web_vitals", {
              name: "LCP",
              value: Math.round(entry.startTime),
              event_category: "Performance",
            });
          }
        }

        if (entry.entryType === "first-input") {
          console.log("FID:", (entry as any).processingStart - entry.startTime);
          // Track FID for analytics
          if ((window as any).gtag) {
            (window as any).gtag("event", "web_vitals", {
              name: "FID",
              value: Math.round(
                (entry as any).processingStart - entry.startTime
              ),
              event_category: "Performance",
            });
          }
        }
      }
    });

    observer.observe({
      entryTypes: ["largest-contentful-paint", "first-input"],
    });

    // Monitor image loading performance
    const imageObserver = new PerformanceObserver((list) => {
      for (const entry of list.getEntries()) {
        if (entry.name.includes("/_next/image")) {
          console.log("Image load time:", entry.duration, "ms for", entry.name);

          // Track slow image loads
          if (entry.duration > 1000) {
            if ((window as any).gtag) {
              (window as any).gtag("event", "slow_image_load", {
                image_url: entry.name,
                load_time: Math.round(entry.duration),
                event_category: "Performance",
              });
            }
          }
        }
      }
    });

    imageObserver.observe({ entryTypes: ["resource"] });

    return () => {
      observer.disconnect();
      imageObserver.disconnect();
    };
  }, []);

  const trackImageLoad = (imageSrc: string, loadTime: number) => {
    if ((window as any).gtag) {
      (window as any).gtag("event", "image_loaded", {
        image_src: imageSrc,
        load_time: loadTime,
        event_category: "Performance",
      });
    }
  };

  return { trackImageLoad };
}
