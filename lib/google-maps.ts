/**
 * Convert a Google Maps share/place URL into an iframe-safe embed URL.
 * Place links (maps/place/...) cannot be loaded inside iframes.
 */

function parseLatLng(url: string): { lat: string; lng: string } | null {
  // !3dLAT!4dLNG (place pin — most accurate)
  const pin = url.match(/!3d(-?\d+\.?\d*)!4d(-?\d+\.?\d*)/);
  if (pin) return { lat: pin[1], lng: pin[2] };

  // @LAT,LNG,ZOOM or @LAT,LNG/
  const at = url.match(/@(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (at) return { lat: at[1], lng: at[2] };

  // ?q=LAT,LNG or &q=LAT,LNG
  const q = url.match(/[?&]q=(-?\d+\.?\d*),\s*(-?\d+\.?\d*)/);
  if (q) return { lat: q[1], lng: q[2] };

  // ?ll=LAT,LNG
  const ll = url.match(/[?&]ll=(-?\d+\.?\d*),(-?\d+\.?\d*)/);
  if (ll) return { lat: ll[1], lng: ll[2] };

  // Plain "LAT,LNG"
  const plain = url.trim().match(/^(-?\d+\.?\d*)\s*,\s*(-?\d+\.?\d*)$/);
  if (plain) return { lat: plain[1], lng: plain[2] };

  return null;
}

export function toGoogleMapsEmbedUrl(input: string): string {
  const raw = (input || '').trim();
  if (!raw) return '';

  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    // keep raw
  }

  // Already an embed URL
  if (decoded.includes('/maps/embed') || decoded.includes('output=embed')) {
    return raw;
  }

  const coords = parseLatLng(decoded) || parseLatLng(raw);
  if (coords) {
    return `https://www.google.com/maps?q=${coords.lat},${coords.lng}&hl=en&z=16&output=embed`;
  }

  try {
    const u = new URL(raw);
    if (u.pathname.includes('/maps/embed')) return raw;
  } catch {
    // ignore
  }

  // Last resort: wrap as q= (works for some named places, not all share links)
  return `https://www.google.com/maps?q=${encodeURIComponent(raw)}&output=embed`;
}

export function isLikelyGoogleMapsEmbedUrl(url: string): boolean {
  const v = (url || '').trim();
  return v.includes('output=embed') || v.includes('/maps/embed');
}
