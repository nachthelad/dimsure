# Sistema de Búsqueda

## Descripción General

El sistema de búsqueda proporciona funcionalidades avanzadas de búsqueda y filtrado de productos. Incluye búsqueda por texto, filtros por categoría y marca, ordenamiento, paginación y sugerencias de búsqueda.

## Arquitectura

### Componentes Principales

1. **Search Component**: Interfaz principal de búsqueda
2. **Search Service**: Servicios de búsqueda y filtrado
3. **Filter System**: Sistema de filtros avanzados
4. **Search Suggestions**: Sugerencias de búsqueda
5. **Search Results**: Visualización de resultados

### Estructura de Datos

```typescript
interface SearchQuery {
  query: string;
  filters: SearchFilters;
  sortBy: SortOption;
  page: number;
  limit: number;
}

interface SearchFilters {
  category?: string;
  brand?: string;
  priceRange?: { min: number; max: number };
  confidence?: { min: number; max: number };
  dimensions?: {
    length?: { min: number; max: number };
    width?: { min: number; max: number };
    height?: { min: number; max: number };
  };
  weight?: { min: number; max: number };
  status?: "all" | "approved" | "pending";
}

interface SearchResult {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  facets: SearchFacets;
}

interface SearchFacets {
  categories: { name: string; count: number }[];
  brands: { name: string; count: number }[];
  priceRanges: { range: string; count: number }[];
}
```

## Implementación

### Componente de Búsqueda

**Archivo**: `components/features/product-search.tsx`

```typescript
interface ProductSearchProps {
  initialQuery?: string;
  onSearch?: (results: SearchResult) => void;
  showFilters?: boolean;
  showSuggestions?: boolean;
}

const ProductSearch = ({
  initialQuery = "",
  onSearch,
  showFilters = true,
  showSuggestions = true,
}: ProductSearchProps) => {
  const [query, setQuery] = useState(initialQuery);
  const [filters, setFilters] = useState<SearchFilters>({});
  const [sortBy, setSortBy] = useState<SortOption>("relevance");
  const [results, setResults] = useState<SearchResult>();
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const handleSearch = async (searchQuery?: string) => {
    setLoading(true);
    try {
      const searchResults = await searchProducts({
        query: searchQuery || query,
        filters,
        sortBy,
        page: 1,
        limit: 20,
      });

      setResults(searchResults);
      onSearch?.(searchResults);
    } catch (error) {
      console.error("Search error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleQueryChange = async (newQuery: string) => {
    setQuery(newQuery);

    if (showSuggestions && newQuery.length >= 2) {
      const suggestions = await getSearchSuggestions(newQuery);
      setSuggestions(suggestions);
    } else {
      setSuggestions([]);
    }
  };

  return (
    <div className="product-search">
      <div className="search-input-container">
        <Input
          type="text"
          placeholder="Buscar productos..."
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        />
        <Button onClick={() => handleSearch()}>
          <Search className="h-4 w-4" />
        </Button>
      </div>

      {showSuggestions && suggestions.length > 0 && (
        <SearchSuggestions
          suggestions={suggestions}
          onSelect={(suggestion) => {
            setQuery(suggestion);
            handleSearch(suggestion);
          }}
        />
      )}

      {showFilters && (
        <SearchFilters
          filters={filters}
          onFilterChange={setFilters}
          onApply={() => handleSearch()}
        />
      )}

      {results && (
        <SearchResults
          results={results}
          onPageChange={(page) => handleSearch()}
        />
      )}
    </div>
  );
};
```

### Servicio de Búsqueda

**Archivo**: `lib/services/search-service.ts`

