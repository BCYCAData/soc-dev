<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any -- dynamic Leaflet/GeoJSON + leaflet-editable */
	import { getContext } from 'svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	import { LEAFLET_CONTEXT_KEY, type LeafletContext } from '$lib/map/createLeafletMap';
	import { templateLeafletStyle } from '$lib/map/profiles/property-capture';

	export interface TemplateAttribute {
		id: string;
		name: string;
		type: string;
		required: boolean;
		default?: unknown;
	}
	export interface FeatureTemplate {
		id: string;
		name: string;
		category: string;
		geometry_type: 'point' | 'line' | 'polygon';
		attributes: TemplateAttribute[];
	}

	interface Props {
		propertyId: string;
		templates: FeatureTemplate[];
		featuresByTemplate: Record<string, GeoJSON.FeatureCollection>;
		/** Flips true once MapView has created the map (see PropertyCaptureMap). */
		ready: boolean;
	}

	let { propertyId, templates, featuresByTemplate, ready }: Props = $props();

	const ctx = getContext<LeafletContext>(LEAFLET_CONTEXT_KEY);

	const templatesByCategory = $derived(
		templates.reduce<Record<string, FeatureTemplate[]>>((acc, t) => {
			(acc[t.category] ??= []).push(t);
			return acc;
		}, {})
	);

	// ── Live map refs (set once ready) ──
	let mapRef = $state<any>(undefined);
	let LRef = $state<any>(undefined);

	// ── Capture state ──
	type Mode = 'idle' | 'drawing' | 'form';
	let mode = $state<Mode>('idle');
	let activeTemplate = $state<FeatureTemplate | null>(null);
	let editingFeatureId = $state<string | null>(null);
	let attrValues = $state<Record<string, string>>({});
	let formError = $state<string | null>(null);
	let formIssues = $state<string[]>([]);
	let formWarnings = $state<string[]>([]);
	let savedWarnings = $state<string[]>([]);
	let statusMessage = $state<string | null>(null);
	let saving = $state(false);
	let showTemplatePicker = $state(false);

	// Imperative (non-reactive) Leaflet handles.
	let pendingGeometry: GeoJSON.Geometry | null = null;
	let tempDrawLayer: any = null; // the in-progress drawn layer
	let selectedLayer: any = null; // an existing feature layer being edited
	const featureLayers = new Map<string, any>(); // templateId → L.GeoJSON

	function clearDrawArtifacts() {
		if (mapRef) {
			if (tempDrawLayer) {
				try {
					mapRef.editTools?.stopDrawing?.();
				} catch {
					/* noop */
				}
				mapRef.removeLayer(tempDrawLayer);
			}
			if (selectedLayer?.disableEdit) selectedLayer.disableEdit();
		}
		tempDrawLayer = null;
		selectedLayer = null;
		pendingGeometry = null;
	}

	function resetCapture() {
		clearDrawArtifacts();
		mode = 'idle';
		activeTemplate = null;
		editingFeatureId = null;
		attrValues = {};
		formError = null;
		formIssues = [];
		formWarnings = [];
	}

	function defaultsFor(template: FeatureTemplate): Record<string, string> {
		const v: Record<string, string> = {};
		for (const a of template.attributes) v[a.id] = a.default != null ? String(a.default) : '';
		return v;
	}

	// ── Draw a new feature ──
	function startDraw(template: FeatureTemplate) {
		if (!mapRef) return;
		resetCapture();
		savedWarnings = [];
		showTemplatePicker = false;
		activeTemplate = template;
		editingFeatureId = null;
		attrValues = defaultsFor(template);
		mode = 'drawing';
		statusMessage = `Draw the ${template.name} on the map, then click to finish.`;

		const et = mapRef.editTools;
		if (!et) return;
		if (template.geometry_type === 'point') tempDrawLayer = et.startMarker();
		else if (template.geometry_type === 'line') tempDrawLayer = et.startPolyline();
		else tempDrawLayer = et.startPolygon();
	}

	// ── Select an existing feature (from a layer click) ──
	function selectExisting(template: FeatureTemplate, feature: GeoJSON.Feature, layer: any) {
		resetCapture();
		savedWarnings = [];
		activeTemplate = template;
		editingFeatureId = (feature.properties?.id as string) ?? null;
		selectedLayer = layer;
		const v: Record<string, string> = {};
		for (const a of template.attributes) {
			const val = feature.properties?.[a.id];
			v[a.id] = val != null ? String(val) : '';
		}
		attrValues = v;
		mode = 'form';
		statusMessage = null;
	}

	function enableShapeEdit() {
		if (selectedLayer?.enableEdit) {
			selectedLayer.enableEdit();
			statusMessage = 'Drag the vertices to reshape, then Save.';
		}
	}

	function currentGeometry(): GeoJSON.Geometry | null {
		if (editingFeatureId && selectedLayer) {
			return selectedLayer.toGeoJSON()?.geometry ?? null;
		}
		return pendingGeometry;
	}

	function missingRequired(): string | null {
		if (!activeTemplate) return 'No feature type selected';
		for (const a of activeTemplate.attributes) {
			if (a.required && !attrValues[a.id]?.trim()) return `${a.name} is required`;
		}
		return null;
	}

	// ── Build / rebuild the editable feature layers from data ──
	function buildFeatureLayers() {
		const map = mapRef;
		const L = LRef;
		if (!map || !L) return;

		for (const [, layer] of featureLayers) map.removeLayer(layer);
		featureLayers.clear();

		for (const template of templates) {
			const fc = featuresByTemplate[template.id] ?? { type: 'FeatureCollection', features: [] };
			const style = templateLeafletStyle(template.category);
			const layer = L.geoJSON(fc, {
				pointToLayer: (_f: any, latlng: any) => L.circleMarker(latlng, style),
				style: () => style,
				onEachFeature: (feature: GeoJSON.Feature, lyr: any) => {
					lyr.on('click', (e: any) => {
						e.originalEvent?.stopPropagation?.();
						selectExisting(template, feature, lyr);
					});
				}
			});
			layer.addTo(map);
			featureLayers.set(template.id, layer);
		}
	}

	// Init once the map exists.
	$effect(() => {
		if (!ready) return;
		const map = ctx.getLeafletMap();
		const L = ctx.getLeaflet();
		if (!map || !L) return;
		mapRef = map;
		LRef = L;

		const onCommit = (e: any) => {
			if (mode !== 'drawing') return;
			pendingGeometry = e.layer?.toGeoJSON()?.geometry ?? null;
			tempDrawLayer = e.layer;
			mode = 'form';
			statusMessage = null;
		};
		map.on('editable:drawing:commit', onCommit);
		return () => map.off('editable:drawing:commit', onCommit);
	});

	// Rebuild feature layers whenever the data (or map) changes.
	$effect(() => {
		// reference deps so the effect re-runs on change
		void featuresByTemplate;
		if (mapRef && LRef) buildFeatureLayers();
	});
