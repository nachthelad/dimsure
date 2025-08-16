## Ads rendering policy

- AdSense is disabled globally (no Auto Ads). Ads render only via `components/features/adsense-ad.tsx` when:
  - User granted marketing consent in the cookie banner, and
  - The page has sufficient content (defaults to 600+ chars; listing page uses higher threshold), and
  - The route is content-rich (e.g., blog post/pages), not utility pages.
- This prevents ads on thin pages and login/profile/search/admin routes.

# Sistema de UI/UX

## Descripción General

El sistema de UI/UX proporciona una interfaz de usuario consistente, accesible y moderna utilizando Shadcn UI como base. Incluye componentes reutilizables, sistema de temas, diseño responsivo y patrones de interacción optimizados.

## Arquitectura

### Componentes Principales

1. **Design System**: Sistema de diseño base con tokens
2. **Component Library**: Biblioteca de componentes reutilizables
3. **Theme System**: Sistema de temas claro/oscuro
4. **Layout System**: Sistema de layouts y grids
5. **Responsive Design**: Diseño adaptativo para múltiples dispositivos

### Estructura de Archivos

```
components/
├── ui/                    # Componentes base de Shadcn UI
│   ├── button.tsx
│   ├── card.tsx
│   ├── dialog.tsx
│   └── ...
├── layout/               # Componentes de layout
│   ├── navbar.tsx
│   ├── footer.tsx
│   └── sidebar.tsx
├── features/             # Componentes específicos de funcionalidad
│   ├── product-card.tsx
│   ├── search-bar.tsx
│   └── ...
└── providers/            # Providers de contexto
    ├── theme-provider.tsx
    ├── language-provider.tsx
    └── ...
```

## Sistema de Diseño

### Tokens de Diseño

**Archivo**: `tailwind.config.ts`

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
```

### Variables CSS

**Archivo**: `app/globals.css`

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222.2 84% 4.9%;
    --card: 0 0% 100%;
    --card-foreground: 222.2 84% 4.9%;
    --popover: 0 0% 100%;
    --popover-foreground: 222.2 84% 4.9%;
    --primary: 221.2 83.2% 53.3%;
    --primary-foreground: 210 40% 98%;
    --secondary: 210 40% 96%;
    --secondary-foreground: 222.2 84% 4.9%;
    --muted: 210 40% 96%;
    --muted-foreground: 215.4 16.3% 46.9%;
    --accent: 210 40% 96%;
    --accent-foreground: 222.2 84% 4.9%;
    --destructive: 0 84.2% 60.2%;
    --destructive-foreground: 210 40% 98%;
    --border: 214.3 31.8% 91.4%;
    --input: 214.3 31.8% 91.4%;
    --ring: 221.2 83.2% 53.3%;
    --radius: 0.5rem;
  }

  .dark {
    --background: 222.2 84% 4.9%;
    --foreground: 210 40% 98%;
    --card: 222.2 84% 4.9%;
    --card-foreground: 210 40% 98%;
    --popover: 222.2 84% 4.9%;
    --popover-foreground: 210 40% 98%;
    --primary: 217.2 91.2% 59.8%;
    --primary-foreground: 222.2 84% 4.9%;
    --secondary: 217.2 32.6% 17.5%;
    --secondary-foreground: 210 40% 98%;
    --muted: 217.2 32.6% 17.5%;
    --muted-foreground: 215 20.2% 65.1%;
    --accent: 217.2 32.6% 17.5%;
    --accent-foreground: 210 40% 98%;
    --destructive: 0 62.8% 30.6%;
    --destructive-foreground: 210 40% 98%;
    --border: 217.2 32.6% 17.5%;
    --input: 217.2 32.6% 17.5%;
    --ring: 224.3 76.3% 94.1%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}
```

## Sistema de Temas

### Theme Provider

**Archivo**: `components/layout/theme-provider.tsx`

```typescript
"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}

// Hook personalizado para usar el tema
export const useTheme = () => {
  const { theme, setTheme, systemTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  const currentTheme = theme === "system" ? systemTheme : theme;

  return {
    theme: currentTheme,
    setTheme,
    toggleTheme,
    isDark: currentTheme === "dark",
    isLight: currentTheme === "light",
  };
};
```

