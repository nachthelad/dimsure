"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MessageSquare, Scale, Users, Loader2, Plus, Clock, ThumbsUp, ThumbsDown, AlertTriangle, CheckCircle, XCircle, Settings, Filter, Search } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Skeleton } from "@/components/ui/skeleton"
import { useAuth } from "@/hooks/useAuth"
import { useLanguage } from "@/components/layout/language-provider"
import { getDisputes, voteOnDispute, updateDisputeStatus } from "@/lib/firestore"
import { DisputeModal } from "@/components/features/dispute-modal"
import { APP_CONSTANTS } from "@/lib/constants"

interface Dispute {
  id: string
  title?: string
  description?: string
  productSku?: string
  productName?: string
  disputeType?: 'measurement' | 'description' | 'category' | 'image' | 'weight' | 'other'
  status?: 'open' | 'in_review' | 'resolved' | 'rejected'
  createdBy?: string
  createdByTag?: string
  createdAt?: any
  votes?: {
    upvotes: number
    downvotes: number
    userVotes: { [userId: string]: 'up' | 'down' }
  }
  evidence?: {
    currentValue?: string
    proposedValue?: string
    reasoning?: string
    imageUrl?: string
  }
  resolution?: {
    action: string
    reason: string
    resolvedBy: string
    resolvedAt: any
  }
  resolutionPendingAt?: any
}

