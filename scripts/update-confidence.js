const { initializeApp } = require("firebase/app");
const {
  getFirestore,
  collection,
  getDocs,
  doc,
  updateDoc,
} = require("firebase/firestore");

// Configuración de Firebase (ajusta según tu configuración)
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Función para calcular la confianza de un producto
function calculateProductConfidence(product, disputeInfo = null) {
  const now = new Date();
  const createdAt = product.createdAt?.toDate?.() || new Date(0);
  const lastModified = product.lastModified?.toDate?.() || createdAt;

  // Factor base: confianza inicial
  const baseConfidence = 85;

  // Factor 1: Likes (0-10 puntos)
  const likesScore = calculateLikesScore(product.likes || 0);

  // Factor 2: Views (0-5 puntos)
  const viewsScore = calculateViewsScore(product.views || 0);

  // Factor 3: Ediciones (0-10 puntos)
  const editsScore = calculateEditsScore(product, createdAt, lastModified);

  // Factor 4: Disputas (-15 a +5 puntos)
  const disputesScore = calculateDisputesScore(disputeInfo);

  // Factor 5: Antigüedad y estabilidad (0-10 puntos)
  const ageScore = calculateAgeScore(createdAt, lastModified, now);

  // Cálculo del total
  const totalScore = Math.max(
    0,
    Math.min(
      100,
      baseConfidence +
        likesScore +
        viewsScore +
        editsScore +
        disputesScore +
        ageScore
    )
  );

  return Math.round(totalScore);
}

function calculateLikesScore(likes) {
  if (likes === 0) return 0;
  if (likes <= 2) return 2;
  if (likes <= 5) return 4;
  if (likes <= 10) return 6;
  if (likes <= 20) return 8;
  return 10;
}

function calculateViewsScore(views) {
  if (views === 0) return 0;
  if (views <= 10) return 1;
  if (views <= 50) return 2;
  if (views <= 100) return 3;
  if (views <= 500) return 4;
  return 5;
}

function calculateEditsScore(product, createdAt, lastModified) {
  const hasCommunityEdits =
    product.lastModifiedBy && product.lastModifiedBy !== product.createdBy;

  const daysSinceLastEdit =
    (Date.now() - lastModified.getTime()) / (1000 * 60 * 60 * 24);
  const recentlyEdited = daysSinceLastEdit <= 30;

  const hasBeenEdited = lastModified.getTime() > createdAt.getTime();

  let score = 0;

  if (hasCommunityEdits) score += 5;
  if (recentlyEdited) score += 3;
  if (hasBeenEdited) score += 2;

  return Math.min(10, score);
}

function calculateDisputesScore(disputeInfo) {
  if (!disputeInfo) return 0;

  let score = 0;

  score -= disputeInfo.openDisputes * 3;
  score -= disputeInfo.resolvedDisputes * 2;
  score += disputeInfo.rejectedDisputes * 1;

  return Math.max(-15, Math.min(5, score));
}

function calculateAgeScore(createdAt, lastModified, now) {
  const daysSinceCreation =
    (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  const daysSinceLastEdit =
    (now.getTime() - lastModified.getTime()) / (1000 * 60 * 60 * 24);

  let score = 0;

  if (daysSinceCreation >= 365) score += 4;
  else if (daysSinceCreation >= 180) score += 3;
  else if (daysSinceCreation >= 90) score += 2;
  else if (daysSinceCreation >= 30) score += 1;

  if (daysSinceLastEdit >= 90) score += 3;
  else if (daysSinceLastEdit >= 30) score += 2;
  else if (daysSinceLastEdit >= 7) score += 1;

  const sameDay =
    Math.abs(createdAt.getTime() - lastModified.getTime()) <
    1000 * 60 * 60 * 24;
  if (sameDay) score += 3;

  return Math.min(10, score);
}

// Función principal para actualizar la confianza
async function updateAllProductsConfidence() {
  try {
    console.log("🚀 Iniciando actualización de confianza de productos...");

    // Obtener todos los productos
    const productsSnapshot = await getDocs(collection(db, "products"));
    const products = productsSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    console.log(`📦 Encontrados ${products.length} productos para actualizar`);

    let updated = 0;
    let errors = 0;
    let totalChange = 0;

    for (const product of products) {
      try {
        const oldConfidence = product.confidence || 85;
        const newConfidence = calculateProductConfidence(product);

        // Solo actualizar si hay cambios
        if (oldConfidence !== newConfidence) {
          // Actualizar el producto
          await updateDoc(doc(db, "products", product.id), {
            confidence: newConfidence,
          });

          const change = newConfidence - oldConfidence;
          totalChange += change;

          console.log(
            `✅ ${
              product.name || product.id
            }: ${oldConfidence}% → ${newConfidence}% (${
              change > 0 ? "+" : ""
            }${change})`
          );
          updated++;
        } else {
          console.log(
            `⏭️  ${product.name || product.id}: ${oldConfidence}% (sin cambios)`
          );
        }
      } catch (error) {
        console.error(`❌ Error actualizando ${product.id}:`, error.message);
        errors++;
      }
    }

    const averageChange = Math.round(totalChange / updated);

    const noChanges = products.length - updated - errors;

    console.log("\n📊 Resumen de la actualización:");
    console.log(`   Total productos: ${products.length}`);
    console.log(`   Actualizados: ${updated}`);
    console.log(`   Sin cambios: ${noChanges}`);
    console.log(`   Errores: ${errors}`);
    console.log(
      `   Cambio promedio: ${averageChange > 0 ? "+" : ""}${averageChange}%`
    );

    console.log("\n✅ Actualización completada exitosamente!");
  } catch (error) {
    console.error("❌ Error en la actualización:", error);
  }
}

// Ejecutar el script
if (require.main === module) {
  updateAllProductsConfidence()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error("Error fatal:", error);
      process.exit(1);
    });
}

module.exports = { updateAllProductsConfidence, calculateProductConfidence };
