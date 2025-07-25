# Sistema del Panel de Administración

## Descripción General

El panel de administración proporciona una interfaz centralizada para gestionar todos los aspectos de la aplicación. Incluye herramientas para moderación de productos, gestión de usuarios, análisis de datos y configuración del sistema.

## Arquitectura

### Componentes Principales

1. **Admin Dashboard**: Página principal con estadísticas y acceso rápido
2. **Product Management**: Moderación y gestión de productos
3. **Confidence System**: Gestión del sistema de confianza
4. **User Management**: Administración de usuarios
5. **Analytics**: Análisis de datos y métricas
6. **Blog Management**: Gestión de contenido del blog

### Estructura de Rutas

```
/admin/
├── /                    # Dashboard principal
├── /products           # Gestión de productos
├── /confidence         # Sistema de confianza
├── /users              # Gestión de usuarios
├── /analytics          # Análisis de datos
├── /blog               # Gestión del blog
└── /disputes           # Gestión de disputas
```

## Implementación

### Dashboard Principal

**Archivo**: `app/admin/page.tsx`

```typescript
interface AdminStats {
  totalProducts: number;
  totalUsers: number;
  averageConfidence: number;
  pendingProducts: number;
  activeDisputes: number;
}

const AdminDashboard = () => {
  const [stats, setStats] = useState<AdminStats>();
  const [recentActivity, setRecentActivity] = useState<Activity[]>();

  return (
    <div className="admin-dashboard">
      <StatsCards stats={stats} />
      <QuickActions />
      <RecentActivity activities={recentActivity} />
    </div>
  );
};
```

**Funcionalidades**:

- Estadísticas generales del sistema
- Acciones rápidas para tareas comunes
- Actividad reciente
- Enlaces a todas las secciones admin

### Gestión de Productos

**Archivo**: `app/admin/products/page.tsx`

```typescript
interface ProductModeration {
  product: Product;
  status: "pending" | "approved" | "rejected";
  moderator: string;
  comments?: string;
  timestamp: Date;
}

const ProductManagement = () => {
  const [products, setProducts] = useState<Product[]>();
  const [filters, setFilters] = useState<FilterOptions>();

  const handleModeration = async (
    productId: string,
    action: string,
    comments?: string
  ) => {
    await moderateProduct(productId, action, comments);
    // Actualizar lista
  };

  return (
    <div className="product-management">
      <FilterBar filters={filters} onFilterChange={setFilters} />
      <ProductList products={products} onModerate={handleModeration} />
      <Pagination />
    </div>
  );
};
```

**Funcionalidades**:

- Lista de productos pendientes de moderación
- Filtros por estado, categoría, fecha
- Acciones de aprobar/rechazar con comentarios
- Vista previa de productos
- Búsqueda y ordenamiento

### Sistema de Confianza

**Archivo**: `app/admin/confidence/page.tsx`

```typescript
interface ConfidenceUpdate {
  productSlug: string;
  productName: string;
  oldConfidence: number;
  newConfidence: number;
  wasUpdated: boolean;
  factors?: ConfidenceFactors;
}

const ConfidenceManagement = () => {
  const [isUpdating, setIsUpdating] = useState(false);
  const [results, setResults] = useState<ConfidenceUpdate[]>();

  const handleUpdateAll = async () => {
    setIsUpdating(true);
    const results = await updateAllProductsConfidence();
    setResults(results);
    setIsUpdating(false);
  };

  return (
    <div className="confidence-management">
      <UpdateButton onClick={handleUpdateAll} disabled={isUpdating} />
      <StatsDisplay results={results} />
      <ResultsList results={results} />
    </div>
  );
};
```

**Funcionalidades**:

- Actualización masiva de confianza
- Estadísticas de actualización
- Lista de productos actualizados
- Detalles de factores de confianza

## Componentes de Interfaz

### Stats Cards

```typescript
interface StatsCardProps {
  title: string;
  value: number | string;
  change?: number;
  icon: React.ReactNode;
  color: "default" | "success" | "warning" | "danger";
}

const StatsCard = ({ title, value, change, icon, color }: StatsCardProps) => (
  <Card className={`stats-card stats-card--${color}`}>
    <CardContent>
      <div className="stats-icon">{icon}</div>
      <div className="stats-content">
        <h3 className="stats-title">{title}</h3>
        <p className="stats-value">{value}</p>
        {change && (
          <span
            className={`stats-change ${change > 0 ? "positive" : "negative"}`}
          >
            {change > 0 ? "+" : ""}
            {change}%
          </span>
        )}
      </div>
    </CardContent>
  </Card>
);
```

### Quick Actions

```typescript
interface QuickAction {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

const QuickActions = () => {
  const actions: QuickAction[] = [
    {
      id: "moderate-products",
      title: "Moderar Productos",
      description: "Revisar productos pendientes",
      icon: <Package />,
      href: "/admin/products",
      color: "blue",
    },
    {
      id: "update-confidence",
      title: "Actualizar Confianza",
      description: "Recalcular confianza de productos",
      icon: <TrendingUp />,
      href: "/admin/confidence",
      color: "green",
    },
  ];

  return (
    <div className="quick-actions">
      {actions.map((action) => (
        <Link key={action.id} href={action.href}>
          <Card className={`quick-action quick-action--${action.color}`}>
            <CardContent>
              <div className="action-icon">{action.icon}</div>
              <h3>{action.title}</h3>
              <p>{action.description}</p>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );
};
```

## Sistema de Permisos

### Verificación de Admin