### Theme Toggle

**Archivo**: `components/features/theme-toggle.tsx`

```typescript
"use client";

import * as React from "react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="icon">
          <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}>
          Light
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}>
          Dark
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}>
          System
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
```

## Componentes Base

### Button Component

**Archivo**: `components/ui/button.tsx`

```typescript
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
```

### Card Component

**Archivo**: `components/ui/card.tsx`

```typescript
import * as React from "react";
import { cn } from "@/lib/utils";

const Card = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "rounded-lg border bg-card text-card-foreground shadow-sm",
      className
    )}
    {...props}
  />
));
Card.displayName = "Card";

const CardHeader = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex flex-col space-y-1.5 p-6", className)}
    {...props}
  />
));
CardHeader.displayName = "CardHeader";

const CardTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h3
    ref={ref}
    className={cn(
      "text-2xl font-semibold leading-none tracking-tight",
      className
    )}
    {...props}
  />
));
CardTitle.displayName = "CardTitle";

const CardDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <p
    ref={ref}
    className={cn("text-sm text-muted-foreground", className)}
    {...props}
  />
));
CardDescription.displayName = "CardDescription";

const CardContent = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
));
CardContent.displayName = "CardContent";

const CardFooter = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("flex items-center p-6 pt-0", className)}
    {...props}
  />
));
CardFooter.displayName = "CardFooter";

export {
  Card,
  CardHeader,
  CardFooter,
  CardTitle,
  CardDescription,
  CardContent,
};
```

## Sistema de Layout

### Layout Principal

**Archivo**: `app/layout.tsx`

```typescript
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/theme-provider";
import { LanguageProvider } from "@/components/layout/language-provider";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DimSure - Dimensiones de Productos",
  description: "Encuentra las dimensiones exactas de cualquier producto",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <LanguageProvider>
            <div className="min-h-screen bg-background">
              <Navbar />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <Toaster />
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

### Navbar Component

**Archivo**: `components/layout/navbar.tsx`

```typescript
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/features/theme-toggle";
import { LanguageToggle } from "@/components/features/language-toggle";
import { AuthButton } from "@/components/features/auth-button";
import { useAuth } from "@/hooks/useAuth";
import { APP_CONSTANTS } from "@/lib/constants";

export function Navbar() {
  const pathname = usePathname();
  const { isAdmin } = useAuth();

  const navigation = [
    { name: "Inicio", href: "/" },
    { name: "Productos", href: "/search" },
    { name: "Agregar Producto", href: "/add-product" },
    { name: "Blog", href: "/blog" },
    { name: "Contacto", href: "/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <span className="hidden font-bold sm:inline-block">DimSure</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                {item.name}
              </Link>
            ))}
            {isAdmin && (
              <Link
                href="/admin"
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname.startsWith("/admin")
                    ? "text-foreground"
                    : "text-foreground/60"
                )}
              >
                Admin
              </Link>
            )}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Search component would go here */}
          </div>
          <nav className="flex items-center space-x-2">
            <ThemeToggle />
            <LanguageToggle />
            <AuthButton />
          </nav>
        </div>
      </div>
    </header>
  );
}
```

## Componentes de Funcionalidad

### Product Card

**Archivo**: `components/features/product-card.tsx`

```typescript
import Link from "next/link";
import Image from "next/image";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, Eye, Ruler } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getConfidenceBadgeVariant,
  getConfidenceDescription,
} from "@/lib/utils/confidence-calculator";
import type { Product } from "@/lib/types";

interface ProductCardProps {
  product: Product;
  className?: string;
  showActions?: boolean;
  onLike?: (productId: string) => void;
  isLiked?: boolean;
}

