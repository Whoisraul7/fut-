import { Link, createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, CalendarDays, MapPin, Trophy, Users } from "lucide-react";

import heroImage from "@/assets/hero-pitch.jpg";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CourtCard } from "@/components/futrapa/court-card";
import { CardSkeletonGrid } from "@/components/futrapa/states";
import { useAuth } from "@/hooks/useAuth";
import { useUserLocation } from "@/hooks/useUserLocation";
import { fetchCourts } from "@/lib/futrapa/api";
import { distanceKm } from "@/lib/futrapa/geo";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "FutRapa — Encontre uma quadra e marque sua partida" },
      {
        name: "description",
        content:
          "Encontre quadras públicas e privadas próximas, organize partidas e reúna jogadores em um só lugar.",
      },
      { property: "og:title", content: "FutRapa — Encontre uma quadra e marque sua partida" },
      {
        property: "og:description",
        content: "Quadras próximas, partidas abertas e jogadores prontos para jogar.",
      },
    ],
  }),
  component: Index,
});

const STEPS = [
  {
    icon: MapPin,
    title: "1. Encontre",
    text: "Encontre quadras disponíveis na sua região.",
  },
  {
    icon: CalendarDays,
    title: "2. Organize",
    text: "Escolha data, horário e informações da partida.",
  },
  {
    icon: Users,
    title: "3. Jogue",
    text: "Convide jogadores e reúna sua equipe.",
  },
];

function Index() {
  const { user } = useAuth();
  const { location } = useUserLocation();
  const { data: courts, isLoading } = useQuery({ queryKey: ["courts"], queryFn: fetchCourts });

  const nearby = (courts ?? [])
    .map((court) => ({
      court,
      distance:
        location?.latitude != null && court.latitude != null && court.longitude != null
          ? distanceKm(location.latitude, location.longitude!, court.latitude, court.longitude)
          : null,
    }))
    .sort((a, b) => (a.distance ?? 9999) - (b.distance ?? 9999))
    .slice(0, 3);

  return (
    <div>
      <section className="relative overflow-hidden">
        <img
          src={heroImage}
          alt="Quadra de futebol iluminada à noite"
          width={1600}
          height={1000}
          className="absolute inset-0 h-full w-full object-cover opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/85 to-background" />
        <div className="relative mx-auto max-w-6xl px-4 py-24 text-center sm:py-32">
          <span className="glass-panel inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium text-muted-foreground">
            <span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
            Quadras e partidas perto de você
          </span>

          <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-extrabold leading-[1.05] sm:text-6xl">
            Encontre uma quadra.{" "}
            <span className="text-gradient-pitch">Marque a partida.</span> Jogue futebol.
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-base text-muted-foreground sm:text-lg">
            Encontre quadras públicas e privadas próximas, organize partidas e reúna jogadores em um
            só lugar.
          </p>

          <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="w-full rounded-full font-semibold sm:w-auto">
              <Link to="/quadras">
                Encontrar quadras <ArrowRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="secondary"
              className="w-full rounded-full font-semibold sm:w-auto"
            >
              <Link to="/criar-partida">Criar partida</Link>
            </Button>
            {!user && (
              <Button
                asChild
                size="lg"
                variant="ghost"
                className="w-full rounded-full sm:w-auto"
              >
                <Link to="/auth">Entrar / Criar conta</Link>
              </Button>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16">
        <h2 className="text-center text-2xl font-bold sm:text-3xl">Como funciona</h2>
        <div className="mt-10 grid gap-5 md:grid-cols-3">
          {STEPS.map((step) => (
            <Card
              key={step.title}
              className="border-border/70 bg-card p-6 shadow-card transition-transform hover:-translate-y-1"
            >
              <div className="mb-4 inline-flex rounded-2xl bg-secondary p-3">
                <step.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-display text-lg font-semibold">{step.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{step.text}</p>
            </Card>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-16">
        <div className="mb-6 flex items-end justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold sm:text-3xl">Quadras perto de você</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              {location?.city ? `Mostrando resultados em ${location.city}` : "Detectando região..."}
            </p>
          </div>
          <Button asChild variant="ghost" className="rounded-full">
            <Link to="/quadras">Ver todas</Link>
          </Button>
        </div>

        {isLoading ? (
          <CardSkeletonGrid count={3} />
        ) : (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {nearby.map(({ court, distance }) => (
              <CourtCard key={court.id} court={court} distance={distance} />
            ))}
          </div>
        )}
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-20">
        <Card className="pitch-grid relative overflow-hidden border-primary/25 p-10 text-center shadow-glow">
          <Trophy className="mx-auto h-9 w-9 text-primary" />
          <h2 className="mt-4 text-2xl font-bold sm:text-3xl">Pronto para entrar em campo?</h2>
          <p className="mx-auto mt-2 max-w-xl text-sm text-muted-foreground">
            Crie sua conta gratuita, organize partidas e encontre jogadores na sua região.
          </p>
          <Button asChild size="lg" className="mt-6 rounded-full font-semibold">
            <Link to={user ? "/partidas" : "/auth"}>
              {user ? "Ver partidas abertas" : "Criar conta grátis"}
            </Link>
          </Button>
        </Card>
      </section>
    </div>
  );
}
