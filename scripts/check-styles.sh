#!/usr/bin/env sh
# Styling guardrail — keeps new UI on the Skeleton theme instead of raw Tailwind
# palette colors / legacy utilities. Run via `npm run lint:styles` (also chained
# into `npm run lint`). See docs/styling-conventions.md.
#
# Scanned: src/**/*.svelte and src/**/*.css.
# Excluded: the /dev sandbox, Leaflet/map CSS, and LiteYouTube (YouTube-logo + media colors).

set -e

scope() {
	grep -rnE "$1" src --include=*.svelte --include=*.css 2>/dev/null \
		| grep -ivE '/dev/|/map/|leaflet|LiteYouTube\.svelte' || true
}

status=0

# 1) Raw Tailwind palette colors — use theme tokens (primary/secondary/tertiary/success/warning/error/surface).
palette=$(scope '\b(bg|text|border|ring|fill|stroke|divide|from|to|via)-(blue|red|green|gray|grey|orange|yellow|indigo|slate|zinc|neutral|stone|emerald|sky|amber|rose|purple|pink|cyan|teal|lime|violet|fuchsia)-[0-9]{2,3}\b')
if [ -n "$palette" ]; then
	echo "✖ Raw Tailwind palette colors found — use theme tokens instead:"
	echo "$palette"
	status=1
fi

# 2) Legacy *-opacity-* utilities (removed in Tailwind v4 — render opaque). Use slash syntax: bg-surface-950/50.
opacity=$(scope '\b(bg|text|border|ring)-opacity-[0-9]')
if [ -n "$opacity" ]; then
	echo "✖ Legacy *-opacity-* utilities (no-ops in Tailwind v4) — use slash opacity (e.g. bg-surface-950/50):"
	echo "$opacity"
	status=1
fi

# 3) dark: variants — this project standardizes on Color Pairings (e.g. bg-surface-50-950).
darkvar=$(scope 'dark:(bg|text|border|ring|fill|stroke|divide)-')
if [ -n "$darkvar" ]; then
	echo "✖ dark: variants found — use balanced Color Pairings instead (e.g. text-surface-900-100):"
	echo "$darkvar"
	status=1
fi

if [ "$status" -eq 0 ]; then
	echo "✓ check-styles: no raw palette colors, legacy opacity utilities, or dark: variants."
fi
exit $status
