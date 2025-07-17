import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

interface DescriptionFieldProps {
  value: string
  onChange: (value: string) => void
  t: (key: string) => string
}

export function DescriptionField({ value, onChange, t }: DescriptionFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="description">{t("addProduct.form.description")}</Label>
      <Textarea
        id="description"
        placeholder={t("addProduct.form.descriptionPlaceholder")}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={3}
      />
    </div>
  )
} 