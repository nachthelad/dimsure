# Sistema de Gestión de Productos

## Descripción General

El sistema de gestión de productos permite a los usuarios crear, editar, buscar y gestionar productos con sus dimensiones y especificaciones. Incluye validación de datos, sistema de moderación y gestión de versiones.

## Arquitectura

### Componentes Principales

1. **Product Service**: Servicios para operaciones CRUD de productos
2. **Product Forms**: Formularios para crear y editar productos
3. **Product Cards**: Componentes de visualización de productos
4. **Search System**: Sistema de búsqueda y filtrado
5. **Moderation System**: Sistema de moderación de productos

### Estructura de Datos

```typescript
interface Product {
  id: string;
  name: string;
  sku: string;
  brand: string;
  category: string;
  description: string;
  primaryDimensions: Dimensions;
  secondaryDimensions?: Dimensions;
  weight: number;
  weightUnit: string;
  images: string[];
  confidence: number;
  likes: number;
  views: number;
  createdBy: string;
  createdAt: Timestamp;
  lastModified: Timestamp;
  lastModifiedBy: string;
  status: "pending" | "approved" | "rejected";
}
```

## Implementación

### Servicios de Producto

**Archivo**: `lib/services/product-service.ts`

```typescript
// Crear producto
const product = await createProduct(productData);

// Obtener producto por slug
const product = await getProduct(slug);

// Actualizar producto
await updateProduct(slug, updates);

// Eliminar producto
await deleteProduct(slug);

// Buscar productos
const products = await searchProducts(query, filters);
```

### Formularios de Producto

**Archivo**: `components/features/add-product-form.tsx`

**Campos principales**:

- Nombre del producto
- SKU/Brand
- Categoría
- Descripción
- Dimensiones principales
- Dimensiones secundarias
- Peso
- Imágenes

**Validaciones**:

- Campos requeridos
- Formato de SKU
- Dimensiones válidas
- Tamaño de imágenes
- Formato de peso

### Sistema de Búsqueda

**Archivo**: `components/features/product-search.tsx`

**Funcionalidades**:

- Búsqueda por texto
- Filtros por categoría
- Filtros por marca
- Ordenamiento
- Paginación

```typescript
// Ejemplo de búsqueda
const results = await searchProducts({
  query: "iPhone",
  category: "smartphones",
  brand: "Apple",
  sortBy: "name",
  limit: 20,
});
```

## Flujos de Trabajo

### Creación de Producto

1. **Usuario accede** a `/add-product`
2. **Completa formulario** con datos del producto
3. **Sube imágenes** del producto
4. **Sistema valida** todos los campos
5. **Se crea producto** con estado "pending"
6. **Admin revisa** y aprueba/rechaza
7. **Producto se publica** si es aprobado

### Edición de Producto

1. **Usuario accede** a `/edit-product/[slug]`
2. **Sistema verifica** permisos de edición
3. **Carga datos** actuales del producto
4. **Usuario modifica** campos necesarios
5. **Sistema valida** cambios
6. **Se actualiza** producto
7. **Se recalcula** confianza

### Moderación de Productos

1. **Admin accede** a `/admin/products`
2. **Ve lista** de productos pendientes
3. **Revisa** información del producto
4. **Aprueba o rechaza** con comentarios
5. **Sistema notifica** al creador
6. **Producto se publica** o se archiva

## Validaciones

### Validaciones de Entrada

```typescript
// Validación de dimensiones
const validateDimensions = (dimensions: Dimensions) => {
  return (
    dimensions.length > 0 &&
    dimensions.width > 0 &&
    dimensions.height > 0 &&
    dimensions.depth > 0
  );
};

// Validación de SKU
const validateSKU = (sku: string) => {
  return /^[A-Z0-9-]+$/.test(sku) && sku.length >= 3;
};

// Validación de imágenes
const validateImages = (images: File[]) => {
  return images.every(
    (img) =>
      img.size <= 5 * 1024 * 1024 && // 5MB max
      ["image/jpeg", "image/png", "image/webp"].includes(img.type)
  );
};
```

### Validaciones de Negocio

1. **Unicidad de SKU**: No puede haber SKUs duplicados
2. **Permisos de edición**: Solo creador o admin puede editar
3. **Estado de moderación**: Solo productos aprobados son visibles
4. **Límites de usuario**: Máximo productos por usuario

## Sistema de Imágenes

### Gestión de Imágenes

**Archivo**: `lib/storage.ts`

```typescript
// Subir imagen
const imageUrl = await uploadImage(file, `products/${productId}`);

// Optimizar imagen
const optimizedUrl = await optimizeImage(imageUrl, {
  width: 800,
  quality: 80,
});

// Eliminar imagen
await deleteImage(imageUrl);
```

### Optimización

1. **Compresión automática**: Reducción de tamaño
2. **Redimensionamiento**: Ajuste a dimensiones estándar
3. **Formato WebP**: Conversión automática
4. **Lazy loading**: Carga diferida de imágenes

## Sistema de Categorías

