"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import type { Guide } from "@/lib/types";
import { Badge } from "@/components/ui/badge";
import { Clock, User } from "lucide-react";
import { ShareButton } from "@/components/features/share-button";
import { OptimizedImage } from "@/components/ui/optimized-image";

export function GuideHeaderClient({
  slug,
  fallback,
}: {
  slug: string;
  fallback?: React.ReactNode;
}) {
  const [guide, setGuide] = useState<Guide | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGuide() {
      try {
        const q = query(
          collection(db, "guides"),
          where("slug", "==", slug),
          limit(1)
        );
        const snapshot = await getDocs(q);
        if (!snapshot.empty) {
          const first = snapshot.docs[0];
          if (first) {
            setGuide({ id: first.id, ...first.data() } as Guide);
          }
        }
      } catch (error) {
        console.error("Error fetching guide header:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGuide();
  }, [slug]);

  if (loading) return null;
  if (!guide) return <>{fallback || null}</>;

  return (
    <header className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <Badge variant="secondary">{guide.category}</Badge>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {guide.readTime}
          </div>
          <div className="flex items-center gap-1">
            <User className="h-4 w-4" />
            {guide.author}
          </div>
        </div>
      </div>

      <h1 className="text-4xl font-bold text-foreground mb-4">{guide.title}</h1>

      {guide.coverImage ? (
        <div className="mb-6">
          <OptimizedImage
            src={guide.coverImage}
            alt={guide.title || "Guide cover image"}
            width={guide.coverImageWidth || 1200}
            height={guide.coverImageHeight || 630}
            className="w-full h-auto rounded-md object-cover"
            blurDataURL={guide.coverImageBlurDataURL || ""}
          />
        </div>
      ) : null}

      {guide.description ? (
        <p className="text-xl text-muted-foreground mb-6">
          {guide.description}
        </p>
      ) : null}

      <ShareButton
        title={guide.title || ""}
        description={guide.description || ""}
      />
    </header>
  );
}
