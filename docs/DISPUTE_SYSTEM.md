# Sistema de Disputas

## Descripción General

El sistema de disputas permite a los usuarios reportar problemas con productos, como dimensiones incorrectas, información errónea o categorización inadecuada. Incluye un sistema de votación, moderación y resolución automática.

## Arquitectura

### Componentes Principales

1. **Dispute Modal**: Interfaz para crear disputas
2. **Dispute Management**: Gestión y moderación de disputas
3. **Voting System**: Sistema de votación para resolver disputas
4. **Notification System**: Notificaciones de estado de disputas
5. **Integration**: Integración con sistema de confianza

### Estructura de Datos

```typescript
interface Dispute {
  id: string;
  productSlug: string;
  productName: string;
  type: "measurement" | "description" | "categorization" | "other";
  title: string;
  description: string;
  evidence: string[]; // URLs de imágenes
  createdBy: string;
  createdAt: Timestamp;
  status: "open" | "voting" | "resolved" | "rejected";
  votes: {
    approved: string[]; // User IDs
    rejected: string[]; // User IDs
  };
  resolution?: {
    outcome: "approved" | "rejected";
    moderator: string;
    comments?: string;
    timestamp: Timestamp;
  };
  impact: {
    confidenceChange: number;
    productUpdated: boolean;
  };
}
```

## Implementación

### Creación de Disputas

**Archivo**: `components/features/dispute-modal.tsx`

```typescript
interface DisputeFormData {
  productSlug: string;
  type: DisputeType;
  title: string;
  description: string;
  evidence: File[];
}

const DisputeModal = ({ isOpen, onClose, initialData }: DisputeModalProps) => {
  const [formData, setFormData] = useState<DisputeFormData>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: DisputeFormData) => {
    setIsSubmitting(true);
    try {
      const dispute = await createDispute(data);
      await updateProductConfidence(data.productSlug);
      onClose();
      showSuccess("Disputa creada exitosamente");
    } catch (error) {
      showError("Error al crear la disputa");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{initialData?.title || "Reportar Problema"}</DialogTitle>
        </DialogHeader>
        <DisputeForm
          initialData={initialData}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </DialogContent>
    </Dialog>
  );
};
```

**Funcionalidades**:

- Formulario de creación de disputas
- Subida de evidencia (imágenes)
- Validación de campos
- Integración con sistema de confianza

### Tipos de Disputa

```typescript
enum DisputeType {
  MEASUREMENT = "measurement",
  DESCRIPTION = "description",
  CATEGORIZATION = "categorization",
  OTHER = "other",
}

const disputeTypeConfig = {
  [DisputeType.MEASUREMENT]: {
    label: "Dimensiones Incorrectas",
    description: "Las medidas del producto no son precisas",
    icon: <Ruler />,
    impact: "high",
  },
  [DisputeType.DESCRIPTION]: {
    label: "Descripción Incorrecta",
    description: "La información del producto es errónea",
    icon: <FileText />,
    impact: "medium",
  },
  [DisputeType.CATEGORIZATION]: {
    label: "Categoría Incorrecta",
    description: "El producto está en la categoría equivocada",
    icon: <Folder />,
    impact: "low",
  },
  [DisputeType.OTHER]: {
    label: "Otro Problema",
    description: "Otro tipo de problema con el producto",
    icon: <AlertCircle />,
    impact: "medium",
  },
};
```

### Sistema de Votación

**Archivo**: `lib/firestore.ts`

