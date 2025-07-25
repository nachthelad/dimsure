# Sistema de Testing

## Descripción General

El sistema de testing proporciona una estrategia completa de pruebas para garantizar la calidad y confiabilidad del código. Incluye testing unitario, testing de componentes, testing de integración y testing end-to-end.

## Arquitectura

### Tipos de Testing

1. **Unit Testing**: Pruebas de funciones y utilidades individuales
2. **Component Testing**: Pruebas de componentes de React
3. **Integration Testing**: Pruebas de integración entre módulos
4. **E2E Testing**: Pruebas de flujos completos de usuario
5. **Visual Testing**: Pruebas de regresión visual

### Herramientas Utilizadas

- **Jest**: Framework de testing principal
- **React Testing Library**: Testing de componentes React
- **Cypress**: Testing end-to-end
- **MSW**: Mock Service Worker para APIs
- **@testing-library/jest-dom**: Matchers adicionales para Jest

## Configuración

### Jest Configuration

**Archivo**: `jest.config.js`

```javascript
const nextJest = require("next/jest");

const createJestConfig = nextJest({
  // Provide the path to your Next.js app to load next.config.js and .env files
  dir: "./",
});

// Add any custom config to be passed to Jest
const customJestConfig = {
  setupFilesAfterEnv: ["<rootDir>/jest.setup.js"],
  testEnvironment: "jest-environment-jsdom",
  moduleNameMapping: {
    "^@/(.*)$": "<rootDir>/$1",
  },
  collectCoverageFrom: [
    "components/**/*.{js,jsx,ts,tsx}",
    "lib/**/*.{js,jsx,ts,tsx}",
    "hooks/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
};

// createJestConfig is exported this way to ensure that next/jest can load the Next.js config which is async
module.exports = createJestConfig(customJestConfig);
```

### Jest Setup

**Archivo**: `jest.setup.js`

```javascript
import "@testing-library/jest-dom";
import { server } from "./src/mocks/server";

// Establish API mocking before all tests
beforeAll(() => server.listen());

// Reset any request handlers that we may add during the tests,
// so they don't affect other tests
afterEach(() => server.resetHandlers());

// Clean up after the tests are finished
afterAll(() => server.close());

// Mock Next.js router
jest.mock("next/router", () => ({
  useRouter() {
    return {
      route: "/",
      pathname: "/",
      query: {},
      asPath: "/",
      push: jest.fn(),
      pop: jest.fn(),
      reload: jest.fn(),
      back: jest.fn(),
      prefetch: jest.fn().mockResolvedValue(undefined),
      beforePopState: jest.fn(),
      events: {
        on: jest.fn(),
        off: jest.fn(),
        emit: jest.fn(),
      },
      isFallback: false,
    };
  },
}));

// Mock Next.js Image component
jest.mock("next/image", () => ({
  __esModule: true,
  default: (props) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} />;
  },
}));

// Mock Firebase
jest.mock("@/lib/firebase", () => ({
  db: {},
  auth: {},
  storage: {},
}));
```

## Unit Testing

### Testing de Utilidades

**Archivo**: `lib/utils/__tests__/validation.test.ts`

```typescript
import { validateEmail, validateSKU, validateDimensions } from "../validation";

describe("Validation Utils", () => {
  describe("validateEmail", () => {
    it("should validate correct email addresses", () => {
      expect(validateEmail("test@example.com")).toBe(true);
      expect(validateEmail("user.name@domain.co.uk")).toBe(true);
    });

    it("should reject invalid email addresses", () => {
      expect(validateEmail("invalid-email")).toBe(false);
      expect(validateEmail("test@")).toBe(false);
      expect(validateEmail("@example.com")).toBe(false);
    });
  });

  describe("validateSKU", () => {
    it("should validate correct SKUs", () => {
      expect(validateSKU("ABC123")).toBe(true);
      expect(validateSKU("PRODUCT-001")).toBe(true);
    });

    it("should reject invalid SKUs", () => {
      expect(validateSKU("abc")).toBe(false); // Too short
      expect(validateSKU("ABC 123")).toBe(false); // Contains space
      expect(validateSKU("ABC@123")).toBe(false); // Contains special char
    });
  });

  describe("validateDimensions", () => {
    it("should validate correct dimensions", () => {
      expect(validateDimensions({ length: 10, width: 5, height: 2 })).toBe(
        true
      );
    });

    it("should reject invalid dimensions", () => {
      expect(validateDimensions({ length: 0, width: 5, height: 2 })).toBe(
        false
      );
      expect(validateDimensions({ length: -1, width: 5, height: 2 })).toBe(
        false
      );
    });
  });
});
```

