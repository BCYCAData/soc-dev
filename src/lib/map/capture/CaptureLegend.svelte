<script lang="ts">
	import { getContext } from 'svelte';

	import { LEAFLET_CONTEXT_KEY, type LeafletContext } from '$lib/map/createLeafletMap';
	import { templateLegendSymbol } from '$lib/map/capture/template-styles';
	import { getLegendSymbol, type LegendSymbol } from '$lib/map/render/build-layer';
	import type { ResolvedLayer } from '$lib/map/profiles/types';
	import type { FeatureTemplate } from '$lib/map/capture/PropertyCaptureController.svelte';

	interface Props {
		templates: FeatureTemplate[];
		featuresByTemplate: Record<string, GeoJSON.FeatureCollection>;
		/** Context layers as resolved by PropertyCaptureMap — rows appear only
		 * for those that actually have data. */
		contextLayers: ResolvedLayer[];
		/** Flips true once MapView has created the map (see PropertyCaptureMap). */
		ready: boolean;
	}

	let { templates, featuresByTemplate, contextLayers, ready }: Props = $props();

	const ctx = getContext<LeafletContext>(LEAFLET_CONTEXT_KEY);

	interface LegendRow {
		id: string;
		label: string;
		symbol: LegendSymbol;
	}

	const contextRows = $derived<LegendRow[]>(
		contextLayers
			.filter((rl) => (rl.data?.features?.length ?? 0) > 0)
			.map((rl) => ({
				id: rl.config.id,
				label: rl.config.name,
				symbol: getLegendSymbol(rl.config)
			}))
	);

	// One row per template that currently has features on this property,
	// category-then-name ordered for stability as features come and go.
	const templateRows = $derived<LegendRow[]>(
		templates
			.filter((t) => (featuresByTemplate[t.id]?.features?.length ?? 0) > 0)
			.sort((a, b) => a.category.localeCompare(b.category) || a.name.localeCompare(b.name))
			.map((t) => ({ id: t.id, label: t.name, symbol: templateLegendSymbol(t) }))
	);

	const rows = $derived([...contextRows, ...templateRows]);

	// Attachment: mounts the legend as a Leaflet control in the bottom-right
	// corner (above the credits). Svelte keeps owning the element, so rows
	// re-render reactively as features are added/deleted.
	function legendControl(el: HTMLElement) {
		if (!ready) return;
		const map = ctx.getLeafletMap();
		const L = ctx.getLeaflet();
		if (!map || !L) return;

		const LegendControl = L.Control.extend({
			options: { position: 'bottomright' },
			onAdd: () => {
				L.DomEvent.disableClickPropagation(el);
				L.DomEvent.disableScrollPropagation(el);
				return el;
			},
			// Svelte owns the element — nothing to tear down here.
			onRemove: () => {}
		});
		const control = new LegendControl().addTo(map);
		return () => control.remove();
	}
</script>

{#if rows.length}
	<div class="mapview-legend capture-legend" aria-label="Map legend" {@attach legendControl}>
		{#each rows as row (row.id)}
			{@const sym = row.symbol}
			<div class="mapview-legend__row">
				<span class="mapview-legend__swatch">
					{#if sym.kind === 'point'}
						<span
							class="mapview-legend__glyph mapview-legend__glyph--point"
							class:mapview-legend__glyph--square={sym.point.shape === 'square'}
							class:mapview-legend__glyph--diamond={sym.point.shape === 'diamond'}
							class:mapview-legend__glyph--triangle={sym.point.shape === 'triangle'}
							style:background={sym.point.fillColor ?? '#3388ff'}
							style:color={sym.point.fillColor ?? '#3388ff'}
							style:border-color={sym.point.color ?? 'rgba(0, 0, 0, 0.5)'}
							style:border-width="{sym.point.weight ?? 1}px"
						></span>
					{:else if sym.kind === 'line'}
						<span
							class="mapview-legend__glyph mapview-legend__glyph--line"
							style:background={sym.line.color ?? '#3388ff'}
							style:height="{Math.max(sym.line.weight ?? 2, 2)}px"
						></span>
					{:else}
						<span
							class="mapview-legend__glyph mapview-legend__glyph--polygon"
							style:background={(sym.polygon.fillOpacity ?? 1) === 0
								? 'transparent'
								: (sym.polygon.fillColor ?? 'transparent')}
							style:border-color={sym.polygon.color ?? '#3388ff'}
							style:border-width="{sym.polygon.weight ?? 1}px"
						></span>
					{/if}
				</span>
				{row.label}
			</div>
		{/each}
	</div>
{/if}

<style>
	.capture-legend {
		max-height: 50vh;
		overflow-y: auto;
	}
	/* Until Leaflet adopts it as a control (adding .leaflet-control), the div
	   sits in normal flow below the map canvas — keep it hidden. */
	.capture-legend:not(:global(.leaflet-control)) {
		display: none;
	}
</style>
