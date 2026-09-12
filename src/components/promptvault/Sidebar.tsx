"use client";

import {
  LayoutGrid,
  Image as ImageIcon,
  Film,
  Camera,
  Eye,
  User,
  Hand,
  ShoppingCart,
  ScanFace,
  Heart,
  RefreshCw,
  LifeBuoy,
  LogOut,
  UserCircle,
  Sparkles,
  X,
  Target,
  PawPrint,
  Baby,
  TreePine,
  Zap,
  ArrowRightLeft,
  Users,
  Move,
  Shirt,
  ChevronDown,
} from "lucide-react";
import { useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetClose,
} from "@/components/ui/sheet";
import { useAuthStore } from "@/lib/auth-store";
import { useFavoritesStore } from "@/lib/favorites-store";
import { toast } from "sonner";
import { countFor, filterKey, type Filter } from "./filters";
import { cn } from "@/lib/utils";

interface NavItem {
  label: string;
  icon: React.ElementType;
  filter: Filter;
  isNew?: boolean;
}

interface NavSection {
  title: string;
  items: NavItem[];
  defaultOpen?: boolean;
}

const NAV_SECTIONS: NavSection[] = [
  {
    title: "Principal",
    defaultOpen: true,
    items: [
      { label: "Todos os prompts", icon: LayoutGrid, filter: { kind: "all" } },
      { label: "Novidades", icon: Sparkles, filter: { kind: "novidades" }, isNew: true },
      { label: "Imagem", icon: ImageIcon, filter: { kind: "type", value: "Imagem" } },
      { label: "Vídeo", icon: Film, filter: { kind: "videos-with-ref" } },
      { label: "Vídeos Parte 2", icon: Film, filter: { kind: "videos-no-ref" } },
    ],
  },
  {
    title: "Estilo & Moda",
    defaultOpen: true,
    items: [
      { label: "UGC", icon: Camera, filter: { kind: "category", value: "UGC" } },
      { label: "POV", icon: Eye, filter: { kind: "category", value: "POV" } },
      { label: "POV Avançado", icon: Target, filter: { kind: "category", value: "POV Avançado" } },
      { label: "Selfie", icon: User, filter: { kind: "category", value: "Selfie" } },
      { label: "Produto", icon: Hand, filter: { kind: "category", value: "Produto" } },
      { label: "Moda", icon: Shirt, filter: { kind: "category", value: "Moda" }, isNew: true },
      { label: "Masculino", icon: User, filter: { kind: "category", value: "Masculino" }, isNew: true },
      { label: "Casal", icon: Users, filter: { kind: "category", value: "Casal" }, isNew: true },
      { label: "Lingerie", icon: Heart, filter: { kind: "category", value: "Lingerie" }, isNew: true },
      { label: "Movimento", icon: Move, filter: { kind: "category", value: "Movimento" }, isNew: true },
    ],
  },
  {
    title: "Temas",
    defaultOpen: true,
    items: [
      { label: "Natal", icon: TreePine, filter: { kind: "category", value: "Natal" }, isNew: true },
      { label: "Ganchos", icon: Zap, filter: { kind: "category", value: "Gancho" }, isNew: true },
      { label: "Transições", icon: ArrowRightLeft, filter: { kind: "category", value: "Transição" }, isNew: true },
      { label: "PET", icon: PawPrint, filter: { kind: "category", value: "PET" } },
      { label: "Infantil", icon: Baby, filter: { kind: "category", value: "Infantil" } },
    ],
  },
  {
    title: "TikTok",
    defaultOpen: false,
    items: [
      { label: "TikTok Shop", icon: ShoppingCart, filter: { kind: "category", value: "TikTok Shop" } },
      { label: "Identidade AI", icon: ScanFace, filter: { kind: "category", value: "Identidade AI" } },
      { label: "Selfie UGC", icon: Camera, filter: { kind: "category", value: "Selfie UGC" } },
    ],
  },
  {
    title: "Meus",
    defaultOpen: true,
    items: [
      { label: "Favoritos", icon: Heart, filter: { kind: "favorites" } },
      { label: "Atualizações", icon: RefreshCw, filter: { kind: "updates" } },
    ],
  },
];

interface SidebarContentProps {
  filter: Filter;
  onSelect: (f: Filter) => void;
  onClose?: () => void;
}