export function ProductCard({
  product,
  className,
  showActions = true,
  onLike,
  isLiked = false,
}: ProductCardProps) {
  return (
    <Card
      className={cn(
        "group overflow-hidden transition-all hover:shadow-lg",
        className
      )}
    >
      <Link href={`/product/${product.urlSlug}`}>
        <CardHeader className="p-0">
          <div className="relative aspect-square overflow-hidden">
            <Image
              src={product.images[0] || "/placeholder.jpg"}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            <div className="absolute top-2 right-2">
              <Badge
                variant={getConfidenceBadgeVariant(product.confidence || 0)}
                className="text-xs"
                title={getConfidenceDescription(product.confidence || 0)}
              >
                {product.confidence !== undefined
                  ? `${product.confidence}%`
                  : "N/A"}
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Link>

      <CardContent className="p-4">
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <Link href={`/product/${product.urlSlug}`}>
                <h3 className="font-semibold text-sm truncate hover:text-primary transition-colors">
                  {product.name}
                </h3>
              </Link>
              <p className="text-xs text-muted-foreground truncate">
                {product.brand}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Ruler className="h-3 w-3" />
            <span>
              {product.primaryDimensions.length} ×{" "}
              {product.primaryDimensions.width} ×{" "}
              {product.primaryDimensions.height} cm
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <Heart className="h-3 w-3" />
                <span>{product.likes || 0}</span>
              </div>
              <div className="flex items-center gap-1">
                <Eye className="h-3 w-3" />
                <span>{product.views || 0}</span>
              </div>
            </div>

            {showActions && onLike && (
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  onLike(product.id);
                }}
                className={cn("h-8 w-8 p-0", isLiked && "text-red-500")}
              >
                <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
```

## Sistema Responsivo

### Breakpoints

```typescript
// Tailwind CSS breakpoints
const breakpoints = {
  sm: "640px", // Small devices
  md: "768px", // Medium devices
  lg: "1024px", // Large devices
  xl: "1280px", // Extra large devices
  "2xl": "1536px", // 2X large devices
};

// Hook para detectar breakpoint
export const useBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<string>("sm");

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width >= 1536) setBreakpoint("2xl");
      else if (width >= 1280) setBreakpoint("xl");
      else if (width >= 1024) setBreakpoint("lg");
      else if (width >= 768) setBreakpoint("md");
      else setBreakpoint("sm");
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return breakpoint;
};
```

### Grid System

```typescript
// Sistema de grid responsivo
const GridContainer = ({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) => (
  <div
    className={cn(
      "grid gap-4",
      "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5",
      className
    )}
  >
    {children}
  </div>
);

// Grid para productos
const ProductGrid = ({ products }: { products: Product[] }) => (
  <GridContainer>
    {products.map((product) => (
      <ProductCard key={product.id} product={product} />
    ))}
  </GridContainer>
);
```

## Accesibilidad

### ARIA Labels

```typescript
// Componente con accesibilidad mejorada
const AccessibleButton = ({
  children,
  onClick,
  ariaLabel,
  ...props
}: ButtonProps & { ariaLabel: string }) => (
  <Button
    onClick={onClick}
    aria-label={ariaLabel}
    role="button"
    tabIndex={0}
    onKeyDown={(e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onClick?.(e as any);
      }
    }}
    {...props}
  >
    {children}
  </Button>
);
```

### Focus Management

```typescript
// Hook para manejo de focus
export const useFocusTrap = (ref: RefObject<HTMLElement>) => {
  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const focusableElements = element.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );

    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[
      focusableElements.length - 1
    ] as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Tab") {
        if (e.shiftKey) {
          if (document.activeElement === firstElement) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    element.addEventListener("keydown", handleKeyDown);
    return () => element.removeEventListener("keydown", handleKeyDown);
  }, [ref]);
};
```

## Animaciones

### Transiciones CSS

```css
/* Transiciones suaves */
.transition-all {
  transition: all 0.2s ease-in-out;
}

.transition-colors {
  transition: color 0.2s ease-in-out, background-color 0.2s ease-in-out,
    border-color 0.2s ease-in-out;
}

.transition-transform {
  transition: transform 0.2s ease-in-out;
}

/* Animaciones personalizadas */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fade-in {
  animation: fadeIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateX(-100%);
  }
  to {
    transform: translateX(0);
  }
}

