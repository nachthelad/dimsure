"use client"

import { Globe } from "lucide-react"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useLanguage } from "@/components/language-provider"
import { locales, localeNames, localeFlags } from "@/lib/i18n"
import React from "react"

export function LanguageToggle({ setSidebarForceOpen }: { setSidebarForceOpen?: (open: boolean) => void }) {
  const { locale, setLocale } = useLanguage()
  const [open, setOpen] = React.useState(false)

  const currentLanguage = {
    name: localeNames[locale],
    flag: localeFlags[locale],
  }

  const handleOpenChange = (isOpen: boolean) => {
    setOpen(isOpen)
    if (setSidebarForceOpen) setSidebarForceOpen(isOpen)
  }

  return (
    <DropdownMenu open={open} onOpenChange={handleOpenChange}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center gap-2">
          <Globe className="h-4 w-4" />
          <span className="hidden sm:inline">
            {currentLanguage.flag} {currentLanguage.name}
          </span>
          <span className="sm:hidden">{currentLanguage.flag}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((localeCode) => (
          <DropdownMenuItem
            key={localeCode}
            onClick={() => setLocale(localeCode)}
            className={locale === localeCode ? "bg-accent" : ""}
          >
            <span className="mr-2">{localeFlags[localeCode]}</span>
            {localeNames[localeCode]}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
