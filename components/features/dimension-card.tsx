"use client"

import { Package, Ruler } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useUnit } from "@/components/layout/unit-provider"
import { useLanguage } from "@/components/layout/language-provider"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"

interface DimensionCardProps {
  dimensions: { length: number; width: number; height: number }
  title: string
  isPrimary?: boolean
}

export function DimensionCard({ dimensions, title, isPrimary = false }: DimensionCardProps) {
  const { unit, convertDimension } = useUnit()
  const { t } = useLanguage()

  const formatDimension = (value: number) => {
    const converted = convertDimension(value, "mm")
    return Math.round(converted).toString()
  }

  return (
    <Card className={isPrimary ? "border-primary/20 bg-primary/5 dark:bg-primary/10" : ""}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Package className="h-5 w-5" />
          {title}
          <Badge variant="secondary">{unit}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-4">
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Ruler className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t("units.length")}</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{formatDimension(dimensions.length)}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Ruler className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t("units.width")}</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{formatDimension(dimensions.width)}</div>
          </div>
          <div className="text-center">
            <div className="flex items-center justify-center gap-1 mb-1">
              <Ruler className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">{t("units.height")}</span>
            </div>
            <div className="text-2xl font-bold text-foreground">{formatDimension(dimensions.height)}</div>
          </div>
        </div>
        <div className="mt-4 text-center flex items-center justify-center gap-2">
          <span className="text-lg font-semibold text-foreground">
            {formatDimension(dimensions.length)} × {formatDimension(dimensions.width)} × {formatDimension(dimensions.height)} {unit}
          </span>
          <CopyDimensionsButton dimensions={dimensions} unit={unit} />
        </div>
      </CardContent>
    </Card>
  )
}

function CopyDimensionsButton({ dimensions, unit }: { dimensions: { length: number, width: number, height: number }, unit: string }) {
  const [copied, setCopied] = useState(false);
  const value = `${dimensions.length} × ${dimensions.width} × ${dimensions.height} ${unit}`;

  const handleCopy = async () => {
    await navigator.clipboard.writeText(value);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };

  return (
    <Button size="icon" variant="ghost" onClick={handleCopy} aria-label="Copy dimensions">
      {copied ? <span className="text-green-600 text-xs font-medium">✓</span> : <Copy className="h-4 w-4" />}
    </Button>
  );
}
