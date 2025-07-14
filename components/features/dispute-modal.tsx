"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Upload, X, Image as ImageIcon } from "lucide-react"
import { getProduct, createDispute, uploadEvidenceImage } from "@/lib/firestore"
import { validateImageFile } from "@/lib/storage"
import { useAuth } from "@/hooks/useAuth"
import { useLanguage } from "@/components/layout/language-provider"
import { toast } from "@/hooks/use-toast"
import Image from "next/image"

interface DisputeModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
  initialData?: {
    title?: string
    productSku?: string
    product?: any // Add the full product object so we can extract different values
    disputeType?: 'measurement' | 'description' | 'category' | 'image' | 'weight' | 'other'
  }
  mode?: 'create' | 'suggest'
}

export function DisputeModal({ 
  isOpen, 
  onOpenChange, 
  onSuccess,
  initialData,
  mode = 'create'
}: DisputeModalProps) {
  const { user } = useAuth()
  const { t } = useLanguage()

  // Helper function to get current value based on dispute type
  const getCurrentValueForType = (disputeType: string, product: any): string => {
    if (!product) return ""
    
    switch (disputeType) {
      case 'measurement':
        if (product.primaryDimensions) {
          return `${product.primaryDimensions.length} × ${product.primaryDimensions.width} × ${product.primaryDimensions.height} mm`
        }
        return t("disputes.modal.noMeasurements")
      
      case 'weight':
        // Check for weight in specifications or weight field
        const weight = product.specifications?.weight || product.weight
        if (weight) {
          return weight
        }
        return t("disputes.modal.noWeight")
      
      default:
        return ""
    }
  }
  const [newDispute, setNewDispute] = useState({
    title: "",
    description: "",
    productSku: "",
    disputeType: "measurement" as 'measurement' | 'description' | 'category' | 'image' | 'weight' | 'other',
    evidence: {
      currentValue: "",
      proposedValue: "",
      reasoning: ""
    }
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [evidenceImage, setEvidenceImage] = useState<File | null>(null)
  const [evidenceImagePreview, setEvidenceImagePreview] = useState<string>("")
  const [isUploadingImage, setIsUploadingImage] = useState(false)

  // Pre-fill form when modal opens with initial data
  useEffect(() => {
    if (isOpen && initialData) {
      const disputeType = initialData.disputeType || "measurement"
      const currentValue = getCurrentValueForType(disputeType, initialData.product)
      
      setNewDispute({
        title: initialData.title || "",
        description: "",
        productSku: initialData.productSku || "",
        disputeType: disputeType,
        evidence: {
          currentValue: currentValue,
          proposedValue: "",
          reasoning: ""
        }
      })
    } else if (isOpen && !initialData) {
      // Reset form for new dispute
      setNewDispute({
        title: "",
        description: "",
        productSku: "",
        disputeType: "measurement",
        evidence: { currentValue: "", proposedValue: "", reasoning: "" }
      })
    }
    
    // Reset image state when modal opens/closes
    if (!isOpen) {
      setEvidenceImage(null)
      setEvidenceImagePreview("")
    }
  }, [isOpen, initialData, t])

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Validate the image
      const validation = validateImageFile(file)
      if (!validation.isValid) {
        toast({
          title: "Image Error",
          description: validation.error,
          variant: "destructive",
        })
        return
      }

      setEvidenceImage(file)

      // Create preview
      const reader = new FileReader()
      reader.onload = (e) => {
        setEvidenceImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const removeEvidenceImage = () => {
    setEvidenceImage(null)
    setEvidenceImagePreview("")
  }

  // Update currentValue when dispute type changes (only for measurement and weight types)
  const handleDisputeTypeChange = (newType: string) => {
    setNewDispute(prev => {
      const newCurrentValue = (newType === 'measurement' || newType === 'weight') && initialData?.product
        ? getCurrentValueForType(newType, initialData.product)
        : prev.evidence.currentValue

      return {
        ...prev,
        disputeType: newType as any,
        evidence: {
          ...prev.evidence,
          currentValue: newCurrentValue
        }
      }
    })
  }

  const handleCreateDispute = async () => {
    if (!user) return
    
    // Validation
    if (!newDispute.title.trim()) {
      alert(mode === 'suggest' ? t("disputes.modal.validation.titleRequiredSuggest") : t("disputes.modal.validation.titleRequired"))
      return
    }
    
    if (!newDispute.description.trim()) {
      alert(t("disputes.modal.validation.descriptionRequired"))
      return
    }
    
    if (!newDispute.productSku.trim()) {
      alert(t("disputes.modal.validation.skuRequired"))
      return
    }
    
    if (newDispute.disputeType === 'measurement' || newDispute.disputeType === 'weight') {
      if (!newDispute.evidence.proposedValue.trim()) {
        alert(mode === 'suggest' 
          ? t("disputes.modal.validation.valueRequired") 
          : t("disputes.modal.validation.valuesRequired"))
        return
      }
      if (mode === 'create' && !newDispute.evidence.currentValue.trim()) {
        alert(t("disputes.modal.validation.valuesRequired"))
        return
      }
    }
    
    try {
      setIsSubmitting(true)
      
      // Validate product exists (only if not pre-filled)
      const product = await getProduct(newDispute.productSku.trim())
      if (!product) {
        alert(t("disputes.modal.validation.productNotFound"))
        return
      }

      const disputeData: any = {
        title: newDispute.title.trim(),
        description: newDispute.description.trim(),
        productSku: newDispute.productSku.trim(),
        productName: product.name,
        disputeType: newDispute.disputeType,
        status: 'open' as const,
        createdBy: user.uid,
      }

      // Add evidence field for measurement, weight, and image disputes
      if (newDispute.disputeType === 'measurement' || newDispute.disputeType === 'weight') {
        disputeData.evidence = {
          currentValue: newDispute.evidence.currentValue.trim(),
          proposedValue: newDispute.evidence.proposedValue.trim(),
          reasoning: newDispute.evidence.reasoning.trim()
        }
      } else {
        // For other types, just include the reasoning/source
        disputeData.evidence = {
          reasoning: newDispute.evidence.reasoning.trim()
        }
      }

      // Upload evidence image if provided
      if (evidenceImage) {
        setIsUploadingImage(true)
        try {
          // Generate a temporary ID for the dispute to upload the image
          const tempDisputeId = `temp_${Date.now()}_${user.uid}`
          const imageUrl = await uploadEvidenceImage(evidenceImage, tempDisputeId, user.uid)
          disputeData.evidence.imageUrl = imageUrl
        } catch (error) {
          console.error("Error uploading evidence image:", error)
          toast({
            title: t("disputes.modal.errors.imageUploadFailed"),
            description: t("disputes.modal.errors.imageUploadFailedDesc"),
            variant: "destructive",
          })
        } finally {
          setIsUploadingImage(false)
        }
      }

      await createDispute(disputeData)
      
      onOpenChange(false)
      setNewDispute({
        title: "",
        description: "",
        productSku: "",
        disputeType: "measurement",
        evidence: { currentValue: "", proposedValue: "", reasoning: "" }
      })
      setEvidenceImage(null)
      setEvidenceImagePreview("")
      
      const successMessage = mode === 'suggest' 
        ? t("disputes.modal.success.suggestionSubmitted")
        : t("disputes.modal.success.disputeSubmitted")
      
      alert(successMessage)
      
      if (onSuccess) {
        onSuccess()
      }
    } catch (error) {
      console.error("Error creating dispute:", error)
      alert(mode === 'suggest' ? t("disputes.modal.errors.submitFailedSuggest") : t("disputes.modal.errors.submitFailed"))
    } finally {
      setIsSubmitting(false)
    }
  }

  const isProductSkuReadonly = !!initialData?.productSku

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl p-0"
        style={{ maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}
      >
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle>
            {mode === 'suggest' ? t("disputes.modal.suggestTitle") : t("disputes.modal.createTitle")}
          </DialogTitle>
        </DialogHeader>
        <div
          className="space-y-4 px-6 pb-6 overflow-y-auto flex-1"
          style={{ maxHeight: 'calc(90vh - 64px - 72px)' }} // 64px header aprox, 72px botones
        >
          <div>
            <Label htmlFor="title">{t("disputes.modal.title")}</Label>
            <Input
              id="title"
              value={newDispute.title}
              onChange={(e) => setNewDispute(prev => ({ ...prev, title: e.target.value }))}
              placeholder={mode === 'suggest' 
                ? t("disputes.modal.titlePlaceholderSuggest")
                : t("disputes.modal.titlePlaceholder")}
            />
          </div>
          
          <div>
            <Label htmlFor="productSku">{t("disputes.modal.productSku")}</Label>
            <Input
              id="productSku"
              value={newDispute.productSku}
              onChange={(e) => setNewDispute(prev => ({ ...prev, productSku: e.target.value }))}
              placeholder={t("disputes.modal.skuPlaceholder")}
              disabled={isProductSkuReadonly}
              className={isProductSkuReadonly ? "bg-muted" : ""}
            />
          </div>

          <div>
            <Label htmlFor="disputeType">{t("disputes.modal.issueType")}</Label>
            <Select 
              value={newDispute.disputeType} 
              onValueChange={handleDisputeTypeChange}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="measurement">{t("disputes.modal.issueTypes.measurement")}</SelectItem>
                <SelectItem value="weight">{t("disputes.modal.issueTypes.weight")}</SelectItem>
                <SelectItem value="image">{t("disputes.modal.issueTypes.image")}</SelectItem>
                <SelectItem value="description">{t("disputes.modal.issueTypes.description")}</SelectItem>
                <SelectItem value="category">{t("disputes.modal.issueTypes.category")}</SelectItem>
                <SelectItem value="other">{t("disputes.modal.issueTypes.other")}</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {(newDispute.disputeType === 'measurement' || newDispute.disputeType === 'weight') && (
            <>
                              <div>
                  <Label htmlFor="currentValue">
                    {newDispute.disputeType === 'weight' ? t("disputes.modal.currentWeight") : t("disputes.modal.currentValue")}
                  </Label>
                  <Input
                    id="currentValue"
                    value={newDispute.evidence.currentValue}
                    onChange={(e) => setNewDispute(prev => ({ 
                      ...prev, 
                      evidence: { ...prev.evidence, currentValue: e.target.value }
                    }))}
                    placeholder={newDispute.disputeType === 'weight' 
                      ? t("disputes.modal.currentWeightPlaceholder") 
                      : t("disputes.modal.currentValuePlaceholder")}
                    disabled={mode === 'suggest' && initialData?.product}
                    className={mode === 'suggest' && initialData?.product ? "bg-muted" : ""}
                  />
                </div>
                
                <div>
                  <Label htmlFor="proposedValue">
                    {mode === 'suggest' 
                      ? (newDispute.disputeType === 'weight' ? t("disputes.modal.correctWeight") : t("disputes.modal.correctValue"))
                      : (newDispute.disputeType === 'weight' ? t("disputes.modal.proposedWeight") : t("disputes.modal.proposedValue"))
                    }
                  </Label>
                  <Input
                    id="proposedValue"
                    value={newDispute.evidence.proposedValue}
                    onChange={(e) => setNewDispute(prev => ({ 
                      ...prev, 
                      evidence: { ...prev.evidence, proposedValue: e.target.value }
                    }))}
                    placeholder={newDispute.disputeType === 'weight' 
                      ? t("disputes.modal.proposedWeightPlaceholder") 
                      : t("disputes.modal.proposedValuePlaceholder")}
                  />
                </div>
            </>
          )}

          <div>
            <Label htmlFor="description">{t("disputes.modal.description")}</Label>
            <Textarea
              id="description"
              value={newDispute.description}
              onChange={(e) => setNewDispute(prev => ({ ...prev, description: e.target.value }))}
              placeholder={mode === 'suggest' 
                ? t("disputes.modal.descriptionPlaceholderSuggest") 
                : t("disputes.modal.descriptionPlaceholder")}
              rows={4}
            />
          </div>

          {/* Evidence/Source section - now available for all dispute types */}
          <div>
            <Label htmlFor="reasoning">{t("disputes.modal.evidenceSource")}</Label>
            <Textarea
              id="reasoning"
              value={newDispute.evidence.reasoning}
              onChange={(e) => setNewDispute(prev => ({ 
                ...prev, 
                evidence: { ...prev.evidence, reasoning: e.target.value }
              }))}
              placeholder={mode === 'suggest' 
                ? t("disputes.modal.evidenceSourcePlaceholderSuggest")
                : t("disputes.modal.evidenceSourcePlaceholder")}
              rows={3}
            />
          </div>

          {/* Evidence Image Upload */}
          <div>
            <Label>{t("disputes.modal.evidenceImage")}</Label>
            <div className="border-2 border-dashed border-border rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
              {evidenceImagePreview ? (
                <div className="relative">
                  <Image
                    src={evidenceImagePreview}
                    alt="Evidence"
                    width={200}
                    height={200}
                    className="mx-auto rounded-lg object-cover max-h-48"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2"
                    onClick={removeEvidenceImage}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <p className="text-sm text-muted-foreground mt-2">
                    {evidenceImage?.name}
                  </p>
                </div>
              ) : (
                <>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    disabled={isUploadingImage}
                    className="hidden"
                    id="evidence-upload"
                  />
                  <label htmlFor="evidence-upload" className="cursor-pointer">
                    <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">{t("disputes.modal.evidenceImageUpload")}</p>
                    <p className="text-xs text-muted-foreground">{t("disputes.modal.evidenceImageFormats")}</p>
                  </label>
                </>
              )}
            </div>
          </div>

        </div>
        <div className="flex justify-end gap-2 pt-4 pb-4 px-6 border-t bg-background z-10">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {t("disputes.modal.cancel")}
          </Button>
          <Button onClick={handleCreateDispute} disabled={isSubmitting || isUploadingImage}>
            {isSubmitting ? t("disputes.modal.submitting") : 
             isUploadingImage ? t("disputes.modal.uploading") : 
             (mode === 'suggest' ? t("disputes.modal.submitSuggestion") : t("disputes.modal.submit"))}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 