```typescript
// Middleware de verificación
const requireAdmin = (handler: NextApiHandler) => {
  return async (req: NextApiRequest, res: NextApiResponse) => {
    const { user } = await getSession(req, res);

    if (!user || user.email !== process.env.NEXT_PUBLIC_ADMIN_EMAIL) {
      return res.status(403).json({ error: "Admin access required" });
    }

    return handler(req, res);
  };
};

// Hook de verificación en frontend
const useAdminAccess = () => {
  const { user, isLoggedIn } = useAuth();
  const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

  return { isAdmin, hasAccess: isLoggedIn && isAdmin };
};
```

### Protección de Rutas

```typescript
// Componente de protección
const AdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAdmin, hasAccess } = useAdminAccess();
  const router = useRouter();

  useEffect(() => {
    if (!hasAccess) {
      router.push("/login");
    }
  }, [hasAccess, router]);

  if (!hasAccess) {
    return <div>Acceso denegado</div>;
  }

  return <>{children}</>;
};
```

## Funcionalidades Avanzadas

### Sistema de Notificaciones

```typescript
interface AdminNotification {
  id: string;
  type: "product_pending" | "dispute_created" | "confidence_low";
  title: string;
  message: string;
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

const NotificationBell = () => {
  const [notifications, setNotifications] = useState<AdminNotification[]>();
  const [unreadCount, setUnreadCount] = useState(0);

  const markAsRead = async (notificationId: string) => {
    await updateNotification(notificationId, { read: true });
    setUnreadCount((prev) => Math.max(0, prev - 1));
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <Badge variant="destructive">{unreadCount}</Badge>
        <Bell className="h-5 w-5" />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {notifications?.map((notification) => (
          <DropdownMenuItem
            key={notification.id}
            onClick={() => markAsRead(notification.id)}
          >
            <div>
              <p className="font-medium">{notification.title}</p>
              <p className="text-sm text-muted-foreground">
                {notification.message}
              </p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
```

### Exportación de Datos

```typescript
const DataExport = () => {
  const exportProducts = async (format: "csv" | "json") => {
    const data = await getAllProducts();

    if (format === "csv") {
      const csv = convertToCSV(data);
      downloadFile(csv, "products.csv", "text/csv");
    } else {
      const json = JSON.stringify(data, null, 2);
      downloadFile(json, "products.json", "application/json");
    }
  };

  return (
    <div className="data-export">
      <Button onClick={() => exportProducts("csv")}>Exportar CSV</Button>
      <Button onClick={() => exportProducts("json")}>Exportar JSON</Button>
    </div>
  );
};
```

## Configuración

### Variables de Entorno

```env
# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
NEXT_PUBLIC_ADMIN_PANEL_ENABLED=true

# Analytics
NEXT_PUBLIC_ANALYTICS_ENABLED=true
NEXT_PUBLIC_GOOGLE_ANALYTICS_ID=GA_MEASUREMENT_ID

# Notifications
NEXT_PUBLIC_NOTIFICATIONS_ENABLED=true
```

### Configuración de Firestore

```javascript
// Reglas de seguridad para admin
match /admin/{document=**} {
  allow read, write: if request.auth != null &&
    request.auth.token.email == resource.data.adminEmail;
}

// Reglas para productos (admin puede modificar todos)
match /products/{productId} {
  allow read: if true;
  allow write: if request.auth != null &&
    (resource.data.createdBy == request.auth.uid ||
     request.auth.token.email == resource.data.adminEmail);
}
```

## Testing

### Casos de Prueba

1. **Acceso de admin**
2. **Moderación de productos**
3. **Actualización de confianza**
4. **Exportación de datos**
5. **Sistema de notificaciones**

### Herramientas de Testing

```typescript
// Mock de datos de admin
const mockAdminData = {
  products: [{ id: "1", name: "Test Product", status: "pending" }],
  stats: {
    totalProducts: 100,
    pendingProducts: 5,
  },
};

// Test de moderación
test("should moderate product", async () => {
  render(<ProductManagement />);
  fireEvent.click(screen.getByText("Aprobar"));
  expect(mockModerateProduct).toHaveBeenCalledWith("1", "approved");
});
```

## Monitoreo

### Métricas a Seguir

1. **Productos moderados**: Tasa de aprobación/rechazo
2. **Tiempo de moderación**: Promedio de tiempo de revisión
3. **Confianza promedio**: Evolución de la confianza del sistema
4. **Actividad de admin**: Acciones realizadas por administradores
5. **Errores del sistema**: Problemas detectados

### Alertas

- Productos pendientes por más de 24 horas
- Confianza promedio por debajo del 70%
- Múltiples productos rechazados del mismo usuario
- Errores en actualización de confianza

## Troubleshooting

### Problemas Comunes

1. **No se puede acceder al panel**

   - Verificar email de admin en variables de entorno
   - Comprobar autenticación del usuario
   - Revisar reglas de Firestore

2. **Moderación no funciona**

   - Verificar permisos de escritura
   - Comprobar estructura de datos
   - Revisar logs de errores

3. **Actualización de confianza falla**
   - Verificar datos de productos
   - Comprobar información de disputas
   - Revisar algoritmo de cálculo

## Consideraciones Futuras

### Mejoras Planificadas

1. **Roles múltiples**: Diferentes niveles de admin
2. **Auditoría completa**: Log de todas las acciones
3. **Dashboard personalizable**: Widgets configurables
4. **Integración con IA**: Moderación automática
5. **API de admin**: Endpoints para integraciones

### Optimizaciones

1. **Caché de estadísticas**: Reducir consultas a Firestore
2. **Actualización en tiempo real**: WebSockets para notificaciones
3. **Bulk operations**: Operaciones masivas optimizadas
4. **Offline support**: Funcionalidad sin conexión
