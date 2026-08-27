import { supabase } from "@/integrations/supabase/client";

import type { Court, Match } from "./types";

const MATCH_SELECT =
  "id, creator_id, court_id, title, match_date, match_time, max_players, football_type, level, description, status, created_at, court:courts(*), participants:match_participants(user_id)";

export async function fetchCourts(): Promise<Court[]> {
  const { data, error } = await supabase
    .from("courts")
    .select("*")
    .order("rating", { ascending: false });
  if (error) throw error;
  return (data ?? []) as unknown as Court[];
}

export async function fetchCourt(id: string): Promise<Court | null> {
  const { data, error } = await supabase.from("courts").select("*").eq("id", id).maybeSingle();
  if (error) throw error;
  return (data ?? null) as unknown as Court | null;
}

export async function fetchMatches(): Promise<Match[]> {
  const { data, error } = await supabase
    .from("matches")
    .select(MATCH_SELECT)
    .neq("status", "cancelada")
    .order("match_date", { ascending: true })
    .order("match_time", { ascending: true });
  if (error) throw error;
  return (data ?? []) as unknown as Match[];
}

export async function fetchMatch(id: string): Promise<Match | null> {
  const { data, error } = await supabase
    .from("matches")
    .select(MATCH_SELECT)
    .eq("id", id)
    .maybeSingle();
  if (error) throw error;
  return (data ?? null) as unknown as Match | null;
}

export async function joinMatch(matchId: string, userId: string) {
  const { error } = await supabase
    .from("match_participants")
    .insert({ match_id: matchId, user_id: userId });
  if (error) throw error;
}

export async function leaveMatch(matchId: string, userId: string) {
  const { error } = await supabase
    .from("match_participants")
    .delete()
    .eq("match_id", matchId)
    .eq("user_id", userId);
  if (error) throw error;
}

export async function cancelMatch(matchId: string) {
  const { error } = await supabase
    .from("matches")
    .update({ status: "cancelada" })
    .eq("id", matchId);
  if (error) throw error;
}

export function spotsLeft(match: Match): number {
  return Math.max(match.max_players - (match.participants?.length ?? 0), 0);
}

export function formatMatchDate(date: string): string {
  const [y, m, d] = date.split("-");
  return `${d}/${m}/${y}`;
}

export function formatMatchTime(time: string): string {
  return time.slice(0, 5);
}
