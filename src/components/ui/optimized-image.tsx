import React from "react";
import { cn } from "@/lib/utils";

interface OptimizedImageProps
  extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  /** Display widths to generate srcset for. Default [320, 640, 960, 1280] */
  widths?: number[];
  /** Quality 1-100. Default 75 */
  quality?: number;
  /** Default sizes attribute. */
  sizes?: string;
  /** Eager load instead of lazy (use for LCP). Default false */
  priority?: boolean;
  className?: string;
}

const SUPABASE_STORAGE_RE =
  /^(https?:\/\/[a-z0-9-]+\.supabase\.co\/storage\/v1)\/(object|render\/image)\/public\/(.+)$/i;

/**
 * Build a Supabase image-transform URL that returns optimized WebP.
 * Falls back to original URL when not Supabase storage.
 */
function buildTransformedUrl(
  src: string,
  width: number,
  quality: number,
): string {
  const m = src.match(SUPABASE_STORAGE_RE);
  if (!m) return src;
  const [, base, , path] = m;
  const url = new URL(`${base}/render/image/public/${path}`);
  url.searchParams.set("width", String(width));
  url.searchParams.set("quality", String(quality));
  url.searchParams.set("format", "origin"); // origin = let Supabase pick best (WebP/AVIF)
  url.searchParams.set("resize", "contain");
  return url.toString();
}

/**
 * Drop-in <img> replacement that:
 * - serves WebP/AVIF via Supabase image transform (when applicable)
 * - generates a responsive srcset
 * - lazy-loads by default with async decoding
 */
export function OptimizedImage({
  src,
  alt,
  width,
  height,
  widths = [320, 640, 960, 1280],
  quality = 75,
  sizes = "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw",
  priority = false,
  className,
  ...rest
}: OptimizedImageProps) {
  const isSupabase = SUPABASE_STORAGE_RE.test(src);

  if (!isSupabase) {
    return (
      <img
        src={src}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? "eager" : "lazy"}
        decoding="async"
        fetchPriority={priority ? "high" : "auto"}
        className={cn(className)}
        {...rest}
      />
    );
  }

  const srcSet = widths
    .map((w) => `${buildTransformedUrl(src, w, quality)} ${w}w`)
    .join(", ");

  const fallbackSrc = buildTransformedUrl(src, widths[widths.length - 1], quality);

  return (
    <img
      src={fallbackSrc}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding="async"
      fetchPriority={priority ? "high" : "auto"}
      className={cn(className)}
      {...rest}
    />
  );
}
