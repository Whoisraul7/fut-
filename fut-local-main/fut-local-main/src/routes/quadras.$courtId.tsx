import { useQuery } from "@tanstack/react-query";
import { Link, createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, Star } from "lucide-react";

import { MiniMap } from "@/components/futrapa/location-bar";
import { MatchCard } from "@/components/futrapa/match-card";
import { EmptyState, ErrorState } from "@/components/futrapa/states";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { fetchCourt, fetchMatches } from "@/lib/futrapa/api";
import { formatDistance, distanceKm } from "@/lib/futrapa/geo";
import { useUserLocation } from "@/hooks/useUserLocation";
import { KIND_LABEL, SURFACE_LABEL } from "@/lib/futrapa/types";
import { CalendarDays } from "lucide-react";

export const Route = createFileRoute("/quadras/$courtId")({
  head: () => ({
    meta: [
      { title: "Detalhes da quadra — FutRapa" },
      {
        name: "description",
        content: "Endereço, horários, avaliação e partidas marcadas nesta quadra.",
      },
      { property: "og:title", content: "Detalhes da quadra — FutRapa" },
      {
        property: "og:description",
        content: "Veja informações da quadra e crie uma partida no local.",
      },
    ],
  }),
  component: CourtDetail,
});

function CourtDetail() {
  const { courtId } = Route.useParams();
  const { location } = useUserLocation();

  const courtQuery = useQuery({
    queryKey: ["court", courtId],
    queryFn: () => fetchCourt(courtId),
  });
  const matchesQuery = useQuery({ queryKey: ["matches"], queryFn: fetchMatches });

  if (courtQuery.isLoading) {
    return (
      <div className="mx-auto max-w-4xl space-y-4 px-4 py-10">
        <Skeleton className="h-64 w-full rounded-2xl" />
        <Skeleton className="h-8 w-2/3" />
        <Skeleton className="h-32 w-full" />
      </div>
    );
  }

  if (courtQuery.isError) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <ErrorState message={(courtQuery.error as Error)?.message} />
      </div>
    );
  }

  const court = courtQuery.data;
  if (!court) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-10">
        <EmptyState
          icon={MapPin}
          title="Quadra não encontrada"
          description="Essa quadra pode ter sido removida. Veja outras opções perto de você."
          action={
            <Button asChild className="rounded-full">
              <Link to="/quadras">Ver quadras</Link>
            </Button>
          }
        />
      </div>
    );
  }

  const distance =
    location?.latitude != null &&
    location.longitude != null &&
    court.latitude != null &&
    court.longitude != null
      ? distanceKm(location.latitude, location.longitude, court.latitude, court.longitude)
      : null;

  const courtMatches = (matchesQuery.data ?? []).filter((m) => m.court_id === court.id);

  return (
    <div className="mx-auto max-w-4xl space-y-8 px-4 py-10">
      <div className="overflow-hidden rounded-3xl border border-border shadow-card">
        {court.photo_url ? (
          <img
            src={court.photo_url}
            alt={court.name}
            className="h-64 w-full object-cover sm:h-80"
          />
        ) : (
          <div className="pitch-grid h-64 w-full" />
        )}
      </div>

      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2">
          <Badge className="rounded-full">{KIND_LABEL[court.kind]}</Badge>
          <Badge variant="outline" className="rounded-full">
            {SURFACE_LABEL[court.surface]}
          </Badge>
          {court.rating !== null && (
            <span className="flex items-center gap-1 text-sm font-semibold">
              <Star className="h-4 w-4 fill-primary text-primary" />
              {Number(court.rating).toFixed(1)}
            </span>
          )}
        </div>

        <h1 className="text-3xl font-bold sm:text-4xl">{court.name}</h1>

        <div className="grid gap-3 text-sm text-muted-foreground sm:grid-cols-2">
          <span className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" />
            {[court.address, court.district, court.city, court.state].filter(Boolean).join(", ")}
          </span>
          {court.opening_hours && (
            <span className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-primary" />
              {court.opening_hours}
            </span>
          )}
          <span>Distância aproximada: {formatDistance(distance)}</span>
          {court.price_info && <span>Valor: {court.price_info}</span>}
        </div>

        <Button asChild size="lg" className="rounded-full font-semibold">
          <Link to="/criar-partida" search={{ courtId: court.id }}>
            Criar partida aqui
          </Link>
        </Button>
      </div>

      <MiniMap latitude={court.latitude} longitude={court.longitude} title={court.name} />

      <section className="space-y-4">
        <h2 className="text-xl font-bold">Partidas nesta quadra</h2>
        {courtMatches.length === 0 ? (
          <Card className="border-dashed p-8 text-center text-sm text-muted-foreground">
            Ainda não há partidas marcadas aqui. Seja o primeiro a organizar uma.
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {courtMatches.map((m) => (
              <MatchCard key={m.id} match={m} />
            ))}
          </div>
        )}
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <CalendarDays className="h-3.5 w-3.5" /> Horários sujeitos à disponibilidade do local.
        </p>
      </section>
    </div>
  );
}
