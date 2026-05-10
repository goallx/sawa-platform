"use client";

import { useState } from "react";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ShareWinCardProps {
  copyText: string;
  twitterUrl: string;
  instagramUrl: string;
}

export function ShareWinCard({
  copyText,
  twitterUrl,
  instagramUrl
}: ShareWinCardProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    await navigator.clipboard.writeText(copyText);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <div className="space-y-4">
      <textarea
        readOnly
        value={copyText}
        rows={5}
        className="flex w-full rounded-lg border border-[#E2E8F0] bg-white px-4 py-3 text-sm text-[#0F172A] outline-none"
      />
      <button
        type="button"
        onClick={handleCopy}
        className={cn(buttonVariants(), "w-full justify-center")}
      >
        {copied ? "Copied" : "Copy to Clipboard"}
      </button>
      <div className="flex flex-col gap-3 sm:flex-row">
        <a
          href={twitterUrl}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ variant: "outline" }), "justify-center")}
        >
          Share on Twitter
        </a>
        <a
          href={instagramUrl}
          target="_blank"
          rel="noreferrer"
          className={cn(buttonVariants({ variant: "outline" }), "justify-center")}
        >
          Share on Instagram
        </a>
      </div>
    </div>
  );
}
