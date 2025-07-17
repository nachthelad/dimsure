import { Upload, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"

interface ImageUploadFieldProps {
  images: File[]
  imagePreviews: string[]
  mainImageIndex: number
  onImagesChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onMainImageChange: (index: number) => void
  onImageRemove: (index: number) => void
  isUploading: boolean
  error?: string
  t: (key: string) => string
}

export function ImageUploadField({ 
  images, 
  imagePreviews, 
  mainImageIndex, 
  onImagesChange, 
  onMainImageChange, 
  onImageRemove, 
  isUploading, 
  error, 
  t 
}: ImageUploadFieldProps) {
  return (
    <div className="space-y-4">
      <Label htmlFor="image">{t("addProduct.form.productImage")}</Label>

      <div className={`border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors ${
        error ? "border-red-500" : "border-border"
      }`}>
        <input
          id="image"
          type="file"
          accept="image/jpeg,image/png,image/webp"
          multiple
          onChange={onImagesChange}
          disabled={isUploading}
          className="hidden"
        />
        <label htmlFor="image" className="cursor-pointer">
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">{t("addProduct.form.imageUpload")}</p>
          <p className="text-sm text-muted-foreground">{t("addProduct.form.maxImages")}</p>
          <p className="text-sm text-muted-foreground">{t("addProduct.form.imageFormats")}</p>
        </label>
        {images.length > 0 && (
          <>
            <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
              {images.map((file, idx) => (
                <div
                  key={idx}
                  className={`relative border rounded-lg p-2 bg-muted/50 flex flex-col items-center cursor-pointer select-none ${mainImageIndex === idx ? 'ring-2 ring-primary' : ''}`}
                  onClick={() => onMainImageChange(idx)}
                  tabIndex={0}
                  role="button"
                  aria-pressed={mainImageIndex === idx}
                >
                  <img
                    src={imagePreviews[idx] || "/placeholder.svg"}
                    alt={file.name}
                    className="w-20 h-20 object-cover rounded mb-2"
                  />
                  <span className="text-xs font-medium mb-1 truncate max-w-[80px]">{file.name}</span>
                  <div className="flex items-center gap-1">
                    <input
                      type="radio"
                      name="mainImage"
                      checked={mainImageIndex === idx}
                      readOnly
                      className="accent-primary hidden"
                    />
                    <span className="text-xs">{t("addProduct.form.setAsMain")}</span>
                  </div>
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    className="absolute top-1 right-1 h-5 w-5 rounded-full p-0"
                    onClick={e => {
                      e.stopPropagation();
                      onImageRemove(idx);
                    }}
                    disabled={isUploading}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <Badge variant="secondary">{t("addProduct.form.imageReady")}</Badge>
            </div>
          </>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
} 