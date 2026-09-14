export type Coordinates = { latitude: number; longitude: number };
export const DELIVERY_RADIUS_KM = 5;
export function distanceKm(a: Coordinates, b: Coordinates) {
  const rad = (n: number) => n * Math.PI / 180;
  const lat = rad(b.latitude - a.latitude);
  const lon = rad(b.longitude - a.longitude);
  const h = Math.sin(lat / 2) ** 2 + Math.cos(rad(a.latitude)) * Math.cos(rad(b.latitude)) * Math.sin(lon / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(Math.min(1, Math.max(0, h))));
}
export function deliveryStatus(pickup: Coordinates | null | undefined, customer: (Coordinates & { accuracy?: number }) | null) {
  if (!pickup) return "unconfigured";
  if (!customer) return "unchecked";
  const distance = distanceKm(pickup, customer);
  if (distance <= DELIVERY_RADIUS_KM) return "available";
  const uncertainty = (customer.accuracy ?? 0) / 1000;
  if (distance - uncertainty > DELIVERY_RADIUS_KM) return "outside";
  return "uncertain";
}
