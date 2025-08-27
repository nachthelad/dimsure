"use client";

import { Button } from "@/components/ui/button";
import { Share2 } from "lucide-react";

interface ShareButtonProps {
  title: string;
  description?: string;
  size?: "default" | "sm" | "lg" | "icon";
  variant?:
    | "default"
    | "destructive"
    | "outline"
    | "secondary"
    | "ghost"
    | "link";
}

export function ShareButton({
  title,
  description,
  size = "sm",
  variant = "outline",
}: ShareButtonProps) {
  const handleShare = () => {
    const url = window.location.href;
    const data: ShareData = { title, url };
    if (description) {
      data.text = description;
    }
    if (navigator.share) {
      navigator.share(data).catch(() => {
        navigator.clipboard.writeText(url);
      });
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <Button 
      variant={variant} 
      size={size} 
      onClick={handleShare}
      aria-label={`Share ${title}`}
    >
      <Share2 className="h-4 w-4 mr-2" />
      Share
    </Button>
  );
}
