"use client"
import { useEffect, useState } from "react"
import Link from "next/link"
import { db } from "@/lib/firebase"
import { collection, getDocs, query, orderBy } from "firebase/firestore"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import ReactMarkdown from "react-markdown"
import remarkGfm from "remark-gfm"

interface Post {
  id: string
  title?: string
  slug?: string
  content?: string
  coverImage?: string
  createdAt?: any
}

export default function BlogPage() {
  const [loading, setLoading] = useState(true)
  const [posts, setPosts] = useState<Post[]>([])

  useEffect(() => {
    async function fetchPosts() {
      const q = query(collection(db, "blogPosts"), orderBy("createdAt", "desc"))
      const snapshot = await getDocs(q)
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as Post[]
      setPosts(data)
      setLoading(false)
    }
    fetchPosts()
  }, [])

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
    )
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Dimsure Blog</h1>
        <p className="text-xl text-muted-foreground">
          Articles and tips about packaging, logistics and Dimsure updates.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        {posts.length === 0 && (
          <Card className="max-w-2xl mx-auto">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl">No articles yet</CardTitle>
            </CardHeader>
            <CardContent className="text-center">
              <p className="text-muted-foreground">There are no blog articles published yet.</p>
            </CardContent>
          </Card>
        )}
        {posts.map(post => (
          <Link key={post.id} href={`/blog/${post.slug}`} className="block group">
            <Card className="h-full flex flex-col">
              {post.coverImage && (
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-48 object-cover rounded-t"
                />
              )}
              <CardHeader>
                <CardTitle className="text-2xl group-hover:text-primary transition-colors">
                  {post.title}
                </CardTitle>
                <div className="text-xs text-muted-foreground mt-1">
                  {post.createdAt?.toDate ? post.createdAt.toDate().toLocaleDateString() : ""}
                </div>
              </CardHeader>
              <CardContent className="flex-1">
                <div className="text-muted-foreground text-sm line-clamp-3 prose prose-sm prose-invert max-w-none">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>
                    {post.content?.slice(0, 300) + ((post.content?.length || 0) > 300 ? "..." : "")}
                  </ReactMarkdown>
                </div>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  )
}