function SidebarContent({ filter, onSelect, onClose }: SidebarContentProps) {
  const logout = useAuthStore((s) => s.logout);
  const favIds = useFavoritesStore((s) => s.ids);
  const activeKey = filterKey(filter);
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () => Object.fromEntries(NAV_SECTIONS.map((s) => [s.title, s.defaultOpen ?? true]))
  );

  const toggleSection = useCallback((title: string) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  }, []);

  const handleSelect = (f: Filter) => {
    onSelect(f);
    onClose?.();
  };

  const handleAccount = () => {
    toast.info("PromptVault", {
      description: "Você está conectado ao acervo exclusivo.",
    });
    onClose?.();
  };

  const handleSupport = () => {
    toast.info("Suporte PromptVault", {
      description: "Envie um e-mail para suporte@promptvault.app — responderemos em até 24h.",
    });
    onClose?.();
  };

  const handleLogout = () => {
    logout();
    toast.success("Você saiu do acervo. Até logo!");
    onClose?.();
  };

  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Brand */}
      <div className="shrink-0 flex items-center justify-between gap-2 px-4 pt-4 pb-3">
        <div className="flex items-center gap-2.5">
          <div className="grid h-8 w-8 place-items-center rounded-xl bg-brand-gradient glow-purple">
            <Sparkles className="h-4 w-4 text-white" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-semibold tracking-wide">PromptVault</p>
            <p className="text-[10px] text-muted-foreground">TikTok Shop</p>
          </div>
        </div>
        {onClose && (
          <SheetClose asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground lg:hidden"
              aria-label="Fechar menu"
            >
              <X className="h-4 w-4" />
            </Button>
          </SheetClose>
        )}
      </div>
      <Separator className="bg-white/5" />

      {/* Nav with collapsible sections - proper overflow scrolling */}
      <nav className="flex-1 min-h-0 overflow-y-auto overscroll-contain px-2.5 py-2" style={{ scrollbarGutter: "stable" }}>
        {NAV_SECTIONS.map((section) => {
          const isOpen = openSections[section.title] !== false;
          return (
            <div key={section.title} className="mb-0.5">
              <button
                type="button"
                onClick={() => toggleSection(section.title)}
                className="flex w-full items-center gap-1.5 px-2.5 py-1.5 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 hover:text-muted-foreground transition-colors"
              >
                <ChevronDown
                  className={cn(
                    "h-3 w-3 shrink-0 transition-transform duration-200",
                    !isOpen && "-rotate-90"
                  )}
                />
                {section.title}
              </button>
              {isOpen && (
                <div className="space-y-px">
                  {section.items.map((item) => {
                    const active = activeKey === filterKey(item.filter);
                    const Icon = item.icon;
                    const count = countFor(item.filter, favIds);
                    return (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => handleSelect(item.filter)}
                        className={cn(
                          "group flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] transition-all",
                          active
                            ? "bg-white/10 text-white shadow-inner"
                            : "text-muted-foreground hover:bg-white/5 hover:text-foreground"
                        )}
                      >
                        <span
                          className={cn(
                            "grid h-6 w-6 shrink-0 place-items-center rounded-md transition-colors",
                            active
                              ? "bg-brand-gradient text-white"
                              : "bg-white/5 text-muted-foreground group-hover:text-foreground"
                          )}
                        >
                          <Icon className="h-3 w-3" />
                        </span>
                        <span className="flex-1 text-left font-medium truncate">
                          {item.label}
                          {item.isNew && (
                            <span className="ml-1 inline-flex items-center rounded-full border border-emerald-400/40 bg-emerald-500/20 px-1 py-px text-[7px] font-bold uppercase tracking-wider text-emerald-300">
                              NOVO
                            </span>
                          )}
                        </span>
                        <span
                          className={cn(
                            "rounded px-1 py-0.5 text-[9px] font-semibold tabular-nums",
                            active
                              ? "bg-white/15 text-white"
                              : "bg-white/5 text-muted-foreground"
                          )}
                        >
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <Separator className="bg-white/5" />
      {/* Footer actions */}
      <div className="shrink-0 px-2.5 py-2 space-y-px">
        <button
          type="button"
          onClick={handleAccount}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground"
        >
          <span className="grid h-6 w-6 place-items-center rounded-md bg-white/5">
            <UserCircle className="h-3 w-3" />
          </span>
          <span className="flex-1 text-left font-medium">Minha conta</span>
        </button>
        <button
          type="button"
          onClick={handleSupport}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] text-muted-foreground transition-all hover:bg-white/5 hover:text-foreground"
        >
          <span className="grid h-6 w-6 place-items-center rounded-md bg-white/5">
            <LifeBuoy className="h-3 w-3" />
          </span>
          <span className="flex-1 text-left font-medium">Suporte</span>
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className="flex w-full items-center gap-2 rounded-lg px-2.5 py-1.5 text-[12px] text-rose-300/90 transition-all hover:bg-rose-500/10 hover:text-rose-200"
        >
          <span className="grid h-6 w-6 place-items-center rounded-md bg-rose-500/10">
            <LogOut className="h-3 w-3" />
          </span>
          <span className="flex-1 text-left font-medium">Sair</span>
        </button>
      </div>
    </div>
  );
}

interface SidebarProps {
  filter: Filter;
  onSelect: (f: Filter) => void;
}

export function Sidebar({ filter, onSelect }: SidebarProps) {
  return (
    <aside className="hidden lg:flex sticky top-0 h-screen w-64 shrink-0 flex-col border-r border-white/5 bg-sidebar/60 backdrop-blur-xl">
      <SidebarContent filter={filter} onSelect={onSelect} />
    </aside>
  );
}

interface MobileSidebarProps extends SidebarProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MobileSidebar({
  filter,
  onSelect,
  open,
  onOpenChange,
}: MobileSidebarProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="left"
        className="w-[280px] max-w-[85vw] border-white/5 bg-sidebar/95 p-0"
      >
        <SheetHeader className="sr-only">
          <SheetTitle>Menu de navegação</SheetTitle>
        </SheetHeader>
        <SidebarContent
          filter={filter}
          onSelect={onSelect}
          onClose={() => onOpenChange(false)}
        />
      </SheetContent>
    </Sheet>
  );
}
