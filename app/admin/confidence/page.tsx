"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  RefreshCw,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { useAuth } from "@/hooks/useAuth";
import { updateAllProductsConfidence } from "@/lib/firestore";
import { APP_CONSTANTS } from "@/lib/constants";

interface UpdateResult {
  productSlug: string;
  productName?: string;
  oldConfidence?: number | undefined;
  newConfidence?: number | undefined;
  wasUpdated?: boolean;
  factors?: any;
  error?: string;
}

export default function ConfidenceAdminPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [isUpdating, setIsUpdating] = useState(false);
  const [results, setResults] = useState<UpdateResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [stats, setStats] = useState({
    total: 0,
    updated: 0,
    errors: 0,
    averageChange: 0,
    noChanges: 0,
  });

  const isAdmin =
    user?.email === APP_CONSTANTS.ADMIN_EMAIL ||
    user?.email === APP_CONSTANTS.DEBUG_AUTHORIZED_EMAIL;

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
          <p className="mt-2">Cargando...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    router.push("/login?redirect=/admin/confidence");
    return null;
  }

  const handleUpdateAllConfidence = async () => {
    try {
      setIsUpdating(true);
      setResults([]);
      setProgress(0);
      setStats({
        total: 0,
        updated: 0,
        errors: 0,
        averageChange: 0,
        noChanges: 0,
      });

      const updateResults = await updateAllProductsConfidence();
      setResults(updateResults);

      // Calcular estadísticas
      const total = updateResults.length;
      const actuallyUpdated = updateResults.filter((r) => r.wasUpdated).length;
      const noChanges = updateResults.filter(
        (r) => !r.error && !r.wasUpdated
      ).length;
      const errors = updateResults.filter((r) => r.error).length;

      const changes = updateResults
        .filter(
          (r) =>
            r.wasUpdated &&
            r.oldConfidence !== undefined &&
            r.newConfidence !== undefined
        )
        .map((r) => (r.newConfidence || 0) - (r.oldConfidence || 0));

      const averageChange =
        changes.length > 0
          ? Math.round(
              changes.reduce((sum, change) => sum + change, 0) / changes.length
            )
          : 0;

      setStats({
        total,
        updated: actuallyUpdated,
        errors,
        averageChange,
        noChanges,
      });
      setProgress(100);
    } catch (error) {
      console.error("Error updating confidence:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const getConfidenceChangeColor = (oldConf: number, newConf: number) => {
    const change = newConf - oldConf;
    if (change > 0) return "text-green-600";
    if (change < 0) return "text-red-600";
    return "text-gray-600";
  };

  const getConfidenceChangeIcon = (oldConf: number, newConf: number) => {
    const change = newConf - oldConf;
    if (change > 0) return <TrendingUp className="h-4 w-4 text-green-600" />;
    if (change < 0)
      return <TrendingUp className="h-4 w-4 text-red-600 rotate-180" />;
    return <CheckCircle className="h-4 w-4 text-gray-600" />;
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Administración de Confianza</h1>
        <p className="text-muted-foreground">
          Actualiza la confianza de todos los productos en el sistema usando el
          nuevo algoritmo.
        </p>
      </div>

      {/* Panel de control */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Actualizar Confianza de Productos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Este proceso calculará la confianza de todos los productos
              basándose en:
            </p>
            <ul className="text-sm text-muted-foreground space-y-1 ml-4">
              <li>• Likes y visualizaciones</li>
              <li>• Ediciones por la comunidad</li>
              <li>• Historial de disputas</li>
              <li>• Antigüedad y estabilidad</li>
            </ul>

            <Button
              onClick={handleUpdateAllConfidence}
              disabled={isUpdating}
              className="w-full"
            >
              {isUpdating ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Actualizando confianza...
                </>
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Actualizar Confianza de Todos los Productos
                </>
              )}
            </Button>

            {isUpdating && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso</span>
                  <span>{progress}%</span>
                </div>
                <Progress value={progress} className="w-full" />
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Estadísticas */}
      {stats.total > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Estadísticas de la Actualización</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold">{stats.total}</div>
                <div className="text-sm text-muted-foreground">Total</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {stats.updated}
                </div>
                <div className="text-sm text-muted-foreground">
                  Actualizados
                </div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">
                  {stats.errors}
                </div>
                <div className="text-sm text-muted-foreground">Errores</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">
                  {stats.noChanges}
                </div>
                <div className="text-sm text-muted-foreground">Sin Cambios</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">
                  {stats.averageChange > 0 ? "+" : ""}
                  {stats.averageChange}
                </div>
                <div className="text-sm text-muted-foreground">
                  Cambio Promedio
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Resultados */}
      {results.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Productos Actualizados</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {results
                .filter((result) => result.wasUpdated || result.error)
                .map((result, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="font-medium">
                        {result.productName || result.productSlug}
                      </div>
                      <div className="text-xs text-muted-foreground font-mono">
                        {result.productSlug}
                      </div>
                      {result.error ? (
                        <div className="text-sm text-red-600 flex items-center gap-1 mt-1">
                          <AlertTriangle className="h-3 w-3" />
                          {result.error}
                        </div>
                      ) : (
                        <div className="text-sm text-muted-foreground mt-1">
                          {result.oldConfidence}% → {result.newConfidence}%
                        </div>
                      )}
                    </div>

                    {!result.error &&
                      result.oldConfidence !== undefined &&
                      result.newConfidence !== undefined && (
                        <div className="flex items-center gap-2">
                          {getConfidenceChangeIcon(
                            result.oldConfidence,
                            result.newConfidence
                          )}
                          <span
                            className={`text-sm font-medium ${getConfidenceChangeColor(
                              result.oldConfidence,
                              result.newConfidence
                            )}`}
                          >
                            {result.newConfidence > result.oldConfidence
                              ? "+"
                              : ""}
                            {result.newConfidence - result.oldConfidence}
                          </span>
                        </div>
                      )}
                  </div>
                ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
