"use client";
import { createContext, useContext, useRef, useState, type ReactNode } from "react";
import { chefs, siteConfig } from "@/data/site";
import { deliveryStatus, type Coordinates } from "@/lib/delivery";
export type CustomerLocation = Coordinates & { accuracy: number; mapsUrl: string; capturedAt: string };
const Context = createContext<{
  location: CustomerLocation | null; locating: boolean; error: string | null; requestLocation(): void;
} | null>(null);
export function DeliveryLocationProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<CustomerLocation | null>(null);
  const [locating, setLocating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const pending = useRef(false);
  function requestLocation() {
    if (pending.current) return;
    setError(null);

    if (
      typeof window !== "undefined" &&
      !window.isSecureContext &&
      window.location.hostname !== "localhost" &&
      window.location.hostname !== "127.0.0.1"
    ) {
      setError(
        "Geolocation requires a secure connection (HTTPS or localhost). If testing from a mobile phone on local network, use HTTPS or test on localhost."
      );
      return;
    }

    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setError("Location isn’t supported in this browser. Pickup is still available.");
      return;
    }

    pending.current = true;
    setLocating(true);

    const handleSuccess = (position: GeolocationPosition) => {
      const { latitude, longitude, accuracy } = position.coords;
      setLocation({
        latitude,
        longitude,
        accuracy,
        mapsUrl: `https://www.google.com/maps?q=${latitude},${longitude}`,
        capturedAt: new Date().toISOString(),
      });
      pending.current = false;
      setLocating(false);
      setError(null);
    };

    const handleError = (err: GeolocationPositionError, isFallback = false) => {
      // If high accuracy failed due to timeout (3) or position unavailable (2), retry with standard network accuracy
      if (!isFallback && (err.code === 2 || err.code === 3)) {
        navigator.geolocation.getCurrentPosition(
          handleSuccess,
          (fallbackErr) => handleError(fallbackErr, true),
          { enableHighAccuracy: false, timeout: 12000, maximumAge: 300000 }
        );
        return;
      }

      pending.current = false;
      setLocating(false);

      switch (err.code) {
        case 1: // PERMISSION_DENIED
          setError(
            "Location access was blocked. Please enable location permissions in your browser (click the lock / tune icon in the address bar) and tap Share GPS location again."
          );
          break;
        case 2: // POSITION_UNAVAILABLE
          setError(
            "Couldn't determine your device's GPS location. Make sure device Location Services / Wi-Fi are enabled and try again."
          );
          break;
        case 3: // TIMEOUT
          setError("Location request timed out. Please tap Share GPS location again.");
          break;
        default:
          setError(err.message || "Couldn’t get your location. Allow location access and try again.");
      }
    };

    // First try with high accuracy (GPS fix on phones)
    navigator.geolocation.getCurrentPosition(
      handleSuccess,
      (err) => handleError(err, false),
      { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
    );
  }
  return <Context.Provider value={{ location, locating, error, requestLocation }}>{children}</Context.Provider>;
}
export function useDeliveryLocation() {
  const value = useContext(Context);
  if (!value) throw new Error("DeliveryLocationProvider is required");
  return value;
}
export function DeliveryChecker() {
  const { location, locating, error, requestLocation } = useDeliveryLocation();
  const statuses = chefs.map(chef => chef.homeDeliveryEnabled === false ? "disabled" : deliveryStatus(chef.pickupCoordinates, location));
  const available = statuses.filter(status => status === "available").length;
  const pending = statuses.filter(status => status === "unconfigured" || status === "uncertain").length;
  return <section className="delivery-checker page-shell" aria-label="Check delivery availability">
    <div>
      <h3>Check who can deliver right to your door</h3>
      {location && <p className="delivery-check-result" role="status">
        {siteConfig.deliveryLocationsAreDemo ? "Demo result: " : ""}
        {pending
          ? `${available} of ${chefs.length} chefs confirmed for delivery. ${pending} still need confirmation. Pickup is available from all ${chefs.length}.`
          : `${available} of ${chefs.length} chefs deliver to you. Pickup is available from all ${chefs.length}.`}
      </p>}
      {error && <p className="clean-loc-error" role="alert">{error}</p>}
    </div>
    <button type="button" onClick={requestLocation} disabled={locating}>
      {locating ? "Checking…" : "Share GPS location"}
    </button>
  </section>;
}