```typescript
// Búsqueda principal de productos
export const searchProducts = async (
  searchQuery: SearchQuery
): Promise<SearchResult> => {
  const { query, filters, sortBy, page, limit } = searchQuery;

  // Construir consulta base
  let q = query(collection(db, "products"), where("status", "==", "approved"));

  // Aplicar filtros
  if (filters.category) {
    q = query(q, where("category", "==", filters.category));
  }

  if (filters.brand) {
    q = query(q, where("brand", "==", filters.brand));
  }

  if (filters.confidence?.min) {
    q = query(q, where("confidence", ">=", filters.confidence.min));
  }

  if (filters.confidence?.max) {
    q = query(q, where("confidence", "<=", filters.confidence.max));
  }

  // Aplicar ordenamiento
  const sortField = getSortField(sortBy);
  const sortDirection = getSortDirection(sortBy);
  q = query(q, orderBy(sortField, sortDirection));

  // Aplicar paginación
  const offset = (page - 1) * limit;
  q = query(q, limit(limit), startAfter(offset));

  // Ejecutar consulta
  const snapshot = await getDocs(q);
  const products = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  })) as Product[];

  // Obtener total de resultados
  const totalSnapshot = await getCountFromServer(q);
  const total = totalSnapshot.data().count;

  // Calcular facetas
  const facets = await calculateSearchFacets(filters);

  return {
    products,
    total,
    page,
    totalPages: Math.ceil(total / limit),
    facets,
  };
};

// Búsqueda por texto con ranking
const searchByText = async (
  query: string,
  products: Product[]
): Promise<Product[]> => {
  const searchTerms = query
    .toLowerCase()
    .split(" ")
    .filter((term) => term.length > 0);

  return products
    .filter((product) => {
      const searchableText = [
        product.name,
        product.brand,
        product.category,
        product.description,
        product.sku,
      ]
        .join(" ")
        .toLowerCase();

      // Calcular score de relevancia
      const score = searchTerms.reduce((total, term) => {
        if (searchableText.includes(term)) {
          // Peso mayor para coincidencias en nombre y marca
          if (product.name.toLowerCase().includes(term)) total += 10;
          else if (product.brand.toLowerCase().includes(term)) total += 8;
          else if (product.category.toLowerCase().includes(term)) total += 5;
          else total += 1;
        }
        return total;
      }, 0);

      product.searchScore = score;
      return score > 0;
    })
    .sort((a, b) => (b.searchScore || 0) - (a.searchScore || 0));
};
```

### Sistema de Filtros

**Archivo**: `components/features/search-filters.tsx`

```typescript
interface SearchFiltersProps {
  filters: SearchFilters;
  onFilterChange: (filters: SearchFilters) => void;
  onApply: () => void;
  facets?: SearchFacets;
}

const SearchFilters = ({
  filters,
  onFilterChange,
  onApply,
  facets,
}: SearchFiltersProps) => {
  const [localFilters, setLocalFilters] = useState(filters);

  const handleFilterChange = (key: keyof SearchFilters, value: any) => {
    const newFilters = { ...localFilters, [key]: value };
    setLocalFilters(newFilters);
  };

  const handleApply = () => {
    onFilterChange(localFilters);
    onApply();
  };

  const handleClear = () => {
    const clearedFilters = {};
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
    onApply();
  };

  return (
    <div className="search-filters">
      <div className="filters-header">
        <h3>Filtros</h3>
        <Button variant="ghost" size="sm" onClick={handleClear}>
          Limpiar
        </Button>
      </div>

      {/* Filtro por categoría */}
      <div className="filter-section">
        <h4>Categoría</h4>
        <Select
          value={localFilters.category || ""}
          onValueChange={(value) => handleFilterChange("category", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas las categorías" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas las categorías</SelectItem>
            {facets?.categories.map((category) => (
              <SelectItem key={category.name} value={category.name}>
                {category.name} ({category.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro por marca */}
      <div className="filter-section">
        <h4>Marca</h4>
        <Select
          value={localFilters.brand || ""}
          onValueChange={(value) => handleFilterChange("brand", value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Todas las marcas" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todas las marcas</SelectItem>
            {facets?.brands.map((brand) => (
              <SelectItem key={brand.name} value={brand.name}>
                {brand.name} ({brand.count})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Filtro por confianza */}
      <div className="filter-section">
        <h4>Confianza</h4>
        <div className="range-slider">
          <Slider
            value={[
              localFilters.confidence?.min || 0,
              localFilters.confidence?.max || 100,
            ]}
            onValueChange={([min, max]) =>
              handleFilterChange("confidence", { min, max })
            }
            min={0}
            max={100}
            step={5}
          />
          <div className="range-labels">
            <span>{localFilters.confidence?.min || 0}%</span>
            <span>{localFilters.confidence?.max || 100}%</span>
          </div>
        </div>
      </div>

      <Button onClick={handleApply} className="w-full">
        Aplicar Filtros
      </Button>
    </div>
  );
};
```

### Sugerencias de Búsqueda

**Archivo**: `lib/services/suggestions-service.ts`

