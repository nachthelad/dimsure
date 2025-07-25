# Sistema de Internacionalización (i18n)

## Descripción General

El sistema de internacionalización permite que la aplicación sea completamente multilingüe, soportando múltiples idiomas y culturas. Utiliza un sistema de traducciones basado en archivos JSON y contextos de React.

## Arquitectura

### Componentes Principales

1. **Language Provider**: Contexto de React para gestión de idioma
2. **Translation Files**: Archivos JSON con traducciones
3. **useLanguage Hook**: Hook personalizado para acceder a traducciones
4. **Language Toggle**: Componente para cambiar idioma
5. **Middleware**: Detección automática de idioma

### Idiomas Soportados

- **Español (es)**: Idioma principal
- **Inglés (en)**: Idioma secundario
- **Extensible**: Fácil agregar nuevos idiomas

## Implementación

### Language Provider

**Archivo**: `components/layout/language-provider.tsx`

```typescript
interface LanguageContextType {
  locale: string;
  t: (key: string, params?: Record<string, any>) => string;
  changeLanguage: (locale: string) => void;
}

const { locale, t, changeLanguage } = useLanguage();
```

**Funcionalidades**:

- Gestión de estado de idioma
- Función de traducción con parámetros
- Persistencia en localStorage
- Detección automática de idioma del navegador

### Archivos de Traducción

**Estructura de archivos**:

```
lib/translations/
├── index.ts
├── en.ts
└── es.ts
```

**Ejemplo de traducción**:

```typescript
// es.ts
export const es = {
  common: {
    loading: "Cargando...",
    error: "Error",
    save: "Guardar",
    cancel: "Cancelar",
  },
  product: {
    title: "Producto",
    add: "Agregar Producto",
    edit: "Editar Producto",
    details: {
      dimensions: "Dimensiones",
      weight: "Peso",
      brand: "Marca",
    },
  },
};
```

### Hook useLanguage

**Archivo**: `hooks/useLanguage.ts`

```typescript
// Uso básico
const { t } = useLanguage();
const message = t("common.loading");

// Con parámetros
const welcome = t("user.welcome", { name: "Juan" });

// Traducción condicional
const status = t(`product.status.${productStatus}`);
```

## Sistema de Traducciones

### Estructura de Claves

```typescript
// Organización jerárquica
{
  "common": {
    "actions": {},
    "status": {},
    "messages": {}
  },
  "product": {
    "form": {},
    "details": {},
    "actions": {}
  },
  "admin": {
    "dashboard": {},
    "products": {},
    "users": {}
  }
}
```

### Parámetros de Traducción

```typescript
// Traducción con parámetros
const translation = {
  "user.welcome": "Bienvenido, {{name}}!",
  "product.count": "{{count}} productos encontrados",
  "price.format": "{{currency}}{{amount}}",
};

// Uso
t("user.welcome", { name: "María" });
t("product.count", { count: 42 });
t("price.format", { currency: "$", amount: "99.99" });
```

### Traducciones Condicionales

```typescript
// Pluralización
const translation = {
  "item.count": "{{count}} item",
  "item.count_plural": "{{count}} items",
};

// Género
const translation = {
  "user.greeting_male": "Bienvenido, {{name}}",
  "user.greeting_female": "Bienvenida, {{name}}",
};
```

## Componentes de Interfaz

### Language Toggle

**Archivo**: `components/features/language-toggle.tsx`

```typescript
<LanguageToggle
  currentLocale={locale}
  onLanguageChange={changeLanguage}
  languages={[
    { code: "es", name: "Español", flag: "🇪🇸" },
    { code: "en", name: "English", flag: "🇺🇸" },
  ]}
/>
```

**Funcionalidades**:

- Selector de idioma visual
- Banderas de países
- Persistencia de selección
- Animaciones de transición

### Detección Automática

**Archivo**: `middleware.ts`

```typescript
// Detección de idioma preferido
const acceptLanguage = request.headers.get("accept-language");
const preferredLocale = getPreferredLocale(acceptLanguage);

// Redirección si es necesario
if (pathname === "/" && preferredLocale !== "es") {
  return NextResponse.redirect(new URL(`/${preferredLocale}`, request.url));
}
```

## Configuración

### Variables de Entorno

```env
# Configuración de idiomas
NEXT_PUBLIC_DEFAULT_LOCALE=es
NEXT_PUBLIC_SUPPORTED_LOCALES=es,en
NEXT_PUBLIC_FALLBACK_LOCALE=es
```

### Configuración de Next.js

**Archivo**: `next.config.mjs`

```javascript
const nextConfig = {
  i18n: {
    locales: ["es", "en"],
    defaultLocale: "es",
    localeDetection: true,
  },
};
```

## Flujos de Trabajo

### Cambio de Idioma