### Testing de Hooks

**Archivo**: `hooks/__tests__/useAuth.test.ts`

```typescript
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "../useAuth";
import { auth } from "@/lib/firebase";

// Mock Firebase Auth
jest.mock("@/lib/firebase", () => ({
  auth: {
    onAuthStateChanged: jest.fn(),
    signOut: jest.fn(),
  },
}));

describe("useAuth", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return initial state", () => {
    const { result } = renderHook(() => useAuth());

    expect(result.current.user).toBeNull();
    expect(result.current.isLoggedIn).toBe(false);
    expect(result.current.loading).toBe(true);
  });

  it("should update state when user signs in", () => {
    const mockUser = {
      uid: "123",
      email: "test@example.com",
      displayName: "Test User",
    };

    const { result } = renderHook(() => useAuth());

    act(() => {
      // Simulate auth state change
      const authStateCallback = auth.onAuthStateChanged.mock.calls[0][0];
      authStateCallback(mockUser);
    });

    expect(result.current.user).toEqual(mockUser);
    expect(result.current.isLoggedIn).toBe(true);
    expect(result.current.loading).toBe(false);
  });

  it("should handle sign out", () => {
    const { result } = renderHook(() => useAuth());

    act(() => {
      result.current.signOut();
    });

    expect(auth.signOut).toHaveBeenCalled();
  });
});
```

## Component Testing

### Testing de Componentes Simples

**Archivo**: `components/ui/__tests__/Button.test.tsx`

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "../button";

