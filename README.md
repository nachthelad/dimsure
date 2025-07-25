# 📏 DimSure

**La base de datos colaborativa de dimensiones de productos** | **The collaborative database of product dimensions**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/your-username/dimsure)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-13-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Firebase](https://img.shields.io/badge/Firebase-9-orange)](https://firebase.google.com/)

---

## 🇪🇸 Español

### ¿Qué es DimSure?

DimSure es una plataforma comunitaria donde cualquier persona puede consultar, agregar y verificar las dimensiones de productos. Su objetivo es ayudar a consumidores, empresas y profesionales de la logística a encontrar medidas precisas y confiables para optimizar envíos, embalajes y almacenamiento.

### 🎯 Características Principales

- **📏 Base de datos colaborativa**: Consulta y contribuye con dimensiones verificadas
- **🔍 Búsqueda avanzada**: Encuentra productos por nombre, marca, categoría o SKU
- **⭐ Sistema de confianza**: Algoritmo dinámico que evalúa la calidad de la información
- **🌍 Multilingüe**: Disponible en español e inglés
- **📱 Responsive**: Funciona perfectamente en móviles y desktop
- **🔐 Autenticación segura**: Login con Google o email/password
- **⚡ Tiempo real**: Actualizaciones instantáneas de datos

### 🚀 Tecnologías Utilizadas

- **Frontend**: Next.js 13, React 18, TypeScript
- **UI**: Tailwind CSS, Shadcn/ui, Radix UI
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Deployment**: Vercel, Firebase Hosting
- **Testing**: Jest, React Testing Library, Cypress

### 📦 Instalación

```bash
# Clonar el repositorio
git clone https://github.com/your-username/dimsure.git
cd dimsure

# Instalar dependencias
npm install

# Configurar variables de entorno
cp .env.example .env.local

# Ejecutar en desarrollo
npm run dev
```

### 🔧 Configuración

1. **Crear proyecto en Firebase**:

   - Firestore Database
   - Authentication (Google + Email/Password)
   - Storage para imágenes

2. **Configurar variables de entorno**:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
```

3. **Configurar reglas de Firestore** (ver `firestore.rules`)

### 📚 Documentación

- [Sistema de Autenticación](docs/AUTHENTICATION_SYSTEM.md)
- [Gestión de Productos](docs/PRODUCT_MANAGEMENT_SYSTEM.md)
- [Sistema de Confianza](docs/CONFIDENCE_SYSTEM.md)
- [Panel de Administración](docs/ADMIN_PANEL_SYSTEM.md)
- [Sistema de Búsqueda](docs/SEARCH_SYSTEM.md)
- [Sistema de Disputas](docs/DISPUTE_SYSTEM.md)
- [Testing](docs/TESTING_SYSTEM.md)
- [Deployment](docs/DEPLOYMENT_SYSTEM.md)

### 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

### 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE](LICENSE) para detalles.

---

## 🇺🇸 English

### What is DimSure?

DimSure is a collaborative platform where anyone can consult, add, and verify product dimensions. Its goal is to help consumers, businesses, and logistics professionals find precise and reliable measurements to optimize shipping, packaging, and storage.

### 🎯 Key Features

- **📏 Collaborative database**: Query and contribute verified dimensions
- **🔍 Advanced search**: Find products by name, brand, category, or SKU
- **⭐ Trust system**: Dynamic algorithm that evaluates information quality
- **🌍 Multilingual**: Available in Spanish and English
- **📱 Responsive**: Works perfectly on mobile and desktop
- **🔐 Secure authentication**: Login with Google or email/password
- **⚡ Real-time**: Instant data updates

### 🚀 Technologies Used

- **Frontend**: Next.js 13, React 18, TypeScript
- **UI**: Tailwind CSS, Shadcn/ui, Radix UI
- **Backend**: Firebase (Firestore, Auth, Storage)
- **Deployment**: Vercel, Firebase Hosting
- **Testing**: Jest, React Testing Library, Cypress

### 📦 Installation

```bash
# Clone the repository
git clone https://github.com/your-username/dimsure.git
cd dimsure

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Run in development
npm run dev
```

### 🔧 Configuration

1. **Create Firebase project**:

   - Firestore Database
   - Authentication (Google + Email/Password)
   - Storage for images

2. **Configure environment variables**:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_ADMIN_EMAIL=admin@example.com
```

3. **Configure Firestore rules** (see `firestore.rules`)

### 📚 Documentation

- [Authentication System](docs/AUTHENTICATION_SYSTEM.md)
- [Product Management](docs/PRODUCT_MANAGEMENT_SYSTEM.md)
- [Confidence System](docs/CONFIDENCE_SYSTEM.md)
- [Admin Panel](docs/ADMIN_PANEL_SYSTEM.md)
- [Search System](docs/SEARCH_SYSTEM.md)
- [Dispute System](docs/DISPUTE_SYSTEM.md)
- [Testing](docs/TESTING_SYSTEM.md)
- [Deployment](docs/DEPLOYMENT_SYSTEM.md)

### 🤝 Contributing

1. Fork the project
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🌐 Live Demo

**Website**: [dimsure.online](https://dimsure.online)

**Admin Demo**: [admin.dimsure.online](https://admin.dimsure.online)

---

## 📊 Project Status

![GitHub last commit](https://img.shields.io/github/last-commit/your-username/dimsure)
![GitHub issues](https://img.shields.io/github/issues/your-username/dimsure)
![GitHub pull requests](https://img.shields.io/github/issues-pr/your-username/dimsure)
![GitHub stars](https://img.shields.io/github/stars/your-username/dimsure)

---

## 📞 Contact

- **Website**: [dimsure.online](https://dimsure.online)
- **Email**: contact@dimsure.online
- **Twitter**: [@dimsure](https://twitter.com/dimsure)
- **Discord**: [DimSure Community](https://discord.gg/dimsure)

---

<div align="center">

**Made with ❤️ by the DimSure Community**

[![Contributors](https://img.shields.io/github/contributors/your-username/dimsure)](https://github.com/your-username/dimsure/graphs/contributors)

</div>
