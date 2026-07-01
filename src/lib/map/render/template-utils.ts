/**
 * Helpers for authoring popup/tooltip templates whose output is bound as HTML by
 * Leaflet (`bindPopup`/`bindTooltip`). Feature properties come from external/cached
 * sources (NSW Spatial Services, user-entered attributes), so any value interpolated
 * into template markup must be escaped to avoid XSS.
 *
 * Pure string implementation (no DOM) so it is safe under SSR as well as in the browser.
 */
const HTML_ESCAPES: Record<string, string> = {
	'&': '&amp;',
	'<': '&lt;',
	'>': '&gt;',
	'"': '&quot;',
	"'": '&#39;'
};

/** Escape a value for safe interpolation into HTML template text. */
export function escapeHtml(value: unknown): string {
	return String(value ?? '').replace(/[&<>"']/g, (c) => HTML_ESCAPES[c]);
}
