import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Calculator, AlertTriangle } from "lucide-react";
import { useUnit } from "@/components/layout/unit-provider";

interface UnitsConverterProps {
  onInsertDimensions?: (length: string, width: string, height: string) => void;
  onInsertWeight?: (weight: string) => void;
  currentUnit: string;
  t: (key: string) => string;
}

type DimensionConversion = "mm-to-in" | "in-to-mm";
type WeightConversion = "g-to-lb" | "lb-to-g";

export function UnitsConverter({
  onInsertDimensions,
  onInsertWeight,
  currentUnit,
  t,
}: UnitsConverterProps) {
  const [isOpen, setIsOpen] = useState(false);

  // Determinar el tipo de conversión basándose en las props
  const isDimensionConverter = !!onInsertDimensions;
  const isWeightConverter = !!onInsertWeight;

  const [dimensionConversion, setDimensionConversion] =
    useState<DimensionConversion>("mm-to-in");
  const [weightConversion, setWeightConversion] =
    useState<WeightConversion>("g-to-lb");

  // Dimension inputs
  const [inputLength, setInputLength] = useState("");
  const [inputWidth, setInputWidth] = useState("");
  const [inputHeight, setInputHeight] = useState("");

  // Weight input
  const [inputWeight, setInputWeight] = useState("");

  const [error, setError] = useState("");

  // Conversion functions
  const convertMmToInches = (mm: number): number => mm / 25.4;
  const convertInchesToMm = (inches: number): number => inches * 25.4;
  const convertGToLb = (g: number): number => g / 453.592;
  const convertLbToG = (lb: number): number => lb * 453.592;

  // Función para manejar el pegado de dimensiones
  const handleDimensionPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    // Buscar 3 números separados por x, espacio o coma
    const match = text.match(
      /(\d+(?:\.\d+)?)[ x,]+(\d+(?:\.\d+)?)[ x,]+(\d+(?:\.\d+)?)/
    );
    if (match) {
      setInputLength(match[1]);
      setInputWidth(match[2]);
      setInputHeight(match[3]);
      setError("");
      e.preventDefault();
    }
  };

  const handleInsert = () => {
    setError("");

    if (isDimensionConverter) {
      handleDimensionInsert();
    } else if (isWeightConverter) {
      handleWeightInsert();
    }
  };

  const handleDimensionInsert = () => {
    // Validar que todos los campos estén llenos
    if (!inputLength || !inputWidth || !inputHeight) {
      setError(t("addProduct.converter.allFieldsRequired"));
      return;
    }

    // Validar que los valores sean números positivos
    const length = parseFloat(inputLength);
    const width = parseFloat(inputWidth);
    const height = parseFloat(inputHeight);

    if (
      isNaN(length) ||
      isNaN(width) ||
      isNaN(height) ||
      length <= 0 ||
      width <= 0 ||
      height <= 0
    ) {
      setError(t("addProduct.converter.positiveNumbers"));
      return;
    }

    // Validar que la conversión sea compatible con la unidad actual
    if (dimensionConversion === "in-to-mm" && currentUnit === "mm") {
      // Convertir pulgadas a mm
      const convertedLength = convertInchesToMm(length).toFixed(2);
      const convertedWidth = convertInchesToMm(width).toFixed(2);
      const convertedHeight = convertInchesToMm(height).toFixed(2);
      onInsertDimensions?.(convertedLength, convertedWidth, convertedHeight);
    } else if (dimensionConversion === "mm-to-in" && currentUnit === "inches") {
      // Convertir mm a pulgadas
      const convertedLength = convertMmToInches(length).toFixed(3);
      const convertedWidth = convertMmToInches(width).toFixed(3);
      const convertedHeight = convertMmToInches(height).toFixed(3);
      onInsertDimensions?.(convertedLength, convertedWidth, convertedHeight);
    } else {
      // Error: conversión incompatible
      if (dimensionConversion === "in-to-mm" && currentUnit === "inches") {
        setError(t("addProduct.converter.errorInToMm"));
      } else if (dimensionConversion === "mm-to-in" && currentUnit === "mm") {
        setError(t("addProduct.converter.errorMmToIn"));
      }
      return;
    }

    // Limpiar campos y cerrar dialog
    setInputLength("");
    setInputWidth("");
    setInputHeight("");
    setIsOpen(false);
  };

  const handleWeightInsert = () => {
    // Validar que el campo esté lleno
    if (!inputWeight) {
      setError(t("addProduct.converter.allFieldsRequired"));
      return;
    }

    // Validar que el valor sea un número positivo
    const weight = parseFloat(inputWeight);

    if (isNaN(weight) || weight <= 0) {
      setError(t("addProduct.converter.positiveNumbers"));
      return;
    }

    // Validar que la conversión sea compatible con la unidad actual
    if (weightConversion === "lb-to-g" && currentUnit === "g") {
      // Convertir libras a gramos
      const convertedWeight = convertLbToG(weight).toFixed(0);
      onInsertWeight?.(convertedWeight);
    } else if (weightConversion === "g-to-lb" && currentUnit === "lb") {
      // Convertir gramos a libras
      const convertedWeight = convertGToLb(weight).toFixed(3);
      onInsertWeight?.(convertedWeight);
    } else {
      // Error: conversión incompatible
      if (weightConversion === "lb-to-g" && currentUnit === "lb") {
        setError(t("addProduct.converter.errorLbToG"));
      } else if (weightConversion === "g-to-lb" && currentUnit === "g") {
        setError(t("addProduct.converter.errorGToLb"));
      }
      return;
    }

    // Limpiar campos y cerrar dialog
    setInputWeight("");
    setIsOpen(false);
  };

  const handleDimensionPresetChange = (type: DimensionConversion) => {
    setDimensionConversion(type);
    setError("");
    setInputLength("");
    setInputWidth("");
    setInputHeight("");
  };

  const handleWeightPresetChange = (type: WeightConversion) => {
    setWeightConversion(type);
    setError("");
    setInputWeight("");
  };

  const getDimensionPresetLabel = (type: DimensionConversion) => {
    if (type === "mm-to-in") {
      return t("addProduct.converter.mmToInches");
    } else {
      return t("addProduct.converter.inchesToMm");
    }
  };

  const getWeightPresetLabel = (type: WeightConversion) => {
    if (type === "g-to-lb") {
      return t("addProduct.converter.gToLb");
    } else {
      return t("addProduct.converter.lbToG");
    }
  };

  const getDimensionInputLabel = (type: DimensionConversion) => {
    if (type === "mm-to-in") {
      return t("addProduct.converter.enterMm");
    } else {
      return t("addProduct.converter.enterInches");
    }
  };

  const getWeightInputLabel = (type: WeightConversion) => {
    if (type === "g-to-lb") {
      return t("addProduct.converter.enterG");
    } else {
      return t("addProduct.converter.enterLb");
    }
  };

  // Determinar el título del dialog
  const getDialogTitle = () => {
    if (isDimensionConverter) {
      return t("addProduct.converter.dimensionTitle");
    } else if (isWeightConverter) {
      return t("addProduct.converter.weightTitle");
    }
    return t("addProduct.converter.title");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="md:ml-2 h-10 w-10 sm:w-auto px-2 sm:px-3"
        >
          <Calculator className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-md mx-auto">
        <DialogHeader>
          <DialogTitle>{getDialogTitle()}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Dimension Presets */}
          {isDimensionConverter && (
            <div className="flex gap-2">
              <Button
                variant={
                  dimensionConversion === "mm-to-in" ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleDimensionPresetChange("mm-to-in")}
                className="flex-1"
              >
                {getDimensionPresetLabel("mm-to-in")}
              </Button>
              <Button
                variant={
                  dimensionConversion === "in-to-mm" ? "default" : "outline"
                }
                size="sm"
                onClick={() => handleDimensionPresetChange("in-to-mm")}
                className="flex-1"
              >
                {getDimensionPresetLabel("in-to-mm")}
              </Button>
            </div>
          )}

          {/* Weight Presets */}
          {isWeightConverter && (
            <div className="flex gap-2">
              <Button
                variant={weightConversion === "g-to-lb" ? "default" : "outline"}
                size="sm"
                onClick={() => handleWeightPresetChange("g-to-lb")}
                className="flex-1"
              >
                {getWeightPresetLabel("g-to-lb")}
              </Button>
              <Button
                variant={weightConversion === "lb-to-g" ? "default" : "outline"}
                size="sm"
                onClick={() => handleWeightPresetChange("lb-to-g")}
                className="flex-1"
              >
                {getWeightPresetLabel("lb-to-g")}
              </Button>
            </div>
          )}

          {/* Error message */}
          {error && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Dimension Input fields */}
          {isDimensionConverter && (
            <div className="space-y-3">
              <Label>{getDimensionInputLabel(dimensionConversion)}</Label>
              <div className="flex flex-col sm:flex-row gap-2">
                <div className="flex-1">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder={t("addProduct.form.length")}
                    value={inputLength}
                    onChange={(e) => setInputLength(e.target.value)}
                    onPaste={handleDimensionPaste}
                  />
                </div>
                <span className="text-muted-foreground self-center hidden sm:block">
                  x
                </span>
                <div className="flex-1">
                  <Input
                    type="number"
                    step="0.01"
                    placeholder={t("addProduct.form.width")}
                    value={inputWidth}
                    onChange={(e) => setInputWidth(e.target.value)}
                  />
                </div>
                <span className="text-muted-foreground self-center hidden sm:block">
                  x
                </span>
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
              <p className="text-xs text-muted-foreground">
                {t("addProduct.form.dimensionsHelp")}
              </p>
            </div>
          )}

          {/* Weight Input field */}
          {isWeightConverter && (
            <div className="space-y-3">
              <Label>{getWeightInputLabel(weightConversion)}</Label>
              <Input
                type="number"
                step="0.01"
                placeholder={t("addProduct.form.weightPlaceholder")}
                value={inputWeight}
                onChange={(e) => setInputWeight(e.target.value)}
              />
            </div>
          )}

          {/* Insert button */}
          <Button onClick={handleInsert} className="w-full">
            {t("addProduct.converter.insert")}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