describe("Button", () => {
  it("should render correctly", () => {
    render(<Button>Click me</Button>);

    expect(
      screen.getByRole("button", { name: /click me/i })
    ).toBeInTheDocument();
  });

  it("should handle click events", () => {
    const handleClick = jest.fn();
    render(<Button onClick={handleClick}>Click me</Button>);

    fireEvent.click(screen.getByRole("button"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it("should be disabled when disabled prop is true", () => {
    render(<Button disabled>Click me</Button>);

    expect(screen.getByRole("button")).toBeDisabled();
  });

  it("should apply different variants", () => {
    const { rerender } = render(<Button variant="default">Default</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-primary");

    rerender(<Button variant="destructive">Destructive</Button>);
    expect(screen.getByRole("button")).toHaveClass("bg-destructive");
  });
});
```

### Testing de Componentes Complejos

**Archivo**: `components/features/__tests__/ProductCard.test.tsx`

```typescript
import { render, screen, fireEvent } from "@testing-library/react";
import { ProductCard } from "../product-card";
import { mockProduct } from "@/__mocks__/product";

// Mock Next.js Link
jest.mock("next/link", () => {
  return ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  );
});

// Mock useAuth hook
jest.mock("@/hooks/useAuth", () => ({
  useAuth: () => ({
    user: { uid: "123" },
    isLoggedIn: true,
  }),
}));

describe("ProductCard", () => {
  const defaultProps = {
    product: mockProduct,
    onLike: jest.fn(),
  };

  it("should render product information correctly", () => {
    render(<ProductCard {...defaultProps} />);

    expect(screen.getByText(mockProduct.name)).toBeInTheDocument();
    expect(screen.getByText(mockProduct.brand)).toBeInTheDocument();
    expect(screen.getByText(`${mockProduct.confidence}%`)).toBeInTheDocument();
  });

  it("should display dimensions correctly", () => {
    render(<ProductCard {...defaultProps} />);

    const dimensions = `${mockProduct.primaryDimensions.length} × ${mockProduct.primaryDimensions.width} × ${mockProduct.primaryDimensions.height} cm`;
    expect(screen.getByText(dimensions)).toBeInTheDocument();
  });

  it("should handle like button click", () => {
    render(<ProductCard {...defaultProps} />);

    const likeButton = screen.getByRole("button", { name: /like/i });
    fireEvent.click(likeButton);

    expect(defaultProps.onLike).toHaveBeenCalledWith(mockProduct.id);
  });

  it("should show like count and view count", () => {
    render(<ProductCard {...defaultProps} />);

    expect(screen.getByText(mockProduct.likes.toString())).toBeInTheDocument();
    expect(screen.getByText(mockProduct.views.toString())).toBeInTheDocument();
  });

  it("should link to product detail page", () => {
    render(<ProductCard {...defaultProps} />);

    const productLink = screen.getByRole("link", { name: mockProduct.name });
    expect(productLink).toHaveAttribute(
      "href",
      `/product/${mockProduct.urlSlug}`
    );
  });
});
```

## Integration Testing

### Testing de Servicios

**Archivo**: `lib/services/__tests__/product-service.test.ts`

```typescript
import { getProduct, createProduct, updateProduct } from "../product-service";
import { mockProduct } from "@/__mocks__/product";

// Mock Firestore
jest.mock("@/lib/firebase", () => ({
  db: {},
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  getDoc: jest.fn(),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
  collection: jest.fn(),
  addDoc: jest.fn(),
}));

describe("Product Service", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getProduct", () => {
    it("should return product when found", async () => {
      const mockGetDoc = require("firebase/firestore").getDoc;
      mockGetDoc.mockResolvedValue({
        exists: () => true,
        data: () => mockProduct,
      });

      const result = await getProduct("test-slug");

      expect(result).toEqual(mockProduct);
    });

    it("should return null when product not found", async () => {
      const mockGetDoc = require("firebase/firestore").getDoc;
      mockGetDoc.mockResolvedValue({
        exists: () => false,
      });

      const result = await getProduct("non-existent-slug");

      expect(result).toBeNull();
    });
  });

  describe("createProduct", () => {
    it("should create product successfully", async () => {
      const mockAddDoc = require("firebase/firestore").addDoc;
      mockAddDoc.mockResolvedValue({ id: "new-product-id" });

      const newProduct = {
        name: "New Product",
        brand: "Test Brand",
        category: "Electronics",
      };

      const result = await createProduct(newProduct);

      expect(mockAddDoc).toHaveBeenCalled();
      expect(result).toEqual({ id: "new-product-id" });
    });
  });
});
```

### Testing de APIs

**Archivo**: `app/api/__tests__/products.test.ts`

```typescript
import { createMocks } from "node-mocks-http";
import productsHandler from "../products";

describe("/api/products", () => {
  it("should return products list", async () => {
    const { req, res } = createMocks({
      method: "GET",
    });

    await productsHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        products: expect.any(Array),
      })
    );
  });

  it("should create new product", async () => {
    const productData = {
      name: "Test Product",
      brand: "Test Brand",
      category: "Electronics",
    };

    const { req, res } = createMocks({
      method: "POST",
      body: productData,
    });

    await productsHandler(req, res);

    expect(res._getStatusCode()).toBe(201);
    expect(JSON.parse(res._getData())).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        ...productData,
      })
    );
  });

  it("should return 405 for unsupported method", async () => {
    const { req, res } = createMocks({
      method: "PUT",
    });

    await productsHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
  });
});
```

## E2E Testing

### Configuración de Cypress

**Archivo**: `cypress.config.ts`

```typescript
import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    supportFile: "cypress/support/e2e.ts",
    specPattern: "cypress/e2e/**/*.cy.{js,jsx,ts,tsx}",
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
  },
  component: {
    devServer: {
      framework: "next",
      bundler: "webpack",
    },
  },
});
```

### Testing de Flujos Completos

**Archivo**: `cypress/e2e/product-creation.cy.ts`

```typescript
describe("Product Creation Flow", () => {
  beforeEach(() => {
    cy.visit("/add-product");
  });

  it("should create a product successfully", () => {
    // Fill product form
    cy.get('[data-testid="product-name"]').type("Test Product");
    cy.get('[data-testid="product-brand"]').type("Test Brand");
    cy.get('[data-testid="product-category"]').select("Electronics");
    cy.get('[data-testid="product-description"]').type("Test description");

    // Fill dimensions
    cy.get('[data-testid="dimension-length"]').type("10");
    cy.get('[data-testid="dimension-width"]').type("5");
    cy.get('[data-testid="dimension-height"]').type("2");

    // Upload image
    cy.get('[data-testid="image-upload"]').attachFile("test-image.jpg");

    // Submit form
    cy.get('[data-testid="submit-button"]').click();

    // Verify success
    cy.url().should("include", "/product/");
    cy.get('[data-testid="product-name"]').should("contain", "Test Product");
  });

  it("should show validation errors for invalid data", () => {
    // Try to submit empty form
    cy.get('[data-testid="submit-button"]').click();

    // Verify validation errors
    cy.get('[data-testid="error-message"]').should("be.visible");
    cy.get('[data-testid="product-name-error"]').should("contain", "Required");
  });

  it("should handle image upload errors", () => {
    // Try to upload invalid file
    cy.get('[data-testid="image-upload"]').attachFile("test.txt");

    // Verify error message
    cy.get('[data-testid="upload-error"]').should(
      "contain",
      "Invalid file type"
    );
  });
});
```

### Testing de Búsqueda

**Archivo**: `cypress/e2e/search.cy.ts`

```typescript
describe("Search Functionality", () => {
  beforeEach(() => {
    cy.visit("/search");
  });

  it("should search products by name", () => {
    cy.get('[data-testid="search-input"]').type("iPhone");
    cy.get('[data-testid="search-button"]').click();

    cy.get('[data-testid="product-card"]').should("have.length.greaterThan", 0);
    cy.get('[data-testid="product-name"]').first().should("contain", "iPhone");
  });

  it("should filter by category", () => {
    cy.get('[data-testid="category-filter"]').select("Electronics");
    cy.get('[data-testid="apply-filters"]').click();

    cy.get('[data-testid="product-card"]').each(($card) => {
      cy.wrap($card)
        .find('[data-testid="product-category"]')
        .should("contain", "Electronics");
    });
  });

  it("should sort results", () => {
    cy.get('[data-testid="sort-select"]').select("name-asc");

    cy.get('[data-testid="product-name"]').then(($names) => {
      const names = Array.from($names, (el) => el.textContent);
      const sortedNames = [...names].sort();
      expect(names).to.deep.equal(sortedNames);
    });
  });
});
```

## Visual Testing

### Configuración de Percy

**Archivo**: `.percy.js`

```javascript
module.exports = {
  version: 2,
  snapshot: {
    widths: [375, 768, 1280],
    minHeight: 1024,
    percyCSS: `
      .percy-hide { visibility: hidden; }
    `,
  },
  discovery: {
    allowedHostnames: ["localhost"],
    disallowedHostnames: [],
    networkIdleTimeout: 100,
  },
};
```

### Testing Visual de Componentes

**Archivo**: `cypress/e2e/visual.cy.ts`

```typescript
describe("Visual Regression Tests", () => {
  it("should match homepage snapshot", () => {
    cy.visit("/");
    cy.percySnapshot("Homepage");
  });

  it("should match product card snapshot", () => {
    cy.visit("/search");
    cy.get('[data-testid="product-card"]').first().should("be.visible");
    cy.percySnapshot("Product Card");
  });

  it("should match dark theme snapshot", () => {
    cy.visit("/");
    cy.get('[data-testid="theme-toggle"]').click();
    cy.percySnapshot("Homepage Dark Theme");
  });
});
```

## Mocking

### Mock Service Worker

**Archivo**: `src/mocks/handlers.ts`

```typescript
import { rest } from "msw";

