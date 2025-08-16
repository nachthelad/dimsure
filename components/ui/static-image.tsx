"use client";

interface StaticImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
}

export function StaticImage({
  src,
  alt,
  width,
  height,
  className,
}: StaticImageProps) {
  return (
    <img
      src={src}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="eager"
    />
  );
}
