export type CourtKind = "publica" | "privada";
export type CourtSurface = "society" | "futsal" | "grama" | "areia";
export type FootballType = "society" | "futsal" | "campo" | "areia";
export type MatchLevel = "iniciante" | "intermediario" | "avancado";
export type MatchStatus = "aberta" | "cheia" | "cancelada" | "encerrada";

export interface Court {
  id: string;
  name: string;
  kind: CourtKind;
  surface: CourtSurface;
  address: string | null;
  district: string | null;
  city: string;
  state: string | null;
  latitude: number | null;
  longitude: number | null;
  photo_url: string | null;
  rating: number | null;
  price_info: string | null;
  opening_hours: string | null;
  notes?: string | null;
}

export interface Profile {
  id: string;
  name: string;
  email: string | null;
  avatar_url: string | null;
  city: string | null;
  bio: string | null;
  position: string | null;
}

export interface Match {
  id: string;
  creator_id: string;
  court_id: string | null;
  title: string;
  match_date: string;
  match_time: string;
  max_players: number;
  football_type: FootballType;
  level: MatchLevel;
  description: string | null;
  status: MatchStatus;
  created_at: string;
  court?: Court | null;
  participants?: { user_id: string }[];
}

export const SURFACE_LABEL: Record<CourtSurface, string> = {
  society: "Campo society",
  futsal: "Futsal",
  grama: "Grama",
  areia: "Areia",
};

export const KIND_LABEL: Record<CourtKind, string> = {
  publica: "Pública",
  privada: "Privada",
};

export const LEVEL_LABEL: Record<MatchLevel, string> = {
  iniciante: "Iniciante",
  intermediario: "Intermediário",
  avancado: "Avançado",
};

export const FOOTBALL_TYPE_LABEL: Record<FootballType, string> = {
  society: "Society",
  futsal: "Futsal",
  campo: "Campo (grama)",
  areia: "Futebol de areia",
};