### Estructura de Categorías

```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  parentId?: string;
  icon?: string;
  description?: string;
}
```

### Gestión Jerárquica

- **Categorías principales**: Electrónicos, Muebles, Ropa, etc.
- **Subcategorías**: Smartphones, Laptops, etc.
- **Categorías específicas**: iPhone, Samsung, etc.

## Sistema de Marcas

### Gestión de Marcas

```typescript
interface Brand {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  website?: string;
  description?: string;
}
```

### Funcionalidades

1. **Autocompletado**: Sugerencias de marcas existentes
2. **Creación automática**: Nuevas marcas se crean automáticamente
3. **Normalización**: Nombres se normalizan automáticamente

## Sistema de Disputas

### Gestión de Disputas

**Archivo**: `components/features/dispute-modal.tsx`

```typescript
// Crear disputa
const dispute = await createDispute({
  productSlug: "iphone-14-pro",
  type: "measurement",
  description: "Las dimensiones no son correctas",
  evidence: ["image1.jpg", "image2.jpg"],
});

// Votar en disputa
await voteOnDispute(disputeId, "approved", userId);
```

### Tipos de Disputa

1. **Medición**: Dimensiones incorrectas
2. **Descripción**: Información incorrecta
3. **Categorización**: Categoría incorrecta
4. **Otros**: Otros problemas

## Sistema de Likes

### Gestión de Likes

```typescript
// Dar like
await likeProduct(productSlug, userId);

// Quitar like
await unlikeProduct(productSlug, userId);

// Verificar si usuario dio like
const hasLiked = await checkUserLike(productSlug, userId);
```

### Funcionalidades

1. **Contador en tiempo real**: Actualización inmediata
2. **Persistencia**: Likes se guardan en Firestore
3. **Validación**: Un like por usuario por producto

## Sistema de Vistas

### Tracking de Vistas

```typescript
// Incrementar vistas
await incrementProductViews(productSlug);

// Obtener estadísticas
const stats = await getProductStats(productSlug);
```

### Métricas

1. **Vistas totales**: Contador de visitas
2. **Vistas únicas**: Usuarios únicos
3. **Tiempo en página**: Duración de visita
4. **Fuente de tráfico**: De dónde viene el usuario

## Configuración

### Variables de Entorno

```env
# Firebase Storage
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your-bucket

# Límites de aplicación
NEXT_PUBLIC_MAX_PRODUCTS_PER_USER=100
NEXT_PUBLIC_MAX_IMAGES_PER_PRODUCT=10
NEXT_PUBLIC_MAX_IMAGE_SIZE=5242880
```

### Configuración de Firestore

```javascript
// Reglas de seguridad para productos
match /products/{productId} {
  allow read: if true;
  allow create: if request.auth != null;
  allow update: if request.auth != null &&
    (resource.data.createdBy == request.auth.uid ||
     request.auth.token.admin == true);
  allow delete: if request.auth != null &&
    (resource.data.createdBy == request.auth.uid ||
     request.auth.token.admin == true);
}
```

## Testing

### Casos de Prueba

1. **Creación exitosa de producto**
2. **Validación de campos requeridos**
3. **Subida de imágenes**
4. **Búsqueda y filtrado**
5. **Edición de productos**
6. **Sistema de likes**
7. **Creación de disputas**

### Herramientas de Testing

- **Jest**: Testing unitario
- **React Testing Library**: Testing de componentes
- **Firebase Emulator**: Testing local
- **Cypress**: Testing end-to-end

## Monitoreo

### Métricas a Seguir

1. **Productos creados**: Nuevos productos por día
2. **Tasa de aprobación**: Productos aprobados vs rechazados
3. **Disputas**: Número y resolución de disputas
4. **Engagement**: Likes y vistas por producto
5. **Calidad**: Productos con alta confianza

### Alertas

- Múltiples productos rechazados del mismo usuario
- Disputas no resueltas por mucho tiempo
- Errores en subida de imágenes
- Productos duplicados detectados

## Troubleshooting

### Problemas Comunes

1. **Producto no se crea**

   - Verificar validaciones
   - Comprobar permisos de Firestore
   - Revisar configuración de Storage

2. **Imágenes no se suben**

   - Verificar tamaño de archivo
   - Comprobar formato de imagen
   - Revisar reglas de Storage

3. **Búsqueda no funciona**
   - Verificar índices de Firestore
   - Comprobar configuración de búsqueda
   - Revisar permisos de lectura

## Consideraciones Futuras

### Mejoras Planificadas

1. **Importación masiva**: CSV/Excel import
2. **API pública**: Endpoints para terceros
3. **Sistema de versiones**: Historial de cambios
4. **Autocompletado inteligente**: IA para sugerencias
5. **Verificación automática**: Validación con fuentes oficiales

### Optimizaciones

1. **Caché de productos**: Redis para búsquedas rápidas
2. **CDN para imágenes**: Distribución global
3. **Indexación avanzada**: Elasticsearch
4. **Compresión de datos**: Optimización de almacenamiento
