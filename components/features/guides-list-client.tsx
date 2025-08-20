"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { db } from "@/lib/firebase";
import { collection, getDocs, orderBy, query } from "firebase/firestore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Clock, User } from "lucide-react";
import type { Guide } from "@/lib/types";

export function GuidesListClient({ children }: { children?: React.ReactNode }) {
  const [guides, setGuides] = useState<Guide[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchGuides() {
      try {
        const q = query(
          collection(db, "guides"),
          orderBy("publishedAt", "desc")
        );
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Guide[];
        setGuides(data);
      } catch (error) {
        console.error("Error fetching guides:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchGuides();
  }, []);

  if (loading) return null;

  if (!guides.length) return <>{children || null}</>;

  return (
    <div className="grid md:grid-cols-2 gap-8">
      {guides.map((guide) => (
        <Link key={guide.id} href={`/guides/${guide.slug}`}>
          <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer group">
            <CardHeader>
              <div className="flex items-start justify-between mb-3">
                <Badge variant="secondary">{guide.category}</Badge>
              </div>
              <CardTitle className="text-xl group-hover:text-primary transition-colors">
                {guide.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4 line-clamp-3">
                {guide.description}
              </p>
              <div className="flex items-center justify-between text-sm text-muted-foreground">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    {guide.readTime}
                  </div>
                  <div className="flex items-center gap-1">
                    <User className="h-4 w-4" />
                    {guide.author}
                  </div>
                </div>
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
}