export const handlers = [
  // Mock products API
  rest.get("/api/products", (req, res, ctx) => {
    return res(
      ctx.status(200),
      ctx.json({
        products: [
          {
            id: "1",
            name: "iPhone 14 Pro",
            brand: "Apple",
            category: "Electronics",
            confidence: 95,
          },
        ],
      })
    );
  }),

  // Mock product creation
  rest.post("/api/products", (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: "new-product-id",
        ...req.body,
      })
    );
  }),

  // Mock search API
  rest.get("/api/search", (req, res, ctx) => {
    const query = req.url.searchParams.get("q");

    return res(
      ctx.status(200),
      ctx.json({
        results: query
          ? [
              {
                id: "1",
                name: `Search result for ${query}`,
                brand: "Test Brand",
              },
            ]
          : [],
      })
    );
  }),
];
```

### Mock de Datos

**Archivo**: `__mocks__/product.ts`

```typescript
export const mockProduct = {
  id: "test-product-id",
  name: "Test Product",
  brand: "Test Brand",
  category: "Electronics",
  description: "A test product for testing purposes",
  sku: "TEST-001",
  primaryDimensions: {
    length: 10,
    width: 5,
    height: 2,
  },
  weight: 500,
  weightUnit: "g",
  images: ["https://example.com/image.jpg"],
  confidence: 85,
  likes: 42,
  views: 1000,
  createdBy: "test-user-id",
  createdAt: new Date("2024-01-01"),
  lastModified: new Date("2024-01-01"),
  lastModifiedBy: "test-user-id",
  status: "approved",
  urlSlug: "test-product",
};

