"use client";

import { useState, useEffect } from "react";
import {
  Info,
  TrendingUp,
  Heart,
  Eye,
  Edit,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  getProductDisputeInfo,
  updateProductConfidence,
} from "@/lib/firestore";
import {
  calculateProductConfidence,
  getConfidenceBadgeVariant,
  getConfidenceDescription,
} from "@/lib/utils/confidence-calculator";
import type { Product } from "@/lib/types";

interface ConfidenceDetailsProps {
  product: Product;
  onConfidenceUpdate?: (newConfidence: number) => void;
}

export function ConfidenceDetails({
  product,
  onConfidenceUpdate,
}: ConfidenceDetailsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [confidenceFactors, setConfidenceFactors] = useState<any>(null);
  const [disputeInfo, setDisputeInfo] = useState<any>(null);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (isOpen) {
      calculateConfidence();
    }
  }, [isOpen, product]);

  const calculateConfidence = async () => {
    try {
      setIsCalculating(true);

      // Obtener información de disputas
      const disputes = await getProductDisputeInfo(product.urlSlug);
      setDisputeInfo(disputes);

      // Calcular factores de confianza
      const factors = calculateProductConfidence(product, disputes);
      setConfidenceFactors(factors);
    } catch (error) {
      console.error("Error calculating confidence:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  const handleRefreshConfidence = async () => {
    try {
      setIsCalculating(true);
      const factors = await updateProductConfidence(product.urlSlug);
      setConfidenceFactors(factors);
      if (onConfidenceUpdate) {
        onConfidenceUpdate(factors.totalScore);
      }
    } catch (error) {
      console.error("Error refreshing confidence:", error);
    } finally {
      setIsCalculating(false);
    }
  };

  const getFactorIcon = (factorName: string) => {
    switch (factorName) {
      case "likesScore":
        return <Heart className="h-4 w-4" />;
      case "viewsScore":
        return <Eye className="h-4 w-4" />;
      case "editsScore":
        return <Edit className="h-4 w-4" />;
      case "disputesScore":
        return <AlertTriangle className="h-4 w-4" />;
      case "ageScore":
        return <Clock className="h-4 w-4" />;
      default:
        return <Info className="h-4 w-4" />;
    }
  };

  const getFactorDescription = (factorName: string, value: number) => {
    switch (factorName) {
      case "likesScore":
        return `Basado en ${product.likes || 0} likes`;
      case "viewsScore":
        return `Basado en ${product.views || 0} visualizaciones`;
      case "editsScore":
        return product.lastModifiedBy &&
          product.lastModifiedBy !== product.createdBy
          ? "Editado por la comunidad"
          : "Sin ediciones comunitarias";
      case "disputesScore":
        if (!disputeInfo) return "Sin información de disputas";
        return `${disputeInfo.totalDisputes} disputas totales`;
      case "ageScore":
        const createdAt = product.createdAt?.toDate?.() || new Date(0);
        const daysSinceCreation = Math.floor(
          (Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24)
        );
        return `Producto creado hace ${daysSinceCreation} días`;
      default:
        return "";
    }
  };

  const getFactorColor = (value: number) => {
    if (value > 0) return "text-green-600";
    if (value < 0) return "text-red-600";
    return "text-gray-600";
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Confianza del Producto
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant={getConfidenceBadgeVariant(product.confidence || 0)}>
              {product.confidence || 0}%
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefreshConfidence}
              disabled={isCalculating}
            >
              {isCalculating ? "Calculando..." : "Actualizar"}
            </Button>
          </div>
        </div>
        <p className="text-sm text-muted-foreground">
          {getConfidenceDescription(product.confidence || 0)}
        </p>
      </CardHeader>

      <CardContent>
        <Collapsible open={isOpen} onOpenChange={setIsOpen}>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" className="w-full justify-between">
              <span>Ver detalles del cálculo</span>
              <span className="text-xs text-muted-foreground">
                {isOpen ? "Ocultar" : "Mostrar"}
              </span>
            </Button>
          </CollapsibleTrigger>

          <CollapsibleContent className="mt-4 space-y-4">
            {isCalculating ? (
              <div className="text-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary mx-auto"></div>
                <p className="text-sm text-muted-foreground mt-2">
                  Calculando confianza...
                </p>
              </div>
            ) : confidenceFactors ? (
              <div className="space-y-3">
                {/* Confianza base */}
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Info className="h-4 w-4 text-blue-600" />
                    <span className="font-medium">Confianza base</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">
                      +{confidenceFactors.baseConfidence}
                    </span>
                    <Badge variant="outline">Base</Badge>
                  </div>
                </div>

                {/* Factores dinámicos */}
                {Object.entries(confidenceFactors)
                  .filter(
                    ([key, value]) =>
                      key !== "baseConfidence" &&
                      key !== "totalScore" &&
                      typeof value === "number"
                  )
                  .map(([factorName, value]) => {
                    const numValue = value as number;
                    return (
                      <div
                        key={factorName}
                        className="flex items-center justify-between p-3 border rounded-lg"
                      >
                        <div className="flex items-center gap-2">
                          {getFactorIcon(factorName)}
                          <div>
                            <span className="font-medium capitalize">
                              {factorName
                                .replace("Score", "")
                                .replace(/([A-Z])/g, " $1")
                                .trim()}
                            </span>
                            <p className="text-xs text-muted-foreground">
                              {getFactorDescription(factorName, numValue)}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <span
                            className={`text-sm font-medium ${getFactorColor(
                              numValue
                            )}`}
                          >
                            {numValue > 0 ? "+" : ""}
                            {numValue}
                          </span>
                          <Badge
                            variant={
                              numValue > 0
                                ? "default"
                                : numValue < 0
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {numValue > 0
                              ? "Bonus"
                              : numValue < 0
                              ? "Penalización"
                              : "Neutral"}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}

                {/* Total */}
                <div className="flex items-center justify-between p-3 bg-primary/10 rounded-lg border-2 border-primary/20">
                  <span className="font-bold">Confianza Total</span>
                  <Badge variant="default" className="text-lg">
                    {confidenceFactors.totalScore}%
                  </Badge>
                </div>

                {/* Información adicional */}
                {disputeInfo && disputeInfo.totalDisputes > 0 && (
                  <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <h4 className="font-medium text-yellow-800 mb-2">
                      Información de Disputas
                    </h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div>Total: {disputeInfo.totalDisputes}</div>
                      <div>Abiertas: {disputeInfo.openDisputes}</div>
                      <div>Resueltas: {disputeInfo.resolvedDisputes}</div>
                      <div>Rechazadas: {disputeInfo.rejectedDisputes}</div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-4 text-muted-foreground">
                No se pudo calcular la confianza
              </div>
            )}
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
