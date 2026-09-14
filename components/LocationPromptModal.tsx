"use client";

import { useState, useEffect } from "react";

export interface LocationData {
  latitude?: number;
  longitude?: number;
  address?: string;
  mapsUrl?: string;
  capturedAt: string;
  source: "gps" | "maps_link" | "manual_address";
}

interface LocationPromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCapture: (data: LocationData) => void;
  currentLocation: LocationData | null;
  dishName: string;
  chefName: string;
}

export function LocationPromptModal({
  isOpen,
  onClose,
  onCapture,
  currentLocation,
  dishName,
  chefName,
}: LocationPromptModalProps) {
  const [inputVal, setInputVal] = useState(
    currentLocation?.mapsUrl || currentLocation?.address || ""
  );
  const [isLocating, setIsLocating] = useState(false);
  const [geoError, setGeoError] = useState<string | null>(null);
  const [captured, setCaptured] = useState<LocationData | null>(currentLocation);

  useEffect(() => {
    setCaptured(currentLocation);
    if (currentLocation?.mapsUrl || currentLocation?.address) {
      setInputVal(currentLocation.mapsUrl || currentLocation.address || "");
    }
  }, [currentLocation]);

  if (!isOpen) return null;

  const handleUseGPS = () => {
    setGeoError(null);
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const { latitude, longitude } = position.coords;
        const mapsUrl = `https://www.google.com/maps?q=${latitude},${longitude}`;
        const locData: LocationData = {
          latitude,
          longitude,
          mapsUrl,
          capturedAt: new Date().toISOString(),
          source: "gps",
        };
        setCaptured(locData);
        onCapture(locData);
      },
      (err) => {
        setIsLocating(false);
        console.warn("Geolocation error:", err);
        setGeoError(
          "Couldn’t access GPS location. Please paste your Google Maps link or enter your locality below."
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    let mapsUrl = inputVal.trim();
    const isUrl = inputVal.startsWith("http://") || inputVal.startsWith("https://");

    // Check if user entered coordinates like "15.283, 73.986"
    const coordMatch = inputVal.match(/^(-?\d+(\.\d+)?),\s*(-?\d+(\.\d+)?)$/);
    let lat: number | undefined;
    let lng: number | undefined;

    if (coordMatch) {
      lat = parseFloat(coordMatch[1]);
      lng = parseFloat(coordMatch[3]);
      mapsUrl = `https://www.google.com/maps?q=${lat},${lng}`;
    } else if (!isUrl) {
      mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        inputVal.trim()
      )}`;
    }

    const locData: LocationData = {
      latitude: lat,
      longitude: lng,
      address: !isUrl ? inputVal.trim() : undefined,
      mapsUrl,
      capturedAt: new Date().toISOString(),
      source: isUrl ? "maps_link" : "manual_address",
    };

    setCaptured(locData);
    onCapture(locData);
  };

  // Embed map query
  const mapQuery = captured?.latitude && captured?.longitude
    ? `${captured.latitude},${captured.longitude}`
    : captured?.address
    ? captured.address
    : "Margao, Goa";

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="modal-kicker">DOORSTEP DELIVERY LOCATION</span>
            <h3 className="modal-title">Share exact delivery location</h3>
            <p className="modal-subtitle">
              For <strong>{dishName}</strong> by {chefName}
            </p>
          </div>
          <button
            type="button"
            className="modal-close-btn"
            onClick={onClose}
            aria-label="Close modal"
          >
            ✕
          </button>
        </div>

        <div className="modal-body">
          {/* Option 1: One-tap GPS button */}
          <div className="location-option-card">
            <div className="option-label">Option 1: Device GPS</div>
            <button
              type="button"
              className="gps-btn"
              onClick={handleUseGPS}
              disabled={isLocating}
            >
              {isLocating ? "📍 Detecting exact location..." : "📍 Share My Current Location"}
            </button>
            {geoError && <p className="location-error-msg">{geoError}</p>}
          </div>

          <div className="modal-divider">
            <span>OR</span>
          </div>

          {/* Option 2: Paste Google Maps link or enter address */}
          <form className="location-option-card" onSubmit={handleManualSubmit}>
            <label className="option-label" htmlFor="maps-input">
              Option 2: Google Maps link or Address
            </label>
            <div className="input-with-button">
              <input
                id="maps-input"
                type="text"
                className="location-input"
                placeholder="Paste Google Maps link or exact address"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
              />
              <button type="submit" className="confirm-btn">
                Confirm
              </button>
            </div>
          </form>

          {/* Map Preview & Captured Status */}
          {captured && (
            <div className="captured-location-box">
              <div className="captured-header">
                <span className="captured-badge">✓ Location Captured</span>
                {captured.mapsUrl && (
                  <a
                    href={captured.mapsUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="maps-link-external"
                  >
                    View on Google Maps ↗
                  </a>
                )}
              </div>

              {captured.latitude && captured.longitude ? (
                <p className="captured-details">
                  Coordinates: <strong>{captured.latitude.toFixed(5)}, {captured.longitude.toFixed(5)}</strong>
                </p>
              ) : captured.address ? (
                <p className="captured-details">
                  Address: <strong>{captured.address}</strong>
                </p>
              ) : null}

              <div className="map-embed-wrapper">
                <iframe
                  title="Google Map preview"
                  src={`https://maps.google.com/maps?q=${encodeURIComponent(
                    mapQuery
                  )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                  width="100%"
                  height="160"
                  style={{ border: 0 }}
                  loading="lazy"
                />
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button type="button" className="save-location-btn" onClick={onClose}>
            {captured ? "Done / Save Location" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
}
