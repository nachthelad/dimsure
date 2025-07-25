import type { Product } from "../types";

export interface ConfidenceFactors {
  baseConfidence: number;
  likesScore: number;
  viewsScore: number;
  editsScore: number;
  disputesScore: number;
  ageScore: number;
  totalScore: number;
}

export interface DisputeInfo {
  totalDisputes: number;
  resolvedDisputes: number;
  rejectedDisputes: number;
  openDisputes: number;
}

/**
 * Calcula la confianza de un producto basada en múltiples factores
 * @param product - El producto a evaluar
 * @param disputeInfo - Información sobre disputas del producto
 * @returns Objeto con la confianza calculada y los factores individuales
 */
export function calculateProductConfidence(
  product: Product,
  disputeInfo?: DisputeInfo
): ConfidenceFactors {
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

  return {
    baseConfidence,
    likesScore,
    viewsScore,
    editsScore,
    disputesScore,
    ageScore,
    totalScore: Math.round(totalScore),
  };
}

/**
 * Calcula el score basado en likes
 * Máximo 10 puntos
 */
function calculateLikesScore(likes: number): number {
  if (likes === 0) return 0;
  if (likes <= 2) return 2;
  if (likes <= 5) return 4;
  if (likes <= 10) return 6;
  if (likes <= 20) return 8;
  return 10; // 20+ likes
}

/**
 * Calcula el score basado en visualizaciones
 * Máximo 5 puntos
 */
function calculateViewsScore(views: number): number {
  if (views === 0) return 0;
  if (views <= 10) return 1;
  if (views <= 50) return 2;
  if (views <= 100) return 3;
  if (views <= 500) return 4;
  return 5; // 500+ views
}

/**
 * Calcula el score basado en ediciones
 * Máximo 10 puntos
 */
function calculateEditsScore(
  product: Product,
  createdAt: Date,
  lastModified: Date
): number {
  // Si el producto fue editado por alguien diferente al creador
  const hasCommunityEdits =
    product.lastModifiedBy && product.lastModifiedBy !== product.createdBy;

  // Si ha sido editado recientemente (últimos 30 días)
  const daysSinceLastEdit =
    (Date.now() - lastModified.getTime()) / (1000 * 60 * 60 * 24);
  const recentlyEdited = daysSinceLastEdit <= 30;

  // Si ha sido editado después de la creación
  const hasBeenEdited = lastModified.getTime() > createdAt.getTime();

  let score = 0;

  if (hasCommunityEdits) score += 5; // Edición por la comunidad
  if (recentlyEdited) score += 3; // Edición reciente
  if (hasBeenEdited) score += 2; // Ha sido editado al menos una vez

  return Math.min(10, score);
}

/**
 * Calcula el score basado en disputas
 * Rango: -15 a +5 puntos
 */
function calculateDisputesScore(disputeInfo?: DisputeInfo): number {
  if (!disputeInfo) return 0;

  let score = 0;

  // Penalización por disputas abiertas
  score -= disputeInfo.openDisputes * 3;

  // Penalización por disputas resueltas (indica que había problemas)
  score -= disputeInfo.resolvedDisputes * 2;

  // Bonus por disputas rechazadas (la comunidad validó que el producto estaba bien)
  score += disputeInfo.rejectedDisputes * 1;

  return Math.max(-15, Math.min(5, score));
}

/**
 * Calcula el score basado en antigüedad y estabilidad
 * Máximo 10 puntos
 */
function calculateAgeScore(
  createdAt: Date,
  lastModified: Date,
  now: Date
): number {
  const daysSinceCreation =
    (now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24);
  const daysSinceLastEdit =
    (now.getTime() - lastModified.getTime()) / (1000 * 60 * 60 * 24);

  let score = 0;

  // Bonus por antigüedad (productos más antiguos son más confiables)
  if (daysSinceCreation >= 365) score += 4; // 1+ años
  else if (daysSinceCreation >= 180) score += 3; // 6+ meses
  else if (daysSinceCreation >= 90) score += 2; // 3+ meses
  else if (daysSinceCreation >= 30) score += 1; // 1+ mes

  // Bonus por estabilidad (no ha sido editado recientemente)
  if (daysSinceLastEdit >= 90) score += 3; // 3+ meses sin cambios
  else if (daysSinceLastEdit >= 30) score += 2; // 1+ mes sin cambios
  else if (daysSinceLastEdit >= 7) score += 1; // 1+ semana sin cambios

  // Bonus por consistencia (creado y editado en la misma fecha = datos iniciales buenos)
  const sameDay =
    Math.abs(createdAt.getTime() - lastModified.getTime()) <
    1000 * 60 * 60 * 24;
  if (sameDay) score += 3;

  return Math.min(10, score);
}

/**
 * Obtiene el color del badge de confianza basado en el valor
 */
export function getConfidenceBadgeVariant(
  confidence: number
): "default" | "secondary" | "destructive" {
  if (confidence >= 90) return "default"; // Verde
  if (confidence >= 70) return "secondary"; // Gris
  return "destructive"; // Rojo
}

/**
 * Obtiene la descripción de la confianza
 */
export function getConfidenceDescription(confidence: number): string {
  if (confidence >= 90) return "Muy alta confianza";
  if (confidence >= 80) return "Alta confianza";
  if (confidence >= 70) return "Confianza moderada";
  if (confidence >= 60) return "Confianza baja";
  return "Confianza muy baja";
}
