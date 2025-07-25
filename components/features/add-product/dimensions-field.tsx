import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Info } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { UnitsConverter } from "./units-converter";
import { useUnit } from "@/components/layout/unit-provider";

interface DimensionsFieldProps {
  length: string;
  width: string;
  height: string;
  onChange: (field: "length" | "width" | "height", value: string) => void;
  onPaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;
  error?: string;
  t: (key: string) => string;
}

export function DimensionsField({
  length,
  width,
  height,
  onChange,
  onPaste,
  error,
  t,
}: DimensionsFieldProps) {
  const { getDimensionUnit, isMetric } = useUnit();
  const dimensionUnit = getDimensionUnit();

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-1">
          {t("addProduct.form.boxDimensions")} *{" "}
          {isMetric()
            ? t("addProduct.form.inMillimeters")
            : t("addProduct.form.inInches")}
          <Tooltip>
            <TooltipTrigger asChild>
              <span tabIndex={0} className="outline-none">
                <Info className="h-4 w-4 text-muted-foreground cursor-pointer" />
              </span>
            </TooltipTrigger>
            <TooltipContent side="top">
              {t("addProduct.form.dimensionsHelp")}
            </TooltipContent>
          </Tooltip>
        </Label>
      </div>
      <div className="flex flex-col sm:flex-row gap-2 items-end">
        <div className="flex gap-2 items-end flex-1">
          <Input
            id="length"
            type="number"
            step="1"
            placeholder={t("addProduct.form.length")}
            value={length}
            onChange={(e) => onChange("length", e.target.value)}
            onBlur={(e) => {
              // Validation would be handled by parent component
            }}
            onPaste={onPaste}
            className={`w-full sm:w-24 ${
              error ? "border-red-500 focus:border-red-500" : ""
            }`}
            required
          />
          <span className="text-muted-foreground hidden sm:block">x</span>
          <Input
            id="width"
            type="number"
            step="1"
            placeholder={t("addProduct.form.width")}
            value={width}
            onChange={(e) => onChange("width", e.target.value)}
            onBlur={(e) => {
              // Validation would be handled by parent component
            }}
            className={`w-full sm:w-24 ${
              error ? "border-red-500 focus:border-red-500" : ""
            }`}
            required
          />
          <span className="text-muted-foreground hidden sm:block">x</span>
          <Input
            id="height"
            type="number"
            step="1"
            placeholder={t("addProduct.form.height")}
            value={height}
            onChange={(e) => onChange("height", e.target.value)}
            onBlur={(e) => {
              // Validation would be handled by parent component
            }}
            className={`w-full sm:w-24 ${
              error ? "border-red-500 focus:border-red-500" : ""
            }`}
            required
          />
          <UnitsConverter
            onInsertDimensions={(length, width, height) => {
              onChange("length", length);
              onChange("width", width);
              onChange("height", height);
            }}
            currentUnit={dimensionUnit}
            t={t}
          />
        </div>
      </div>
      {error && <p className="text-sm text-red-500">{error}</p>}
    </div>
  );
}
