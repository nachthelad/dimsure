# Sistema de Confianza de Productos

## Descripción General

El sistema de confianza de Dimsure evalúa la fiabilidad de los datos de cada producto basándose en múltiples factores que indican la calidad y validación de la información por parte de la comunidad.

## Algoritmo de Cálculo

### Confianza Base

- **Valor inicial**: 85%
- Todos los productos comienzan con este nivel de confianza base.

### Factores Dinámicos

#### 1. Likes (0-10 puntos)

- **0 likes**: 0 puntos
- **1-2 likes**: 2 puntos
- **3-5 likes**: 4 puntos
- **6-10 likes**: 6 puntos
- **11-20 likes**: 8 puntos
- **20+ likes**: 10 puntos

#### 2. Visualizaciones (0-5 puntos)

- **0 views**: 0 puntos
- **1-10 views**: 1 punto
- **11-50 views**: 2 puntos
- **51-100 views**: 3 puntos
- **101-500 views**: 4 puntos
- **500+ views**: 5 puntos

#### 3. Ediciones (0-10 puntos)

- **Edición por la comunidad** (diferente al creador): +5 puntos
- **Edición reciente** (últimos 30 días): +3 puntos
- **Ha sido editado**: +2 puntos

#### 4. Disputas (-15 a +5 puntos)

- **Disputas abiertas**: -3 puntos cada una
- **Disputas resueltas**: -2 puntos cada una
- **Disputas rechazadas**: +1 punto cada una

#### 5. Antigüedad y Estabilidad (0-10 puntos)

- **Antigüedad del producto**:
  - 1+ años: +4 puntos
  - 6+ meses: +3 puntos
  - 3+ meses: +2 puntos
  - 1+ mes: +1 punto
- **Estabilidad** (tiempo sin cambios):
  - 3+ meses sin cambios: +3 puntos
  - 1+ mes sin cambios: +2 puntos
  - 1+ semana sin cambios: +1 punto
- **Consistencia inicial** (creado y editado el mismo día): +3 puntos

## Cálculo Final

```
Confianza Total = Base (85) + Likes + Views + Ediciones + Disputas + Antigüedad
```

La confianza final se limita entre 0% y 100%.

## Actualización Automática

La confianza se actualiza automáticamente cuando ocurren los siguientes eventos:

1. **Like/Unlike**: Inmediatamente
2. **Visualización**: Cada 10 views
3. **Edición del producto**: Inmediatamente
4. **Cambio de estado en disputas**: Inmediatamente

## Visualización

### Badges de Confianza

- **≥90%**: Verde (Muy alta confianza)
- **70-89%**: Gris (Alta confianza)
- **<70%**: Rojo (Confianza baja)

### Descripciones

- **≥90%**: "Muy alta confianza"
- **80-89%**: "Alta confianza"
- **70-79%**: "Confianza moderada"
- **60-69%**: "Confianza baja"
- **<60%**: "Confianza muy baja"

## Componentes Implementados

### 1. Calculador de Confianza

- **Archivo**: `lib/utils/confidence-calculator.ts`
- **Función principal**: `calculateProductConfidence()`
- **Utilidades**: `getConfidenceBadgeVariant()`, `getConfidenceDescription()`

### 2. Funciones de Firestore

- **Archivo**: `lib/firestore.ts`
- **Funciones**:
  - `getProductDisputeInfo()`: Obtiene información de disputas
  - `updateProductConfidence()`: Actualiza confianza de un producto
  - `updateAllProductsConfidence()`: Actualiza todos los productos

### 3. Componente de Detalles

- **Archivo**: `components/features/confidence-details.tsx`
- **Funcionalidad**: Muestra desglose detallado del cálculo de confianza

### 4. Página de Administración

- **Archivo**: `app/admin/confidence/page.tsx`
- **Funcionalidad**: Interfaz para actualizar confianza de todos los productos

### 5. Script de Actualización

- **Archivo**: `scripts/update-confidence.js`
- **Funcionalidad**: Script para actualización masiva de confianza

## Uso

### Actualización Individual

```typescript
import { updateProductConfidence } from "@/lib/firestore";

// Actualizar confianza de un producto específico
const factors = await updateProductConfidence("product-slug");
console.log("Nueva confianza:", factors.totalScore);
```

### Actualización Masiva

```typescript
import { updateAllProductsConfidence } from "@/lib/firestore";

// Actualizar confianza de todos los productos
const results = await updateAllProductsConfidence();
console.log("Productos actualizados:", results.length);
```

### Cálculo Manual

```typescript
import { calculateProductConfidence } from "@/lib/utils/confidence-calculator";

const factors = calculateProductConfidence(product, disputeInfo);
console.log("Factores de confianza:", factors);
```

## Configuración

### Variables de Entorno

No se requieren variables adicionales. El sistema utiliza la configuración existente de Firebase.

### Permisos

- **Lectura**: Todos los usuarios pueden ver la confianza
- **Actualización**: Solo el sistema puede actualizar la confianza
- **Administración**: Solo administradores pueden ejecutar actualizaciones masivas

## Monitoreo

### Métricas a Seguir

1. **Distribución de confianza**: Porcentaje de productos en cada rango
2. **Cambios promedio**: Impacto de las actualizaciones
3. **Errores de cálculo**: Productos que fallan al actualizar
4. **Tiempo de procesamiento**: Para actualizaciones masivas

### Logs

El sistema registra:

- Actualizaciones exitosas con cambios de confianza
- Errores durante el cálculo
- Estadísticas de actualizaciones masivas

## Consideraciones Futuras

### Mejoras Potenciales

1. **Ponderación por usuario**: Considerar la reputación del usuario que edita
2. **Verificación externa**: Integrar con fuentes oficiales de datos
3. **Machine Learning**: Ajustar pesos basándose en patrones históricos
4. **Confianza por campo**: Evaluar confianza específica de dimensiones vs descripción

### Optimizaciones

1. **Caché de cálculos**: Evitar recálculos innecesarios
2. **Actualización por lotes**: Procesar múltiples productos simultáneamente
3. **Triggers de Firestore**: Automatizar actualizaciones en tiempo real

## Troubleshooting

### Problemas Comunes

1. **Confianza no se actualiza**: Verificar permisos de Firestore
2. **Cálculo incorrecto**: Revisar datos de disputas y fechas
3. **Errores de rendimiento**: Considerar actualización por lotes

### Debug

```typescript
// Habilitar logs detallados
const factors = calculateProductConfidence(product, disputeInfo);
console.log("Factores detallados:", JSON.stringify(factors, null, 2));
```
