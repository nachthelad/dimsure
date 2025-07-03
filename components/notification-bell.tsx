"use client"

import { useEffect, useState } from "react"
import { Bell } from "lucide-react"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator } from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/hooks/useAuth"
import { getUserNotifications } from "@/lib/firestore"
import { cn } from "@/lib/utils"
import { doc, updateDoc, getDoc, doc as firestoreDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { useLanguage } from "@/components/language-provider"

export function NotificationBell() {
  const { user, isLoggedIn } = useAuth()
  const { locale, t } = useLanguage()
  const [notifications, setNotifications] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [open, setOpen] = useState(false)
  const [disputeStatuses, setDisputeStatuses] = useState<Record<string, string>>({})

  useEffect(() => {
    if (user?.uid) {
      fetchNotifications()
    }
    // eslint-disable-next-line
  }, [user?.uid])

  // Forzar rerender de mensajes al cambiar el idioma
  useEffect(() => {
    setNotifications((prev) => [...prev])
  }, [locale])

  // Consultar el estado actual de las disputas de las notificaciones
  useEffect(() => {
    const fetchDisputeStatuses = async () => {
      const statuses: Record<string, string> = {}
      const disputeNotifs = notifications.filter(n => n.disputeId)
      await Promise.all(disputeNotifs.map(async (notif) => {
        try {
          const disputeDoc = await getDoc(firestoreDoc(db, "disputes", notif.disputeId))
          if (disputeDoc.exists()) {
            const data = disputeDoc.data()
            statuses[notif.disputeId] = data.status
          }
        } catch {}
      }))
      setDisputeStatuses(statuses)
    }
    if (notifications.some(n => n.disputeId)) {
      fetchDisputeStatuses()
    }
  }, [notifications])

  const fetchNotifications = async () => {
    if (!user?.uid) return;
    setLoading(true)
    try {
      const notifs = await getUserNotifications(user.uid)
      setNotifications(notifs)
    } catch (e) {
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (isOpen) fetchNotifications()
  }

  const handleNotificationClick = async (notif: any) => {
    if (!notif.read) {
      // Marcar como leída en Firestore
      await updateDoc(doc(db, "notifications", notif.id), { read: true })
      setNotifications((prev) => prev.map(n => n.id === notif.id ? { ...n, read: true } : n))
    }
    // Si la notificación tiene un enlace, navegar
    if (notif.disputeId) {
      window.location.href = `/disputes` // O podrías hacer scroll a la disputa específica si tienes esa lógica
    }
  }

  const unreadCount = notifications.filter(n => !n.read).length

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <button className="relative p-2 rounded-full hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary">
          <Bell className="h-6 w-6" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5 min-w-[20px] flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-80 max-h-96 overflow-y-auto">
        <DropdownMenuLabel>{t("notifications.title")}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {loading ? (
          <div className="p-4 text-center text-muted-foreground text-sm">{t("notifications.loading")}</div>
        ) : notifications.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground text-sm">{t("notifications.empty")}</div>
        ) : (
          notifications.map((notif) => {
            let message = notif.message;
            if (typeof message === 'object' && message !== null) {
              message = message[locale] || message['en'] || Object.values(message)[0];
            }
            // Estado real de la disputa si existe
            let status = notif.status;
            if (notif.disputeId && disputeStatuses[notif.disputeId]) {
              status = disputeStatuses[notif.disputeId];
            }
            let statusKey = status === "in_review" ? "inReview" : status;
            let statusLabel = status ? t("disputes.tabs." + statusKey) : "";
            return (
              <DropdownMenuItem
                key={notif.id}
                onClick={() => handleNotificationClick(notif)}
                className={cn("cursor-pointer flex flex-col items-start gap-1", !notif.read && "bg-accent/30")}
              >
                <span className="font-medium text-sm">{message}</span>
                <span className="text-xs text-muted-foreground">
                  {notif.createdAt?.toDate ? notif.createdAt.toDate().toLocaleString() : ""}
                  {statusLabel ? ` • ${statusLabel}` : ""}
                </span>
              </DropdownMenuItem>
            )
          })
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
} 