1. **Usuario hace clic** en selector de idioma
2. **Sistema actualiza** estado local
3. **Se guarda** preferencia en localStorage
4. **Se recarga** página con nuevo idioma
5. **Se actualiza** URL con locale

### Carga de Traducciones

1. **Aplicación inicia**
2. **Se detecta** idioma preferido
3. **Se cargan** archivos de traducción
4. **Se inicializa** Language Provider
5. **Se renderiza** interfaz traducida

### Fallback de Traducciones

1. **Se busca** traducción en idioma actual
2. **Si no existe**, se busca en idioma por defecto
3. **Si no existe**, se muestra clave original
4. **Se registra** traducción faltante

## Validación de Traducciones

### Verificación de Completitud

```typescript
// Verificar que todas las claves existen en todos los idiomas
const validateTranslations = () => {
  const keys = getAllKeys(translations.es);
  const missing = keys.filter((key) => !hasKey(translations.en, key));

  if (missing.length > 0) {
    console.warn("Missing translations:", missing);
  }
};
```

### Tipado de Traducciones

```typescript
// Tipado estricto para traducciones
type TranslationKey = keyof typeof translations.es;

const t = (key: TranslationKey, params?: Record<string, any>): string => {
  // Implementación
};
```

## Optimización

### Lazy Loading

```typescript
// Carga diferida de traducciones
const loadTranslation = async (locale: string) => {
  const module = await import(`@/lib/translations/${locale}`);
  return module.default;
};
```

### Caché de Traducciones

```typescript
// Caché en memoria
const translationCache = new Map();

const getTranslation = (locale: string, key: string) => {
  const cacheKey = `${locale}:${key}`;

  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  const translation = loadTranslationFromFile(locale, key);
  translationCache.set(cacheKey, translation);
  return translation;
};
```

## Testing

### Casos de Prueba

1. **Cambio de idioma**
2. **Carga de traducciones**
3. **Fallback de traducciones**
4. **Parámetros de traducción**
5. **Detección automática de idioma**

### Herramientas de Testing

```typescript
// Mock de traducciones para testing
const mockTranslations = {
  es: { test: "Prueba" },
  en: { test: "Test" },
};

// Test de cambio de idioma
test("should change language", () => {
  render(<LanguageToggle />);
  fireEvent.click(screen.getByText("English"));
  expect(localStorage.getItem("locale")).toBe("en");
});
```

## Monitoreo

### Métricas a Seguir

1. **Idiomas más usados**: Distribución de idiomas
2. **Traducciones faltantes**: Claves sin traducción
3. **Errores de traducción**: Fallbacks utilizados
4. **Tiempo de carga**: Rendimiento de carga de traducciones

### Logging

```typescript
// Log de traducciones faltantes
const logMissingTranslation = (key: string, locale: string) => {
  console.warn(`Missing translation: ${key} for locale: ${locale}`);
  // Enviar a servicio de monitoreo
};
```

## Troubleshooting

### Problemas Comunes

1. **Traducción no aparece**

   - Verificar que la clave existe
   - Comprobar que el idioma está cargado
   - Revisar parámetros de traducción

2. **Idioma no cambia**

   - Verificar localStorage
   - Comprobar configuración de Next.js
   - Revisar middleware

3. **Traducciones duplicadas**
   - Verificar estructura de archivos
   - Comprobar claves duplicadas
   - Revisar imports

## Consideraciones Futuras

### Mejoras Planificadas

1. **Más idiomas**: Francés, Alemán, Portugués
2. **Traducción automática**: Google Translate API
3. **Gestión de traducciones**: Panel de admin
4. **Contexto cultural**: Formatos de fecha, moneda, etc.
5. **Traducción de contenido**: Productos, descripciones

### Optimizaciones

1. **Bundle splitting**: Cargar solo idiomas necesarios
2. **CDN para traducciones**: Distribución global
3. **Compresión de archivos**: Reducir tamaño de traducciones
4. **Preload de idiomas**: Cargar idiomas comunes

## Herramientas de Desarrollo

### Scripts de Utilidad

```bash
# Extraer claves de traducción
npm run extract-translations

# Validar traducciones
npm run validate-translations

# Generar archivos de traducción
npm run generate-translations
```

### Extensiones de VS Code

- **i18n Ally**: Gestión de traducciones
- **Auto Rename Tag**: Para archivos JSON
- **Bracket Pair Colorizer**: Para navegación

## Mejores Prácticas

### Organización

1. **Claves descriptivas**: Usar nombres claros y descriptivos
2. **Agrupación lógica**: Organizar por funcionalidad
3. **Consistencia**: Mantener estructura similar entre idiomas
4. **Documentación**: Comentar traducciones complejas

### Mantenimiento

1. **Revisión regular**: Verificar traducciones faltantes
2. **Validación automática**: Scripts de verificación
3. **Backup**: Versionado de archivos de traducción
4. **Testing**: Pruebas automatizadas de traducciones
