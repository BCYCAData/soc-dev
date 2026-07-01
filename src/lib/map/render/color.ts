/**
 * Deterministic per-key colours for categorical map styling (e.g. one fill colour
 * per property / address-site OID). Ported from the v1 `leafletlegendutility.ts` so
 * the v2 map stack carries no dependency on `$lib/leaflet/*` (GIS refactor Phase 6).
 *
 * Same hashing as v1, so colours are stable across the v1→v2 migration.
 */
export interface Color {
	r: number;
	g: number;
	b: number;
}

function hashStringToColor(input: string): Color {
	let hash = 0;
	for (let i = 0; i < input.length; i++) {
		hash = input.charCodeAt(i) + ((hash << 5) - hash);
	}
	return { r: (hash & 0xff0000) >> 16, g: (hash & 0x00ff00) >> 8, b: hash & 0x0000ff };
}

function ensureUniqueColor(color: Color, existingColors: Color[]): Color {
	for (const existing of existingColors) {
		if (existing.r === color.r && existing.g === color.g && existing.b === color.b) {
			// Collision — nudge the blue channel.
			return { r: color.r, g: color.g, b: (color.b + 1) % 256 };
		}
	}
	return color;
}

/** Stable hex colour for `key`, avoiding exact collisions with `existingColors`. */
export function generateUniqueColorForKey(key: string, existingColors: Color[] = []): string {
	const color = ensureUniqueColor(hashStringToColor(key), existingColors);
	const toHex = (v: number) => v.toString(16).padStart(2, '0');
	return '#' + toHex(color.r) + toHex(color.g) + toHex(color.b);
}
