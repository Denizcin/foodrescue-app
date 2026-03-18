"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";

// Istanbul city centre — default when permission is denied or unavailable
export const ISTANBUL = { lat: 41.0082, lng: 28.9784 };

export interface LocationState {
  lat: number;
  lng: number;
  /** true only when the user explicitly granted permission this session */
  granted: boolean;
  loading: boolean;
  requestLocation: () => void;
}

const LocationContext = createContext<LocationState>({
  ...ISTANBUL,
  granted: false,
  loading: false,
  requestLocation: () => {},
});

export function LocationProvider({ children }: { children: ReactNode }) {
  const [coords, setCoords] = useState(ISTANBUL);
  const [granted, setGranted] = useState(false);
  const [loading, setLoading] = useState(false);

  const requestLocation = useCallback(() => {
    if (typeof navigator === "undefined" || !navigator.geolocation) return;
    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setGranted(true);
        setLoading(false);
      },
      () => {
        // Denied or timed-out — keep Istanbul fallback
        setGranted(false);
        setLoading(false);
      },
      { timeout: 8000, maximumAge: 60_000 }
    );
  }, []);

  // Auto-request on mount if the browser already granted permission previously
  useEffect(() => {
    if (typeof navigator === "undefined") return;
    navigator.permissions
      ?.query({ name: "geolocation" })
      .then((result) => {
        if (result.state === "granted") requestLocation();
      })
      .catch(() => {
        // Permissions API not supported — silently skip auto-request
      });
  }, [requestLocation]);

  return (
    <LocationContext.Provider value={{ ...coords, granted, loading, requestLocation }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation(): LocationState {
  return useContext(LocationContext);
}
