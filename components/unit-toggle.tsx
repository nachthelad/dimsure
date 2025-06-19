"use client"

import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { useUnit } from "./unit-provider"
import { useLanguage } from "./language-provider"

export function UnitToggle() {
  const { unit, setUnit } = useUnit()
  const { t } = useLanguage()

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="unit-toggle" className="text-sm font-medium">
        {t("units.mm")}
      </Label>
      <Switch
        id="unit-toggle"
        checked={unit === "inches"}
        onCheckedChange={(checked) => setUnit(checked ? "inches" : "mm")}
      />
      <Label htmlFor="unit-toggle" className="text-sm font-medium">
        {t("units.inches")}
      </Label>
    </div>
  )
}
