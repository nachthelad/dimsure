"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { OptimizedImage } from "@/components/ui/optimized-image";
import { ImagePreloader } from "@/components/seo/image-preloader";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { useLanguage } from "@/components/layout/language-provider";
import type { BlogPost } from "@/lib/types";
import { AdSenseAd } from "@/components/features/adsense-ad";
// import { usePerformanceMonitor } from "@/hooks/use-performance-monitor";

export default function BlogPage() {
  const { t } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<BlogPost[]>([]);
  // const { trackImageLoad } = usePerformanceMonitor();

  useEffect(() => {
    async function fetchPosts() {
      try {
        const q = query(
          collection(db, "blogPosts"),
          orderBy("createdAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as BlogPost[];
        setPosts(data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header Skeleton */}
        <div className="text-center mb-12">
          <Skeleton className="h-10 w-64 mx-auto mb-4" />
          <Skeleton className="h-6 w-96 mx-auto" />
        </div>

        {/* Blog Posts Grid Skeleton */}
        <div className="grid gap-8 md:grid-cols-2">
          {[...Array(4)].map((_, i) => (
            <Card key={i} className="h-full flex flex-col">
              {/* Cover Image Skeleton */}
              <Skeleton className="w-full h-48 rounded-t" />

              <CardHeader>
                {/* Title Skeleton */}
                <Skeleton className="h-7 w-full mb-2" />
                <Skeleton className="h-7 w-3/4" />

                {/* Date Skeleton */}
                <Skeleton className="h-4 w-24 mt-2" />
              </CardHeader>

              <CardContent className="flex-1">
                {/* Content Preview Skeleton */}
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">
          {t("blog.title")}
        </h1>
        <p className="text-xl text-muted-foreground">{t("blog.subtitle")}</p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {/* Preload primeras imágenes para mejorar LCP */}
        <ImagePreloader
          images={
            posts
              .slice(0, 2)
              .map((p) => p.coverImage || "")
              .filter(Boolean) as string[]
          }
          priority
        />
        {/* Ad between header and list, render only when there are enough posts/content */}
        <div className="md:col-span-2">
          <AdSenseAd
            adSlotId="8732452191"
            contentLength={posts.reduce(
              (acc, p) => acc + (p.content?.length || 0),
              0
            )}
            minContentLength={2000}
          />
        </div>
        {posts.length === 0 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">{t("blog.noArticles")}</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">
                {t("blog.noArticlesMessage")}
              </p>
            </CardContent>
          </Card>
        )}
        {posts.map((post, index) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="block group"
          >
            <Card className="h-full flex flex-col">
              {post.coverImage && (
                <div className="relative w-full h-48 overflow-hidden rounded-t">
                  <OptimizedImage
                    src={post.coverImage as string}
                    alt={post.title || "Blog post cover"}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    priority={index === 0}
                    quality={70}
                    blurDataURL={
                      (post as any).coverImageBlurDataURL || undefined
                    }
                  />
                </div>
              )}
              <CardHeader>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <div className="text-xs text-muted-foreground mt-1">
                  {post.createdAt?.toDate
                    ? post.createdAt.toDate().toLocaleDateString()
                    : t("blog.unknownDate")}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-muted-foreground text-sm line-clamp-3 prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {post.content?.slice(0, 300) +
                      ((post.content?.length || 0) > 300 ? "..." : "")}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
