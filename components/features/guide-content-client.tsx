"use client";

import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import type { Guide } from "@/lib/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function GuideContentClient({
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
        console.error("Error fetching guide:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGuide();
  }, [slug]);

  if (loading) return null;
  if (!guide) return <>{fallback || null}</>;

  return (
    <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>
        {guide.content || ""}
      </ReactMarkdown>
    </div>
  );
}
