"use client";

import { useMemo, useState } from "react";
import { Sparkles, Heart, ChevronDown, Film, ArrowRight, Zap, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PROMPTS, type Prompt } from "@/lib/prompts";
import { useFavoritesStore } from "@/lib/favorites-store";
import { toast } from "sonner";
import { applyFilter, filterLabel, type Filter, ALL_FILTER } from "./filters";
import { Sidebar, MobileSidebar } from "./Sidebar";
import { SearchBar } from "./SearchBar";
import { PromptCard } from "./PromptCard";
import { PromptModal } from "./PromptModal";
import { EmptyState } from "./EmptyState";
import { UpdateBanner } from "./UpdateBanner";
import { ManequimPopup } from "./ManequimPopup";

const PAGE_SIZE = 12;

export function Gallery() {
  const [filter, setFilterState] = useState<Filter>(ALL_FILTER);
  const [query, setQueryState] = useState("");
  const [page, setPage] = useState(0);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [selected, setSelected] = useState<Prompt | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const favIds = useFavoritesStore((s) => s.ids);
  const toggleFav = useFavoritesStore((s) => s.toggle);

  const setFilter = (f: Filter) => { setFilterState(f); setPage(0); };
  const setQuery = (q: string) => { setQueryState(q); setPage(0); };

  const filtered = useMemo(() => {
    const base = applyFilter(PROMPTS, filter, favIds);
    const q = query.trim().toLowerCase();
    if (!q) return base;
    return base.filter((p) => (
      p.title.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.type.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q))
    ));
  }, [filter, query, favIds]);

  const visibleCount = PAGE_SIZE * (page + 1);
  const visible = filtered.slice(0, visibleCount);
  const hasMore = visibleCount < filtered.length;
  const hasPreview = (p: Prompt) => Boolean(p.image) || Boolean(p.videoUrl);
  const previewCards = visible.filter(hasPreview);
  const noPreviewCards = visible.filter((p) => !hasPreview(p));
  const hasPreviewCards = previewCards.length > 0;
  const hasNoPreviewCards = noPreviewCards.length > 0;
  const isVideosNoRef = filter.kind === "videos-no-ref";
  const isVideosWithRef = filter.kind === "videos-with-ref";

  // Featured new prompts for the "all" view
  const isNewFilter = filter.kind === "novidades" || filter.kind === "updates";
  const isAllFilter = filter.kind === "all" && !query.trim();
  const newPrompts = useMemo(() => {
    if (!isAllFilter) return [];
    return PROMPTS.filter((p) => p.isNew && (p.image || p.videoUrl)).slice(0, 8);
  }, [isAllFilter]);

  const handleToggleFav = (id: string) => {
    const r = toggleFav(id);
    if (r === "added") toast.success("Adicionado aos favoritos.");
    else toast("Removido dos favoritos.");
  };
  const openModal = (prompt: Prompt) => { setSelected(prompt); setModalOpen(true); };
  const handleSeeFavorites = () => { setFilter({ kind: "favorites" }); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const handleReset = () => { setQuery(""); setFilter(ALL_FILTER); };
  const isFav = (id: string) => favIds.includes(id);
  const activeLabel = filterLabel(filter);

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 min-h-0">
        <Sidebar filter={filter} onSelect={setFilter} />
        <MobileSidebar filter={filter} onSelect={setFilter} open={mobileOpen} onOpenChange={setMobileOpen} />
        <main className="flex-1 min-w-0">
          {/* Mobile header */}
          <div className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-white/5 bg-background/80 px-4 py-3 backdrop-blur-xl">
            <div className="flex items-center gap-2.5">
              <div className="grid h-8 w-8 place-items-center rounded-lg bg-brand-gradient glow-purple"><Sparkles className="h-4 w-4 text-white" /></div>
              <div className="leading-tight"><p className="text-sm font-semibold tracking-wide">PromptVault</p><p className="text-[10px] text-muted-foreground">TikTok Shop</p></div>
            </div>
            <Button variant="ghost" size="icon" onClick={handleSeeFavorites} className="relative h-9 w-9 border border-white/10 bg-white/5" aria-label="Ver favoritos">
              <Heart className="h-4 w-4 text-brand-pink" />
              {favIds.length > 0 && <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-brand-pink px-1 text-[10px] font-bold text-black">{favIds.length}</span>}
            </Button>
          </div>

          <div className="px-3 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8 space-y-4 sm:space-y-6 lg:space-y-7">
            <SearchBar query={query} onQueryChange={setQuery} filter={filter} onFilterChange={setFilter} onOpenMenu={() => setMobileOpen(true)} />

            {/* Featured "Novidades" horizontal scroll - only on "all" filter */}
            {newPrompts.length > 0 && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="grid h-7 w-7 place-items-center rounded-lg bg-brand-gradient shadow-md shadow-brand-purple/20">
                      <Sparkles className="h-3.5 w-3.5 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">Novidades</p>
                      <p className="text-[10px] text-muted-foreground">Prompts adicionados recentemente</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setFilter({ kind: "novidades" })}
                    className="inline-flex items-center gap-1 text-[11px] font-semibold text-brand-purple hover:text-brand-pink transition-colors"
                  >
                    Ver todos
                    <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory" style={{ scrollbarWidth: "none" }}>
                  {newPrompts.map((prompt) => (
                    <button
                      key={prompt.id}
                      type="button"
                      onClick={() => openModal(prompt)}
                      className="group relative shrink-0 w-36 sm:w-44 snap-start rounded-xl overflow-hidden border border-white/10 bg-white/5 transition-all hover:border-brand-purple/30 hover:shadow-lg hover:shadow-brand-purple/10"
                    >
                      <div className="aspect-[3/4] w-full bg-white/5 overflow-hidden">
                        {prompt.image ? (
                          <img
                            src={prompt.image}
                            alt={prompt.title}
                            loading="lazy"
                            decoding="async"
                            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.05]"
                          />
                        ) : prompt.videoUrl ? (
                          <video
                            src={prompt.videoUrl}
                            muted
                            playsInline
                            preload="metadata"
                            className="h-full w-full object-cover opacity-80"
                          />
                        ) : null}
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                      {/* NOVO badge */}
                      <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-500/20 px-1.5 py-px text-[8px] font-bold uppercase tracking-wider text-emerald-300 backdrop-blur-md">
                        <Sparkles className="h-2 w-2" />
                        NOVO
                      </span>
                      {/* Title overlay */}
                      <div className="absolute bottom-0 left-0 right-0 p-2">
                        <p className="text-[11px] font-semibold leading-tight line-clamp-2 text-white">{prompt.title}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Filter info bar */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <p className="text-xs sm:text-sm text-muted-foreground">
                Mostrando <span className="font-semibold text-foreground">{visible.length}</span> de{" "}
                <span className="font-semibold text-foreground">{filtered.length}</span> prompts
                {filter.kind !== "all" && (<> em <span className="font-semibold text-gradient-brand">{activeLabel}</span></>)}
              </p>
              {(isNewFilter || filter.kind === "updates") && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-cyan/30 bg-brand-cyan/10 px-3 py-1 text-[11px] font-medium text-brand-cyan">
                  <Sparkles className="h-3 w-3" /> Novidades no acervo
                </span>
              )}
            </div>

            {visible.length === 0 ? (
              <EmptyState onReset={handleReset} />
            ) : isVideosNoRef ? (
              <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-2.5">
                {visible.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} isFavorite={isFav(prompt.id)} onToggleFavorite={handleToggleFav} onOpen={openModal} />)}
              </div>
            ) : isVideosWithRef ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
                {visible.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} isFavorite={isFav(prompt.id)} onToggleFavorite={handleToggleFav} onOpen={openModal} />)}
              </div>
            ) : (
              <div className="space-y-6">
                {hasPreviewCards && (
                  <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 lg:gap-5">
                    {previewCards.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} isFavorite={isFav(prompt.id)} onToggleFavorite={handleToggleFav} onOpen={openModal} />)}
                  </div>
                )}
                {hasNoPreviewCards && (
                  <div className="pt-4">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex-1 h-px bg-white/10" />
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Film className="h-4 w-4" />
                        <span className="text-sm font-semibold tracking-wide">Sem referência visual</span>
                        <span className="rounded-md bg-white/5 px-2 py-0.5 text-xs font-medium tabular-nums">{noPreviewCards.length}</span>
                      </div>
                      <div className="flex-1 h-px bg-white/10" />
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 sm:gap-2.5">
                      {noPreviewCards.map((prompt) => <PromptCard key={prompt.id} prompt={prompt} isFavorite={isFav(prompt.id)} onToggleFavorite={handleToggleFav} onOpen={openModal} />)}
                    </div>
                  </div>
                )}
              </div>
            )}
            {hasMore && visible.length > 0 && (
              <div className="flex justify-center pt-2">
                <Button type="button" onClick={() => setPage((p) => p + 1)} variant="outline" className="h-11 gap-2 rounded-full border-white/10 bg-white/5 px-7 text-foreground hover:bg-white/10">
                  Ver mais prompts<ChevronDown className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>
        </main>
      </div>
      <footer className="mt-auto border-t border-white/5 bg-background/60 backdrop-blur-xl">
        <div className="px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2.5">
            <div className="grid h-7 w-7 place-items-center rounded-lg bg-brand-gradient"><Sparkles className="h-3.5 w-3.5 text-white" /></div>
            <p className="text-xs text-muted-foreground"><span className="font-semibold text-foreground">PromptVault</span>{" "}TikTok Shop · Seu acervo visual de prompts prontos para copiar, colar e usar.</p>
          </div>
          <p className="text-[11px] text-muted-foreground/70">Acervo exclusivo para clientes · {PROMPTS.length} prompts disponíveis</p>
        </div>
      </footer>
      <UpdateBanner onNavigate={(cat) => setFilter({ kind: "category", value: cat as any })} onNavigateNovidades={() => setFilter({ kind: "novidades" })} />
      <ManequimPopup onNavigate={() => setFilter({ kind: "category", value: "Selfie UGC" })} />
      <PromptModal prompt={selected} open={modalOpen} onOpenChange={setModalOpen} isFavorite={selected ? isFav(selected.id) : false} onToggleFavorite={handleToggleFav} />
    </div>
  );
}
