"use client";

import { useEffect } from "react";

interface ImagePreloaderProps {
  images: string[];
  priority?: boolean;
}

export function ImagePreloader({
  images,
  priority = false,
}: ImagePreloaderProps) {
  useEffect(() => {
    if (!priority) return;

    // Preload critical images
    images.forEach((src) => {
      if (src && typeof window !== "undefined") {
        const link = document.createElement("link");
        link.rel = "preload";
        link.as = "image";
        link.href = src;
        document.head.appendChild(link);
      }
    });

    // Cleanup function
    return () => {
      const preloadLinks = document.querySelectorAll(
        'link[rel="preload"][as="image"]'
      );
      preloadLinks.forEach((link) => {
        if (images.includes(link.getAttribute("href") || "")) {
          link.remove();
        }
      });
    };
  }, [images, priority]);

  return null;
}
