"use client";

import { useEffect, useId, useRef, useState } from "react";
import type { LocationData } from "./ChefCard";

type Place = {
  id: string;
  formattedAddress?: string;
  location?: { lat(): number; lng(): number };
  fetchFields(options: { fields: string[] }): Promise<unknown>;
};
type Prediction = { placeId: string; text: { toString(): string }; toPlace(): Place };
type Places = {
  AutocompleteSessionToken: new () => object;
  AutocompleteSuggestion: {
    fetchAutocompleteSuggestions(request: object): Promise<{ suggestions: { placePrediction?: Prediction }[] }>;
  };
};
type MapsWindow = Window & { google?: { maps: { importLibrary(name: string): Promise<Places> } }; localFoodMapsReady?: () => void };
let library: Promise<Places> | undefined;
function loadPlaces() {
  if (library) return library;
  library = new Promise<Places>((resolve, reject) => {
    const key = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    if (!key) { reject(new Error("Address search unavailable. Please use GPS.")); return; }
    const win = window as MapsWindow;
    if (win.google?.maps.importLibrary) { win.google.maps.importLibrary("places").then(resolve, reject); return; }
    const script = document.createElement("script");
    const timeout = window.setTimeout(() => reject(new Error("Google Maps timed out. Please use GPS.")), 15000);
    win.localFoodMapsReady = () => {
      clearTimeout(timeout);
      win.google!.maps.importLibrary("places").then(resolve, reject);
    };
    script.src = `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(key)}&loading=async&v=weekly&callback=localFoodMapsReady`;
    script.async = true;
    script.onerror = () => { clearTimeout(timeout); reject(new Error("Address search unavailable. Please use GPS.")); };
    document.head.appendChild(script);
  });
  return library;
}

export function GoogleAddressInput({ onChange, onSelect }: {
  onChange(): void;
  onSelect(location: LocationData): void;
}) {
  const id = useId();
  const [value, setValue] = useState("");
  const [results, setResults] = useState<Prediction[]>([]);
  const [active, setActive] = useState(-1);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(false);
  const [focused, setFocused] = useState(false);
  const generation = useRef(0);
  const token = useRef<object | null>(null);
  useEffect(() => () => { generation.current++; }, []);

  useEffect(() => {
    const request = ++generation.current;
    if (selected || value.trim().length < 3) return;
    const timer = setTimeout(async () => {
      setMessage("Searching Google Maps…");
      try {
        const places = await loadPlaces();
        if (request !== generation.current) return;
        token.current ??= new places.AutocompleteSessionToken();
        const response = await places.AutocompleteSuggestion.fetchAutocompleteSuggestions({
          input: value.trim(), sessionToken: token.current,
          locationBias: { center: { lat: 15.2832, lng: 73.9862 }, radius: 30000 },
        });
        if (request !== generation.current) return;
        const predictions = response.suggestions.flatMap(s => s.placePrediction ? [s.placePrediction] : []);
        setResults(predictions);
        setMessage(predictions.length ? "Choose a Google Maps result." : "No locations found. Try a nearby landmark or use GPS.");
      } catch {
        if (request === generation.current) setMessage("Address search unavailable. Please use GPS.");
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [value, selected]);

  async function choose(prediction: Prediction) {
    const request = ++generation.current;
    setResults([]);
    setMessage("Checking location…");
    try {
      const place = prediction.toPlace();
      await place.fetchFields({ fields: ["id", "formattedAddress", "location"] });
      token.current = null;
      if (request !== generation.current) return;
      if (!place.location || !place.formattedAddress || !place.id) throw new Error("No address");
      setValue(place.formattedAddress);
      setSelected(true);
      setMessage("");
      onSelect({
        latitude: place.location.lat(), longitude: place.location.lng(), address: place.formattedAddress,
        mapsUrl: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.formattedAddress)}&query_place_id=${encodeURIComponent(place.id)}`,
        capturedAt: new Date().toISOString(),
      });
    } catch {
      if (request === generation.current) setMessage("Couldn’t verify this location. Choose another result or use GPS.");
    }
  }
  const expanded = focused && results.length > 0;
  return <div className="google-address-control">
    <div className="clean-input-wrap">
      <input className="clean-loc-input" value={value} autoComplete="off"
        placeholder="Find address on Google Maps" aria-label="Delivery address on Google Maps"
        role="combobox" aria-autocomplete="list" aria-expanded={expanded} aria-controls={id}
        aria-activedescendant={expanded && active >= 0 ? `${id}-${active}` : undefined}
        aria-describedby={`${id}-status`}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        onChange={e => {
          generation.current++; setValue(e.target.value); setSelected(false); setResults([]); setActive(-1);
          setMessage(""); onChange();
        }}
        onKeyDown={e => {
          if (e.key === "Escape") { setFocused(false); return; }
          if ((e.key === "ArrowDown" || e.key === "ArrowUp") && results.length) {
            e.preventDefault(); setFocused(true);
            setActive(n => (n + (e.key === "ArrowDown" ? 1 : -1) + results.length) % results.length);
          }
          if (e.key === "Enter") {
            e.preventDefault();
            if (expanded && active >= 0) void choose(results[active]);
            else if (!selected) setMessage("Choose a Google Maps result before setting the address.");
          }
        }} />
      <button type="button" className={`clean-loc-set-btn ${selected ? "is-set" : ""}`}
        onClick={() => {
          if (active >= 0 && results[active]) void choose(results[active]);
          else if (!selected) { setFocused(true); setMessage("Choose a Google Maps result before setting the address."); }
        }}>Set</button>
    </div>
    {expanded && <div className="google-address-results">
      <ul id={id} role="listbox" aria-label="Google Maps locations">
        {results.map((result, index) => <li key={result.placeId} id={`${id}-${index}`} role="option"
          aria-selected={index === active} onMouseDown={e => e.preventDefault()}
          onClick={() => void choose(result)}>{result.text.toString()}</li>)}
      </ul>
      <span className="google-maps-attribution">Google Maps</span>
    </div>}
    <p id={`${id}-status`} className="google-address-status" role="status">{message}</p>
  </div>;
}
