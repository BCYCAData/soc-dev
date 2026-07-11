<script lang="ts">
	import {
		FALLBACK_COLOR,
		LINE_DASH_PRESETS,
		MARKER_SHAPES,
		defaultTemplateStyle,
		diffFromDefault,
		resolveTemplateStyle,
		type TemplateGeometry
	} from '$lib/map/capture/template-styles';
	import type { MarkerShape } from '$lib/map/layers/schemas/layer-config.types';

	interface Props {
		/** Current geometry_type. The parent MUST remount this component (via
		 * {#key}) when geometry or category change — the draft is derived once. */
		geometryType: string;
		category: string;
		/** Persisted feature_templates.style jsonb (null = code default). */
		initial?: unknown;
	}

	let { geometryType, category, initial = null }: Props = $props();

	// Intentionally captured once (via closure, so svelte-check doesn't flag the
	// initial-value reads) — the parent remounts via {#key} on change.
	const { geometry, start } = (() => {
		const g = geometryType as TemplateGeometry;
		return {
			geometry: g,
			start: resolveTemplateStyle({ category, geometry_type: g, style: initial })
		};
	})();

	// Editable draft, initialised from the resolved (default ⊕ override) style.
	let color = $state(
		start.kind === 'point'
			? (start.point.fillColor ?? FALLBACK_COLOR)
			: start.kind === 'line'
				? (start.line.color ?? FALLBACK_COLOR)
				: (start.polygon.fillColor ?? FALLBACK_COLOR)
	);
	let outline = $state(
		start.kind === 'polygon' ? (start.polygon.color ?? FALLBACK_COLOR) : FALLBACK_COLOR
	);
	let shape = $state<MarkerShape>(
		start.kind === 'point' ? (start.point.shape ?? 'circle') : 'circle'
	);
	let sizeNum = $state(
		start.kind === 'point'
			? start.point.shape && start.point.shape !== 'circle'
				? (start.point.size ?? 12)
				: (start.point.radius ?? 6)
			: 6
	);
	let dash = $state(start.kind === 'line' ? (start.line.dashArray ?? '') : '');
	let weight = $state(start.kind === 'line' ? (start.line.weight ?? 3) : 3);
	let fillOpacity = $state(start.kind === 'polygon' ? (start.polygon.fillOpacity ?? 0.4) : 0.4);

	// Full edited style for this geometry → delta vs the code default → what we
	// actually persist ('' = NULL = pure default, so untouched keys keep
	// tracking future default changes).
	const edited = $derived.by(() => {
		if (geometry === 'point') {
			return {
				fillColor: color,
				color,
				shape,
				...(shape === 'circle' ? { radius: sizeNum } : { size: sizeNum })
			};
		}
		if (geometry === 'line') {
			return { color, weight, ...(dash ? { dashArray: dash } : {}) };
		}
		return { fillColor: color, fillOpacity, color: outline };
	});
	const delta = $derived(diffFromDefault(edited, category, geometry));
	const serialized = $derived(delta ? JSON.stringify(delta) : '');
	// Preview runs the exact resolve path the capture map and legend use.
	const preview = $derived(
		resolveTemplateStyle({ category, geometry_type: geometry, style: delta })
	);

	function resetToDefault() {
		const def = defaultTemplateStyle(category, geometry);
		if (def.kind === 'point') {
			color = def.point.fillColor ?? FALLBACK_COLOR;
			shape = def.point.shape ?? 'circle';
			sizeNum = def.point.radius ?? 6;
		} else if (def.kind === 'line') {
			color = def.line.color ?? FALLBACK_COLOR;
			dash = '';
			weight = def.line.weight ?? 3;
		} else {
			color = def.polygon.fillColor ?? FALLBACK_COLOR;
			outline = def.polygon.color ?? FALLBACK_COLOR;
			fillOpacity = def.polygon.fillOpacity ?? 0.4;
		}
	}
</script>

