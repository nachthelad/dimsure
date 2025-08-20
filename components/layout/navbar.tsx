"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Search,
  Plus,
  User,
  MessageSquare,
  BookOpen,
  Settings,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { AuthButton } from "@/components/features/auth-button";
import { ThemeToggle } from "@/components/features/theme-toggle";
import { useLanguage } from "@/components/layout/language-provider";
import { NotificationBell } from "@/components/features/notification-bell";
import { useAuth } from "@/hooks/useAuth";
import { APP_CONSTANTS } from "@/lib/constants";
import { MobileTopbar } from "@/components/layout/mobile-topbar";
import { AppVersion } from "@/components/layout/app-version";

export function Navbar() {
  const pathname = usePathname();
  const { t, locale } = useLanguage();
  const { user } = useAuth();
  const [sidebarForceOpen, setSidebarForceOpen] = useState(false);

  const isAdmin =
    user?.email === APP_CONSTANTS.ADMIN_EMAIL ||
    user?.email === APP_CONSTANTS.DEBUG_AUTHORIZED_EMAIL;

  // Close sheet when pathname changes
  useEffect(() => {
    // Close any transient UI tied to route if needed
  }, [pathname]);

  const navigation = [
    { name: t("navigation.addProduct"), href: "/add-product", icon: Plus },
    { name: t("navigation.search"), href: "/search", icon: Search },
    {
      name: t("navigation.myContributions"),
      href: "/my-contributions",
      icon: User,
    },
    {
      name: t("navigation.communityDisputes"),
      href: "/disputes",
      icon: MessageSquare,
    },
    { name: t("navigation.blog"), href: "/blog", icon: BookOpen },
  ];

  // Sidebar classes
  const sidebarExpandedWidth = locale === "es" ? "xl:w-80" : "xl:w-72";
  const sidebarHoverWidth = locale === "es" ? "xl:hover:w-80" : "xl:hover:w-72";
  const sidebarClass = `hidden xl:flex xl:flex-col xl:fixed xl:inset-y-0 xl:left-0 xl:w-20 ${sidebarHoverWidth} ${
    sidebarForceOpen ? `${sidebarExpandedWidth} sidebar-force-open` : ""
  } xl:bg-background xl:border-r xl:border-border xl:z-50 xl:transition-all xl:duration-200 xl:ease-in-out xl:overflow-hidden group`;

  return (
    <>
      {/* Sidebar Desktop */}
      <aside className={sidebarClass}>
        <div className="flex flex-col h-full">
          {/* App Name + Logo */}
          <Link
            href="/"
            className="flex items-center h-16 border-b border-border px-4 xl:px-6 xl:group-hover:px-6 transition-all duration-200 ease-in-out"
            suppressHydrationWarning
          >
            <img
              src="/android-chrome-192x192.png"
              alt="Dimsure Logo"
              width={32}
              height={32}
              className="h-8 w-8 flex-shrink-0"
              loading="eager"
            />
            <span className="text-2xl font-bold text-foreground opacity-0 xl:group-hover:opacity-100 ml-2 transition-all duration-200 whitespace-nowrap">
              {t("site.name")}
            </span>
          </Link>
          {/* Navigation */}
          <nav className="flex-1 py-6">
            <div className="space-y-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link key={item.name} href={item.href} className="block">
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full h-12 flex items-center py-3 text-lg bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent transition-all duration-200",
                        pathname === item.href ? "font-bold" : "font-normal",
                        "px-4 justify-center",
                        "xl:group-hover:justify-start xl:group-hover:px-4 xl:sidebar-force-open:justify-start xl:sidebar-force-open:px-4"
                      )}
                    >
                      <Icon
                        className={cn(
                          "h-5 w-5 flex-shrink-0 transition-all duration-200",
                          pathname === item.href
                            ? "text-foreground"
                            : "text-muted-foreground"
                        )}
                        strokeWidth={pathname === item.href ? 3 : 2}
                      />
                      <span
                        className={cn(
                          "transition-all duration-200 whitespace-nowrap overflow-hidden",
                          "opacity-0 absolute ml-0",
                          "xl:group-hover:static xl:group-hover:opacity-100 xl:group-hover:ml-3 xl:sidebar-force-open:static xl:sidebar-force-open:opacity-100 xl:sidebar-force-open:ml-3"
                        )}
                      >
                        {item.name}
                      </span>
                    </Button>
                  </Link>
                );
              })}
              {isAdmin && (
                <Link href="/admin" className="block">
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full h-12 flex items-center py-3 text-lg bg-transparent hover:bg-transparent focus:bg-transparent active:bg-transparent transition-all duration-200",
                      pathname.startsWith("/admin")
                        ? "font-bold"
                        : "font-normal",
                      "px-4 justify-center",
                      "xl:group-hover:justify-start xl:group-hover:px-4 xl:sidebar-force-open:justify-start xl:sidebar-force-open:px-4"
                    )}
                  >
                    <Settings
                      className={cn(
                        "h-5 w-5 flex-shrink-0 transition-all duration-200",
                        pathname.startsWith("/admin")
                          ? "text-foreground"
                          : "text-muted-foreground"
                      )}
                      strokeWidth={pathname.startsWith("/admin") ? 3 : 2}
                    />
                    <span
                      className={cn(
                        "transition-all duration-200 whitespace-nowrap overflow-hidden",
                        "opacity-0 absolute ml-0",
                        "xl:group-hover:static xl:group-hover:opacity-100 xl:group-hover:ml-3 xl:sidebar-force-open:static xl:sidebar-force-open:opacity-100 xl:sidebar-force-open:ml-3"
                      )}
                    >
                      Admin
                    </span>
                  </Button>
                </Link>
              )}
            </div>
          </nav>
          {/* Bottom Section */}
          <div className="flex flex-col items-center gap-3 px-2 pb-6 mt-auto">
            <div className="flex flex-col xl:group-hover:flex-row items-center justify-center gap-3 bg-muted/10 rounded-xl p-2 transition-all duration-200">
              <ThemeToggle />
              <NotificationBell setSidebarForceOpen={setSidebarForceOpen} />
            </div>
            <Separator className="my-3 w-full" />
            <div className="flex justify-center w-full px-2">
              <AuthButton />
            </div>
            <Separator className="my-3 w-full" />
            <AppVersion />
          </div>
        </div>
      </aside>

      <MobileTopbar navigation={navigation} isAdmin={isAdmin} />
    </>
  );
}
