"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  Database,
  TrendingUp,
  FileText,
  BookOpen,
  Users,
  Shield,
  ArrowRight,
  Package,
  AlertTriangle,
  BarChart3,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/hooks/useAuth";
import { APP_CONSTANTS } from "@/lib/constants";
import { getDatabaseStats } from "@/lib/firestore";

interface AdminSection {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  badge?: string;
  color: "default" | "secondary" | "destructive" | "outline";
}

export default function AdminPage() {
  const router = useRouter();
  const { user, userData, loading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [statsLoading, setStatsLoading] = useState(true);

  const email = (user?.email || "").toLowerCase();
  const adminEmail = (APP_CONSTANTS.ADMIN_EMAIL || "").toLowerCase();
  const debugEmail = (APP_CONSTANTS.DEBUG_AUTHORIZED_EMAIL || "").toLowerCase();
  const isAdmin =
    (adminEmail && (email === adminEmail || email === debugEmail)) ||
    userData?.role === "admin";

  useEffect(() => {
    if (isAdmin) {
      loadStats();
    }
  }, [isAdmin]);

  // Redirect non-admin after auth state is known
  useEffect(() => {
    if (!loading && !isAdmin) {
      const id = setTimeout(() => {
        router.replace("/login?redirect=/admin");
      }, 0);
      return () => clearTimeout(id);
    }
  }, [loading, isAdmin, router]);

  // Debug logging
  useEffect(() => {
    if (!loading && user) {
      console.log("Admin check:", {
        userEmail: user.email,
        isAdmin,
      });
    }
  }, [user, loading, isAdmin]);

  const loadStats = async () => {
    try {
      const databaseStats = await getDatabaseStats();
      setStats(databaseStats);
    } catch (error) {
      console.error("Error loading stats:", error);
    } finally {
      setStatsLoading(false);
    }
  };

  const adminSections: AdminSection[] = [
    {
      id: "products",
      title: "Gestión de Productos",
      description: "Administrar productos, revisar y aprobar nuevos envíos",
      icon: <Package className="h-6 w-6" />,
      href: "/admin/products",
      color: "default",
    },
    {
      id: "confidence",
      title: "Sistema de Confianza",
      description: "Actualizar y gestionar la confianza de todos los productos",
      icon: <TrendingUp className="h-6 w-6" />,
      href: "/admin/confidence",
      badge: "Nuevo",
      color: "secondary",
    },
    {
      id: "blog",
      title: "Gestión del Blog",
      description: "Crear, editar y publicar artículos del blog",
      icon: <FileText className="h-6 w-6" />,
      href: "/admin/blog",
      color: "default",
    },
    {
      id: "guides",
      title: "Gestión de Guías",
      description: "Crear, editar y publicar guías de logística y embalaje",
      icon: <BookOpen className="h-6 w-6" />,
      href: "/admin/guides",
      color: "default",
    },
    {
      id: "disputes",
      title: "Sistema de Disputas",
      description: "Revisar y resolver disputas de productos",
      icon: <AlertTriangle className="h-6 w-6" />,
      href: "/disputes",
      color: "destructive",
    },
    {
      id: "users",
      title: "Gestión de Usuarios",
      description: "Administrar usuarios, permisos y cuentas",
      icon: <Users className="h-6 w-6" />,
      href: "/admin/users",
      color: "outline",
    },
    {
      id: "analytics",
      title: "Analíticas",
      description: "Ver estadísticas y métricas del sistema",
      icon: <BarChart3 className="h-6 w-6" />,
      href: "/admin/analytics",
      color: "outline",
    },
  ];

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

  if (!loading && !isAdmin) return null;

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-primary/10 rounded-lg">
            <Settings className="h-8 w-8 text-primary" />
          </div>
          <div>
            <h1 className="text-3xl font-bold">Panel de Administración</h1>
            <p className="text-muted-foreground">
              Bienvenido, {user?.displayName || user?.email}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Productos
            </CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading
                ? "..."
                : stats?.totalProducts?.toLocaleString() || "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              Productos aprobados en la base de datos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Contribuciones
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading
                ? "..."
                : stats?.totalContributions?.toLocaleString() || "0"}
            </div>
            <p className="text-xs text-muted-foreground">
              Envíos y ediciones totales
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Confianza Promedio
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {statsLoading ? "..." : `${stats?.averageConfidence || 0}%`}
            </div>
            <p className="text-xs text-muted-foreground">
              Confianza promedio de productos
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Admin Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {adminSections.map((section) => (
          <Card
            key={section.id}
            className="hover:shadow-lg transition-shadow cursor-pointer group"
            onClick={() => router.push(section.href)}
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div
                  className={`p-2 rounded-lg bg-${
                    section.color === "default"
                      ? "primary"
                      : section.color === "secondary"
                      ? "secondary"
                      : section.color === "destructive"
                      ? "destructive"
                      : "muted"
                  }/10`}
                >
                  {section.icon}
                </div>
                {section.badge && (
                  <Badge variant="secondary" className="text-xs">
                    {section.badge}
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <h3 className="font-semibold text-lg">{section.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {section.description}
                </p>
                <div className="flex items-center justify-between pt-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="group-hover:text-primary transition-colors"
                  >
                    Acceder
                    <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5" />
              Acciones Rápidas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              <Button
                variant="outline"
                onClick={() => router.push("/admin/confidence")}
                className="flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Actualizar Confianza
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/disputes")}
                className="flex items-center gap-2"
              >
                <AlertTriangle className="h-4 w-4" />
                Revisar Disputas
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/admin/products")}
                className="flex items-center gap-2"
              >
                <Package className="h-4 w-4" />
                Gestionar Productos
              </Button>
              <Button
                variant="outline"
                onClick={() => router.push("/admin/guides")}
                className="flex items-center gap-2"
              >
                <BookOpen className="h-4 w-4" />
                Gestionar Guías
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
