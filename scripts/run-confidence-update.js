#!/usr/bin/env node

// Cargar variables de entorno desde .env.local
require("dotenv").config({ path: ".env.local" });

const { updateAllProductsConfidence } = require("./update-confidence");

console.log("🚀 Iniciando actualización de confianza de productos...");
console.log("📋 Configuración:");
console.log(`   - Project ID: ${process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID}`);
console.log(
  `   - Auth Domain: ${process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN}`
);
console.log("");

// Verificar configuración
if (!process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID) {
  console.error(
    "❌ Error: NEXT_PUBLIC_FIREBASE_PROJECT_ID no está configurado"
  );
  process.exit(1);
}

// Ejecutar actualización
updateAllProductsConfidence()
  .then(() => {
    console.log("\n✅ Script completado exitosamente!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("\n❌ Error fatal:", error);
    process.exit(1);
  });