```typescript
// Obtener sugerencias de búsqueda
export const getSearchSuggestions = async (
  query: string
): Promise<string[]> => {
  if (query.length < 2) return [];

  const suggestions: string[] = [];

  // Buscar en nombres de productos
  const productsQuery = query(
    collection(db, "products"),
    where("name", ">=", query),
    where("name", "<=", query + "\uf8ff"),
    limit(5)
  );

  const productsSnapshot = await getDocs(productsQuery);
  productsSnapshot.docs.forEach((doc) => {
    const product = doc.data();
    suggestions.push(product.name);
  });

  // Buscar en marcas
  const brandsQuery = query(
    collection(db, "brands"),
    where("name", ">=", query),
    where("name", "<=", query + "\uf8ff"),
    limit(3)
  );

  const brandsSnapshot = await getDocs(brandsQuery);
  brandsSnapshot.docs.forEach((doc) => {
    const brand = doc.data();
    suggestions.push(brand.name);
  });

  // Buscar en categorías
  const categoriesQuery = query(
    collection(db, "categories"),
    where("name", ">=", query),
    where("name", "<=", query + "\uf8ff"),
    limit(3)
  );

  const categoriesSnapshot = await getDocs(categoriesQuery);
  categoriesSnapshot.docs.forEach((doc) => {
    const category = doc.data();
    suggestions.push(category.name);
  });

  // Eliminar duplicados y limitar resultados
  return [...new Set(suggestions)].slice(0, 10);
};

// Búsqueda de autocompletado
export const getAutocompleteSuggestions = async (
  query: string
): Promise<AutocompleteSuggestion[]> => {
  const suggestions = await getSearchSuggestions(query);

  return suggestions.map((suggestion) => ({
    text: suggestion,
    type: getSuggestionType(suggestion),
    icon: getSuggestionIcon(suggestion),
  }));
};
```

## Componentes de Interfaz

### Resultados de Búsqueda

```typescript
interface SearchResultsProps {
  results: SearchResult;
  onPageChange: (page: number) => void;
  onProductClick?: (product: Product) => void;
}

const SearchResults = ({
  results,
  onPageChange,
  onProductClick,
}: SearchResultsProps) => {
  const { products, total, page, totalPages } = results;

  if (products.length === 0) {
    return (
      <div className="search-no-results">
        <Search className="h-12 w-12 text-muted-foreground" />
        <h3>No se encontraron resultados</h3>
        <p>Intenta con otros términos de búsqueda o ajusta los filtros</p>
      </div>
    );
  }

  return (
    <div className="search-results">
      <div className="results-header">
        <p className="results-count">
          {total} producto{total !== 1 ? "s" : ""} encontrado
          {total !== 1 ? "s" : ""}
        </p>
        <SearchSort
          onSortChange={(sortBy) => {
            /* Implementar */
          }}
        />
      </div>

      <div className="results-grid">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onClick={() => onProductClick?.(product)}
          />
        ))}
      </div>

      {totalPages > 1 && (
        <Pagination
          currentPage={page}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};
```

### Ordenamiento

```typescript
interface SortOption {
  value: string;
  label: string;
  field: string;
  direction: "asc" | "desc";
}

const sortOptions: SortOption[] = [
  {
    value: "relevance",
    label: "Relevancia",
    field: "searchScore",
    direction: "desc",
  },
  { value: "name-asc", label: "Nombre A-Z", field: "name", direction: "asc" },
  { value: "name-desc", label: "Nombre Z-A", field: "name", direction: "desc" },
  {
    value: "confidence-desc",
    label: "Confianza Alta",
    field: "confidence",
    direction: "desc",
  },
  {
    value: "confidence-asc",
    label: "Confianza Baja",
    field: "confidence",
    direction: "asc",
  },
  {
    value: "likes-desc",
    label: "Más Populares",
    field: "likes",
    direction: "desc",
  },
  {
    value: "views-desc",
    label: "Más Vistos",
    field: "views",
    direction: "desc",
  },
  {
    value: "created-desc",
    label: "Más Recientes",
    field: "createdAt",
    direction: "desc",
  },
];

const SearchSort = ({
  onSortChange,
}: {
  onSortChange: (sortBy: string) => void;
}) => {
  return (
    <Select onValueChange={onSortChange}>
      <SelectTrigger className="w-48">
        <SelectValue placeholder="Ordenar por" />
      </SelectTrigger>
      <SelectContent>
        {sortOptions.map((option) => (
          <SelectItem key={option.value} value={option.value}>
            {option.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
```

## Optimización

### Índices de Firestore

```javascript
// Índices compuestos para búsqueda eficiente
{
  "collectionGroup": "products",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "status", "order": "ASCENDING" },
    { "fieldPath": "category", "order": "ASCENDING" },
    { "fieldPath": "confidence", "order": "ASCENDING" }
  ]
}

{
  "collectionGroup": "products",
  "queryScope": "COLLECTION",
  "fields": [
    { "fieldPath": "status", "order": "ASCENDING" },
    { "fieldPath": "brand", "order": "ASCENDING" },
    { "fieldPath": "name", "order": "ASCENDING" }
  ]
}
```

### Caché de Búsqueda

