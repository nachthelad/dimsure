import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface ProductNameFieldProps {
  value: string
  onChange: (value: string) => void
  error?: string
  t: (key: string) => string
}

export function ProductNameField({ value, onChange, error, t }: ProductNameFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="name">{t("addProduct.form.productName")} *</Label>
      <Input
        id="name"
        type="text"
        placeholder={t("addProduct.form.productNamePlaceholder")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={(e) => {
          const error = e.target.value.trim() === "" ? t("addProduct.validation.nameRequired") :
                       e.target.value.trim().length < 3 ? t("addProduct.validation.nameMinLength") :
                       e.target.value.trim().length > 100 ? t("addProduct.validation.nameMaxLength") : undefined
          if (error) {
            // This would need to be handled by the parent component
            // For now, we'll just validate on blur
          }
        }}
        className={error ? "border-red-500 focus:border-red-500" : ""}
        required
      />
      {error ? (
        <p className="text-sm text-red-500">{error}</p>
      ) : (
        <p className="text-xs text-muted-foreground">{t("addProduct.form.productNameHelp")}</p>
      )}
    </div>
  )
} 