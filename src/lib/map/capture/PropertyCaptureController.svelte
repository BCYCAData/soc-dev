<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any -- dynamic Leaflet/GeoJSON + leaflet-editable */
	import { getContext } from 'svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	import { Settings, Wrench } from 'lucide-svelte';

	import { LEAFLET_CONTEXT_KEY, type LeafletContext } from '$lib/map/createLeafletMap';
	import {
		resolveTemplateStyle,
		templatePointToLayer,
		templateToLeafletOptions,
		FALLBACK_COLOR,
		type FeatureCategory,
		type TemplateStyleOverride
	} from '$lib/map/capture/template-styles';
	import { enableSnapping } from '$lib/map/capture/snapping';
	import { createShapeDivIcon } from '$lib/map/render/markers';

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
		category: FeatureCategory;
		geometry_type: 'point' | 'line' | 'polygon';
		attributes: TemplateAttribute[];
		/** Optional admin style override (feature_templates.style jsonb). */
		style?: TemplateStyleOverride | null;
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
	let toolbarOpen = $state(true);

	// ── Snapping ──
	let snapEnabled = $state(true);
	let showSnapSettings = $state(false);
	// Defaults mirror the original hard-wired behaviour: 12px, vertices win,
	// every layer participates (an id is only present here once switched off).
	let snapTolerance = $state(12);
	let snapToleranceUnit = $state<'px' | 'm'>('px');
	let snapPreferVertices = $state(true);
	let snapLayerOff = $state<Record<string, boolean>>({});

	// ── Merge mode ──
	let mergeMode = $state(false);
	let mergeIds = $state<string[]>([]); // reactive mirror of the selection
	let mergeTemplateId = $state<string | null>(null);
	let merging = $state(false);

	// ── Edit mode & clipboard ──
	let editMode = $state(false); // explicit tool: click a feature to select/edit it
	let pasteArmed = $state(false); // next map click places the clipboard copy
	let clipboard = $state<{
		template: FeatureTemplate;
		attrs: Record<string, string>;
		geometry: GeoJSON.Geometry;
	} | null>(null);

	// Imperative (non-reactive) Leaflet handles.
	let pendingGeometry: GeoJSON.Geometry | null = null;
	let tempDrawLayer: any = null; // the in-progress drawn layer
	let selectedLayer: any = null; // an existing feature layer being edited
	let pointHandle: any = null; // draggable proxy marker while moving/pasting a point
	let maptip: any = null; // single reusable hover tooltip (idle toolbar only)
	// eslint-disable-next-line svelte/prefer-svelte-reactivity -- imperative Leaflet handle registry
	const featureLayers = new Map<string, any>(); // templateId → L.GeoJSON
	// eslint-disable-next-line svelte/prefer-svelte-reactivity -- imperative Leaflet handle registry
	const mergeSelected = new Map<string, { layer: any; template: FeatureTemplate }>(); // id → layer

	const MERGE_HIGHLIGHT = { color: '#f59e0b', weight: 4, fillColor: '#f59e0b', fillOpacity: 0.35 };
	const SELECT_HIGHLIGHT = { color: '#2563eb', weight: 5, opacity: 1 };

	function highlightSelected(layer: any) {
		layer.setStyle?.(SELECT_HIGHLIGHT);
		layer._icon?.classList?.add('capture-selected');
	}

	function unhighlightSelected(template: FeatureTemplate, layer: any) {
		layer.setStyle?.(templateToLeafletOptions(resolveTemplateStyle(template)));
		layer.setOpacity?.(1);
		layer._icon?.classList?.remove('capture-selected');
	}

	function clearDrawArtifacts() {
		if (mapRef) {
			if (tempDrawLayer) {
				try {
					mapRef.editTools?.stopDrawing?.();
				} catch {
					/* noop */
				}
				tempDrawLayer.disableEdit?.();
				mapRef.removeLayer(tempDrawLayer);
			}
			if (pointHandle) {
				pointHandle.disableEdit?.();
				mapRef.removeLayer(pointHandle);
			}
			if (selectedLayer) {
				selectedLayer.disableEdit?.();
				if (activeTemplate) unhighlightSelected(activeTemplate, selectedLayer);
			}
		}
		tempDrawLayer = null;
		pointHandle = null;
		selectedLayer = null;
		pendingGeometry = null;
	}

	function resetCapture() {
		clearDrawArtifacts();
		hideMaptip();
		mode = 'idle';
		pasteArmed = false;
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

	// ── Collapse the toolbar to its toolbox icon (capture state is kept) ──
	function toggleToolbar() {
		toolbarOpen = !toolbarOpen;
		if (!toolbarOpen) {
			showTemplatePicker = false;
			showSnapSettings = false;
		}
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

	// ── Maptip: hover tooltip with a feature's attributes, shown only while no
	// tool is engaged (no draw/form, edit/merge/paste all off). One tooltip is
	// reused; content is built as DOM nodes so attribute text can't inject HTML. ──
	function maptipContent(template: FeatureTemplate, feature: GeoJSON.Feature): HTMLElement {
		const root = document.createElement('div');
		const title = document.createElement('strong');
		title.textContent = template.name;
		root.appendChild(title);
		for (const a of template.attributes) {
			const val = feature.properties?.[a.id];
			if (val == null || String(val).trim() === '') continue;
			const row = document.createElement('div');
			row.className = 'capture-maptip__row';
			const key = document.createElement('span');
			key.className = 'capture-maptip__key';
			key.textContent = a.name;
			const value = document.createElement('span');
			value.textContent = String(val);
			row.append(key, value);
			root.appendChild(row);
		}
		return root;
	}

	function showMaptip(template: FeatureTemplate, feature: GeoJSON.Feature, e: any) {
		if (!mapRef || !LRef || !e?.latlng) return;
		if (mode !== 'idle' || editMode || mergeMode || pasteArmed) return;
		if (!maptip) {
			maptip = LRef.tooltip({
				className: 'capture-maptip',
				direction: 'top',
				offset: [0, -8],
				opacity: 0.95
			});
		}
		maptip.setContent(maptipContent(template, feature)).setLatLng(e.latlng);
		mapRef.openTooltip(maptip);
	}

	function moveMaptip(e: any) {
		if (maptip && e?.latlng && mapRef?.hasLayer(maptip)) maptip.setLatLng(e.latlng);
	}

	function hideMaptip() {
		if (maptip && mapRef) mapRef.closeTooltip(maptip);
	}

	// ── Feature-click dispatch: paste placement > merge selection > edit-mode
	// selection. Selection needs the explicit Edit tool and never fires while a
	// draw is in progress (a stray click on a feature used to abort the draw). ──
	function handleFeatureClick(
		template: FeatureTemplate,
		feature: GeoJSON.Feature,
		layer: any,
		e: any
	) {
		e.originalEvent?.stopPropagation?.();
		if (pasteArmed) {
			placePasteAt(e.latlng);
			return;
		}
		if (mergeMode) {
			toggleMergeSelect(template, feature, layer);
			return;
		}
		if (!editMode || mode === 'drawing') return;
		selectExisting(template, feature, layer);
	}

	// ── Select an existing feature (from a layer click, Edit mode) ──
	function selectExisting(template: FeatureTemplate, feature: GeoJSON.Feature, layer: any) {
		resetCapture();
		savedWarnings = [];
		activeTemplate = template;
		editingFeatureId = (feature.properties?.id as string) ?? null;
		selectedLayer = layer;
		highlightSelected(layer);
		const v: Record<string, string> = {};
		for (const a of template.attributes) {
			const val = feature.properties?.[a.id];
			v[a.id] = val != null ? String(val) : '';
		}
		attrValues = v;
		mode = 'form';
		statusMessage = null;
	}

	function toggleEditMode() {
		if (editMode) {
			editMode = false;
			resetCapture();
			statusMessage = null;
		} else {
			resetCapture();
			if (mergeMode) {
				clearMergeSelection();
				mergeMode = false;
			}
			editMode = true;
			statusMessage = 'Click a feature on the map to edit it.';
		}
	}

	function enableShapeEdit() {
		if (selectedLayer?.enableEdit) {
			selectedLayer.enableEdit();
			statusMessage = 'Drag the vertices to reshape, then Save.';
		}
	}

	// ── Move a point: leaflet-editable can't drag circleMarkers (needs the
	// Path.Drag plugin), so a draggable proxy marker stands in for every point.
	// Its drag goes through editable, which fires editable:drawing:move — the
	// same event the snapping hook mutates, so point moves snap too. ──
	function spawnPointHandle(latlng: any) {
		if (!mapRef || !LRef || !activeTemplate || pointHandle) return;
		const resolved = resolveTemplateStyle(activeTemplate);
		const pt = resolved.kind === 'point' ? resolved.point : null;
		const icon = createShapeDivIcon(LRef, {
			shape: pt?.shape ?? 'circle',
			color: pt?.fillColor ?? FALLBACK_COLOR,
			size: pt?.size ?? (pt?.radius ? pt.radius * 2 + 4 : 16),
			className: 'mapview-shape-marker capture-point-handle'
		});
		pointHandle = LRef.marker(latlng, { icon, zIndexOffset: 1000 });
		pointHandle.addTo(mapRef);
		pointHandle.enableEdit?.();
		// Snapping mutates the drag latlng in place; re-set it so the icon follows.
		pointHandle.on('drag', () => pointHandle.setLatLng(pointHandle.getLatLng()));
	}

	function startPointMove() {
		if (!selectedLayer?.getLatLng) return;
		spawnPointHandle(selectedLayer.getLatLng());
		selectedLayer.setStyle?.({ opacity: 0.25, fillOpacity: 0.1 });
		selectedLayer.setOpacity?.(0.25);
		statusMessage = 'Drag the point to its new spot, then Save.';
	}

	function currentGeometry(): GeoJSON.Geometry | null {
		if (pointHandle) {
			const ll = pointHandle.getLatLng();
			return { type: 'Point', coordinates: [ll.lng, ll.lat] };
		}
		if (editingFeatureId && selectedLayer) {
			return selectedLayer.toGeoJSON()?.geometry ?? null;
		}
		if (tempDrawLayer?.toGeoJSON) {
			return tempDrawLayer.toGeoJSON()?.geometry ?? null;
		}
		return pendingGeometry;
	}

	// ── Copy / paste: Copy captures the open feature (template + attribute
	// values + live geometry); Paste arms a one-shot click that recentres the
	// copy there and opens it as a NEW feature via the normal save flow. ──
	function copyCurrent() {
		if (!activeTemplate) return;
		const geometry = currentGeometry();
		if (!geometry) {
			formError = 'Nothing to copy — the feature has no geometry.';
			return;
		}
		clipboard = { template: activeTemplate, attrs: { ...attrValues }, geometry };
		statusMessage = `Copied ${activeTemplate.name} — use Paste to place a copy.`;
	}

	function togglePaste() {
		if (pasteArmed) {
			pasteArmed = false;
			statusMessage = null;
			return;
		}
		if (!clipboard) return;
		resetCapture();
		savedWarnings = [];
		pasteArmed = true;
		statusMessage = `Click the map to place the copied ${clipboard.template.name}.`;
	}

	/** Translate a coordinate array by (dLat, dLng) — fine at property scale. */
	function shiftCoords(c: any, dLat: number, dLng: number): any {
		return typeof c[0] === 'number'
			? [c[0] + dLng, c[1] + dLat, ...c.slice(2)]
			: c.map((x: any) => shiftCoords(x, dLat, dLng));
	}

	function placePasteAt(latlng: any) {
		const cb = clipboard ? ($state.snapshot(clipboard) as NonNullable<typeof clipboard>) : null;
		if (!cb || !mapRef || !LRef) return;
		resetCapture();
		savedWarnings = [];
		activeTemplate = cb.template;
		editingFeatureId = null;
		attrValues = { ...cb.attrs };

		// Recentre the copied geometry on the clicked point.
		const anchor = LRef.geoJSON({ type: 'Feature', geometry: cb.geometry, properties: {} })
			.getBounds()
			.getCenter();
		const geometry = {
			...cb.geometry,
			coordinates: shiftCoords(
				(cb.geometry as any).coordinates,
				latlng.lat - anchor.lat,
				latlng.lng - anchor.lng
			)
		} as GeoJSON.Geometry;
		pendingGeometry = geometry;

		if (cb.template.geometry_type === 'point') {
			spawnPointHandle(latlng);
		} else {
			const layer = LRef.geoJSON(
				{ type: 'Feature', geometry, properties: {} },
				{ style: () => templateToLeafletOptions(resolveTemplateStyle(cb.template)) }
			).getLayers()[0];
			layer.addTo(mapRef);
			layer.enableEdit?.();
			tempDrawLayer = layer;
		}
		mode = 'form';
		statusMessage = 'Copy placed — adjust it if needed, then Save.';
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

		// Layers may be replaced under the cursor (post-save rebuild) — the
		// hovered layer's mouseout never fires, so close the maptip here.
		hideMaptip();
		for (const [, layer] of featureLayers) map.removeLayer(layer);
		featureLayers.clear();

		for (const template of templates) {
			const fc = featuresByTemplate[template.id] ?? { type: 'FeatureCollection', features: [] };
			const resolved = resolveTemplateStyle(template);
			const pathOptions = templateToLeafletOptions(resolved);
			const layer = L.geoJSON(fc, {
				pointToLayer: (_f: any, latlng: any) => templatePointToLayer(L, resolved, latlng),
				style: () => pathOptions,
				onEachFeature: (feature: GeoJSON.Feature, lyr: any) => {
					lyr.on('click', (e: any) => handleFeatureClick(template, feature, lyr, e));
					lyr.on('mouseover', (e: any) => showMaptip(template, feature, e));
					lyr.on('mousemove', moveMaptip);
					lyr.on('mouseout', hideMaptip);
				}
			});
			layer.addTo(map);
			featureLayers.set(template.id, layer);
		}
	}

	// ── Snapping: collect candidate layers (context + existing features), flattened to
	// primitive geometries, excluding layers switched off in the snap settings and the
	// shape currently being drawn/edited. ──
	function getSnapLayers(): any[] {
		if (!snapEnabled) return [];
		const out: any[] = [];
		const push = (lyr: any) => {
			if (!lyr) return;
			if (typeof lyr.getLayers === 'function') lyr.getLayers().forEach(push);
			else out.push(lyr);
		};
		const registry = ctx.getLeafletLayers();
		for (const id in registry) if (!snapLayerOff[id]) push(registry[id].leafletLayer);
		for (const [templateId, layer] of featureLayers) if (!snapLayerOff[templateId]) push(layer);
		return out.filter((l) => l !== tempDrawLayer && l !== selectedLayer);
	}

	// Read per snap so settings changes apply to the very next vertex move.
	function getSnapOptions() {
		return {
			tolerance: snapTolerance > 0 ? snapTolerance : 12,
			toleranceUnit: snapToleranceUnit,
			preferVertices: snapPreferVertices
		};
	}

	function toggleSnapLayer(id: string) {
		snapLayerOff[id] = !snapLayerOff[id];
	}

	const snapSettingsLabel = $derived(
		!snapEnabled
			? 'Enable Snap to change snap settings'
			: showSnapSettings
				? 'Hide snap settings'
				: 'Show snap settings'
	);

	/** Context (read-only) layers currently on the map, as snap-toggle entries. */
	const contextSnapTargets = $derived(
		Object.entries(ctx.getLeafletLayers()).map(([id, l]) => ({ id, name: l.name }))
	);

	// ── Merge mode ──
	function highlight(layer: any) {
		layer?.setStyle?.(MERGE_HIGHLIGHT);
	}
	function restore(template: FeatureTemplate, layer: any) {
		layer?.setStyle?.(templateToLeafletOptions(resolveTemplateStyle(template)));
	}
	function clearMergeSelection() {
		for (const [, { layer, template }] of mergeSelected) restore(template, layer);
		mergeSelected.clear();
		mergeIds = [];
		mergeTemplateId = null;
	}
	function toggleMergeMode() {
		if (mergeMode) {
			clearMergeSelection();
			mergeMode = false;
			statusMessage = null;
		} else {
			resetCapture();
			showTemplatePicker = false;
			editMode = false;
			mergeMode = true;
			statusMessage = 'Merge: pick 2+ line/area features of the same type, then Merge.';
		}
	}
	function toggleMergeSelect(template: FeatureTemplate, feature: GeoJSON.Feature, layer: any) {
		if (template.geometry_type === 'point') {
			statusMessage = 'Only line and area features can be merged.';
			return;
		}
		const id = feature.properties?.id as string;
		if (!id) return;
		// Merge requires a single template — switching type starts a fresh selection.
		if (mergeTemplateId && mergeTemplateId !== template.id) clearMergeSelection();
		mergeTemplateId = template.id;
		if (mergeSelected.has(id)) {
			mergeSelected.delete(id);
			restore(template, layer);
		} else {
			mergeSelected.set(id, { layer, template });
			highlight(layer);
		}
		mergeIds = [...mergeSelected.keys()];
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

		const onMapClick = (e: any) => {
			if (pasteArmed) placePasteAt(e.latlng);
		};
		map.on('click', onMapClick);

		// Snapping (GeometryUtil loaded lazily; augments the shared L singleton).
		let cancelled = false;
		let disposeSnap = () => {};
		import('leaflet-geometryutil').then(() => {
			if (!cancelled) disposeSnap = enableSnapping(L, map, getSnapLayers, getSnapOptions);
		});

		return () => {
			cancelled = true;
			disposeSnap();
			map.off('editable:drawing:commit', onCommit);
			map.off('click', onMapClick);
		};
	});

	// Rebuild feature layers whenever the data (or map) changes.
	$effect(() => {
		// reference deps so the effect re-runs on change
		void featuresByTemplate;
		if (mapRef && LRef) buildFeatureLayers();
	});

	// MapView builds its context layers asynchronously, so they land AFTER the
	// capture layers and would paint above them (SVG stacking = add order).
	// They're pointer-transparent (interactive: false in build-layer), but keep
	// the captured features visually on top as each context layer registers.
	$effect(() => {
		void contextSnapTargets;
		if (!mapRef) return;
		for (const [, layer] of featureLayers) layer.bringToFront?.();
	});

	// Attachment: mounts the toolbar as a Leaflet control so it stacks beneath
	// the zoom control in the top-left corner regardless of how big that
	// renders. Re-runs once mapRef/LRef are set (map ready).
	function toolbarControl(el: HTMLElement) {
		const map = mapRef;
		const L = LRef;
		if (!map || !L) return;

		const ToolbarControl = L.Control.extend({
			onAdd: () => {
				// Keeps map drag/dblclick-zoom/scroll from firing through the
				// toolbar. Leaflet 1.9 does NOT stop `click` bubbling (it marks
				// the element instead), so Svelte's delegated onclick handlers
				// inside the toolbar still work.
				L.DomEvent.disableClickPropagation(el);
				L.DomEvent.disableScrollPropagation(el);
				return el;
			},
			// Svelte owns the element — nothing to tear down here.
			onRemove: () => {}
		});
		const control = new ToolbarControl({ position: 'topleft' }).addTo(map);
		return () => control.remove();
	}
</script>

<!-- Toolbar: add-feature template picker + merge/snap controls.
     Reparented into Leaflet's top-left control corner once the map is ready
     (see toolbarControl); hidden until then. -->
<div class="capture-toolbar" {@attach toolbarControl}>
	<button
		type="button"
		class="capture-toolbar__toggle"
		class:capture-toolbar__toggle--open={toolbarOpen}
		aria-expanded={toolbarOpen}
		aria-label={toolbarOpen ? 'Hide capture tools' : 'Show capture tools'}
		title={toolbarOpen ? 'Hide capture tools' : 'Show capture tools'}
		onclick={toggleToolbar}
	>
		<Wrench size={18} />
	</button>
	{#if toolbarOpen}
		<div class="capture-toolbar__row">
			<button
				type="button"
				class="capture-btn capture-btn--primary"
				onclick={() => (showTemplatePicker = !showTemplatePicker)}
			>
				+ Add feature
			</button>
			<button
				type="button"
				class="capture-btn"
				class:capture-btn--active={editMode}
				onclick={toggleEditMode}
			>
				Edit features
			</button>
			<button
				type="button"
				class="capture-btn"
				class:capture-btn--active={mergeMode}
				onclick={toggleMergeMode}
			>
				Merge features
			</button>
			<button
				type="button"
				class="capture-btn"
				class:capture-btn--active={pasteArmed}
				disabled={!clipboard}
				title={clipboard
					? `Paste the copied ${clipboard.template.name}`
					: 'Copy a feature first (open it, then Copy)'}
				onclick={togglePaste}
			>
				Paste
			</button>
			<div class="capture-snap-row">
				<label class="capture-snap" title="Snap vertices to nearby boundaries and features">
					<input
						type="checkbox"
						bind:checked={snapEnabled}
						onchange={() => {
							if (!snapEnabled) showSnapSettings = false;
						}}
					/>
					Snap
				</label>
				<button
					type="button"
					class="capture-snap-row__settings"
					class:capture-snap-row__settings--open={showSnapSettings}
					disabled={!snapEnabled}
					aria-expanded={showSnapSettings}
					aria-label={snapSettingsLabel}
					title={snapSettingsLabel}
					onclick={() => (showSnapSettings = !showSnapSettings)}
				>
					<Settings size={14} />
				</button>
			</div>
		</div>

		{#if showSnapSettings}
			<div class="capture-snap-flyout">
				<header class="capture-snap-flyout__header">
					<span>Snap settings</span>
					<button
						type="button"
						class="capture-panel__close"
						onclick={() => (showSnapSettings = false)}
						aria-label="Close snap settings"
					>
						✕
					</button>
				</header>
				<label class="capture-snap-flyout__field">
					<span>Snap distance</span>
					<span class="capture-snap-flyout__distance">
						<input
							type="number"
							min="1"
							max="100"
							step={snapToleranceUnit === 'm' ? 0.5 : 1}
							bind:value={snapTolerance}
						/>
						<select
							bind:value={snapToleranceUnit}
							aria-label="Snap distance unit"
							title="px keeps the same screen feel at any zoom; m is a fixed ground distance"
						>
							<option value="px">px</option>
							<option value="m">m</option>
						</select>
					</span>
				</label>
				<label class="capture-snap-flyout__check">
					<input type="checkbox" bind:checked={snapPreferVertices} />
					Prefer vertices over edges
				</label>
				<div class="capture-snap-flyout__group">Map layers</div>
				{#each contextSnapTargets as target (target.id)}
					<label class="capture-snap-flyout__check">
						<input
							type="checkbox"
							checked={!snapLayerOff[target.id]}
							onchange={() => toggleSnapLayer(target.id)}
						/>
						{target.name}
					</label>
				{/each}
				<div class="capture-snap-flyout__group">Captured features</div>
				{#each templates as template (template.id)}
					<label class="capture-snap-flyout__check">
						<input
							type="checkbox"
							checked={!snapLayerOff[template.id]}
							onchange={() => toggleSnapLayer(template.id)}
						/>
						{template.name}
					</label>
				{/each}
			</div>
		{/if}
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

		{#if mergeMode}
			<form
				method="POST"
				action="?/mergeFeatures"
				class="capture-merge-bar"
				use:enhance={() => {
					merging = true;
					return async ({ result }) => {
						merging = false;
						if (result.type === 'success') {
							await invalidateAll();
							clearMergeSelection();
							mergeMode = false;
							statusMessage = ((result.data as any)?.message as string) ?? 'Merged';
						} else if (result.type === 'failure') {
							statusMessage = ((result.data as any)?.message as string) ?? 'Merge failed';
						} else {
							statusMessage = 'Merge failed';
						}
					};
				}}
			>
				<input type="hidden" name="propertyId" value={propertyId} />
				<input type="hidden" name="featureIds" value={mergeIds.join(',')} />
				<span>{mergeIds.length} selected</span>
				<button
					type="submit"
					class="capture-btn capture-btn--primary"
					disabled={mergeIds.length < 2 || merging}
				>
					{merging ? 'Merging…' : 'Merge'}
				</button>
				<button type="button" class="capture-btn" onclick={toggleMergeMode}>Cancel</button>
			</form>
		{/if}
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

			<div class="capture-panel__tools">
				{#if editingFeatureId}
					{#if activeTemplate.geometry_type === 'point'}
						<button type="button" class="capture-btn" onclick={startPointMove}>Move point</button>
					{:else}
						<button type="button" class="capture-btn" onclick={enableShapeEdit}>Edit shape</button>
					{/if}
				{/if}
				<button type="button" class="capture-btn" onclick={copyCurrent}>Copy</button>
			</div>

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
				<button type="submit" class="capture-btn capture-btn--danger" disabled={saving}
					>Delete</button
				>
			</form>
		{/if}
	</div>
{/if}

<style>
	.capture-toolbar {
		/* Lives inside .leaflet-container, which sets its own font stack. */
		font-family: var(--base-font-family, sans-serif);
	}
	/* Until Leaflet adopts it as a control (adding .leaflet-control), the div
	   sits in normal flow below the map canvas — keep it hidden. */
	.capture-toolbar:not(:global(.leaflet-control)) {
		display: none;
	}
	.capture-toolbar__toggle {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 34px;
		height: 34px;
		border-radius: 5px;
		background: var(--color-surface-100);
		color: var(--color-surface-900);
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
	}
	:global(.dark) .capture-toolbar__toggle {
		background: var(--color-surface-800);
		color: var(--color-surface-50);
	}
	/* Keep after the .dark rule — must win in both themes. */
	.capture-toolbar__toggle--open,
	:global(.dark) .capture-toolbar__toggle--open {
		background: #2563eb;
		color: #fff;
	}
	.capture-toolbar__row {
		margin-top: 6px;
		display: flex;
		flex-direction: column;
		gap: 6px;
		align-items: stretch;
	}
	.capture-snap {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 4px;
		font-size: 0.8rem;
		padding: 4px 8px;
		border-radius: 5px;
		background: var(--color-surface-100);
		color: var(--color-surface-900);
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
	}
	:global(.dark) .capture-snap {
		background: var(--color-surface-800);
		color: var(--color-surface-50);
	}
	.capture-snap-row {
		display: flex;
		gap: 4px;
		align-items: stretch;
	}
	.capture-snap-row .capture-snap {
		flex: 1;
	}
	.capture-snap-row__settings {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		width: 28px;
		border-radius: 5px;
		background: var(--color-surface-100);
		color: var(--color-surface-900);
		box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
	}
	:global(.dark) .capture-snap-row__settings {
		background: var(--color-surface-800);
		color: var(--color-surface-50);
	}
	/* Keep after the .dark rule — must win in both themes. */
	.capture-snap-row__settings--open,
	:global(.dark) .capture-snap-row__settings--open {
		background: #2563eb;
		color: #fff;
	}
	.capture-snap-row__settings:disabled {
		opacity: 0.6;
		cursor: not-allowed;
	}
	.capture-snap-flyout {
		position: absolute;
		top: 0;
		left: calc(100% + 8px);
		width: 230px;
		max-height: 70vh;
		overflow-y: auto;
		display: flex;
		flex-direction: column;
		gap: 6px;
		padding: 10px;
		border-radius: 6px;
		background: var(--color-surface-100);
		color: var(--color-surface-900);
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
		font-size: 0.8rem;
	}
	:global(.dark) .capture-snap-flyout {
		background: var(--color-surface-800);
		color: var(--color-surface-50);
	}
	.capture-snap-flyout__header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		font-weight: 600;
	}
	.capture-snap-flyout__field {
		display: flex;
		justify-content: space-between;
		align-items: center;
		gap: 8px;
	}
	.capture-snap-flyout__field input,
	.capture-snap-flyout__field select {
		padding: 2px 6px;
		border-radius: 4px;
		border: 1px solid var(--color-surface-300);
		background: var(--color-surface-50);
		color: inherit;
	}
	.capture-snap-flyout__field input {
		width: 64px;
	}
	:global(.dark) .capture-snap-flyout__field input,
	:global(.dark) .capture-snap-flyout__field select {
		background: var(--color-surface-900);
		border-color: var(--color-surface-600);
	}
	.capture-snap-flyout__distance {
		display: inline-flex;
		align-items: center;
		gap: 4px;
	}
	.capture-snap-flyout__check {
		display: flex;
		align-items: center;
		gap: 6px;
	}
	.capture-snap-flyout__group {
		text-transform: capitalize;
		font-size: 0.7rem;
		font-weight: 600;
		opacity: 0.7;
		margin-top: 4px;
	}
	.capture-btn--active {
		outline: 2px solid #f59e0b;
	}
	.capture-merge-bar {
		margin-top: 6px;
		display: flex;
		gap: 8px;
		align-items: center;
		background: var(--color-surface-100);
		color: var(--color-surface-900);
		padding: 6px 10px;
		border-radius: 6px;
		box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
		font-size: 0.82rem;
	}
	:global(.dark) .capture-merge-bar {
		background: var(--color-surface-800);
		color: var(--color-surface-50);
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
	.capture-panel__tools {
		display: flex;
		gap: 8px;
	}
	/* Selected divIcon point (paths get SELECT_HIGHLIGHT via setStyle instead). */
	:global(.capture-selected) {
		outline: 2px solid #2563eb;
		outline-offset: 2px;
	}
	/* Draggable proxy marker used while moving/pasting a point. */
	:global(.capture-point-handle) {
		cursor: grab;
		filter: drop-shadow(0 0 3px rgba(37, 99, 235, 0.9));
	}
	/* Maptip: idle-toolbar hover tooltip with a feature's attributes.
	   Lives in Leaflet's zero-width tooltip pane, where an abspos box collapses
	   to min-content once white-space:nowrap is lifted — width:max-content sizes
	   it by its lines instead, with max-width as the wrap point. */
	:global(.capture-maptip) {
		font-family: var(--base-font-family, sans-serif);
		font-size: 0.75rem;
		width: max-content;
		max-width: 240px;
		white-space: normal;
	}
	:global(.capture-maptip .capture-maptip__row) {
		display: flex;
		justify-content: space-between;
		gap: 10px;
	}
	:global(.capture-maptip .capture-maptip__row span:last-child) {
		overflow-wrap: anywhere;
		text-align: right;
	}
	:global(.capture-maptip .capture-maptip__key) {
		font-weight: 600;
		opacity: 0.7;
		flex-shrink: 0;
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