```typescript
// Votar en una disputa
export const voteOnDispute = async (
  disputeId: string,
  vote: "approved" | "rejected",
  userId: string
) => {
  const disputeRef = doc(db, "disputes", disputeId);

  await updateDoc(disputeRef, {
    [`votes.${vote}`]: arrayUnion(userId),
    // Remover voto previo si existe
    [`votes.${vote === "approved" ? "rejected" : "approved"}`]:
      arrayRemove(userId),
  });

  // Verificar si se alcanzó el umbral de votos
  const dispute = await getDoc(disputeRef);
  const votes = dispute.data()?.votes;

  if (votes.approved.length >= VOTE_THRESHOLD) {
    await resolveDispute(disputeId, "approved");
  } else if (votes.rejected.length >= VOTE_THRESHOLD) {
    await resolveDispute(disputeId, "rejected");
  }
};

// Resolver disputa automáticamente
const resolveDispute = async (
  disputeId: string,
  outcome: "approved" | "rejected"
) => {
  const disputeRef = doc(db, "disputes", disputeId);
  const dispute = await getDoc(disputeRef);
  const disputeData = dispute.data();

  await updateDoc(disputeRef, {
    status: "resolved",
    resolution: {
      outcome,
      moderator: "system",
      timestamp: serverTimestamp(),
      comments:
        outcome === "approved"
          ? "Disputa aprobada por votación de la comunidad"
          : "Disputa rechazada por votación de la comunidad",
    },
  });

  // Actualizar confianza del producto
  await updateProductConfidence(disputeData.productSlug);

  // Notificar al creador de la disputa
  await sendDisputeNotification(disputeData.createdBy, disputeId, outcome);
};
```

## Gestión de Disputas

### Lista de Disputas

**Archivo**: `app/disputes/page.tsx`

```typescript
interface DisputeFilters {
  status: "all" | "open" | "voting" | "resolved" | "rejected";
  type: "all" | DisputeType;
  dateRange: { start: Date; end: Date };
}

const DisputesPage = () => {
  const [disputes, setDisputes] = useState<Dispute[]>();
  const [filters, setFilters] = useState<DisputeFilters>();
  const [loading, setLoading] = useState(true);

  const fetchDisputes = async (filters?: DisputeFilters) => {
    setLoading(true);
    const disputes = await getDisputes(filters);
    setDisputes(disputes);
    setLoading(false);
  };

  return (
    <div className="disputes-page">
      <DisputeFilters filters={filters} onFilterChange={setFilters} />
      <DisputeList disputes={disputes} onVote={handleVote} />
      <Pagination />
    </div>
  );
};
```

### Detalle de Disputa

**Archivo**: `app/disputes/[id]/page.tsx`

```typescript
const DisputeDetailPage = ({ params }: { params: { id: string } }) => {
  const [dispute, setDispute] = useState<Dispute>();
  const [product, setProduct] = useState<Product>();
  const { user } = useAuth();

  const handleVote = async (vote: "approved" | "rejected") => {
    if (!user) {
      showError("Debes iniciar sesión para votar");
      return;
    }

    await voteOnDispute(params.id, vote, user.uid);
    // Recargar disputa
    const updatedDispute = await getDispute(params.id);
    setDispute(updatedDispute);
  };

  return (
    <div className="dispute-detail">
      <DisputeHeader dispute={dispute} />
      <DisputeContent dispute={dispute} product={product} />
      <DisputeEvidence evidence={dispute?.evidence} />
      <DisputeVoting
        dispute={dispute}
        onVote={handleVote}
        userVote={getUserVote(dispute, user?.uid)}
      />
      <DisputeResolution resolution={dispute?.resolution} />
    </div>
  );
};
```

## Componentes de Interfaz

### Dispute Card

