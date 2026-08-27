import { Link } from "@tanstack/react-router";
import { CalendarDays, Clock, MapPin, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { formatMatchDate, formatMatchTime, spotsLeft } from "@/lib/futrapa/api";
import { LEVEL_LABEL, FOOTBALL_TYPE_LABEL, type Match } from "@/lib/futrapa/types";

export function MatchCard({ match }: { match: Match }) {
  const joined = match.participants?.length ?? 0;
  const left = spotsLeft(match);

  return (
    <Card className="flex flex-col gap-4 border-border/70 bg-card p-5 shadow-card transition-all hover:-translate-y-1 hover:shadow-glow">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="font-display text-lg font-semibold leading-tight">{match.title}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" />
            {match.court?.name ?? "Local a definir"}
          </p>
        </div>
        <Badge variant="outline" className="rounded-full">
          {LEVEL_LABEL[match.level]}
        </Badge>
      </div>

      <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <CalendarDays className="h-4 w-4 text-primary" />
          {formatMatchDate(match.match_date)}
        </span>
        <span className="flex items-center gap-1.5">
          <Clock className="h-4 w-4 text-primary" />
          {formatMatchTime(match.match_time)}
        </span>
        <span className="flex items-center gap-1.5">
          <Users className="h-4 w-4 text-primary" />
          {joined}/{match.max_players} jogadores
        </span>
        <span className="truncate">{FOOTBALL_TYPE_LABEL[match.football_type]}</span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
        <div
          className="bg-gradient-pitch h-full rounded-full transition-all"
          style={{ width: `${Math.min((joined / match.max_players) * 100, 100)}%` }}
        />
      </div>

      <div className="flex items-center justify-between gap-3">
        <span className="text-xs text-muted-foreground">
          {left > 0 ? `${left} vaga${left > 1 ? "s" : ""} restante${left > 1 ? "s" : ""}` : "Sem vagas"}
        </span>
        <Button asChild size="sm" className="rounded-full font-semibold">
          <Link to="/partidas/$matchId" params={{ matchId: match.id }}>
            Ver partida
          </Link>
        </Button>
      </div>
    </Card>
  );
}
