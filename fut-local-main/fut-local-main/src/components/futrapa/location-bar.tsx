import { Crosshair, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUserLocation } from "@/hooks/useUserLocation";
import { CITY_OPTIONS } from "@/lib/futrapa/geo";

export function LocationBar() {
  const { location, status, requestPrecise, setManualCity } = useUserLocation();

  const label =
    status === "loading"
      ? "Detectando sua localização..."
      : location
        ? `${location.city ?? "Localização"}${location.state ? ` - ${location.state}` : ""}`
        : "Localização não definida";

  const hint =
    location?.source === "precise"
      ? "Localização precisa do dispositivo"
      : location?.source === "manual"
        ? "Região escolhida por você"
        : "Localização aproximada — pode não ser exata";

  return (
    <div className="glass-panel flex flex-col gap-3 rounded-2xl p-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <div className="rounded-full bg-secondary p-2">
          <MapPin className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-semibold">{label}</p>
          <p className="text-xs text-muted-foreground">{hint}</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Select
          value={location?.city ?? undefined}
          onValueChange={(value) => {
            const city = CITY_OPTIONS.find((c) => c.city === value);
            if (city) setManualCity(city);
          }}
        >
          <SelectTrigger className="w-full min-w-40 rounded-full sm:w-48">
            <SelectValue placeholder="Alterar cidade" />
          </SelectTrigger>
          <SelectContent>
            {CITY_OPTIONS.map((c) => (
              <SelectItem key={c.city} value={c.city}>
                {c.city} - {c.state}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          variant="secondary"
          size="icon"
          className="rounded-full"
          onClick={requestPrecise}
          aria-label="Usar minha localização atual"
          title="Usar minha localização atual"
        >
          <Crosshair className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function MiniMap({
  latitude,
  longitude,
  title,
}: {
  latitude: number | null;
  longitude: number | null;
  title: string;
}) {
  if (latitude === null || longitude === null) return null;
  const d = 0.02;
  const bbox = `${longitude - d}%2C${latitude - d}%2C${longitude + d}%2C${latitude + d}`;
  return (
    <iframe
      title={title}
      className="h-64 w-full rounded-2xl border border-border grayscale-[0.25] contrast-125"
      loading="lazy"
      src={`https://www.openstreetmap.org/export/embed.html?bbox=${bbox}&layer=mapnik&marker=${latitude}%2C${longitude}`}
    />
  );
}