</script>

<!-- Toolbar: add-feature template picker -->
<div class="capture-toolbar">
	<button
		type="button"
		class="capture-btn capture-btn--primary"
		onclick={() => (showTemplatePicker = !showTemplatePicker)}
	>
		+ Add feature
	</button>
	{#if showTemplatePicker}
		<div class="capture-picker">
			{#each Object.entries(templatesByCategory) as [category, list] (category)}
				<div class="capture-picker__group">{category}</div>
				{#each list as template (template.id)}
					<button type="button" class="capture-picker__item" onclick={() => startDraw(template)}>
						{template.name}
						<span class="capture-picker__geom">{template.geometry_type}</span>
					</button>
				{/each}
			{/each}
		</div>
	{/if}
</div>

{#if statusMessage}
	<div class="capture-status">{statusMessage}</div>
{/if}

{#if savedWarnings.length}
	<div class="capture-warn-banner">
		<span>{savedWarnings.join('; ')}</span>
		<button type="button" onclick={() => (savedWarnings = [])} aria-label="Dismiss">✕</button>
	</div>
{/if}

<!-- Side panel: attribute form for the active feature -->
{#if mode === 'form' && activeTemplate}
	<div class="capture-panel">
		<header class="capture-panel__header">
			<span>{editingFeatureId ? 'Edit' : 'New'} {activeTemplate.name}</span>
			<button type="button" class="capture-panel__close" onclick={resetCapture} aria-label="Close">
				✕
			</button>
		</header>

		<form
			method="POST"
			action="?/saveFeature"
			use:enhance={({ formData, cancel }) => {
				const err = missingRequired();
				if (err) {
					formError = err;
					cancel();
					return;
				}
				const geom = currentGeometry();
				if (!geom) {
					formError = 'No geometry to save — draw or edit the shape first.';
					cancel();
					return;
				}
				formData.set('geometry', JSON.stringify(geom));
				formError = null;
				formIssues = [];
				formWarnings = [];
				saving = true;
				return async ({ result }) => {
					saving = false;
					if (result.type === 'success') {
						const w = ((result.data as any)?.warnings ?? []) as string[];
						await invalidateAll();
						resetCapture();
						savedWarnings = w;
						statusMessage = w.length ? 'Saved (with warnings)' : 'Saved';
					} else if (result.type === 'failure') {
						const d = result.data as any;
						formError = d?.message ?? 'Save failed';
						formIssues = (d?.issues ?? []) as string[];
						formWarnings = (d?.warnings ?? []) as string[];
					} else {
						formError = 'Save failed';
					}
				};
			}}
		>
			<input type="hidden" name="propertyId" value={propertyId} />
			<input type="hidden" name="templateId" value={activeTemplate.id} />
			<input type="hidden" name="featureId" value={editingFeatureId ?? ''} />

			{#each activeTemplate.attributes as attr (attr.id)}
				<label class="capture-field">
					<span class="capture-field__label">
						{attr.name}{#if attr.required}<span class="capture-field__req">*</span>{/if}
					</span>
					{#if attr.name === 'description'}
						<textarea name={`attr_${attr.id}`} bind:value={attrValues[attr.id]} rows="3"></textarea>
					{:else}
						<input type="text" name={`attr_${attr.id}`} bind:value={attrValues[attr.id]} />
					{/if}
				</label>
			{/each}

			{#if editingFeatureId && activeTemplate.geometry_type !== 'point'}
				<button type="button" class="capture-btn" onclick={enableShapeEdit}>Edit shape</button>
			{/if}

			{#if formError}<p class="capture-error">{formError}</p>{/if}
			{#if formIssues.length}
				<ul class="capture-issues">
					{#each formIssues as issue (issue)}<li>{issue}</li>{/each}
				</ul>
			{/if}
			{#if formWarnings.length}
				<ul class="capture-warnings">
					{#each formWarnings as warning (warning)}<li>{warning}</li>{/each}
				</ul>
			{/if}

			<div class="capture-panel__actions">
				<button type="submit" class="capture-btn capture-btn--primary" disabled={saving}>
					{saving ? 'Saving…' : 'Save'}
				</button>
				<button type="button" class="capture-btn" onclick={resetCapture}>Cancel</button>
			</div>
		</form>

		{#if editingFeatureId}
			<form
				method="POST"
				action="?/deleteFeature"
				use:enhance={() => {
					saving = true;
					return async ({ result }) => {
						saving = false;
						if (result.type === 'success') {
							await invalidateAll();
							resetCapture();
							statusMessage = 'Deleted.';
						} else {
							formError = 'Delete failed';
						}
					};
				}}
			>
				<input type="hidden" name="propertyId" value={propertyId} />
				<input type="hidden" name="featureId" value={editingFeatureId} />
				<button type="submit" class="capture-btn capture-btn--danger" disabled={saving}>Delete</button>
			</form>
		{/if}
	</div>
{/if}

<style>
	.capture-toolbar {
		position: absolute;
		top: 0.75rem;
		left: 0.75rem;
		z-index: 1100;
	}
	.capture-status {
		position: absolute;
		top: 0.75rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 1100;
		background: var(--color-surface-900);
		color: var(--color-surface-50);
		padding: 4px 10px;
		border-radius: 4px;
		font-size: 0.8rem;
		opacity: 0.92;
	}
	.capture-picker {
		margin-top: 6px;
		background: var(--color-surface-100);
		color: var(--color-surface-900);
		border-radius: 6px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
		padding: 6px;
		max-height: 60vh;
		overflow-y: auto;
		min-width: 200px;
	}
	:global(.dark) .capture-picker {
		background: var(--color-surface-800);
		color: var(--color-surface-50);
	}
	.capture-picker__group {
		text-transform: capitalize;
		font-size: 0.7rem;
		opacity: 0.7;
		padding: 6px 6px 2px;
		font-weight: 600;
	}
	.capture-picker__item {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
		width: 100%;
		text-align: left;
		padding: 6px 8px;
		border-radius: 4px;
		font-size: 0.85rem;
	}
	.capture-picker__item:hover {
		background: var(--color-surface-200);
	}
	:global(.dark) .capture-picker__item:hover {
		background: var(--color-surface-700);
	}
	.capture-picker__geom {
		font-size: 0.65rem;
		opacity: 0.6;
	}
	.capture-panel {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		bottom: 0.75rem;
		width: 280px;
		z-index: 1100;
		background: var(--color-surface-100);
		color: var(--color-surface-900);
		border-radius: 8px;
		box-shadow: 0 2px 10px rgba(0, 0, 0, 0.35);
		padding: 12px;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
	:global(.dark) .capture-panel {
		background: var(--color-surface-800);
		color: var(--color-surface-50);
	}
	.capture-panel__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: 600;
	}
	.capture-panel__close {
		opacity: 0.7;
	}
	.capture-field {
		display: flex;
		flex-direction: column;
		gap: 3px;
		font-size: 0.8rem;
	}
	.capture-field__req {
		color: #ef4444;
		margin-left: 2px;
	}
	.capture-field :global(input),
	.capture-field :global(textarea) {
		border: 1px solid var(--color-surface-400);
		border-radius: 4px;
		padding: 5px 7px;
		background: var(--color-surface-50);
		color: inherit;
		font-size: 0.85rem;
	}
	:global(.dark) .capture-field :global(input),
	:global(.dark) .capture-field :global(textarea) {
		background: var(--color-surface-900);
		border-color: var(--color-surface-600);
	}
	.capture-panel__actions {
		display: flex;
		gap: 8px;
		margin-top: 4px;
	}
	.capture-btn {
		padding: 6px 12px;
		border-radius: 5px;
		font-size: 0.85rem;
		background: var(--color-surface-200);
		color: var(--color-surface-900);
	}
	:global(.dark) .capture-btn {
		background: var(--color-surface-700);
		color: var(--color-surface-50);
	}
	.capture-btn--primary {
		background: #2563eb;
		color: #fff;
	}
	.capture-btn--danger {
		background: #dc2626;
		color: #fff;
	}
	.capture-btn:disabled {
		opacity: 0.6;
	}
	.capture-error {
		color: #ef4444;
		font-size: 0.8rem;
	}
	.capture-issues,
	.capture-warnings {
		margin: 0;
		padding-left: 1.1rem;
		font-size: 0.78rem;
		display: flex;
		flex-direction: column;
		gap: 2px;
	}
	.capture-issues {
		color: #ef4444;
	}
	.capture-warnings {
		color: #b45309;
	}
	:global(.dark) .capture-warnings {
		color: #fbbf24;
	}
	.capture-warn-banner {
		position: absolute;
		top: 2.6rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 1100;
		max-width: 70%;
		display: flex;
		gap: 8px;
		align-items: center;
		background: #fef3c7;
		color: #92400e;
		border: 1px solid #f59e0b;
		padding: 4px 10px;
		border-radius: 4px;
		font-size: 0.78rem;
	}
</style>