```typescript
interface DisputeCardProps {
  dispute: Dispute;
  onVote?: (vote: "approved" | "rejected") => void;
  showActions?: boolean;
}

const DisputeCard = ({
  dispute,
  onVote,
  showActions = true,
}: DisputeCardProps) => {
  const { user } = useAuth();
  const userVote = getUserVote(dispute, user?.uid);

  return (
    <Card className="dispute-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {getDisputeTypeIcon(dispute.type)}
            <Badge variant={getDisputeStatusVariant(dispute.status)}>
              {getDisputeStatusLabel(dispute.status)}
            </Badge>
          </div>
          <span className="text-sm text-muted-foreground">
            {formatDate(dispute.createdAt)}
          </span>
        </div>
        <CardTitle>{dispute.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">
          {dispute.description}
        </p>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="text-center">
              <div className="text-lg font-bold text-green-600">
                {dispute.votes.approved.length}
              </div>
              <div className="text-xs text-muted-foreground">Aprobados</div>
            </div>
            <div className="text-center">
              <div className="text-lg font-bold text-red-600">
                {dispute.votes.rejected.length}
              </div>
              <div className="text-xs text-muted-foreground">Rechazados</div>
            </div>
          </div>

          {showActions && dispute.status === "voting" && (
            <div className="flex gap-2">
              <Button
                size="sm"
                variant={userVote === "approved" ? "default" : "outline"}
                onClick={() => onVote?.("approved")}
              >
                Aprobar
              </Button>
              <Button
                size="sm"
                variant={userVote === "rejected" ? "destructive" : "outline"}
                onClick={() => onVote?.("rejected")}
              >
                Rechazar
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
```

### Dispute Filters

```typescript
const DisputeFilters = ({ filters, onFilterChange }: DisputeFiltersProps) => {
  return (
    <div className="dispute-filters">
      <Select
        value={filters?.status || "all"}
        onValueChange={(value) => onFilterChange({ ...filters, status: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="open">Abiertas</SelectItem>
          <SelectItem value="voting">En Votación</SelectItem>
          <SelectItem value="resolved">Resueltas</SelectItem>
          <SelectItem value="rejected">Rechazadas</SelectItem>
        </SelectContent>
      </Select>

      <Select
        value={filters?.type || "all"}
        onValueChange={(value) => onFilterChange({ ...filters, type: value })}
      >
        <SelectTrigger>
          <SelectValue placeholder="Tipo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="measurement">Dimensiones</SelectItem>
          <SelectItem value="description">Descripción</SelectItem>
          <SelectItem value="categorization">Categoría</SelectItem>
          <SelectItem value="other">Otros</SelectItem>
        </SelectContent>
      </Select>

      <DateRangePicker
        value={filters?.dateRange}
        onChange={(range) => onFilterChange({ ...filters, dateRange: range })}
      />
    </div>
  );
};
```

## Sistema de Notificaciones

### Notificaciones de Disputa

```typescript
interface DisputeNotification {
  id: string;
  type: "dispute_created" | "dispute_voted" | "dispute_resolved";
  disputeId: string;
  userId: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Timestamp;
}

// Enviar notificación de disputa
const sendDisputeNotification = async (
  userId: string,
  disputeId: string,
  type: DisputeNotification["type"]
) => {
  const notification: Omit<DisputeNotification, "id"> = {
    type,
    disputeId,
    userId,
    title: getNotificationTitle(type),
    message: getNotificationMessage(type),
    read: false,
    createdAt: serverTimestamp(),
  };

  await addDoc(collection(db, "notifications"), notification);
};
```

## Integración con Sistema de Confianza

### Impacto en Confianza

```typescript
// Calcular impacto de disputa en confianza
const calculateDisputeImpact = (dispute: Dispute): number => {
  const baseImpact = {
    measurement: -10,
    description: -5,
    categorization: -3,
    other: -5,
  };

  const typeImpact = baseImpact[dispute.type];
  const voteRatio =
    dispute.votes.approved.length /
    (dispute.votes.approved.length + dispute.votes.rejected.length);

  // Si la mayoría vota a favor, el impacto es mayor
  return voteRatio > 0.5 ? typeImpact * 1.5 : typeImpact;
};

// Actualizar confianza del producto basado en disputas
const updateProductConfidenceFromDisputes = async (productSlug: string) => {
  const disputes = await getProductDisputes(productSlug);
  const totalImpact = disputes
    .filter(
      (d) => d.status === "resolved" && d.resolution?.outcome === "approved"
    )
    .reduce((sum, dispute) => sum + calculateDisputeImpact(dispute), 0);

  // Aplicar impacto a la confianza del producto
  await updateProductField(productSlug, "confidence", increment(totalImpact));
};
```

