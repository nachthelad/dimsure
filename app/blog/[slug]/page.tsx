"use client";
import { useEffect, useState } from "react";
import { useParams, notFound } from "next/navigation";
import { db } from "@/lib/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { OptimizedImage } from "@/components/ui/optimized-image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "@/components/layout/language-provider";
import type { BlogPost } from "@/lib/types";
import { AdSenseAd } from "@/components/features/adsense-ad";

export default function BlogPostPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [post, setPost] = useState<BlogPost | null>(null);

  useEffect(() => {
    async function fetchPost() {
      const q = query(collection(db, "blogPosts"), where("slug", "==", slug));
      const snapshot = await getDocs(q);
      const firstDoc = snapshot.docs.at(0);
      if (firstDoc) {
        const data = firstDoc.data();
        setPost({ id: firstDoc.id, ...(data as any) } as BlogPost);
      }
      setLoading(false);
    }
    fetchPost();
  }, [slug]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!post) {
    notFound();
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="mb-6">
        <Button asChild variant="outline">
          <Link href="/blog">
            <ArrowLeft className="mr-2 h-4 w-4" /> {t("blog.backToBlog")}
          </Link>
        </Button>
      </div>
      <Card className="max-w-3xl mx-auto">
        {post.coverImage && (
          <div className="relative w-full h-80 overflow-hidden rounded-t">
            <OptimizedImage
              src={post.coverImage}
              alt={post.title || "Blog cover"}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 768px"
              priority
              quality={70}
              blurDataURL={(post as any).coverImageBlurDataURL || undefined}
            />
          </div>
        )}
        <CardHeader>
          <CardTitle>{post.title}</CardTitle>
          <div className="text-xs text-muted-foreground mt-1">
            {post.createdAt?.toDate
              ? post.createdAt.toDate().toLocaleDateString()
              : t("blog.unknownDate")}
            <span> &middot; Dimsure</span>
          </div>
        </CardHeader>
        <CardContent>
          <div className="prose prose-invert max-w-none">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>
              {post.content}
            </ReactMarkdown>
          </div>
          {/* Contextual in-article ad after sufficient content */}
          <div className="mt-8">
            <AdSenseAd
              adSlotId="8732452191"
              contentLength={post.content?.length || 0}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
