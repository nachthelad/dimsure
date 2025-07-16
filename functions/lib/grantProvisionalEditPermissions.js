"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.grantProvisionalEditPermissions = void 0;
const functions = __importStar(require("firebase-functions/v1"));
const admin = __importStar(require("firebase-admin"));
admin.initializeApp();
const db = admin.firestore();
exports.grantProvisionalEditPermissions = functions.pubsub
    .schedule("every 1 hours")
    .onRun(async (_context) => {
    const now = admin.firestore.Timestamp.now();
    const disputesSnap = await db
        .collection("disputes")
        .where("status", "==", "in_review")
        .where("resolutionPendingAt", ">", 0)
        .get();
    for (const doc of disputesSnap.docs) {
        const dispute = doc.data();
        if (dispute.provisionalEditor)
            continue; // Ya tiene permiso
        const pendingAt = dispute.resolutionPendingAt;
        if (!pendingAt)
            continue;
        // 7 días en milisegundos
        // const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
        // Para testing, usar 1 minuto (60 * 1000 ms)
        const sevenDaysMs = 1 * 60 * 1000; // 1 minuto para pruebas
        const nowMs = now.toMillis();
        const pendingAtMs = pendingAt.toMillis ? pendingAt.toMillis() : new Date(pendingAt).getTime();
        if (nowMs - pendingAtMs < sevenDaysMs)
            continue; // No pasaron 7 días
        // Buscar producto
        const productSnap = await db.collection("products").doc(dispute.productSku).get();
        if (!productSnap.exists)
            continue;
        const product = productSnap.data();
        if (!product)
            continue;
        // Si el producto fue modificado después de resolutionPendingAt, no dar permiso
        const lastModified = product.lastModified?.toMillis
            ? product.lastModified.toMillis()
            : new Date(product.lastModified).getTime();
        if (lastModified > pendingAtMs)
            continue;
        // Otorgar permiso
        await doc.ref.update({
            provisionalEditor: dispute.createdBy,
        });
        // (Opcional) Notificar al usuario
        await db.collection("notifications").add({
            userId: dispute.createdBy,
            type: "provisional_edit",
            productId: dispute.productSku,
            disputeId: doc.id,
            message: {
                en: `You can now edit the product "${product.name}" as your dispute was not addressed in time.`,
                es: `Ahora puedes editar el producto "${product.name}" porque tu disputa no fue resuelta a tiempo.`,
            },
            read: false,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            status: "Granted",
        });
    }
    return null;
});