## Configuración

### Variables de Entorno

```env
# Dispute Configuration
NEXT_PUBLIC_DISPUTE_VOTE_THRESHOLD=5
NEXT_PUBLIC_DISPUTE_AUTO_RESOLVE=true
NEXT_PUBLIC_DISPUTE_NOTIFICATIONS_ENABLED=true

# Vote Configuration
NEXT_PUBLIC_MIN_VOTES_FOR_RESOLUTION=3
NEXT_PUBLIC_VOTE_TIMEOUT_HOURS=72
```

### Configuración de Firestore

```javascript
// Reglas de seguridad para disputas
match /disputes/{disputeId} {
  allow read: if true;
  allow create: if request.auth != null;
  allow update: if request.auth != null &&
    (resource.data.createdBy == request.auth.uid ||
     request.auth.token.admin == true);
  allow delete: if request.auth.token.admin == true;
}

// Reglas para votos
match /disputes/{disputeId}/votes/{voteId} {
  allow read: if true;
  allow write: if request.auth != null;
}
```

## Testing

### Casos de Prueba

1. **Creación de disputa**
2. **Sistema de votación**
3. **Resolución automática**
4. **Notificaciones**
5. **Impacto en confianza**

### Herramientas de Testing

```typescript
// Mock de disputa para testing
const mockDispute: Dispute = {
  id: "test-dispute",
  productSlug: "test-product",
  productName: "Test Product",
  type: "measurement",
  title: "Test Dispute",
  description: "Test description",
  evidence: [],
  createdBy: "test-user",
  createdAt: new Date(),
  status: "open",
  votes: { approved: [], rejected: [] },
};

// Test de votación
test("should vote on dispute", async () => {
  render(<DisputeCard dispute={mockDispute} onVote={mockVote} />);
  fireEvent.click(screen.getByText("Aprobar"));
  expect(mockVote).toHaveBeenCalledWith("approved");
});
```

## Monitoreo

### Métricas a Seguir

1. **Disputas creadas**: Nuevas disputas por día
2. **Tasa de resolución**: Disputas resueltas vs totales
3. **Tiempo de resolución**: Promedio de tiempo para resolver
4. **Impacto en confianza**: Cambio promedio en confianza
5. **Participación**: Usuarios que votan en disputas

### Alertas

- Disputas sin resolver por más de 7 días
- Múltiples disputas del mismo usuario
- Disputas con evidencia insuficiente
- Errores en sistema de votación

## Troubleshooting

### Problemas Comunes

1. **Disputa no se crea**

   - Verificar permisos de Firestore
   - Comprobar validación de campos
   - Revisar configuración de Storage

2. **Votos no se registran**

   - Verificar autenticación del usuario
   - Comprobar reglas de Firestore
   - Revisar lógica de votación

3. **Resolución automática no funciona**
   - Verificar umbral de votos
   - Comprobar lógica de resolución
   - Revisar notificaciones

## Consideraciones Futuras

### Mejoras Planificadas

1. **Sistema de reputación**: Peso de votos basado en reputación
2. **Evidencia mejorada**: Soporte para videos y documentos
3. **Resolución por IA**: Análisis automático de disputas
4. **Sistema de apelación**: Proceso de revisión de decisiones
5. **Integración externa**: Verificación con fuentes oficiales

### Optimizaciones

1. **Caché de disputas**: Reducir consultas a Firestore
2. **Votación en tiempo real**: WebSockets para actualizaciones
3. **Bulk operations**: Operaciones masivas de resolución
4. **Compresión de evidencia**: Optimización de imágenes
