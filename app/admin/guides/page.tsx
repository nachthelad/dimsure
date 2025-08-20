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
import {
  optimizeAndUploadImage,
  validateImageFile,
  type UploadedImageMeta,
} from "@/lib/storage";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { APP_CONSTANTS } from "@/lib/constants";

function slugify(text: string) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function ensureUniqueGuideSlug(baseSlug: string): Promise<string> {
  let candidate = baseSlug;
  let suffix = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const snapshot = await getDocs(
      query(collection(db, "guides"), where("slug", "==", candidate))
    );
    if (snapshot.empty) {
      return candidate;
    }
    suffix += 1;
    candidate = `${baseSlug}-${suffix}`;
  }
}

const MAX_CONTENT_LENGTH = 20000;

export default function GuidesAdminPage() {
  const { user, loading, userData } = useAuth();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Measurement");
  const [readTime, setReadTime] = useState("5 min read");
  const [author, setAuthor] = useState("Dimsure Team");
  const [content, setContent] = useState("");
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null);
  const [coverImageUrl, setCoverImageUrl] = useState("");
  const [coverImageMeta, setCoverImageMeta] =
    useState<UploadedImageMeta | null>(null);
  const [imageError, setImageError] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  if (loading) return <div>Cargando...</div>;
  const isEmailAdmin =
    !!user?.email &&
    (user.email === APP_CONSTANTS.ADMIN_EMAIL ||
      user.email === APP_CONSTANTS.DEBUG_AUTHORIZED_EMAIL);
  if (!user || (userData?.role !== "admin" && !isEmailAdmin))
    return <div>No autorizado</div>;

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
      const meta = await optimizeAndUploadImage(file, "guides");
      setCoverImageFile(file);
      setCoverImageUrl(meta.url);
      setCoverImageMeta(meta);
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
    const baseSlug = slugify(title);
    const slug = await ensureUniqueGuideSlug(baseSlug);
    try {
      await addDoc(collection(db, "guides"), {
        title,
        slug,
        description,
        category,
        readTime,
        author: author || "Dimsure Team",
        content,
        coverImage: coverImageUrl || null,
        coverImageWidth: coverImageMeta?.width || null,
        coverImageHeight: coverImageMeta?.height || null,
        coverImageBlurDataURL: coverImageMeta?.blurDataURL || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        publishedAt: serverTimestamp(),
      });
      setTitle("");
      setDescription("");
      setCategory("Measurement");
      setReadTime("5 min read");
      setAuthor("Dimsure Team");
      setContent("");
      setCoverImageFile(null);
      setCoverImageUrl("");
      setSuccess(true);
    } catch (err) {
      alert("Error al guardar la guía");
    }
    setSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-2">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Nueva Guía</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 font-medium">Título</label>
              <input
                className="w-full border border-input bg-background p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Título de la guía"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block mb-1 font-medium">Descripción</label>
              <textarea
                className="w-full border border-input bg-background p-2 rounded min-h-[80px]"
                placeholder="Resumen breve"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={300}
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block mb-1 font-medium">Categoría</label>
                <input
                  className="w-full border border-input bg-background p-2 rounded"
                  placeholder="Measurement / Optimization / Logistics / Operations"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">
                  Tiempo de lectura
                </label>
                <input
                  className="w-full border border-input bg-background p-2 rounded"
                  placeholder="5 min read"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  required
                />
              </div>
              <div>
                <label className="block mb-1 font-medium">Autor</label>
                <input
                  className="w-full border border-input bg-background p-2 rounded"
                  placeholder="Autor"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Imagen de portada
              </label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                disabled={uploadingImage}
                className="w-full border border-input bg-background p-2 rounded"
              />
              {uploadingImage && (
                <div className="text-blue-600 mt-1">Subiendo imagen...</div>
              )}
              {imageError && (
                <div className="text-red-600 mt-1">{imageError}</div>
              )}
              {coverImageFile && coverImageUrl && (
                <div className="mt-2">
                  <div className="text-sm text-gray-600">
                    {coverImageFile.name}
                  </div>
                  <img
                    src={coverImageUrl}
                    alt="Vista previa"
                    className="mt-1 max-h-40 rounded"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium">
                Contenido (Markdown)
              </label>
              <textarea
                className="w-full border border-input bg-background p-2 rounded min-h-[240px] font-mono"
                placeholder="Escribe el contenido en Markdown"
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
                !description ||
                !category ||
                !readTime ||
                !content ||
                content.length > MAX_CONTENT_LENGTH
              }
            >
              {submitting ? "Publicando..." : "Publicar"}
            </Button>
            {success && (
              <div className="text-green-600 mt-2">
                ¡Guía publicada correctamente!
              </div>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
