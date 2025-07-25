# Sistema de Autenticación

## Descripción General

El sistema de autenticación utiliza Firebase Authentication con proveedores múltiples y gestión de roles de usuario. Proporciona autenticación segura, gestión de sesiones y control de acceso basado en roles.

## Arquitectura

### Componentes Principales

1. **Firebase Authentication**: Proveedor principal de autenticación
2. **Hook useAuth**: Hook personalizado para gestión de estado de autenticación
3. **Context Providers**: Gestión de estado global de usuario
4. **Middleware**: Protección de rutas y redirecciones

### Proveedores de Autenticación

- **Google**: Autenticación con cuenta de Google
- **Email/Password**: Registro e inicio de sesión tradicional
- **Anónimo**: Sesiones temporales para usuarios no registrados

## Implementación

### Hook useAuth

**Archivo**: `hooks/useAuth.ts`

```typescript
interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  loading: boolean;
}

const { user, isLoggedIn, isAdmin, loading } = useAuth();
```

**Funcionalidades**:

- Estado de autenticación en tiempo real
- Detección automática de roles de administrador
- Gestión de sesiones persistentes
- Redirección automática según estado

### Gestión de Usuarios

**Archivo**: `lib/services/user-service.ts`

```typescript
// Crear perfil de usuario
await createUserProfile(userId, userData);

// Obtener perfil de usuario
const profile = await getUserProfile(userId);

// Actualizar perfil
await updateUserProfile(userId, updates);
```

### Middleware de Protección

**Archivo**: `middleware.ts`

```typescript
// Protección de rutas administrativas
if (pathname.startsWith("/admin") && !isAdmin) {
  return NextResponse.redirect(new URL("/login", request.url));
}

// Protección de rutas privadas
if (pathname.startsWith("/profile") && !isLoggedIn) {
  return NextResponse.redirect(new URL("/login", request.url));
}
```

## Roles y Permisos

### Roles Disponibles

1. **Usuario Anónimo**

   - Ver productos públicos
   - Buscar productos
   - Navegar por el sitio

2. **Usuario Registrado**

   - Todo lo anterior +
   - Crear productos
   - Editar productos propios
   - Reportar disputas
   - Dar like a productos

3. **Administrador**
   - Todo lo anterior +
   - Acceso al panel de administración
   - Moderar productos
   - Gestionar disputas
   - Actualizar confianza de productos
   - Gestionar usuarios

### Configuración de Roles

Los roles se configuran en Firebase Authentication y se verifican mediante:

```typescript
// Verificación de admin
const isAdmin = user?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;

// Verificación de permisos
const canEditProduct = product.createdBy === user?.uid || isAdmin;
```

## Flujos de Autenticación

### Registro de Usuario

1. Usuario hace clic en "Registrarse"
2. Se abre modal de registro con opciones:
   - Google (OAuth)
   - Email/Password
3. Se crea cuenta en Firebase Auth
4. Se crea perfil en Firestore
5. Se redirige al usuario

### Inicio de Sesión

1. Usuario hace clic en "Iniciar Sesión"
2. Se abre modal de login
3. Se autentica con Firebase
4. Se carga perfil del usuario
5. Se actualiza estado global

### Cierre de Sesión

1. Usuario hace clic en "Cerrar Sesión"
2. Se cierra sesión en Firebase
3. Se limpia estado local
4. Se redirige a página principal

## Seguridad

### Medidas Implementadas

1. **Validación de Tokens**: Verificación automática de tokens JWT
2. **Protección de Rutas**: Middleware que verifica permisos
3. **Validación de Datos**: Sanitización de inputs de usuario
4. **Reglas de Firestore**: Reglas de seguridad en base de datos

### Reglas de Firestore

```javascript
// Ejemplo de reglas de seguridad
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Usuarios pueden leer productos públicos
    match /products/{productId} {
      allow read: if true;
      allow write: if request.auth != null &&
        (resource.data.createdBy == request.auth.uid ||
         request.auth.token.admin == true);
    }

    // Solo admins pueden acceder a configuración
    match /admin/{document=**} {
      allow read, write: if request.auth.token.admin == true;
    }
  }
}
```

## Manejo de Errores

### Errores Comunes

1. **Usuario no autenticado**

   - Redirección automática a login
   - Mensaje informativo

2. **Permisos insuficientes**

   - Bloqueo de acceso
   - Explicación del error

3. **Token expirado**
   - Renovación automática
   - Re-autenticación si es necesario

### Logging

```typescript
// Log de eventos de autenticación
console.log("User login:", { userId, email, timestamp });
console.log("Admin access:", { userId, route, timestamp });
```

## Configuración

### Variables de Entorno

```env
# Firebase Config
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_domain
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id

# Admin Configuration
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
```

### Configuración de Firebase

```typescript
// firebase.ts
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  // ... otras configuraciones
};
```

## Testing

### Casos de Prueba

1. **Registro exitoso**
2. **Login con credenciales válidas**
3. **Acceso denegado a rutas protegidas**
4. **Renovación de tokens**
5. **Cierre de sesión**

### Herramientas de Testing

- **Jest**: Testing unitario
- **React Testing Library**: Testing de componentes
- **Firebase Emulator**: Testing local

## Monitoreo

### Métricas a Seguir

1. **Tasa de registro**: Usuarios que completan el registro
2. **Tasa de retención**: Usuarios que regresan
3. **Errores de autenticación**: Fallos en login/registro
4. **Accesos administrativos**: Uso del panel de admin

### Alertas

- Múltiples intentos fallidos de login
- Accesos no autorizados a rutas admin
- Errores de configuración de Firebase

## Troubleshooting

### Problemas Comunes

1. **Usuario no puede registrarse**

   - Verificar configuración de Firebase
   - Revisar reglas de Firestore
   - Comprobar variables de entorno

2. **No se detecta rol de admin**

   - Verificar email en variables de entorno
   - Comprobar configuración de Firebase Auth
   - Revisar reglas de Firestore

3. **Sesión se pierde frecuentemente**
   - Verificar configuración de persistencia
   - Revisar configuración de tokens
   - Comprobar reglas de CORS

## Consideraciones Futuras

### Mejoras Planificadas

1. **Autenticación Multi-Factor (MFA)**
2. **Sistema de invitaciones**
3. **Gestión de roles más granular**
4. **Integración con SSO empresarial**
5. **Auditoría de accesos**

### Optimizaciones

1. **Caché de perfiles de usuario**
2. **Lazy loading de datos de usuario**
3. **Compresión de tokens**
4. **Sincronización offline**
