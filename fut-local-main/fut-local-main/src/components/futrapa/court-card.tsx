import { Link } from "@tanstack/react-router";
import { Clock, MapPin, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatDistance } from "@/lib/futrapa/geo";
import { KIND_LABEL, SURFACE_LABEL, type Court } from "@/lib/futrapa/types";

export function CourtCard({ court, distance }: { court: Court; distance: number | null }) {
  return (
    <Card className="group overflow-hidden border-border/70 bg-card p-0 shadow-card transition-all hover:-translate-y-1 hover:shadow-glow">
      <div className="relative h-40 overflow-hidden bg-secondary">
        {court.photo_url ? (
          <img
            src={court.photo_url}
            alt={court.name}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="pitch-grid h-full w-full" />
        )}
        <div className="absolute left-3 top-3 flex gap-2">
          <Badge
            variant={court.kind === "publica" ? "secondary" : "default"}
            className="rounded-full"
          >
            {KIND_LABEL[court.kind]}
          </Badge>
          <Badge variant="outline" className="rounded-full bg-background/70">
            {SURFACE_LABEL[court.surface]}
          </Badge>
        </div>
        {court.rating !== null && (
          <div className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-background/80 px-2 py-1 text-xs font-semibold">
            <Star className="h-3.5 w-3.5 fill-primary text-primary" />
            {Number(court.rating).toFixed(1)}
          </div>
        )}
      </div>

      <div className="space-y-3 p-4">
        <div>
          <h3 className="font-display text-lg font-semibold leading-tight">{court.name}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">
              {court.district ? `${court.district}, ` : ""}
              {court.city}
              {court.state ? ` - ${court.state}` : ""}
            </span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {court.opening_hours && (
            <span className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5" />
              {court.opening_hours}
            </span>
          )}
          <span className="text-primary">{formatDistance(distance)}</span>
          {court.price_info && <span>{court.price_info}</span>}
        </div>

        <div className="flex gap-2 pt-1">
          <Button asChild variant="secondary" size="sm" className="flex-1 rounded-full">
            <Link to="/quadras/$courtId" params={{ courtId: court.id }}>
              Ver detalhes
            </Link>
          </Button>
          <Button asChild size="sm" className="flex-1 rounded-full font-semibold">
            <Link to="/criar-partida" search={{ courtId: court.id }}>
              Criar partida
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  );
}
