import React, { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";

interface SmartImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string;
  alt: string;
  /** Optional list of widths to generate srcset (only used if the source supports query params) */
  widths?: number[];
  /** Aspect ratio class (e.g. "aspect-square", "aspect-video") */
  aspectClass?: string;
  /** Blur placeholder data URL or color */
  placeholderColor?: string;
  /** Eager load (disable lazy loading) */
  eager?: boolean;
}

/**
 * SmartImage — optimized image component with:
 * - Lazy loading via IntersectionObserver
 * - Blur-up placeholder (fade-in on load)
 * - WebP-friendly srcset for Supabase Storage / Unsplash / generic CDNs
 * - Decoding async + intrinsic size hints
 */
export const SmartImage: React.FC<SmartImageProps> = ({
  src,
  alt,
  widths = [320, 640, 960, 1280],
  aspectClass,
  placeholderColor = "hsl(var(--muted))",
  eager = false,
  className,
  ...rest
}) => {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(eager);
  const [errored, setErrored] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (eager || inView) return;
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setInView(true);
            io.disconnect();
          }
        });
      },
      { rootMargin: "200px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [eager, inView]);

  // Build srcset for known providers
  const buildSrcSet = (): string | undefined => {
    if (!src) return undefined;
    try {
      const url = new URL(src, window.location.origin);
      const isSupabase = url.hostname.includes("supabase");
      const isUnsplash = url.hostname.includes("unsplash");

      if (isUnsplash) {
        return widths
          .map((w) => {
            const u = new URL(src);
            u.searchParams.set("w", String(w));
            u.searchParams.set("q", "75");
            u.searchParams.set("auto", "format");
            return `${u.toString()} ${w}w`;
          })
          .join(", ");
      }
      if (isSupabase && url.pathname.includes("/render/image/")) {
        return widths
          .map((w) => {
            const u = new URL(src);
            u.searchParams.set("width", String(w));
            u.searchParams.set("quality", "75");
            return `${u.toString()} ${w}w`;
          })
          .join(", ");
      }
    } catch {
      /* ignore */
    }
    return undefined;
  };

  const srcSet = buildSrcSet();

  return (
    <div
      ref={ref}
      className={cn("relative overflow-hidden bg-muted", aspectClass, className)}
      style={{ backgroundColor: placeholderColor }}
    >
      {/* Blur placeholder layer */}
      <div
        aria-hidden
        className={cn(
          "absolute inset-0 transition-opacity duration-500",
          loaded ? "opacity-0" : "opacity-100",
          "bg-gradient-to-br from-muted to-muted/60 animate-pulse"
        )}
      />
      {(inView || eager) && !errored && (
        <img
          src={src}
          srcSet={srcSet}
          sizes={srcSet ? "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" : undefined}
          alt={alt}
          loading={eager ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => setErrored(true)}
          className={cn(
            "w-full h-full object-cover transition-opacity duration-500",
            loaded ? "opacity-100" : "opacity-0"
          )}
          {...rest}
        />
      )}
      {errored && (
        <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
          Image indisponible
        </div>
      )}
    </div>
  );
};

export default SmartImage;
