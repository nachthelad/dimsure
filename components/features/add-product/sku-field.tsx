import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface SkuFieldProps {
  value: string
  onChange: (value: string) => void
  error?: string
  t: (key: string) => string
}

export function SkuField({ value, onChange, error, t }: SkuFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="sku">{t("addProduct.form.sku")} *</Label>
      <Input
        id="sku"
        type="text"
        placeholder={t("addProduct.form.skuPlaceholder")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => {
          const error = e.target.value.trim() === "" ? t("addProduct.validation.skuRequired") :
                       e.target.value.trim().length < 2 ? t("addProduct.validation.skuMinLength") :
                       e.target.value.trim().length > 50 ? t("addProduct.validation.skuMaxLength") : undefined
          if (error) {
            // This would need to be handled by the parent component
          }
        }}
        className={error ? "border-red-500 focus:border-red-500" : ""}
        required
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
} 