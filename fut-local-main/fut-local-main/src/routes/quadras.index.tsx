import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { MapPin, Search } from "lucide-react";
import { useMemo, useState } from "react";

import { CourtCard } from "@/components/futrapa/court-card";
import { LocationBar, MiniMap } from "@/components/futrapa/location-bar";
import { CardSkeletonGrid, EmptyState, ErrorState } from "@/components/futrapa/states";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useUserLocation } from "@/hooks/useUserLocation";
import { fetchCourts } from "@/lib/futrapa/api";
import { distanceKm } from "@/lib/futrapa/geo";
import { cn } from "@/lib/utils";
import type { Court } from "@/lib/futrapa/types";

export const Route = createFileRoute("/quadras/")({
  head: () => ({
    meta: [
      { title: "Quadras próximas — FutRapa" },
      {
        name: "description",
        content:
          "Veja quadras públicas e privadas próximas: society, futsal, grama e areia, com distância, horários e avaliação.",
      },
      { property: "og:title", content: "Quadras próximas — FutRapa" },
      {
        property: "og:description",
        content: "Filtre por tipo, superfície, distância e avaliação e crie sua partida.",
      },
    ],
  }),
  component: CourtsPage,
});

type Filter =
  | "todas"
  | "publica"
  | "privada"
  | "proximas"
  | "avaliadas"
  | "society"
  | "futsal"
  | "grama"
  | "areia";

const FILTERS: { value: Filter; label: string }[] = [
  { value: "todas", label: "Todas" },
  { value: "publica", label: "Públicas" },
  { value: "privada", label: "Privadas" },
  { value: "proximas", label: "Mais próximas" },
  { value: "avaliadas", label: "Melhor avaliadas" },
  { value: "society", label: "Campo society" },
  { value: "futsal", label: "Futsal" },
  { value: "grama", label: "Grama" },
  { value: "areia", label: "Areia" },
];

function CourtsPage() {
  const { location } = useUserLocation();
  const [filter, setFilter] = useState<Filter>("todas");
  const [search, setSearch] = useState("");

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["courts"],
    queryFn: fetchCourts,
  });

  const withDistance = useMemo(() => {
    const list = (data ?? []).map((court: Court) => ({
      court,
      distance:
        location?.latitude != null &&
        location.longitude != null &&
        court.latitude != null &&
        court.longitude != null
          ? distanceKm(location.latitude, location.longitude, court.latitude, court.longitude)
          : null,
    }));

    const term = search.trim().toLowerCase();
    const filtered = list.filter(({ court }) => {
      if (term && !`${court.name} ${court.city} ${court.district ?? ""}`.toLowerCase().includes(term))
        return false;
      if (filter === "publica" || filter === "privada") return court.kind === filter;
      if (["society", "futsal", "grama", "areia"].includes(filter))
        return court.surface === filter;
      return true;
    });

    if (filter === "avaliadas")
      return filtered.sort((a, b) => Number(b.court.rating ?? 0) - Number(a.court.rating ?? 0));
    return filtered.sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999));
  }, [data, location, filter, search]);

  return (
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-10">
      <header>
        <h1 className="text-3xl font-bold sm:text-4xl">Quadras</h1>
        <p className="mt-2 text-muted-foreground">
          Quadras públicas e privadas disponíveis na sua região.
        </p>
      </header>

      <LocationBar />

      <div className="relative">
        <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por cidade ou nome da quadra"
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

      {location?.latitude != null && location.longitude != null && (
        <MiniMap
          latitude={location.latitude}
          longitude={location.longitude}
          title="Mapa da sua região"
        />
      )}

      {isLoading ? (
        <CardSkeletonGrid />
      ) : isError ? (
        <ErrorState message={(error as Error)?.message} />
      ) : withDistance.length === 0 ? (
        <EmptyState
          icon={MapPin}
          title="Nenhuma quadra encontrada"
          description="Tente mudar os filtros, buscar outro nome ou alterar a cidade selecionada."
        />
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {withDistance.map(({ court, distance }) => (
            <CourtCard key={court.id} court={court} distance={distance} />
          ))}
        </div>
      )}
    </div>
  );
}
