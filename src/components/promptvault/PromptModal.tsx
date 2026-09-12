"use client";

import { Copy, Heart, Check, X, Film, ImageIcon, Lightbulb, Sparkles } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { Prompt, PromptType } from "@/lib/prompts";
import { cn } from "@/lib/utils";
import { copyText } from "@/lib/copy";
import { toast } from "sonner";

const TYPE_STYLE: Record<PromptType, string> = {
  Imagem: "bg-brand-cyan/15 text-brand-cyan border-brand-cyan/30",
  Vídeo: "bg-brand-pink/15 text-brand-pink border-brand-pink/30",
  POV: "bg-brand-purple/20 text-brand-purple border-brand-purple/40",
  Selfie: "bg-fuchsia-400/15 text-fuchsia-300 border-fuchsia-400/30",
  UGC: "bg-cyan-400/15 text-cyan-300 border-cyan-400/30",
  Produto: "bg-amber-400/15 text-amber-300 border-amber-400/30",
};

interface PromptModalProps {
  prompt: Prompt | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
}

export function PromptModal({
  prompt,
  open,
  onOpenChange,
  isFavorite,
  onToggleFavorite,
}: PromptModalProps) {
  const [copied, setCopied] = useState(false);
  const hasImage = Boolean(prompt?.image);
  const hasVideo = Boolean(prompt?.videoUrl);
  const hasMedia = hasImage || hasVideo;
  const isNew = Boolean(prompt?.isNew);

  const handleCopy = async () => {
    if (!prompt) return;
    const ok = await copyText(prompt.prompt);
    if (ok) {
      setCopied(true);
      toast.success("Prompt copiado!");
      setTimeout(() => setCopied(false), 1600);
    } else {
      toast.error("Não foi possível copiar.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton={false}
        className={cn(
          "p-0 gap-0 overflow-hidden rounded-xl sm:rounded-2xl border-white/10 bg-popover/95 backdrop-blur-2xl",
          hasMedia ? "max-w-4xl" : "max-w-lg"
        )}
      >
        {prompt && (
          <div className={cn("flex flex-col max-h-[90vh] sm:max-h-[92vh]", hasMedia && "md:grid md:grid-cols-5")}>
            {/* Image side */}
            {hasImage && (
              <div className="relative md:col-span-2 h-40 sm:h-56 md:h-auto md:max-h-[92vh] bg-white/5 shrink-0">
                <img
                  src={prompt.image}
                  alt={prompt.title}
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent md:bg-gradient-to-r" />
                <span
                  className={cn(
                    "absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md",
                    TYPE_STYLE[prompt.type]
                  )}
                >
                  {prompt.type === "Vídeo" ? (
                    <Film className="h-3 w-3" />
                  ) : (
                    <ImageIcon className="h-3 w-3" />
                  )}
                  {prompt.type}
                </span>
                {isNew && (
                  <span className="absolute right-3 top-3 inline-flex items-center gap-0.5 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-emerald-300 backdrop-blur-md">
                    <Sparkles className="h-2.5 w-2.5" />
                    NOVO
                  </span>
                )}
              </div>
            )}

            {/* Video side (when no image but has videoUrl) */}
            {hasVideo && !hasImage && (
              <div className="relative md:col-span-2 h-36 sm:h-48 md:h-auto md:max-h-[92vh] bg-black/60 shrink-0">
                <video
                  src={prompt.videoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-contain"
                />
                <span
                  className={cn(
                    "absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md",
                    TYPE_STYLE[prompt.type]
                  )}
                >
                  <Film className="h-3 w-3" />
                  {prompt.type}
                </span>
              </div>
            )}

            {hasImage && hasVideo && (
              <div className="relative md:col-span-5 h-32 sm:h-44 bg-black/60 shrink-0">
                <video
                  src={prompt.videoUrl}
                  controls
                  playsInline
                  preload="metadata"
                  className="h-full w-full object-contain"
                />
                <span
                  className={cn(
                    "absolute left-3 top-3 inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md",
                    TYPE_STYLE[prompt.type]
                  )}
                >
                  <Film className="h-3 w-3" />
                  Vídeo
                </span>
              </div>
            )}

            {/* Details side */}
            <div className={cn("relative flex flex-col p-3 sm:p-5 md:p-6 overflow-y-auto overscroll-contain", hasMedia ? "md:col-span-3" : "")}>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                className="absolute right-3 top-3 grid h-7 w-7 place-items-center rounded-full border border-white/10 bg-black/30 text-white/70 backdrop-blur-md transition-colors hover:text-white hover:bg-black/50"
                aria-label="Fechar"
              >
                <X className="h-3.5 w-3.5" />
              </button>

              {!hasMedia && (
                <span
                  className={cn(
                    "mb-2 inline-flex w-fit items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] sm:text-xs font-bold uppercase tracking-wider backdrop-blur-md",
                    TYPE_STYLE[prompt.type]
                  )}
                >
                  {prompt.type === "Vídeo" ? (
                    <Film className="h-3 w-3" />
                  ) : (
                    <ImageIcon className="h-3 w-3" />
                  )}
                  {prompt.type}
                  {isNew && (
                    <span className="ml-1 inline-flex items-center gap-0.5 border-l border-white/20 pl-1 text-emerald-300">
                      <Sparkles className="h-2.5 w-2.5" />
                      NOVO
                    </span>
                  )}
                </span>
              )}

              <DialogTitle className="text-base sm:text-lg md:text-xl font-bold tracking-tight pr-8">
                {prompt.title}
              </DialogTitle>
              <DialogDescription className="sr-only">
                Detalhes do prompt {prompt.title}
              </DialogDescription>

              <p className="mt-1 text-[11px] sm:text-sm text-muted-foreground/80 leading-relaxed line-clamp-2 sm:line-clamp-none">
                {prompt.description}
              </p>

              {prompt.explanation && (
                <div className="mt-3 rounded-lg border border-brand-purple/20 bg-brand-purple/[0.05] p-3">
                  <p className="mb-1.5 flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-brand-purple">
                    <Lightbulb className="h-3 w-3" />
                    Como usar
                  </p>
                  <p className="whitespace-pre-line text-[11px] sm:text-[12px] leading-relaxed text-foreground/80">
                    {prompt.explanation}
                  </p>
                </div>
              )}

              {/* Prompt text - the main copy target */}
              <div className="mt-3 flex-1 min-h-0">
                <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground/60">
                  Prompt
                </p>
                <div className="relative rounded-lg border border-white/8 bg-black/30 max-h-[28vh] sm:max-h-[36vh] md:max-h-none overflow-y-auto overscroll-contain">
                  <pre className="whitespace-pre-wrap break-words p-2.5 sm:p-3.5 text-[10px] sm:text-[12px] leading-[1.5] sm:leading-[1.65] text-foreground/90 font-mono selection:bg-brand-purple/30">
                    {prompt.prompt}
                  </pre>
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md border border-white/10 bg-black/50 px-1.5 py-1 text-[9px] sm:text-[10px] font-bold text-white/90 backdrop-blur-md transition-all hover:bg-black/70 active:scale-95"
                  >
                    {copied ? (
                      <>
                        <Check className="h-3 w-3 text-emerald-400" />
                        <span className="text-emerald-400">OK</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-3 w-3" />
                        Copiar
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Bottom actions */}
              <div className="mt-3 sm:mt-4 flex items-center gap-2">
                <Button
                  type="button"
                  onClick={handleCopy}
                  className={cn(
                    "h-9 sm:h-10 flex-1 gap-1.5 text-[12px] sm:text-sm font-bold border-0 transition-all active:scale-[0.97]",
                    copied
                      ? "bg-emerald-500/90 text-white hover:bg-emerald-500"
                      : "bg-brand-gradient text-white hover:brightness-110"
                  )}
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5" />
                      Copiar prompt
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => onToggleFavorite(prompt.id)}
                  className={cn(
                    "h-9 sm:h-10 gap-1.5 border-white/10 text-[12px] sm:text-sm",
                    isFavorite
                      ? "bg-brand-pink/15 text-brand-pink border-brand-pink/30 hover:bg-brand-pink/20"
                      : "bg-white/5 text-foreground hover:bg-white/10"
                  )}
                >
                  <Heart
                    className={cn("h-3.5 w-3.5", isFavorite && "fill-current")}
                  />
                  {isFavorite ? "Salvo" : "Salvar"}
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
