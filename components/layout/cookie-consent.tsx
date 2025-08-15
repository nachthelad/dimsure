"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Cookie, X, Settings } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [preferences, setPreferences] = useState({
    essential: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    } else {
      const savedPreferences = JSON.parse(consent);
      setPreferences(savedPreferences);
    }
  }, []);

  const acceptAll = () => {
    const allAccepted = {
      essential: true,
      analytics: true,
      marketing: true,
    };
    setPreferences(allAccepted);
    localStorage.setItem("cookie-consent", JSON.stringify(allAccepted));
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    setShowBanner(false);

    // Update consent for analytics and ads
    applyConsent(allAccepted);
  };

  const acceptEssential = () => {
    const essentialOnly = {
      essential: true,
      analytics: false,
      marketing: false,
    };
    setPreferences(essentialOnly);
    localStorage.setItem("cookie-consent", JSON.stringify(essentialOnly));
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    setShowBanner(false);

    // Deny analytics and ads storage
    applyConsent(essentialOnly);
  };

  const savePreferences = () => {
    localStorage.setItem("cookie-consent", JSON.stringify(preferences));
    localStorage.setItem("cookie-consent-date", new Date().toISOString());
    setShowBanner(false);

    // Apply consent to Google tags (analytics and ads)
    applyConsent(preferences);
  };

  const applyConsent = (prefs: typeof preferences) => {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: prefs.analytics ? "granted" : "denied",
        ad_storage: prefs.marketing ? "granted" : "denied",
      });
    }
  };

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
      <Card className="mx-auto max-w-4xl border-2 shadow-lg">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <Cookie className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div className="flex-1">
              <h3 className="font-semibold text-lg mb-2">We use cookies</h3>
              <p className="text-muted-foreground text-sm mb-4">
                We use cookies to enhance your experience, analyze site traffic,
                and for marketing purposes. You can choose which cookies to
                accept below.
              </p>

              <div className="flex flex-wrap gap-3">
                <Button
                  onClick={acceptAll}
                  className="bg-primary hover:bg-primary/90"
                >
                  Accept All
                </Button>
                <Button onClick={acceptEssential} variant="outline">
                  Essential Only
                </Button>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Settings className="h-4 w-4" />
                      Customize
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Cookie Preferences</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="essential" className="font-medium">
                              Essential Cookies
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Required for basic site functionality
                            </p>
                          </div>
                          <Switch
                            id="essential"
                            checked={preferences.essential}
                            disabled={true}
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="analytics" className="font-medium">
                              Analytics Cookies
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Help us improve our website
                            </p>
                          </div>
                          <Switch
                            id="analytics"
                            checked={preferences.analytics}
                            onCheckedChange={(checked) =>
                              setPreferences((prev) => ({
                                ...prev,
                                analytics: checked,
                              }))
                            }
                          />
                        </div>

                        <div className="flex items-center justify-between">
                          <div>
                            <Label htmlFor="marketing" className="font-medium">
                              Marketing Cookies
                            </Label>
                            <p className="text-sm text-muted-foreground">
                              Personalized ads and content
                            </p>
                          </div>
                          <Switch
                            id="marketing"
                            checked={preferences.marketing}
                            onCheckedChange={(checked) =>
                              setPreferences((prev) => ({
                                ...prev,
                                marketing: checked,
                              }))
                            }
                          />
                        </div>
                      </div>

                      <Button onClick={savePreferences} className="w-full">
                        Save Preferences
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={acceptEssential}
              className="flex-shrink-0"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