.slide-in {
  animation: slideIn 0.3s ease-out;
}
```

### Framer Motion

```typescript
import { motion } from "framer-motion";

// Componente con animación
const AnimatedCard = ({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3, delay }}
    whileHover={{ scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
  >
    {children}
  </motion.div>
);

// Lista animada
const AnimatedList = ({ items }: { items: any[] }) => (
  <div className="space-y-4">
    {items.map((item, index) => (
      <AnimatedCard key={item.id} delay={index * 0.1}>
        <ProductCard product={item} />
      </AnimatedCard>
    ))}
  </div>
);
```

## Configuración

### Variables de Entorno

```env
# UI Configuration
NEXT_PUBLIC_DEFAULT_THEME=system
NEXT_PUBLIC_ANIMATIONS_ENABLED=true
NEXT_PUBLIC_REDUCED_MOTION=false

# Performance
NEXT_PUBLIC_IMAGE_OPTIMIZATION=true
NEXT_PUBLIC_LAZY_LOADING=true
```

### Configuración de Next.js

```javascript
// next.config.mjs
const nextConfig = {
  images: {
    domains: ["firebasestorage.googleapis.com"],
    formats: ["image/webp", "image/avif"],
  },
  // Nota: `optimizeCss` y otras flags experimentales quedaron obsoletas en Next.js moderno.
};

export default nextConfig;
```

## Testing

### Casos de Prueba

1. **Renderizado de componentes**
2. **Interacciones de usuario**
3. **Responsividad**
4. **Accesibilidad**
5. **Temas claro/oscuro**

### Herramientas de Testing

```typescript
// Test de componente
test("should render product card correctly", () => {
  const product = mockProduct;
  render(<ProductCard product={product} />);

  expect(screen.getByText(product.name)).toBeInTheDocument();
  expect(screen.getByText(product.brand)).toBeInTheDocument();
  expect(screen.getByText(`${product.confidence}%`)).toBeInTheDocument();
});

// Test de accesibilidad
test("should be accessible", () => {
  const { container } = render(<ProductCard product={mockProduct} />);
  expect(container).toBeAccessible();
});

// Test de responsividad
test("should be responsive", () => {
  render(<ProductCard product={mockProduct} />);

  // Simular pantalla móvil
  window.innerWidth = 375;
  window.dispatchEvent(new Event("resize"));

  expect(screen.getByRole("img")).toHaveClass("object-cover");
});
```

## Monitoreo

### Métricas a Seguir

1. **Core Web Vitals**: LCP, FID, CLS
2. **Tiempo de carga**: FCP, TTI
3. **Interacciones**: Clicks, hovers, scrolls
4. **Errores de UI**: JavaScript errors, CSS issues
5. **Accesibilidad**: Violaciones de WCAG

### Herramientas de Monitoreo

- **Lighthouse**: Performance y accesibilidad
- **Web Vitals**: Métricas de rendimiento
- **axe-core**: Testing de accesibilidad
- **Sentry**: Error tracking

## Troubleshooting

### Problemas Comunes

1. **Componentes no se renderizan**

   - Verificar imports de componentes
   - Comprobar configuración de Tailwind
   - Revisar errores de TypeScript

2. **Estilos no se aplican**

   - Verificar clases de Tailwind
   - Comprobar configuración de CSS
   - Revisar conflictos de estilos

3. **Tema no cambia**
   - Verificar ThemeProvider
   - Comprobar localStorage
   - Revisar variables CSS

## Consideraciones Futuras

### Mejoras Planificadas

1. **Design Tokens**: Sistema de tokens más robusto
2. **Component Library**: Más componentes especializados
3. **Micro-interactions**: Animaciones más sofisticadas
4. **Dark Mode**: Mejoras en tema oscuro
5. **Mobile First**: Optimización para móviles

### Optimizaciones

1. **Bundle Splitting**: Código más eficiente
2. **Image Optimization**: Mejor rendimiento de imágenes
3. **CSS-in-JS**: Estilos más dinámicos
4. **Progressive Enhancement**: Mejora gradual
