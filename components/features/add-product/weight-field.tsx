import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface WeightFieldProps {
  value: string
  onChange: (value: string) => void
  error?: string
  t: (key: string) => string
}

export function WeightField({ value, onChange, error, t }: WeightFieldProps) {
  return (
    <div className="mt-6">
      <Label htmlFor="weight">{t("addProduct.form.packageWeight")}</Label>
      <div className="relative w-24 mt-1">
        <Input
          id="weight"
          type="number"
          placeholder={t("addProduct.form.weightPlaceholder")}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onBlur={(e) => {
            // Validation would be handled by parent component
          }}
          className={`pr-7 ${error ? "border-red-500 focus:border-red-500" : ""}`}
        />
        <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted-foreground pointer-events-none">g</span>
      </div>
      {error && (
        <p className="text-sm text-red-500 mt-1">{error}</p>
      )}
    </div>
  )
} 