<fieldset class="border-surface-300 rounded-md border p-4">
	<legend class="px-1 text-sm font-medium">Map style</legend>
	<input type="hidden" name="style" value={serialized} />

	<div class="flex flex-wrap items-end gap-4">
		<div>
			<label for="style_color" class="block text-sm font-medium">
				{geometry === 'polygon' ? 'Fill colour' : 'Colour'}
			</label>
			<input
				type="color"
				id="style_color"
				bind:value={color}
				class="border-surface-300 mt-1 h-9 w-14 rounded-md"
			/>
		</div>

		{#if geometry === 'point'}
			<div>
				<label for="style_shape" class="block text-sm font-medium">Shape</label>
				<select
					id="style_shape"
					bind:value={shape}
					class="border-surface-300 bg-surface-50-950 mt-1 block rounded-md shadow-sm"
				>
					{#each MARKER_SHAPES as s (s)}
						<option value={s}>{s}</option>
					{/each}
				</select>
			</div>
			<div>
				<label for="style_size" class="block text-sm font-medium">
					{shape === 'circle' ? 'Radius (px)' : 'Size (px)'}
				</label>
				<input
					type="number"
					id="style_size"
					bind:value={sizeNum}
					min={shape === 'circle' ? 2 : 6}
					max={shape === 'circle' ? 20 : 32}
					class="border-surface-300 mt-1 block w-24 rounded-md shadow-sm"
				/>
			</div>
		{:else if geometry === 'line'}
			<div>
				<label for="style_dash" class="block text-sm font-medium">Line style</label>
				<select
					id="style_dash"
					bind:value={dash}
					class="border-surface-300 bg-surface-50-950 mt-1 block rounded-md shadow-sm"
				>
					{#each LINE_DASH_PRESETS as preset (preset.value)}
						<option value={preset.value}>{preset.label}</option>
					{/each}
					{#if dash && !LINE_DASH_PRESETS.some((p) => p.value === dash)}
						<option value={dash}>Custom ({dash})</option>
					{/if}
				</select>
			</div>
			<div>
				<label for="style_weight" class="block text-sm font-medium">Weight (px)</label>
				<input
					type="number"
					id="style_weight"
					bind:value={weight}
					min="1"
					max="10"
					class="border-surface-300 mt-1 block w-24 rounded-md shadow-sm"
				/>
			</div>
		{:else}
			<div>
				<label for="style_fill_opacity" class="block text-sm font-medium">
					Fill opacity ({fillOpacity})
				</label>
				<input
					type="range"
					id="style_fill_opacity"
					bind:value={fillOpacity}
					min="0"
					max="1"
					step="0.05"
					class="mt-2 block w-32"
				/>
			</div>
			<div>
				<label for="style_outline" class="block text-sm font-medium">Outline colour</label>
				<input
					type="color"
					id="style_outline"
					bind:value={outline}
					class="border-surface-300 mt-1 h-9 w-14 rounded-md"
				/>
			</div>
		{/if}

		<div class="ml-auto flex items-end gap-3">
			<div class="text-center">
				<span class="block text-sm font-medium">Preview</span>
				<svg width="72" height="40" viewBox="0 0 72 40" aria-hidden="true" class="mt-1">
					{#if preview.kind === 'point'}
						{#if !preview.point.shape || preview.point.shape === 'circle'}
							<circle
								cx="36"
								cy="20"
								r={preview.point.radius ?? 6}
								fill={preview.point.fillColor}
								fill-opacity={preview.point.fillOpacity ?? 0.4}
								stroke={preview.point.color}
								stroke-width={preview.point.weight ?? 3}
								stroke-opacity={preview.point.opacity ?? 0.8}
							/>
						{:else}
							{@const s = preview.point.size ?? 12}
							{#if preview.point.shape === 'square'}
								<rect
									x={36 - s / 2}
									y={20 - s / 2}
									width={s}
									height={s}
									fill={preview.point.fillColor}
								/>
							{:else if preview.point.shape === 'diamond'}
								<polygon
									points={`36,${20 - s / 2} ${36 + s / 2},20 36,${20 + s / 2} ${36 - s / 2},20`}
									fill={preview.point.fillColor}
								/>
							{:else}
								<polygon
									points={`36,${20 - s / 2} ${36 + s / 2},${20 + s / 2} ${36 - s / 2},${20 + s / 2}`}
									fill={preview.point.fillColor}
								/>
							{/if}
						{/if}
					{:else if preview.kind === 'line'}
						<line
							x1="6"
							y1="20"
							x2="66"
							y2="20"
							stroke={preview.line.color}
							stroke-width={preview.line.weight ?? 3}
							stroke-opacity={preview.line.opacity ?? 0.8}
							stroke-dasharray={preview.line.dashArray}
							stroke-linecap="round"
						/>
					{:else}
						<rect
							x="8"
							y="6"
							width="56"
							height="28"
							rx="3"
							fill={preview.polygon.fillColor}
							fill-opacity={preview.polygon.fillOpacity ?? 0.4}
							stroke={preview.polygon.color}
							stroke-width={preview.polygon.weight ?? 3}
							stroke-opacity={preview.polygon.opacity ?? 0.8}
						/>
					{/if}
				</svg>
			</div>
			<button
				type="button"
				onclick={resetToDefault}
				disabled={!delta}
				class="bg-surface-200 text-surface-800 rounded-md px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50"
			>
				Reset to default
			</button>
		</div>
	</div>

	<p class="text-surface-500 mt-2 text-xs">
		{delta
			? 'Custom style — stored as an override on this template.'
			: `Using the ${category} category default.`}
	</p>
</fieldset>
