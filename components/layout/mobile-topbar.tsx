"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Menu, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { LanguageToggle } from "@/components/features/language-toggle";
import { ThemeToggle } from "@/components/features/theme-toggle";
import { AuthButton } from "@/components/features/auth-button";
import { Separator } from "@/components/ui/separator";
import { AppVersion } from "@/components/layout/app-version";

import type { ComponentType } from "react";

type NavigationItem = {
  name: string;
  href: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
};

interface MobileTopbarProps {
  navigation: NavigationItem[];
  isAdmin: boolean;
}

export function MobileTopbar({ navigation, isAdmin }: MobileTopbarProps) {
  const pathname = usePathname();
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  return (
    <nav className="xl:hidden bg-background border-b border-border sticky top-0 z-50 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo only on mobile */}
          <Link href="/" className="flex items-center space-x-2">
            <img
              src="/android-chrome-192x192.png"
              alt="Dimsure Logo"
              width={32}
              height={32}
              className="h-8 w-8"
              loading="eager"
            />
          </Link>
          <div className="flex items-center space-x-2">
            <LanguageToggle />
            <ThemeToggle />
            <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
              <SheetTrigger asChild>
                <Button 
                  variant="ghost" 
                  size="icon"
                  aria-label="Open navigation menu"
                  aria-expanded={isSheetOpen}
                >
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-64">
                <SheetTitle>Menu</SheetTitle>
                <div className="flex flex-col space-y-2 mt-8">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link key={item.name} href={item.href}>
                        <Button
                          variant={pathname === item.href ? "default" : "ghost"}
                          className="w-full justify-start space-x-2"
                          onClick={() => setIsSheetOpen(false)}
                        >
                          <Icon className="h-4 w-4" />
                          <span>{item.name}</span>
                        </Button>
                      </Link>
                    );
                  })}
                  {isAdmin && (
                    <Link href="/admin">
                      <Button
                        variant={
                          pathname.startsWith("/admin") ? "default" : "ghost"
                        }
                        className="w-full justify-start space-x-2"
                        onClick={() => setIsSheetOpen(false)}
                      >
                        <Settings className="h-4 w-4" />
                        <span>Admin</span>
                      </Button>
                    </Link>
                  )}
                  <div className="border-t border-border pt-4 mt-4">
                    <AuthButton />
                    <Separator className="my-3" />
                    <AppVersion />
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
}
