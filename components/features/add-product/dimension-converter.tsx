import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Calculator, AlertTriangle } from "lucide-react"

interface DimensionConverterProps {
  onInsertDimensions: (length: string, width: string, height: string) => void
  currentUnit: string
  t: (key: string) => string
}

export function DimensionConverter({ onInsertDimensions, currentUnit, t }: DimensionConverterProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [conversionType, setConversionType] = useState<'mm-to-in' | 'in-to-mm'>('mm-to-in')
  const [inputLength, setInputLength] = useState('')
  const [inputWidth, setInputWidth] = useState('')
  const [inputHeight, setInputHeight] = useState('')
  const [error, setError] = useState('')

  const convertMmToInches = (mm: number): number => mm / 25.4
  const convertInchesToMm = (inches: number): number => inches * 25.4

  const handleInsert = () => {
    setError('')
    
    // Validar que todos los campos estén llenos
    if (!inputLength || !inputWidth || !inputHeight) {
      setError(t("addProduct.converter.allFieldsRequired"))
      return
    }

    // Validar que los valores sean números positivos
    const length = parseFloat(inputLength)
    const width = parseFloat(inputWidth)
    const height = parseFloat(inputHeight)

    if (isNaN(length) || isNaN(width) || isNaN(height) || length <= 0 || width <= 0 || height <= 0) {
      setError(t("addProduct.converter.positiveNumbers"))
      return
    }

    // Validar que la conversión sea compatible con la unidad actual
    if (conversionType === 'in-to-mm' && currentUnit === 'mm') {
      // Convertir pulgadas a mm
      const convertedLength = convertInchesToMm(length).toFixed(2)
      const convertedWidth = convertInchesToMm(width).toFixed(2)
      const convertedHeight = convertInchesToMm(height).toFixed(2)
      onInsertDimensions(convertedLength, convertedWidth, convertedHeight)
    } else if (conversionType === 'mm-to-in' && currentUnit === 'inches') {
      // Convertir mm a pulgadas
      const convertedLength = convertMmToInches(length).toFixed(3)
      const convertedWidth = convertMmToInches(width).toFixed(3)
      const convertedHeight = convertMmToInches(height).toFixed(3)
      onInsertDimensions(convertedLength, convertedWidth, convertedHeight)
    } else {
      // Error: conversión incompatible
      if (conversionType === 'in-to-mm' && currentUnit === 'inches') {
        setError(t("addProduct.converter.errorInToMm"))
      } else if (conversionType === 'mm-to-in' && currentUnit === 'mm') {
        setError(t("addProduct.converter.errorMmToIn"))
      }
      return
    }

    // Limpiar campos y cerrar dialog
    setInputLength('')
    setInputWidth('')
    setInputHeight('')
    setIsOpen(false)
  }

  const handlePresetChange = (type: 'mm-to-in' | 'in-to-mm') => {
    setConversionType(type)
    setError('')
    setInputLength('')
    setInputWidth('')
    setInputHeight('')
  }

  const getPresetLabel = (type: 'mm-to-in' | 'in-to-mm') => {
    if (type === 'mm-to-in') {
      return t("addProduct.converter.mmToInches")
    } else {
      return t("addProduct.converter.inchesToMm")
    }
  }

  const getInputLabel = (type: 'mm-to-in' | 'in-to-mm') => {
    if (type === 'mm-to-in') {
      return t("addProduct.converter.enterMm")
    } else {
      return t("addProduct.converter.enterInches")
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="md:ml-2 h-10 w-10 sm:w-auto px-2 sm:px-3">
          <Calculator className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>{t("addProduct.converter.title")}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          {/* Presets */}
          <div className="flex gap-2">
            <Button
              variant={conversionType === 'mm-to-in' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePresetChange('mm-to-in')}
              className="flex-1"
            >
              {getPresetLabel('mm-to-in')}
            </Button>
            <Button
              variant={conversionType === 'in-to-mm' ? 'default' : 'outline'}
              size="sm"
              onClick={() => handlePresetChange('in-to-mm')}
              className="flex-1"
            >
              {getPresetLabel('in-to-mm')}
            </Button>
          </div>

          {/* Error message */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Input fields */}
          <div className="space-y-3">
            <Label>{getInputLabel(conversionType)}</Label>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <Input
                  type="number"
                  step="0.01"
                  placeholder={t("addProduct.form.length")}
                  value={inputLength}
                  onChange={(e) => setInputLength(e.target.value)}
                />
              </div>
              <span className="text-muted-foreground self-center hidden sm:block">x</span>
              <div className="flex-1">
                <Input
                  type="number"
                  step="0.01"
                  placeholder={t("addProduct.form.width")}
                  value={inputWidth}
                  onChange={(e) => setInputWidth(e.target.value)}
                />
              </div>
              <span className="text-muted-foreground self-center hidden sm:block">x</span>
              <div className="flex-1">
                <Input
                  type="number"
                  step="0.01"
                  placeholder={t("addProduct.form.height")}
                  value={inputHeight}
                  onChange={(e) => setInputHeight(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Insert button */}
          <Button onClick={handleInsert} className="w-full">
            {t("addProduct.converter.insert")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 