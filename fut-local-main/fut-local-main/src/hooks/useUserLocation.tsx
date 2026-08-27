import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

import {
  CITY_OPTIONS,
  STORAGE_KEY,
  lookupApproximateLocation,
  nearestCity,
  type CityOption,
  type UserLocation,
} from "@/lib/futrapa/geo";

interface LocationContextValue {
  location: UserLocation | null;
  status: "idle" | "loading" | "ready" | "denied";
  requestPrecise: () => void;
  setManualCity: (city: CityOption) => void;
}

const LocationContext = createContext<LocationContextValue | undefined>(undefined);

const DEFAULT_CITY = CITY_OPTIONS[0]!;

export function LocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [status, setStatus] = useState<LocationContextValue["status"]>("idle");

  const persist = useCallback((next: UserLocation) => {
    setLocation(next);
    setStatus("ready");
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch {
      /* storage indisponível */
    }
  }, []);

  const resolveAutomatically = useCallback(async () => {
    setStatus("loading");
    const approximate = await lookupApproximateLocation();
    if (approximate) {
      persist(approximate);
      return;
    }
    persist({
      city: DEFAULT_CITY.city,
      state: DEFAULT_CITY.state,
      latitude: DEFAULT_CITY.latitude,
      longitude: DEFAULT_CITY.longitude,
      source: "approximate",
    });
  }, [persist]);

  const requestPrecise = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      void resolveAutomatically();
      return;
    }
    setStatus("loading");
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const near = nearestCity(pos.coords.latitude, pos.coords.longitude);
        persist({
          city: near.city,
          state: near.state,
          latitude: pos.coords.latitude,
          longitude: pos.coords.longitude,
          source: "precise",
        });
      },
      () => {
        setStatus("denied");
        void resolveAutomatically();
      },
      { timeout: 8000, maximumAge: 300000 },
    );
  }, [persist, resolveAutomatically]);

  const setManualCity = useCallback(
    (city: CityOption) => {
      persist({
        city: city.city,
        state: city.state,
        latitude: city.latitude,
        longitude: city.longitude,
        source: "manual",
      });
    },
    [persist],
  );

  useEffect(() => {
    let stored: UserLocation | null = null;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) stored = JSON.parse(raw) as UserLocation;
    } catch {
      stored = null;
    }
    if (stored) {
      setLocation(stored);
      setStatus("ready");
      return;
    }
    requestPrecise();
  }, [requestPrecise]);

  return (
    <LocationContext.Provider value={{ location, status, requestPrecise, setManualCity }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useUserLocation(): LocationContextValue {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useUserLocation deve ser usado dentro de LocationProvider");
  return ctx;
}
