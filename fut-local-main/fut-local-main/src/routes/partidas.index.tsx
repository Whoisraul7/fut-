import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { CalendarDays, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { MatchCard } from "@/components/futrapa/match-card";
import { CardSkeletonGrid, EmptyState, ErrorState } from "@/components/futrapa/states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fetchMatches, spotsLeft } from "@/lib/futrapa/api";
import { useUserLocation } from "@/hooks/useUserLocation";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/partidas/")({
  head: () => ({
    meta: [
      { title: "Partidas abertas — FutRapa" },
      {
        name: "description",
        content:
          "Veja partidas de futebol abertas perto de você, confira vagas restantes e entre no jogo.",
      },
      { property: "og:title", content: "Partidas abertas — FutRapa" },
      {
        property: "og:description",
        content: "Escolha uma partida, confira as vagas e reúna o time.",
      },
    ],
  }),
  component: MatchesPage,
});

type Filter = "todas" | "vagas" | "cidade" | "iniciante" | "intermediario" | "avancado";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "vagas", label: "Com vagas" },
  { value: "cidade", label: "Na minha cidade" },
  { value: "iniciante", label: "Iniciante" },
  { value: "intermediario", label: "Intermediário" },
  { value: "avancado", label: "Avançado" },
];

function MatchesPage() {
  const [filter, setFilter] = useState<Filter>("todas");
  const [search, setSearch] = useState("");
  const { location } = useUserLocation();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["matches"],
    queryFn: fetchMatches,
  });

  const matches = useMemo(() => {
    const term = search.trim().toLowerCase();
    return (data ?? []).filter((m) => {
      if (term && !`${m.title} ${m.court?.name ?? ""} ${m.court?.city ?? ""}`.toLowerCase().includes(term))
        return false;
      if (filter === "vagas") return spotsLeft(m) > 0;
      if (filter === "cidade") return location?.city ? m.court?.city === location.city : true;
      if (["iniciante", "intermediario", "avancado"].includes(filter)) return m.level === filter;
      return true;
    });
  }, [data, filter, search, location]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold sm:text-4xl">Partidas</h1>
          <p className="mt-2 text-muted-foreground">
            Entre em uma partida aberta ou organize a sua.
          </p>
        </div>
        <Button asChild className="rounded-full font-semibold">
          <Link to="/criar-partida">Criar partida</Link>
        </Button>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por partida, quadra ou cidade"
          className="h-12 rounded-full pl-11"
        />
      </div>

      <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1">
        {FILTERS.map((f) => (
          <button key={f.value} onClick={() => setFilter(f.value)} className="shrink-0">
            <Badge
              variant={filter === f.value ? "default" : "outline"}
              className={cn(
                "cursor-pointer rounded-full px-4 py-2 text-xs font-medium",
                filter === f.value && "shadow-glow",
              )}
            >
              {f.label}
            </Badge>
          </button>
        ))}
      </div>

      {isLoading ? (
        <CardSkeletonGrid count={6} height={240} />
      ) : isError ? (
        <ErrorState message={(error as Error)?.message} />
      ) : matches.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Nenhuma partida por aqui"
          description="Ainda não há partidas com esses filtros. Que tal criar a primeira?"
          action={
            <Button asChild className="rounded-full font-semibold">
              <Link to="/criar-partida">Criar partida</Link>
            </Button>
          }
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map((m) => (
            <MatchCard key={m.id} match={m} />
          ))}
        </div>
      )}
    </div>
  );
}
