"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { useUnit } from "@/components/layout/unit-provider";
import { useLanguage } from "@/components/layout/language-provider";

export function UnitToggle() {
  const { unitSystem, setUnitSystem } = useUnit();
  const { t } = useLanguage();

  return (
    <div className="flex items-center space-x-2">
      <Label htmlFor="unit-toggle" className="text-sm font-medium">
        {t("units.metric")}
      </Label>
      <Switch
        id="unit-toggle"
        checked={unitSystem === "imperial"}
        onCheckedChange={(checked) =>
          setUnitSystem(checked ? "imperial" : "metric")
        }
      />
      <Label htmlFor="unit-toggle" className="text-sm font-medium">
        {t("units.imperial")}
      </Label>
    </div>
  );
}
