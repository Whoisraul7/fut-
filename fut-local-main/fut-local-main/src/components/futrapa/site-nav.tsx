import { Link, useNavigate, useRouterState } from "@tanstack/react-router";
import { CalendarDays, Home, MapPin, Sparkles, User } from "lucide-react";

import { Brand } from "./brand";
import { useAuth, useProfile } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useQueryClient } from "@tanstack/react-query";

const LINKS = [
  { to: "/", label: "Início", icon: Home },
  { to: "/quadras", label: "Quadras", icon: MapPin },
  { to: "/partidas", label: "Partidas", icon: CalendarDays },
  { to: "/futrapa-plus", label: "FutRapa+", icon: Sparkles },
] as const;

export function SiteHeader() {
  const { user } = useAuth();
  const { data: profile } = useProfile();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  async function handleSignOut() {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }

  return (
    <header className="sticky top-0 z-50 w-full glass-panel border-b">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Brand />

        <nav className="hidden items-center gap-1 md:flex">
          {LINKS.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className="rounded-full px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
              activeOptions={{ exact: link.to === "/" }}
              activeProps={{ className: "bg-secondary text-foreground" }}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="rounded-full outline-none ring-ring focus-visible:ring-2">
                  <Avatar className="h-9 w-9 border border-border">
                    <AvatarImage src={profile?.avatar_url ?? undefined} alt={profile?.name ?? ""} />
                    <AvatarFallback className="bg-secondary text-sm">
                      {(profile?.name ?? "J").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-52">
                <DropdownMenuItem asChild>
                  <Link to="/dashboard">Meu painel</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/perfil">Meu perfil</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/criar-partida">Criar partida</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onSelect={() => void handleSignOut()}>Sair</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild size="sm" className="rounded-full font-semibold">
              <Link to="/auth">Entrar</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}

export function MobileTabBar() {
  const { user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  const items = [
    ...LINKS,
    { to: user ? "/dashboard" : "/auth", label: "Perfil", icon: User } as const,
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 glass-panel border-t pb-[env(safe-area-inset-bottom)] md:hidden">
      <ul className="mx-auto flex max-w-md items-stretch justify-between px-2">
        {items.map((item) => {
          const active =
            item.to === "/" ? pathname === "/" : pathname.startsWith(item.to as string);
          return (
            <li key={item.label} className="flex-1">
              <Link
                to={item.to}
                className={cn(
                  "flex flex-col items-center gap-1 py-2.5 text-[11px] font-medium transition-colors",
                  active ? "text-primary" : "text-muted-foreground",
                )}
              >
                <item.icon className={cn("h-5 w-5", active && "drop-shadow-glow")} />
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border/60 py-10 text-sm text-muted-foreground">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-4 text-center">
        <Brand compact />
        <p>Encontre uma quadra. Marque a partida. Jogue futebol.</p>
        <p className="text-xs">© {new Date().getFullYear()} FutRapa</p>
      </div>
    </footer>
  );
}
