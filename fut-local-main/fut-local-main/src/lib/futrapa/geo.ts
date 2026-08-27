export interface UserLocation {
  city: string | null;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  /** "precise" = GPS do navegador, "approximate" = por IP, "manual" = escolhido pelo usuário */
  source: "precise" | "approximate" | "manual";
}

export const STORAGE_KEY = "futrapa.location";

/** Distância em km entre dois pontos (Haversine). */
export function distanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const toRad = (v: number) => (v * Math.PI) / 180;
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(a));
}

export function formatDistance(km: number | null): string {
  if (km === null || Number.isNaN(km)) return "—";
  if (km < 1) return `${Math.round(km * 1000)} m`;
  if (km < 10) return `${km.toFixed(1)} km`;
  return `${Math.round(km)} km`;
}

export interface CityOption {
  city: string;
  state: string;
  latitude: number;
  longitude: number;
}

/** Cidades atendidas hoje. Pode ser trocado por uma API de geocoding via env. */
export const CITY_OPTIONS: CityOption[] = [
  { city: "São Paulo", state: "SP", latitude: -23.5505, longitude: -46.6333 },
  { city: "Rio de Janeiro", state: "RJ", latitude: -22.9068, longitude: -43.1729 },
  { city: "Belo Horizonte", state: "MG", latitude: -19.9167, longitude: -43.9345 },
  { city: "Recife", state: "PE", latitude: -8.0476, longitude: -34.877 },
  { city: "Porto Alegre", state: "RS", latitude: -30.0346, longitude: -51.2177 },
  { city: "Curitiba", state: "PR", latitude: -25.4284, longitude: -49.2733 },
  { city: "Salvador", state: "BA", latitude: -12.9777, longitude: -38.5016 },
  { city: "Brasília", state: "DF", latitude: -15.7939, longitude: -47.8828 },
];

/** Camada de integração configurável: endpoint de geolocalização por IP. */
const IP_LOOKUP_URL =
  (import.meta.env["VITE_IP_GEOLOCATION_URL"] as string | undefined) ??
  "https://ipapi.co/json/";

export async function lookupApproximateLocation(): Promise<UserLocation | null> {
  try {
    const res = await fetch(IP_LOOKUP_URL);
    if (!res.ok) return null;
    const data = (await res.json()) as Record<string, unknown>;
    const lat = Number(data["latitude"]);
    const lon = Number(data["longitude"]);
    if (Number.isNaN(lat) || Number.isNaN(lon)) return null;
    return {
      city: (data["city"] as string) ?? null,
      state: (data["region_code"] as string) ?? (data["region"] as string) ?? null,
      latitude: lat,
      longitude: lon,
      source: "approximate",
    };
  } catch {
    return null;
  }
}

export function nearestCity(lat: number, lon: number): CityOption {
  return [...CITY_OPTIONS].sort(
    (a, b) =>
      distanceKm(lat, lon, a.latitude, a.longitude) -
      distanceKm(lat, lon, b.latitude, b.longitude),
  )[0]!;
}
