import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRef } from "react"

interface BrandFieldProps {
  value: string
  onChange: (value: string) => void
  onInput: (value: string) => void
  onSelect: (name: string) => void
  options: string[]
  inputRef: React.RefObject<HTMLInputElement>
  error?: string
  t: (key: string) => string
}

export function BrandField({ value, onChange, onInput, onSelect, options, inputRef, error, t }: BrandFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor="brand">{t("addProduct.form.brand")} *</Label>
      <div className="relative">
        <Input
          id="brand"
          type="text"
          placeholder={t("addProduct.form.brandPlaceholder")}
          value={value}
          onChange={(e) => {
            onChange(e.target.value)
            onInput(e.target.value)
          }}
          onBlur={(e) => {
            const error = e.target.value.trim() === "" ? t("addProduct.validation.brandRequired") : undefined
            if (error) {
              // This would need to be handled by the parent component
            }
          }}
          ref={inputRef}
          autoComplete="off"
          className={error ? "border-red-500 focus:border-red-500" : ""}
          required
        />
        {options.length > 0 && (
          <ul className="absolute z-10 bg-background border border-border rounded w-full mt-1 max-h-40 overflow-auto shadow">
            {options.map((option) => (
              <li
                key={option}
                className="px-3 py-2 cursor-pointer hover:bg-primary/10"
                onClick={() => onSelect(option)}
              >
                {option}
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  )
} 