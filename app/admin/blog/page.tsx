"use client";
import React, { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { db } from "@/lib/firebase";
import {
  collection,
  addDoc,
  serverTimestamp,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { optimizeAndUploadImage, validateImageFile } from "@/lib/storage";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/components/layout/language-provider";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function ensureUniqueSlug(baseSlug: string): Promise<string> {
  let candidate = baseSlug;
  let suffix = 1;
  // Try a few times; extremely unlikely to loop many times
  // Check if any post already uses this slug
  // If exists, append incremental suffix: slug-2, slug-3, ...
  // Firestore: query equality on field 'slug'
  // Loop until unique
  // Note: This is client-side uniqueness; race conditions are unlikely here
  // For strong guarantees, enforce at write-time with a Cloud Function
  // which is out of scope for this UI change
  // Here, we aim for practical uniqueness in admin UI
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const snapshot = await getDocs(
      query(collection(db, "blogPosts"), where("slug", "==", candidate))
    );
    if (snapshot.empty) {
      return candidate;
    }
    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }
}

const MAX_CONTENT_LENGTH = 10000;

export default function BlogAdminPage() {
  const { user, loading, userData } = useAuth();
  const { t } = useLanguage();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [imageError, setImageError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (loading) return <div>{t("blog.admin.loading")}</div>;
  if (!user || userData?.role !== "admin")
    return <div>{t("blog.admin.notAuthorized")}</div>;

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setImageError("");
    if (!file) return;
    const validation = validateImageFile(file);
    if (!validation.isValid) {
      setImageError(validation.error || "Archivo no válido");
      setCoverImageFile(null);
      setCoverImageUrl("");
      return;
    }
    setUploadingImage(true);
    try {
      const url = await optimizeAndUploadImage(file, "blog");
      setCoverImageFile(file);
      setCoverImageUrl(url);
    } catch (err) {
      setImageError("Error al subir la imagen");
      setCoverImageFile(null);
      setCoverImageUrl("");
    }
    setUploadingImage(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const slug = await ensureUniqueSlug(slugify(title));
    try {
      await addDoc(collection(db, "blogPosts"), {
        title,
        slug,
        content,
        coverImage: coverImageUrl,
        createdAt: serverTimestamp(),
        author: user.email,
      });
      setTitle("");
      setContent("");
      setCoverImageFile(null);
      setCoverImageUrl("");
      setSuccess(true);
    } catch (err) {
      alert("Error al guardar el artículo");
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-2">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>{t("blog.admin.newPostTitle")}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 font-medium">
                {t("blog.admin.titleLabel")}
              </label>
              <input
                className="w-full border border-input bg-background p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder={t("blog.admin.titlePlaceholder")}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">
                {t("blog.admin.coverImageLabel")}
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                disabled={uploadingImage}
                className="w-full border border-input bg-background p-2 rounded"
              />
              {uploadingImage && (
                <div className="text-blue-600 mt-1">
                  {t("blog.admin.uploadingImage")}
                </div>
              )}
              {imageError && (
                <div className="text-red-600 mt-1">
                  {t("blog.admin.imageError", { error: imageError })}
                </div>
              )}
              {coverImageFile && coverImageUrl && (
                <div className="mt-2">
                  <div className="text-sm text-gray-600">
                    {coverImageFile.name}
                  </div>
                  <img
                    src={coverImageUrl}
                    alt={t("blog.admin.coverImagePreviewAlt")}
                    className="mt-1 max-h-40 rounded"
                  />
                </div>
              )}
            </div>
            <div>
              <label className="block mb-1 font-medium">
                {t("blog.admin.contentLabel", { max: MAX_CONTENT_LENGTH })}
              </label>
              <textarea
                className="w-full border border-input bg-background p-2 rounded min-h-[200px] font-mono"
                placeholder={t("blog.admin.contentPlaceholder")}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                maxLength={MAX_CONTENT_LENGTH}
                required
              />
              <div className="text-right text-xs text-gray-500 mt-1">
                {content.length} / {MAX_CONTENT_LENGTH}
              </div>
            </div>
            <Button
              type="submit"
              disabled={
                submitting ||
                uploadingImage ||
                !title ||
                !content ||
                !coverImageUrl ||
                content.length > MAX_CONTENT_LENGTH
              }
            >
              {submitting
                ? t("blog.admin.publishing")
                : t("blog.admin.publish")}
            </Button>
            {success && (
              <div className="text-green-600 mt-2">
                {t("blog.admin.success")}
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
