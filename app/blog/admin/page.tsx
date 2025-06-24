"use client"
import { useState } from "react"
import { useAuth } from "@/hooks/useAuth"
import { db } from "@/lib/firebase"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { uploadBlogImage, validateImageFile } from "@/lib/storage"
import ToolbarPlugin from "./ToolbarPlugin";
import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { OnChangePlugin } from "@lexical/react/LexicalOnChangePlugin";
import { $generateHtmlFromNodes } from "@lexical/html";
import { ListPlugin } from '@lexical/react/LexicalListPlugin';
import { LinkPlugin } from '@lexical/react/LexicalLinkPlugin';
import { ListNode, ListItemNode } from '@lexical/list';
import { LinkNode } from '@lexical/link';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";


function slugify(text: string) {
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/[^\w-]+/g, "")
}

const MAX_CONTENT_LENGTH = 10000;

// Lexical config
const initialConfig = {
  namespace: "BlogEditor",
  theme: {
    paragraph: "mb-2",
    text: {
      bold: "font-bold",
      italic: "italic",
      underline: "underline",
    },
  },
  onError(error: Error) {
    throw error;
  },
  nodes: [ListNode, ListItemNode, LinkNode],
};

export default function BlogAdminPage() {
  const { user, loading } = useAuth()
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [coverImageFile, setCoverImageFile] = useState<File | null>(null)
  const [coverImageUrl, setCoverImageUrl] = useState("")
  const [imageError, setImageError] = useState("")
  const [uploadingImage, setUploadingImage] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)

  if (loading) return <div>Cargando...</div>
  if (!user || user.email !== "nacho.vent@gmail.com") return <div>No autorizado</div>

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    setImageError("")
    if (!file) return
    const validation = validateImageFile(file)
    if (!validation.isValid) {
      setImageError(validation.error || "Archivo no válido")
      setCoverImageFile(null)
      setCoverImageUrl("")
      return
    }
    setUploadingImage(true)
    try {
      const url = await uploadBlogImage(file)
      setCoverImageFile(file)
      setCoverImageUrl(url)
    } catch (err) {
      setImageError("Error al subir la imagen")
      setCoverImageFile(null)
      setCoverImageUrl("")
    }
    setUploadingImage(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const slug = slugify(title)
    try {
      await addDoc(collection(db, "blogPosts"), {
        title,
        slug,
        content,
        coverImage: coverImageUrl,
        createdAt: serverTimestamp(),
        author: user.email,
      })
      setTitle("")
      setContent("")
      setCoverImageFile(null)
      setCoverImageUrl("")
      setSuccess(true)
    } catch (err) {
      alert("Error al guardar el artículo")
    }
    setSubmitting(false)
  }

  // Convert Lexical state to HTML and set as content
  function onChange(editorState: any, editor: any) {
    editorState.read(() => {
      const htmlString = $generateHtmlFromNodes(editor, null);
      setContent(htmlString);
    });
  }

  return (
    <div className="max-w-4xl mx-auto py-8 px-2">
      <Card className="mx-auto max-w-2xl">
        <CardHeader>
          <CardTitle>Nuevo artículo del blog</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-1 font-medium">Título</label>
              <input
                className="w-full border border-input bg-background p-2 rounded focus:outline-none focus:ring-2 focus:ring-primary"
                placeholder="Título"
                value={title}
                onChange={e => setTitle(e.target.value)}
                required
              />
            </div>
            <div>
              <label className="block mb-1 font-medium">Imagen de portada (JPG, PNG, WebP, máx 5MB)</label>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleImageChange}
                disabled={uploadingImage}
                className="w-full border border-input bg-background p-2 rounded"
              />
              {uploadingImage && <div className="text-blue-600 mt-1">Subiendo imagen...</div>}
              {imageError && <div className="text-red-600 mt-1">{imageError}</div>}
              {coverImageFile && coverImageUrl && (
                <div className="mt-2">
                  <div className="text-sm text-gray-600">{coverImageFile.name}</div>
                  <img src={coverImageUrl} alt="Preview" className="mt-1 max-h-40 rounded" />
                </div>
              )}
            </div>
            <div>
              <label className="block mb-1 font-medium">Contenido (máx {MAX_CONTENT_LENGTH} caracteres)</label>
              <div className="border rounded bg-background">
                <LexicalComposer initialConfig={initialConfig}>
                  <div className="border-b bg-muted px-2 py-1 rounded-t">
                    <ToolbarPlugin />
                  </div>
                  <RichTextPlugin
                    contentEditable={
                      <ContentEditable
                        className="prose prose-invert min-h-[200px] w-full bg-background text-foreground p-4 focus:outline-none rounded-b"
                      />
                    }
                    ErrorBoundary={({ children }) => <>{children}</>}
                  />
                  <HistoryPlugin />
                  <ListPlugin />
                  <LinkPlugin />
                  <OnChangePlugin onChange={onChange} />
                </LexicalComposer>
              </div>
              <div className="text-right text-xs text-gray-500 mt-1">
                {content.length} / {MAX_CONTENT_LENGTH}
              </div>
            </div>
            <Button
              type="submit"
              disabled={submitting || uploadingImage || !title || !content || !coverImageUrl || content.length > MAX_CONTENT_LENGTH}
            >
              {submitting ? "Publicando..." : "Publicar"}
            </Button>
            {success && <div className="text-green-600 mt-2">¡Artículo publicado!</div>}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
