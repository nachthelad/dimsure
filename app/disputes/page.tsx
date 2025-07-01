"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { MessageSquare, Scale, Users, Loader2, Plus, Clock, ThumbsUp, ThumbsDown, AlertTriangle, CheckCircle, XCircle, Settings } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/hooks/useAuth"
import { useLanguage } from "@/components/language-provider"
import { getDisputes, voteOnDispute, updateDisputeStatus } from "@/lib/firestore"
import { DisputeModal } from "@/components/dispute-modal"
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
}

export default function DisputesPage() {
  const { isLoggedIn, loading, user, userData } = useAuth()
  const { t } = useLanguage()
  const router = useRouter()
  const [disputes, setDisputes] = useState<Dispute[]>([])
  const [disputesLoading, setDisputesLoading] = useState(true)
  const [selectedTab, setSelectedTab] = useState("all")
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

  const filteredDisputes = disputes.filter(dispute => {
    if (selectedTab === "all") return true
    if (selectedTab === "my-disputes") return dispute.createdBy === user?.uid
    return dispute.status === selectedTab
  })

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return null // Will redirect
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {t("disputes.title")}
            {isAdmin && (
              <Badge variant="destructive" className="ml-2">{t("disputes.admin")}</Badge>
            )}
          </h1>
          <p className="text-xl text-muted-foreground">{t("disputes.subtitle")}</p>
        </div>
        
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          {t("disputes.reportIssue")}
        </Button>
      </div>

      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="all">{t("disputes.tabs.all")}</TabsTrigger>
          <TabsTrigger value="open">{t("disputes.tabs.open")}</TabsTrigger>
          <TabsTrigger value="in_review">{t("disputes.tabs.inReview")}</TabsTrigger>
          <TabsTrigger value="resolved">{t("disputes.tabs.resolved")}</TabsTrigger>
          <TabsTrigger value="rejected">{t("disputes.tabs.rejected")}</TabsTrigger>
          <TabsTrigger value="my-disputes">{t("disputes.tabs.myReports")}</TabsTrigger>
        </TabsList>

        <TabsContent value={selectedTab} className="space-y-4">
          {disputesLoading ? (
            <div className="flex items-center justify-center h-32">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : filteredDisputes.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">{t("disputes.empty.noDisputes")}</h3>
                <p className="text-muted-foreground">
                  {selectedTab === "my-disputes" 
                    ? t("disputes.empty.noReportsYet")
                    : t("disputes.empty.noMatchingFilter")}
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredDisputes.map((dispute) => (
              <Card key={dispute.id} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-lg font-semibold">{dispute.title || t("disputes.dispute.untitled")}</h3>
                        <Badge className={getStatusColor(dispute.status)}>
                          {getStatusIcon(dispute.status)}
                          <span className="ml-1 capitalize">{dispute.status?.replace('_', ' ') || 'unknown'}</span>
                        </Badge>
                        <Badge variant="outline" className={getDisputeTypeColor(dispute.disputeType)}>
                          {dispute.disputeType || 'Other'}
                        </Badge>
                      </div>
                      
                      <p className="text-sm text-muted-foreground mb-2">
                        {t("disputes.dispute.product")} <span className="font-mono">{dispute.productSku || 'N/A'}</span> - {dispute.productName || t("disputes.dispute.unknownProduct")}
                      </p>
                      
                      <p className="text-muted-foreground mb-4">{dispute.description || t("disputes.dispute.noDescription")}</p>
                      
                                              {dispute.evidence && (
                          <div className="bg-muted/50 p-3 rounded-lg mb-4">
                            {(dispute.disputeType === 'measurement' || dispute.disputeType === 'weight') && (
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                <div>
                                  <span className="font-medium">{t("disputes.dispute.evidence.current")} </span>
                                  <span className="font-mono">{dispute.evidence.currentValue}</span>
                                </div>
                                <div>
                                  <span className="font-medium">{t("disputes.dispute.evidence.proposed")} </span>
                                  <span className="font-mono">{dispute.evidence.proposedValue}</span>
                                </div>
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
                        )}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
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
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>
      </Tabs>

      <DisputeModal
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onSuccess={loadDisputes}
        mode="create"
      />
    </div>
  )
}
