"use client";

import {
  Copy,
  Heart,
  Eye,
  Film,
  ImageIcon,
  Check,
  Play,
  Sparkles,
} from "lucide-react";
import { useState } from "react";
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

function TypeIcon({ type, className }: { type: PromptType; className?: string }) {
  if (type === "Vídeo") return <Film className={className} />;
  if (type === "Produto") return <Eye className={className} />;
  return <ImageIcon className={className} />;
}

interface PromptCardProps {
  prompt: Prompt;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpen: (prompt: Prompt) => void;
}

export function PromptCard({
  prompt,
  isFavorite,
  onToggleFavorite,
  onOpen,
}: PromptCardProps) {
  const [copied, setCopied] = useState(false);
  const hasImage = Boolean(prompt.image);
  const hasVideo = Boolean(prompt.videoUrl);
  const showVideoThumb = hasVideo && !hasImage;
  const isNew = Boolean(prompt.isNew);

  const handleCopy = async () => {
    const ok = await copyText(prompt.prompt);
    if (ok) {
      setCopied(true);
      toast.success("Prompt copiado!");
      setTimeout(() => setCopied(false), 1600);
    } else {
      toast.error("Não foi possível copiar.");
    }
  };

  /* ─── COMPACT CARD (no preview at all — no image AND no video) ─── */
  if (!hasImage && !hasVideo) {
    return (
      <article className="group glass relative rounded-xl overflow-hidden transition-all duration-300 hover:border-white/15 hover:shadow-lg hover:shadow-black/20">
        <div className="flex items-center gap-2 p-2.5 sm:p-3">
          {/* Type icon */}
          <span
            className={cn(
              "inline-flex items-center justify-center shrink-0 rounded-lg border h-8 w-8 sm:h-9 sm:w-9",
              TYPE_STYLE[prompt.type]
            )}
          >
            <TypeIcon type={prompt.type} className="h-3 w-3 sm:h-3.5 sm:w-3.5" />
          </span>

          {/* Text */}
          <button
            type="button"
            onClick={() => onOpen(prompt)}
            className="flex-1 min-w-0 text-left focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/60 rounded"
            aria-label={`Ver detalhes de ${prompt.title}`}
          >
            <h3 className="text-[12px] sm:text-sm font-semibold leading-tight line-clamp-1 text-foreground">
              {prompt.title}
              {isNew && (
                <span className="ml-1.5 inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-500/20 px-1 py-px text-[7px] font-bold uppercase tracking-wider text-emerald-300">
                  NOVO
                </span>
              )}
            </h3>
            <p className="mt-0.5 text-[10px] sm:text-[11px] text-muted-foreground/70 leading-snug line-clamp-1">
              {prompt.description}
            </p>
          </button>

          {/* Actions */}
          <div className="flex items-center gap-1 shrink-0">
            <Button
              type="button"
              onClick={handleCopy}
              size="sm"
              className={cn(
                "h-7 px-2 gap-1 text-[10px] font-bold border-0 transition-all active:scale-[0.97] rounded-lg",
                copied
                  ? "bg-emerald-500/90 text-white"
                  : "bg-brand-gradient text-white hover:brightness-110"
              )}
            >
              {copied ? (
                <Check className="h-3 w-3" />
              ) : (
                <Copy className="h-3 w-3" />
              )}
            </Button>
            <button
              type="button"
              onClick={() => onToggleFavorite(prompt.id)}
              className={cn(
                "grid h-7 w-7 shrink-0 place-items-center rounded-lg border transition-all",
                isFavorite
                  ? "border-brand-pink/40 bg-brand-pink/20 text-brand-pink"
                  : "border-white/10 bg-white/5 text-muted-foreground/70 hover:text-brand-pink hover:border-brand-pink/40"
              )}
              aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
            >
              <Heart
                className={cn(
                  "h-3 w-3 transition-transform",
                  isFavorite && "fill-current scale-110"
                )}
              />
            </button>
          </div>
        </div>
      </article>
    );
  }

  /* ─── FULL CARD (with reference image) ─── */
  return (
    <article className={cn(
      "group glass relative rounded-xl sm:rounded-2xl overflow-hidden transition-all duration-300 hover:-translate-y-0.5 hover:border-white/15 hover:shadow-xl hover:shadow-black/30 flex flex-col",
      isNew && "ring-1 ring-emerald-400/20"
    )}>
      {/* Image / Video thumb */}
      <button
        type="button"
        onClick={() => onOpen(prompt)}
        className="relative block w-full overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-purple/60"
        aria-label={`Ver detalhes de ${prompt.title}`}
      >
        <div className="aspect-[3/4] sm:aspect-[4/5] w-full bg-white/5">
          {showVideoThumb ? (
            <div className="relative h-full w-full bg-black/40">
              <video
                src={prompt.videoUrl}
                muted
                playsInline
                preload="metadata"
                className="h-full w-full object-cover opacity-80 transition-opacity duration-300 group-hover:opacity-100"
              />
              <div className="absolute inset-0 grid place-items-center">
                <div className="grid h-10 w-10 sm:h-14 sm:w-14 place-items-center rounded-full bg-white/15 backdrop-blur-md border border-white/20 transition-transform duration-300 group-hover:scale-110">
                  <Play className="h-4 w-4 sm:h-6 sm:w-6 text-white ml-0.5" />
                </div>
              </div>
            </div>
          ) : (
            <img
              src={prompt.image}
              alt={prompt.title}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
            />
          )}
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

        {/* Type badge */}
        <span
          className={cn(
            "absolute left-2 top-2 sm:left-3 sm:top-3 inline-flex items-center gap-1 rounded-full border px-1.5 py-0.5 text-[8px] sm:text-[10px] font-bold uppercase tracking-wider backdrop-blur-md",
            TYPE_STYLE[prompt.type]
          )}
        >
          <TypeIcon type={prompt.type} className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
          {prompt.type}
        </span>

        {/* NOVO badge */}
        {isNew && (
          <span className="absolute right-2 top-2 sm:right-3 sm:top-3 z-10 inline-flex items-center gap-0.5 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-bold uppercase tracking-wider text-emerald-300 backdrop-blur-md">
            <Sparkles className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
            NOVO
          </span>
        )}
      </button>

      {/* Favorite */}
      <button
        type="button"
        onClick={() => onToggleFavorite(prompt.id)}
        className={cn(
          "absolute right-2 top-2 sm:right-3 sm:top-3 z-10 grid h-7 w-7 sm:h-8 sm:w-8 place-items-center rounded-full border backdrop-blur-md transition-all",
          isNew && "right-2 top-8 sm:right-3 sm:top-10",
          isFavorite
            ? "border-brand-pink/40 bg-brand-pink/20 text-brand-pink"
            : "border-white/10 bg-black/25 text-white/70 hover:text-brand-pink hover:border-brand-pink/40"
        )}
        aria-label={isFavorite ? "Remover dos favoritos" : "Adicionar aos favoritos"}
      >
        <Heart
          className={cn("h-3 w-3 sm:h-3.5 sm:w-3.5 transition-transform", isFavorite && "fill-current scale-110")}
        />
      </button>

      {/* Body */}
      <div className="flex flex-1 flex-col p-2 sm:p-3 pb-1.5 sm:pb-2.5">
        <h3 className="text-[11px] sm:text-sm font-bold leading-tight line-clamp-1 text-foreground">
          {prompt.title}
        </h3>
        <p className="mt-0.5 text-[9px] sm:text-xs text-muted-foreground/80 leading-relaxed line-clamp-2">
          {prompt.description}
        </p>

        <div className="mt-auto pt-1.5 sm:pt-2 flex items-center gap-1.5">
          <Button
            type="button"
            onClick={handleCopy}
            size="sm"
            className={cn(
              "h-7 sm:h-8 flex-1 gap-1 text-[10px] sm:text-xs font-bold border-0 transition-all active:scale-[0.97]",
              copied
                ? "bg-emerald-500/90 text-white"
                : "bg-brand-gradient text-white hover:brightness-110"
            )}
          >
            {copied ? (
              <>
                <Check className="h-3 w-3" />
                <span className="sm:inline">OK</span>
              </>
            ) : (
              <>
                <Copy className="h-3 w-3" />
                <span className="sm:inline">Copiar</span>
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpen(prompt)}
            className="h-7 w-7 sm:h-8 sm:w-8 p-0 border-white/10 bg-white/5 text-foreground/70 hover:bg-white/10 hover:text-foreground"
          >
            <Eye className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </article>
  );
}