```typescript
// Caché en memoria para resultados de búsqueda
const searchCache = new Map<
  string,
  { results: SearchResult; timestamp: number }
>();

const getCachedSearch = (cacheKey: string): SearchResult | null => {
  const cached = searchCache.get(cacheKey);
  if (cached && Date.now() - cached.timestamp < 5 * 60 * 1000) {
    // 5 minutos
    return cached.results;
  }
  return null;
};

const setCachedSearch = (cacheKey: string, results: SearchResult) => {
  searchCache.set(cacheKey, { results, timestamp: Date.now() });

  // Limpiar caché si es muy grande
  if (searchCache.size > 100) {
    const oldestKey = searchCache.keys().next().value;
    searchCache.delete(oldestKey);
  }
};
```

## Configuración

### Variables de Entorno

```env
# Search Configuration
NEXT_PUBLIC_SEARCH_SUGGESTIONS_ENABLED=true
NEXT_PUBLIC_SEARCH_CACHE_ENABLED=true
NEXT_PUBLIC_SEARCH_RESULTS_PER_PAGE=20
NEXT_PUBLIC_SEARCH_MAX_SUGGESTIONS=10

# Performance
NEXT_PUBLIC_SEARCH_DEBOUNCE_MS=300
NEXT_PUBLIC_SEARCH_MIN_QUERY_LENGTH=2
```

### Configuración de Firestore

```javascript
// Reglas de seguridad para búsqueda
match /products/{productId} {
  allow read: if true; // Búsqueda pública
  allow write: if request.auth != null &&
    (resource.data.createdBy == request.auth.uid ||
     request.auth.token.admin == true);
}
```

## Testing

### Casos de Prueba

1. **Búsqueda básica por texto**
2. **Filtros por categoría y marca**
3. **Ordenamiento de resultados**
4. **Paginación**
5. **Sugerencias de búsqueda**

### Herramientas de Testing

```typescript
// Mock de resultados de búsqueda
const mockSearchResults: SearchResult = {
  products: [
    { id: "1", name: "iPhone 14 Pro", brand: "Apple", confidence: 95 },
    { id: "2", name: "Samsung Galaxy S23", brand: "Samsung", confidence: 92 },
  ],
  total: 2,
  page: 1,
  totalPages: 1,
  facets: {
    categories: [{ name: "Smartphones", count: 2 }],
    brands: [
      { name: "Apple", count: 1 },
      { name: "Samsung", count: 1 },
    ],
    priceRanges: [],
  },
};

// Test de búsqueda
test("should search products", async () => {
  render(<ProductSearch onSearch={mockOnSearch} />);
  fireEvent.change(screen.getByPlaceholderText("Buscar productos..."), {
    target: { value: "iPhone" },
  });
  fireEvent.click(screen.getByRole("button", { name: /buscar/i }));
  expect(mockOnSearch).toHaveBeenCalledWith(
    expect.objectContaining({
      products: expect.arrayContaining([
        expect.objectContaining({ name: "iPhone 14 Pro" }),
      ]),
    })
  );
});
```

## Monitoreo

### Métricas a Seguir

1. **Consultas de búsqueda**: Número de búsquedas por día
2. **Tiempo de respuesta**: Latencia de búsquedas
3. **Tasa de clics**: Productos clickeados desde búsqueda
4. **Búsquedas sin resultados**: Términos que no encuentran nada
5. **Uso de filtros**: Filtros más utilizados

### Alertas

- Búsquedas con tiempo de respuesta alto
- Errores en consultas de Firestore
- Búsquedas sin resultados frecuentes
- Problemas con índices de búsqueda

## Troubleshooting

### Problemas Comunes

1. **Búsqueda lenta**

   - Verificar índices de Firestore
   - Comprobar consultas complejas
   - Revisar caché de búsqueda

2. **Resultados incorrectos**

   - Verificar filtros aplicados
   - Comprobar ordenamiento
   - Revisar algoritmo de relevancia

3. **Sugerencias no aparecen**
   - Verificar longitud mínima de consulta
   - Comprobar configuración de sugerencias
   - Revisar índices de texto

## Consideraciones Futuras

### Mejoras Planificadas

1. **Búsqueda semántica**: IA para entender intención
2. **Búsqueda por imagen**: Búsqueda visual de productos
3. **Búsqueda de voz**: Comandos de voz
4. **Búsqueda avanzada**: Operadores booleanos
5. **Búsqueda personalizada**: Basada en historial del usuario

### Optimizaciones

1. **Elasticsearch**: Motor de búsqueda dedicado
2. **CDN para búsqueda**: Distribución global
3. **Búsqueda predictiva**: Anticipar consultas
4. **Compresión de índices**: Reducir tamaño de datos