export const mockProducts = [
  mockProduct,
  {
    ...mockProduct,
    id: "test-product-2",
    name: "Test Product 2",
    urlSlug: "test-product-2",
  },
];
```

## Scripts de Testing

### Package.json Scripts

```json
{
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "test:e2e": "cypress run",
    "test:e2e:open": "cypress open",
    "test:visual": "percy exec -- cypress run",
    "test:ci": "npm run test && npm run test:e2e"
  }
}
```

### GitHub Actions

**Archivo**: `.github/workflows/test.yml`

```yaml
name: Tests

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest

    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: "18"
          cache: "npm"

      - name: Install dependencies
        run: npm ci

      - name: Run unit tests
        run: npm run test:coverage

      - name: Run E2E tests
        run: |
          npm run build
          npm run start &
          npm run test:e2e

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          file: ./coverage/lcov.info
```

## Monitoreo de Testing

### Métricas de Cobertura

```typescript
// Configuración de cobertura
const coverageConfig = {
  collectCoverageFrom: [
    "components/**/*.{js,jsx,ts,tsx}",
    "lib/**/*.{js,jsx,ts,tsx}",
    "hooks/**/*.{js,jsx,ts,tsx}",
    "!**/*.d.ts",
    "!**/node_modules/**",
    "!**/.next/**",
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80,
    },
  },
  coverageReporters: ["text", "lcov", "html"],
};
```

### Reportes de Testing

```typescript
// Generación de reportes
const generateTestReport = () => {
  const report = {
    timestamp: new Date().toISOString(),
    summary: {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
    },
    coverage: {
      statements: 0,
      branches: 0,
      functions: 0,
      lines: 0,
    },
    duration: 0,
  };

  return report;
};
```

## Troubleshooting

### Problemas Comunes

1. **Tests que fallan intermitentemente**

   - Verificar mocks y limpieza
   - Comprobar timing y async operations
   - Revisar estado compartido entre tests

2. **Componentes no se renderizan en tests**

   - Verificar providers y contextos
   - Comprobar mocks de Next.js
   - Revisar configuración de Jest

3. **E2E tests lentos**
   - Optimizar selectores
   - Usar waitFor en lugar de sleep
   - Revisar configuración de Cypress

## Consideraciones Futuras

### Mejoras Planificadas

1. **Testing de Performance**: Lighthouse CI
2. **Testing de Accesibilidad**: axe-core integration
3. **Testing de Seguridad**: OWASP ZAP
4. **Testing de API**: Contract testing
5. **Testing de Base de Datos**: Testcontainers

### Optimizaciones

1. **Paralelización**: Tests en paralelo
2. **Caching**: Cache de dependencias
3. **Selective Testing**: Solo tests afectados
4. **Visual Regression**: Screenshot testing
