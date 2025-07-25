"use client";

import { useEffect, useState } from "react";
import { useRouter, notFound, useParams } from "next/navigation";
import {
  Clock,
  ThumbsUp,
  ThumbsDown,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Settings,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/components/layout/language-provider";
import {
  getDisputes,
  voteOnDispute,
  updateDisputeStatus,
  getProduct,
} from "@/lib/firestore";
import { APP_CONSTANTS } from "@/lib/constants";
import { toast } from "@/hooks/use-toast";
import type { Dispute } from "@/lib/types";

export default function DisputeDetailPage() {
  const { isLoggedIn, loading, user, userData } = useAuth();
  const { t } = useLanguage();
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [dispute, setDispute] = useState<Dispute | null>(null);
  const [disputeIndex, setDisputeIndex] = useState<number | null>(null);
  const [disputesLoading, setDisputesLoading] = useState(true);
  const [product, setProduct] = useState<any>(null);
  const [canProvisionalEdit, setCanProvisionalEdit] = useState(false);
  const [voteLoading, setVoteLoading] = useState<"up" | "down" | null>(null);

  // Check if current user is admin
  const isAdmin =
    userData?.email === APP_CONSTANTS.ADMIN_EMAIL ||
    userData?.email === APP_CONSTANTS.DEBUG_AUTHORIZED_EMAIL;

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login?redirect=/disputes");
    }
  }, [isLoggedIn, loading, router]);

  useEffect(() => {
    if (isLoggedIn && params?.id) {
      loadDispute();
    }
    // eslint-disable-next-line
  }, [isLoggedIn, params?.id]);

  useEffect(() => {
    if (dispute?.productSku) {
      getProduct(dispute.productSku).then(setProduct);
    }
  }, [dispute]);

  useEffect(() => {
    if (!dispute || !product || !user) {
      setCanProvisionalEdit(false);
      return;
    }
    if (dispute.status === "in_review" && dispute.resolutionPendingAt) {
      const pendingAtMs = dispute.resolutionPendingAt.toMillis
        ? dispute.resolutionPendingAt.toMillis()
        : new Date(dispute.resolutionPendingAt).getTime();
      const lastModifiedMs = product.lastModified?.toMillis
        ? product.lastModified.toMillis()
        : new Date(product.lastModified).getTime();
      const now = Date.now();
      const gracePeriodMs = 7 * 24 * 60 * 60 * 1000; // 7 días
      // Si el producto fue editado después de la disputa, nadie puede editar
      if (lastModifiedMs > pendingAtMs) {
        setCanProvisionalEdit(false);
        return;
      }
      // Durante los primeros 7 días, solo el creador del producto puede editar
      if (now - pendingAtMs < gracePeriodMs) {
        if (product.createdBy === user.uid) {
          setCanProvisionalEdit(true);
          return;
        }
      } else {
        // Pasados los 7 días, solo el creador de la disputa puede editar
        if (dispute.createdBy === user.uid) {
          setCanProvisionalEdit(true);
          return;
        }
      }
    }
    setCanProvisionalEdit(false);
  }, [dispute, product, user]);

  const loadDispute = async () => {
    try {
      setDisputesLoading(true);
      // getDisputes trae todas, buscamos la que corresponde
      const disputesData = await getDisputes();
      // Ordenar por fecha ascendente (más vieja primero)
      const disputesByOldest = [...(disputesData as Dispute[])].sort((a, b) => {
        // Si falta createdAt, lo mandamos al final
        if (!a.createdAt && !b.createdAt) return 0;
        if (!a.createdAt) return 1;
        if (!b.createdAt) return -1;
        const aTime = a.createdAt?.toDate
          ? a.createdAt.toDate()
          : new Date(a.createdAt);
        const bTime = b.createdAt?.toDate
          ? b.createdAt.toDate()
          : new Date(b.createdAt);
        return aTime.getTime() - bTime.getTime();
      });
      const idx = disputesByOldest.findIndex((d) => d.id === params.id);
      if (idx === -1) {
        notFound();
        return;
      }
      setDispute(disputesByOldest[idx] || null);
      setDisputeIndex(idx);
    } catch (error) {
      notFound();
    } finally {
      setDisputesLoading(false);
    }
  };

  const handleVote = async (disputeId: string, voteType: "up" | "down") => {
    if (!user) return;
    setVoteLoading(voteType);
    // Actualización optimista de votos
    setDispute((prev) => {
      if (!prev) return prev;
      const prevVotes = prev.votes || {
        upvotes: 0,
        downvotes: 0,
        userVotes: {},
      };
      const userVotes = { ...prevVotes.userVotes };
      const previousVote = userVotes[user.uid];
      let upvotes = prevVotes.upvotes;
      let downvotes = prevVotes.downvotes;
      // Quitar voto anterior
      if (previousVote === "up") upvotes = Math.max(0, upvotes - 1);
      if (previousVote === "down") downvotes = Math.max(0, downvotes - 1);
      // Agregar nuevo voto
      if (previousVote !== voteType) {
        if (voteType === "up") upvotes += 1;
        else downvotes += 1;
        userVotes[user.uid] = voteType;
      } else {
        // Si hace click en el mismo, lo quita
        delete userVotes[user.uid];
      }
      return {
        ...prev,
        votes: {
          ...prevVotes,
          upvotes,
          downvotes,
          userVotes,
        },
      };
    });
    try {
      await voteOnDispute(disputeId, user.uid, voteType);
      // No recargues toda la disputa
    } catch (error) {
      toast({
        title: "Error",
        description:
          "No se pudo registrar tu voto. Por favor, intenta de nuevo.",
        variant: "destructive",
      });
    } finally {
      setVoteLoading(null);
    }
  };

  const handleStatusChange = async (disputeId: string, newStatus: string) => {
    if (!isAdmin) return;
    try {
      await updateDisputeStatus(disputeId, newStatus, {
        action: `Changed status to ${newStatus}`,
        reason: "Admin action",
        resolvedBy: user?.uid || "unknown",
      });
      loadDispute();
    } catch (error) {
      alert("Failed to update dispute status. Please try again.");
    }
  };

  const getStatusIcon = (status?: Dispute["status"]) => {
    switch (status) {
      case "open":
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case "in_review":
        return <Clock className="h-4 w-4 text-blue-500" />;
      case "resolved":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "rejected":
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status?: Dispute["status"]) => {
    switch (status) {
      case "open":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "in_review":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "resolved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getDisputeTypeColor = (type?: Dispute["disputeType"]) => {
    switch (type) {
      case "measurement":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "description":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "category":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "other":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  if (loading || disputesLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <div className="mb-4">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-96" />
        </div>
        <Skeleton className="h-10 w-32 mb-8" />
        <Skeleton className="h-40 w-full my-8" />
      </div>
    );
  }

  if (!isLoggedIn || !dispute) {
    return null; // O notFound()
  }

  const readableId =
    disputeIndex !== null
      ? `#${(disputeIndex + 1).toString().padStart(3, "0")}`
      : "";

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <Button
        variant="outline"
        className="mb-6"
        onClick={() => router.push("/disputes")}
      >
        ← {t("common.backToList")}
      </Button>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            {readableId} {dispute.title || t("disputes.dispute.untitled")}
          </CardTitle>
          <div className="flex flex-wrap gap-2 mt-2">
            <Badge className={getStatusColor(dispute.status)}>
              {getStatusIcon(dispute.status)}
              <span className="ml-1 capitalize">
                {dispute.status?.replace("_", " ") || "unknown"}
              </span>
            </Badge>
            <Badge
              variant="outline"
              className={getDisputeTypeColor(dispute.disputeType)}
            >
              {dispute.disputeType || "Other"}
            </Badge>
            {dispute.status === "in_review" && dispute.resolutionPendingAt && (
              <Badge
                variant="destructive"
                className="bg-orange-100 text-orange-800 border-orange-200"
              >
                {t("disputes.dispute.pendingCreatorAction") ||
                  "Pending creator action"}
              </Badge>
            )}
            {canProvisionalEdit && (
              <Badge
                variant="default"
                className="bg-green-100 text-green-800 border-green-200"
              >
                {t("disputes.dispute.youCanEditProduct") ||
                  "You can edit the product"}
              </Badge>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground mb-2">
            {t("disputes.dispute.product")}{" "}
            <span className="font-mono">{dispute.productSku || "N/A"}</span> -{" "}
            {dispute.productName || t("disputes.dispute.unknownProduct")}
          </p>
          <p className="text-muted-foreground mb-4">
            {dispute.description || t("disputes.dispute.noDescription")}
          </p>
          {dispute.evidence &&
            (dispute.evidence.currentValue ||
              dispute.evidence.proposedValue ||
              dispute.evidence.reasoning ||
              dispute.evidence.imageUrl) && (
              <div className="bg-muted/50 p-3 rounded-lg mb-4">
                {(dispute.disputeType === "measurement" ||
                  dispute.disputeType === "weight") && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                    {dispute.evidence.currentValue && (
                      <div>
                        <span className="font-medium">
                          {t("disputes.dispute.evidence.current")}{" "}
                        </span>
                        <span className="font-mono">
                          {dispute.evidence.currentValue}
                        </span>
                      </div>
                    )}
                    {dispute.evidence.proposedValue && (
                      <div>
                        <span className="font-medium">
                          {t("disputes.dispute.evidence.proposed")}{" "}
                        </span>
                        <span className="font-mono">
                          {dispute.evidence.proposedValue}
                        </span>
                      </div>
                    )}
                  </div>
                )}
                {dispute.evidence.reasoning && (
                  <div className="mt-2 text-sm">
                    <span className="font-medium">
                      {t("disputes.dispute.evidence.evidence")}{" "}
                    </span>
                    {dispute.evidence.reasoning}
                  </div>
                )}
                {dispute.evidence.imageUrl && (
                  <div className="mt-3">
                    <p className="text-sm font-medium mb-2">
                      {t("disputes.dispute.evidence.evidenceImage")}
                    </p>
                    <img
                      src={dispute.evidence.imageUrl}
                      alt="Evidence"
                      className="max-w-full max-h-48 rounded-lg object-cover border"
                    />
                  </div>
                )}
              </div>
            )}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
              <span>
                {t("disputes.dispute.createdBy")}{" "}
                {dispute.createdByTag || "@unknown"}
              </span>
              <span>
                {dispute.createdAt
                  ? new Date(
                      dispute.createdAt.toDate
                        ? dispute.createdAt.toDate()
                        : dispute.createdAt
                    ).toLocaleDateString()
                  : t("disputes.dispute.unknownDate")}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {canProvisionalEdit && (
                <Button
                  variant="default"
                  size="sm"
                  className="mr-2"
                  onClick={() =>
                    router.push(
                      `/edit-product/${product?.urlSlug || dispute.productSku}`
                    )
                  }
                >
                  {t("disputes.dispute.editProduct") || "Edit Product"}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVote(dispute.id, "up")}
                className="flex items-center gap-1"
                disabled={voteLoading === "up"}
              >
                {voteLoading === "up" ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <ThumbsUp className="h-3 w-3" />
                )}
                {dispute.votes?.upvotes || 0}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleVote(dispute.id, "down")}
                className="flex items-center gap-1"
                disabled={voteLoading === "down"}
              >
                {voteLoading === "down" ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <ThumbsDown className="h-3 w-3" />
                )}
                {dispute.votes?.downvotes || 0}
              </Button>
              {/* Admin Controls */}
              {isAdmin && (
                <div className="flex items-center gap-2 ml-4 border-l pl-4">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  <Select
                    value={dispute.status || "open"}
                    onValueChange={(value) =>
                      handleStatusChange(dispute.id, value)
                    }
                  >
                    <SelectTrigger className="w-32 h-8">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="open">Open</SelectItem>
                      <SelectItem value="in_review">In Review</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