export default function DisputesPage() {
  const { isLoggedIn, loading, user, userData } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [filteredDisputes, setFilteredDisputes] = useState<Dispute[]>([])
  const [disputesLoading, setDisputesLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>("all")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [showMyReports, setShowMyReports] = useState(false)
  const [searchTerm, setSearchTerm] = useState("")
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  // Check if current user is admin
  const isAdmin = userData?.email === APP_CONSTANTS.ADMIN_EMAIL || userData?.email === APP_CONSTANTS.DEBUG_AUTHORIZED_EMAIL

  useEffect(() => {
    if (!loading && !isLoggedIn) {
      router.push("/login?redirect=/disputes")
    }
  }, [isLoggedIn, loading, router])

  useEffect(() => {
    if (isLoggedIn) {
      loadDisputes()
    }
  }, [isLoggedIn])

  // Filter disputes based on all filters
  useEffect(() => {
    let filtered = disputes

    // Filter by status
    if (statusFilter !== "all") {
      filtered = filtered.filter(dispute => dispute.status === statusFilter)
    }

    // Filter by type
    if (typeFilter !== "all") {
      filtered = filtered.filter(dispute => dispute.disputeType === typeFilter)
    }

    // Filter by my reports
    if (showMyReports) {
      filtered = filtered.filter(dispute => dispute.createdBy === user?.uid)
    }

    // Filter by search term
    if (searchTerm.trim()) {
      filtered = filtered.filter(dispute =>
        dispute.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        dispute.productSku?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    setFilteredDisputes(filtered)
  }, [disputes, statusFilter, typeFilter, showMyReports, searchTerm, user?.uid])

  const loadDisputes = async () => {
    try {
      setDisputesLoading(true)
      const disputesData = await getDisputes()
      setDisputes(disputesData)
    } catch (error) {
      console.error("Error loading disputes:", error)
    } finally {
      setDisputesLoading(false)
    }
  }

  const handleVote = async (disputeId: string, voteType: 'up' | 'down') => {
    if (!user) return
    
    try {
      await voteOnDispute(disputeId, user.uid, voteType)
      loadDisputes()
    } catch (error) {
      console.error("Error voting on dispute:", error)
    }
  }

  const handleStatusChange = async (disputeId: string, newStatus: string) => {
    if (!isAdmin) return
    
    try {
      await updateDisputeStatus(disputeId, newStatus, {
        action: `Changed status to ${newStatus}`,
        reason: "Admin action",
        resolvedBy: user?.uid || "unknown"
      })
      loadDisputes() // Reload disputes to show updated status
    } catch (error) {
      console.error("Error updating dispute status:", error)
      alert("Failed to update dispute status. Please try again.")
    }
  }

  const getStatusIcon = (status?: Dispute['status']) => {
    switch (status) {
      case 'open':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'in_review':
        return <Clock className="h-4 w-4 text-blue-500" />
      case 'resolved':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'rejected':
        return <XCircle className="h-4 w-4 text-red-500" />
      default:
        return <AlertTriangle className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status?: Dispute['status']) => {
    switch (status) {
      case 'open':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'in_review':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'resolved':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getDisputeTypeColor = (type?: Dispute['disputeType']) => {
    switch (type) {
      case 'measurement':
        return 'bg-purple-100 text-purple-800 border-purple-200'
      case 'description':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'category':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'other':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  if (loading || disputesLoading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="mb-8">
          {/* Header Skeleton */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
            <div>
              <Skeleton className="h-10 w-64 mb-2" />
              <Skeleton className="h-6 w-96" />
            </div>
            <Skeleton className="h-10 w-32" />
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-4 w-4" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-8 w-12" />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Filters Skeleton */}
        <div className="mb-6 space-y-4">
          <Skeleton className="h-10 w-80" />
          <div className="flex gap-3">
            <Skeleton className="h-10 flex-1 sm:w-40" />
            <Skeleton className="h-10 flex-1 sm:w-40" />
            <Skeleton className="h-10 flex-1 sm:w-32" />
          </div>
        </div>

        {/* Disputes List Skeleton */}
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-5 w-20" />
                    </div>
                    <Skeleton className="h-4 w-64 mb-2" />
                    <Skeleton className="h-4 w-full mb-4" />
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                        <Skeleton className="h-4 w-32" />
                        <Skeleton className="h-4 w-24" />
                      </div>
                      <div className="flex items-center gap-2">
                        <Skeleton className="h-8 w-12" />
                        <Skeleton className="h-8 w-12" />
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null // Will redirect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold text-foreground mb-2">
              {t("disputes.title")}
              {isAdmin && (
                <Badge variant="destructive" className="ml-2">{t("disputes.admin")}</Badge>
              )}
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground">{t("disputes.subtitle")}</p>
          </div>
          
          <Button onClick={() => setIsCreateDialogOpen(true)} className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            {t("disputes.reportIssue")}
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Disputes</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{disputes.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Open</CardTitle>
              <AlertTriangle className="h-4 w-4 text-yellow-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {disputes.filter(d => d.status === 'open').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">In Review</CardTitle>
              <Clock className="h-4 w-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {disputes.filter(d => d.status === 'in_review').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">My Reports</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {disputes.filter(d => d.createdBy === user?.uid).length}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search disputes..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Filter Controls */}
        <div className="flex gap-3 sm:gap-4 sm:items-center">
          <div className="flex gap-3 flex-1 sm:flex-none">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="flex-1 sm:w-40">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="open">Open</SelectItem>
                <SelectItem value="in_review">In Review</SelectItem>
                <SelectItem value="resolved">Resolved</SelectItem>
                <SelectItem value="rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="flex-1 sm:w-40">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="measurement">Measurement</SelectItem>
                <SelectItem value="description">Description</SelectItem>
                <SelectItem value="category">Category</SelectItem>
                <SelectItem value="image">Image</SelectItem>
                <SelectItem value="weight">Weight</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Button 
            variant={showMyReports ? "default" : "outline"}
            onClick={() => setShowMyReports(!showMyReports)}
            className="flex-1 sm:flex-none sm:w-auto"
          >
            <Users className="h-4 w-4 mr-2" />
            My Reports
          </Button>
        </div>

        {/* Active Filters Display */}
        {(searchTerm || statusFilter !== "all" || typeFilter !== "all" || showMyReports) && (
          <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
            <span>Showing {filteredDisputes.length} of {disputes.length} disputes</span>
            {statusFilter !== "all" && (
              <Badge variant="secondary">Status: {statusFilter}</Badge>
            )}
            {typeFilter !== "all" && (
              <Badge variant="secondary">Type: {typeFilter}</Badge>
            )}
            {showMyReports && (
              <Badge variant="secondary">My Reports Only</Badge>
            )}
            {searchTerm && (
              <Badge variant="secondary">Search: "{searchTerm}"</Badge>
            )}
          </div>
        )}
      </div>

      {/* Disputes List */}
      {filteredDisputes.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {disputes.length === 0 ? t("disputes.empty.noDisputes") : "No disputes match your filters"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {disputes.length === 0 
                ? t("disputes.empty.noReportsYet")
                : "Try adjusting your filters or search term"
              }
            </p>
            {(statusFilter !== "all" || typeFilter !== "all" || showMyReports || searchTerm) && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setStatusFilter("all")
                  setTypeFilter("all")
                  setShowMyReports(false)
                  setSearchTerm("")
                }}
              >
                Clear All Filters
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredDisputes.map((dispute, idx) => {
            // Identificador legible tipo #001
            const readableId = `#${(idx + 1).toString().padStart(3, '0')}`;
            return (
              <Card key={dispute.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        {/* Título como link a la página individual */}
                        <a href={`/disputes/${dispute.id}`} className="text-lg font-semibold hover:underline focus:underline">
                          {readableId} {dispute.title || t("disputes.dispute.untitled")}
                        </a>
                        <Badge className={getStatusColor(dispute.status)}>
                          {getStatusIcon(dispute.status)}
                          <span className="ml-1 capitalize">{dispute.status?.replace('_', ' ') || 'unknown'}</span>
                        </Badge>
                        <Badge variant="outline" className={getDisputeTypeColor(dispute.disputeType)}>
                          {dispute.disputeType || 'Other'}
                        </Badge>
                        {/* Badge especial si está pendiente de acción */}
                        {dispute.status === 'in_review' && dispute.resolutionPendingAt && (
                          <Badge variant="destructive" className="bg-orange-100 text-orange-800 border-orange-200">
                            {t('disputes.dispute.pendingCreatorAction') || 'Pending creator action'}
                          </Badge>
                        )}
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {t("disputes.dispute.product")} <span className="font-mono">{dispute.productSku || 'N/A'}</span> - {dispute.productName || t("disputes.dispute.unknownProduct")}
                      </p>
                      
                      <p className="text-muted-foreground mb-4">{dispute.description || t("disputes.dispute.noDescription")}</p>
                      
                      {dispute.evidence && (
                        (dispute.evidence.currentValue || dispute.evidence.proposedValue || dispute.evidence.reasoning || dispute.evidence.imageUrl) && (
                          <div className="bg-muted/50 p-3 rounded-lg mb-4">
                            {(dispute.disputeType === 'measurement' || dispute.disputeType === 'weight') && (
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
                                {dispute.evidence.currentValue && (
                                  <div>
                                    <span className="font-medium">{t("disputes.dispute.evidence.current")} </span>
                                    <span className="font-mono">{dispute.evidence.currentValue}</span>
                                  </div>
                                )}
                                {dispute.evidence.proposedValue && (
                                  <div>
                                    <span className="font-medium">{t("disputes.dispute.evidence.proposed")} </span>
                                    <span className="font-mono">{dispute.evidence.proposedValue}</span>
                                  </div>
                                )}
                              </div>
                            )}
                            {dispute.evidence.reasoning && (
                              <div className="mt-2 text-sm">
                                <span className="font-medium">{t("disputes.dispute.evidence.evidence")} </span>
                                {dispute.evidence.reasoning}
                              </div>
                            )}
                            {dispute.evidence.imageUrl && (
                              <div className="mt-3">
                                <p className="text-sm font-medium mb-2">{t("disputes.dispute.evidence.evidenceImage")}</p>
                                <img
                                  src={dispute.evidence.imageUrl}
                                  alt="Evidence"
                                  className="max-w-full max-h-48 rounded-lg object-cover border"
                                />
                              </div>
                            )}
                          </div>
                        )
                      )}

                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-muted-foreground">
                          <span>{t("disputes.dispute.createdBy")} {dispute.createdByTag || '@unknown'}</span>
                          <span>{dispute.createdAt ? new Date(dispute.createdAt.toDate ? dispute.createdAt.toDate() : dispute.createdAt).toLocaleDateString() : t("disputes.dispute.unknownDate")}</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVote(dispute.id, 'up')}
                            className="flex items-center gap-1"
                          >
                            <ThumbsUp className="h-3 w-3" />
                            {dispute.votes?.upvotes || 0}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleVote(dispute.id, 'down')}
                            className="flex items-center gap-1"
                          >
                            <ThumbsDown className="h-3 w-3" />
                            {dispute.votes?.downvotes || 0}
                          </Button>
                          {/* Botón para ver detalle */}
                          <a href={`/disputes/${dispute.id}`}>
                            <Button size="sm" className="ml-2">
                              Ver detalle
                            </Button>
                          </a>
                          {/* Admin Controls */}
                          {isAdmin && (
                            <div className="flex items-center gap-2 ml-4 border-l pl-4">
                              <Settings className="h-4 w-4 text-muted-foreground" />
                              <Select value={dispute.status || 'open'} onValueChange={(value) => handleStatusChange(dispute.id, value)}>
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
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <DisputeModal
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={loadDisputes}
        mode="create"
      />
    </div>
  )
}
