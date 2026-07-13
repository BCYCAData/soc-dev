<script lang="ts">
	/* eslint-disable @typescript-eslint/no-explicit-any -- dynamic Leaflet/GeoJSON + leaflet-editable */
	import { getContext, onDestroy, untrack } from 'svelte';
	import { enhance } from '$app/forms';
	import { invalidateAll } from '$app/navigation';

	import { LEAFLET_CONTEXT_KEY, type LeafletContext } from '$lib/map/createLeafletMap';
	import { enableSnapping } from '$lib/map/capture/snapping';
	import { generateUniqueColorForKey } from '$lib/map/render/color';
	import { escapeHtml } from '$lib/map/render/template-utils';

	export interface KyngEditSession {
		session_id: string;
		kyng_ids: string[];
		status: 'draft' | 'validated' | 'promoted' | 'rejected';
		control_lines?: GeoJSON.FeatureCollection | null;
		region_assignments?: { region: number; kyng_id: string }[] | null;
		validation?: { valid: boolean; issues: string[]; warnings: string[] } | null;
	}

	interface MovedSummary {
		from_kyng: string;
		to_kyng: string;
		faces: number;
		area_m2: number;
	}
	interface MovedProperty {
		property_id: string;
		address: string;
		from_kyng: string;
		to_kyng: string;
	}
	interface Proposal {
		session_id: string;
		regions: GeoJSON.FeatureCollection;
		boundaries: GeoJSON.FeatureCollection;
		moved: MovedSummary[];
		properties_moved: MovedProperty[];
		warnings: string[];
	}

	interface Props {
		/** Flips true once MapView has created the map. */
		ready: boolean;
		boundaries: GeoJSON.FeatureCollection | null;
		activeSession: KyngEditSession | null;
	}

	let { ready, boundaries, activeSession }: Props = $props();

	const ctx = getContext<LeafletContext>(LEAFLET_CONTEXT_KEY);
	const FABRIC_MIN_ZOOM = 13;

	// ── Live map refs ──
	let mapRef = $state<any>(undefined);
	let LRef = $state<any>(undefined);

	// ── Session / proposal state ──
	// Writable $derived: locally reassigned by the action handlers, re-synced
	// from the load data after invalidateAll.
	let session = $derived<KyngEditSession | null>(activeSession);
	let proposal = $state<Proposal | null>(null);
	let overrides = $state<Record<number, string>>({});
	let selectedAreaIds = $state<string[]>([]);
	let drawing = $state(false);
	let lineCount = $state(0);
	let busy = $state(false);
	let statusMessage = $state<string | null>(null);
	let errorMessage = $state<string | null>(null);
	let fabricCount = $state<number | null>(null);
	let zoomedEnough = $state(false);

	// Imperative Leaflet handles.
	let fabricGroup: any = null;
	let previewGroup: any = null;
	let linesGroup: any = null;
	let tempDrawLayer: any = null;
	let fabricFetchSeq = 0;

	// Serialized form payloads (hidden inputs).
	let proposeFormEl = $state<HTMLFormElement | undefined>(undefined);
	let controlLinesJson = $state('');
	let regionAssignmentsJson = $state('');

	const areas = $derived(
		(boundaries?.features ?? [])
			.map((f) => ({
				id: String(f.properties?.kyng_id ?? ''),
				name: String(f.properties?.kyng ?? '')
			}))
			.filter((a) => a.id)
			.sort((a, b) => a.name.localeCompare(b.name))
	);
	const areaName = (id: string) => areas.find((a) => a.id === id)?.name ?? id;
	const colorFor = (id: string) => generateUniqueColorForKey(id, []);
	const sessionAreas = $derived(
		session ? session.kyng_ids.map((id) => ({ id, name: areaName(id) })) : []
	);

	function toggleAreaSelection(id: string) {
		selectedAreaIds = selectedAreaIds.includes(id)
			? selectedAreaIds.filter((x) => x !== id)
			: [...selectedAreaIds, id];
	}

	// ── Fabric live layer: refetch on moveend, zoom-gated, canvas renderer ──
	function fabricStyle(feature: GeoJSON.Feature) {
		const kyngId = feature.properties?.kyng_id as string | null;
		return kyngId
			? { color: '#475569', weight: 0.7, fillColor: colorFor(kyngId), fillOpacity: 0.22 }
			: {
					color: '#b91c1c',
					weight: 0.9,
					dashArray: '3 3',
					fillColor: '#9ca3af',
					fillOpacity: 0.15
				};
	}

	function fabricTooltip(feature: GeoJSON.Feature): string {
		const p = feature.properties ?? {};
		return `
			<strong>${escapeHtml(p.lotidstring ?? p.src_layer ?? 'fabric')}</strong><br>
			<i>Layer:</i> ${escapeHtml(p.src_layer ?? '')}<br>
			<i>KYNG:</i> ${escapeHtml(p.kyng ?? 'unassigned')}`;
	}

	async function refreshFabric() {
		const map = mapRef;
		const L = LRef;
		if (!map || !L || !fabricGroup) return;
		zoomedEnough = map.getZoom() >= FABRIC_MIN_ZOOM;
		if (!zoomedEnough) {
			fabricGroup.clearLayers();
			fabricCount = null;
			return;
		}
		const seq = ++fabricFetchSeq;
		const b = map.getBounds().pad(0.15);
		const simplify = map.getZoom() < 15 ? 2 : 0;
		try {
			const res = await fetch(
				`/admin/site/data/kyng-boundaries/fabric?minLng=${b.getWest()}&minLat=${b.getSouth()}` +
					`&maxLng=${b.getEast()}&maxLat=${b.getNorth()}&simplify=${simplify}`
			);
			if (!res.ok || seq !== fabricFetchSeq) return;
			const fc = (await res.json()) as GeoJSON.FeatureCollection;
			if (seq !== fabricFetchSeq) return;
			const layer = L.geoJSON(fc, {
				renderer: L.canvas({ padding: 0.2 }),
				style: fabricStyle,
				onEachFeature: (feature: GeoJSON.Feature, lyr: any) => {
					lyr.bindTooltip(fabricTooltip(feature), { sticky: true, direction: 'top' });
				}
			});
			fabricGroup.clearLayers();
			fabricGroup.addLayer(layer);
			fabricCount = fc.features?.length ?? 0;
		} catch {
			// viewport fetch is best-effort; the next moveend retries
		}
	}

	// ── Control-line drawing (leaflet-editable + snapping) ──
	const LINE_STYLE = { color: '#f97316', weight: 3, dashArray: '6 4', opacity: 0.95 };

	function startDrawLine() {
		const map = mapRef;
		if (!map?.editTools || drawing) return;
		drawing = true;
		statusMessage =
			'Draw the new border: click to add vertices (they snap to fabric edges), finish by clicking the last vertex again. Overshoot past the outer boundary at both ends.';
		tempDrawLayer = map.editTools.startPolyline(undefined, LINE_STYLE);
	}

	function cancelDraw() {
		const map = mapRef;
		if (tempDrawLayer) {
			try {
				map?.editTools?.stopDrawing?.();
			} catch {
				/* noop */
			}
			tempDrawLayer.disableEdit?.();
			map?.removeLayer(tempDrawLayer);
			tempDrawLayer = null;
		}
		drawing = false;
		statusMessage = null;
	}

	function clearLines() {
		cancelDraw();
		linesGroup?.clearLayers();
		lineCount = 0;
		overrides = {};
	}

	function collectControlLines(): GeoJSON.FeatureCollection {
		const features: GeoJSON.Feature[] = [];
		linesGroup?.eachLayer((lyr: any) => {
			const gj = lyr.toGeoJSON?.();
			if (gj?.geometry?.type === 'LineString' && gj.geometry.coordinates.length >= 2) {
				features.push({ type: 'Feature', properties: {}, geometry: gj.geometry });
			}
		});
		return { type: 'FeatureCollection', features };
	}

	function getSnapLayers(): any[] {
		const out: any[] = [];
		const push = (lyr: any) => {
			if (!lyr) return;
			if (typeof lyr.getLayers === 'function') lyr.getLayers().forEach(push);
			else out.push(lyr);
		};
		const registry = ctx.getLeafletLayers();
		for (const id in registry) {
			if (id === 'kyng-regions' || id === 'kyng-candidates') continue;
			push(registry[id].leafletLayer);
		}
		return out.filter((l) => l !== tempDrawLayer);
	}

	// ── Proposal preview (regions + candidate boundaries) ──
	function effectiveOwner(feature: GeoJSON.Feature): string | null {
		const region = Number(feature.properties?.region);
		return overrides[region] ?? (feature.properties?.kyng_id as string | null);
	}

	function renderPreview() {
		const L = LRef;
		if (!L || !previewGroup) return;
		previewGroup.clearLayers();
		if (!proposal) return;

		const regionsLayer = L.geoJSON(proposal.regions, {
			style: (feature: GeoJSON.Feature) => {
				const owner = effectiveOwner(feature);
				return {
					color: '#111827',
					weight: 1.5,
					dashArray: '4 3',
					fillColor: owner ? colorFor(owner) : '#9ca3af',
					fillOpacity: 0.35
				};
			},
			onEachFeature: (feature: GeoJSON.Feature, lyr: any) => {
				const region = Number(feature.properties?.region);
				lyr.bindTooltip(
					() => {
						const owner = effectiveOwner(feature);
						return `<strong>Region ${region}</strong><br>→ ${escapeHtml(owner ? areaName(owner) : '?')}<br><i>click to switch area</i>`;
					},
					{ sticky: true }
				);
				lyr.on('click', (e: any) => {
					e.originalEvent?.stopPropagation?.();
					cycleRegionOwner(feature);
				});
			}
		});
		previewGroup.addLayer(regionsLayer);

		const candidateLayer = L.geoJSON(proposal.boundaries, {
			style: (feature: GeoJSON.Feature) => ({
				color: colorFor(String(feature.properties?.kyng_id ?? '')),
				weight: 4,
				fillOpacity: 0
			})
		});
		previewGroup.addLayer(candidateLayer);
	}

	function cycleRegionOwner(feature: GeoJSON.Feature) {
		if (!session || busy) return;
		const region = Number(feature.properties?.region);
		const current = effectiveOwner(feature);
		const ids = session.kyng_ids;
		const next = ids[(Math.max(ids.indexOf(current ?? ''), 0) + 1) % ids.length];
		overrides = { ...overrides, [region]: next };
		submitPropose();
	}

	function submitPropose() {
		if (!proposeFormEl || busy) return;
		const fc = collectControlLines();
		if (!fc.features.length) {
			errorMessage = 'Draw at least one control line first.';
			return;
		}
		controlLinesJson = JSON.stringify(fc);
		regionAssignmentsJson = JSON.stringify(
			Object.entries(overrides).map(([region, kyng_id]) => ({ region: Number(region), kyng_id }))
		);
		// Values bound via $state land in the DOM on the next microtask; submit after.
		queueMicrotask(() => proposeFormEl?.requestSubmit());
	}

	function resetAll() {
		clearLines();
		previewGroup?.clearLayers();
		proposal = null;
		overrides = {};
		session = null;
		selectedAreaIds = [];
		statusMessage = null;
		errorMessage = null;
	}

	// Shared use:enhance handler factory for the session actions.
	function actionHandler(kind: 'start' | 'propose' | 'validate' | 'promote' | 'discard') {
		return () => {
			busy = true;
			errorMessage = null;
			return async ({ result }: { result: any }) => {
				busy = false;
				if (result.type === 'failure') {
					errorMessage = (result.data?.message as string) ?? 'Request failed';
					return;
				}
				if (result.type !== 'success') {
					errorMessage = 'Request failed';
					return;
				}
				const d = result.data ?? {};
				if (kind === 'start' && d.session) {
					session = { ...(d.session as KyngEditSession) };
					statusMessage = 'Session started — draw a control line across the shared border.';
				} else if (kind === 'propose' && d.proposal) {
					proposal = d.proposal as Proposal;
					if (session) session = { ...session, status: 'draft', validation: null };
					renderPreview();
					statusMessage =
						'Proposal ready — click a region to move it to the other area, then Validate.';
				} else if (kind === 'validate' && d.validation) {
					if (session) {
						session = {
							...session,
							status: d.validation.valid ? 'validated' : 'draft',
							validation: d.validation
						};
					}
					statusMessage = d.validation.valid
						? 'Validation passed — Promote applies the new boundaries.'
						: 'Validation found blocking issues.';
				} else if (kind === 'promote' && d.promoted) {
					const p = d.promoted;
					statusMessage = `Promoted: ${p.assignments_changed} parcels moved, ${p.areas_updated} boundaries updated, ${p.properties_reassigned} properties reassigned.`;
					resetAll();
					await invalidateAll();
					refreshFabric();
				} else if (kind === 'discard') {
					statusMessage = 'Session discarded.';
					resetAll();
					await invalidateAll();
				}
			};
		};
	}

	// ── Init once the map exists ──
	// The body reads/writes component state, so it runs untracked: the effect
	// depends on `ready` only and never re-runs on session/proposal changes
	// (re-running would recreate the layer groups and drop drawn lines).
	$effect(() => {
		if (!ready) return;
		const map = ctx.getLeafletMap();
		const L = ctx.getLeaflet();
		if (!map || !L) return;
		return untrack(() => initEditor(map, L));
	});

	function initEditor(map: any, L: any): () => void {
		mapRef = map;
		LRef = L;

		fabricGroup = L.layerGroup();
		previewGroup = L.layerGroup();
		linesGroup = L.layerGroup();
		ctx.registerLayer({
			id: 'cadastre-fabric',
			name: 'Cadastral Fabric',
			type: 'geojson',
			visible: true,
			leafletLayer: fabricGroup
		});
		ctx.registerLayer({
			id: 'kyng-regions',
			name: 'Proposal Preview',
			type: 'geojson',
			visible: true,
			leafletLayer: previewGroup
		});
		ctx.registerLayer({
			id: 'kyng-control-lines',
			name: 'Control Lines',
			type: 'geojson',
			visible: true,
			leafletLayer: linesGroup
		});

		const onCommit = (e: any) => {
			if (!drawing) return;
			drawing = false;
			statusMessage = null;
			tempDrawLayer = null;
			const gj = e.layer?.toGeoJSON?.();
			map.removeLayer(e.layer);
			if (gj?.geometry?.type === 'LineString' && gj.geometry.coordinates.length >= 2) {
				linesGroup.addLayer(L.geoJSON(gj, { style: () => LINE_STYLE }).getLayers()[0]);
				lineCount += 1;
			}
		};
		map.on('editable:drawing:commit', onCommit);
		map.on('moveend', refreshFabric);
		refreshFabric();

		// Resume: show the active session's stored control lines.
		if (session?.control_lines?.features?.length) {
			for (const f of session.control_lines.features) {
				linesGroup.addLayer(L.geoJSON(f, { style: () => LINE_STYLE }).getLayers()[0]);
				lineCount += 1;
			}
			for (const o of session.region_assignments ?? []) overrides[o.region] = o.kyng_id;
			statusMessage = 'Resumed the active edit session — re-Propose to rebuild the preview.';
		}

		let cancelled = false;
		let disposeSnap = () => {};
		import('leaflet-geometryutil').then(() => {
			if (!cancelled) {
				disposeSnap = enableSnapping(L, map, getSnapLayers, () => ({
					tolerance: 14,
					toleranceUnit: 'px',
					preferVertices: true
				}));
			}
		});

		return () => {
			cancelled = true;
			disposeSnap();
			map.off('editable:drawing:commit', onCommit);
			map.off('moveend', refreshFabric);
		};
	}

	onDestroy(() => {
		ctx.unregisterLayer('cadastre-fabric');
		ctx.unregisterLayer('kyng-regions');
		ctx.unregisterLayer('kyng-control-lines');
	});
</script>

{#if statusMessage}
	<div class="kyng-editor-status">{statusMessage}</div>
{/if}

<div class="kyng-editor-panel">
	<header class="kyng-editor-panel__header">
		<span>KYNG Boundary Editor</span>
		{#if !zoomedEnough}
			<span class="kyng-editor-panel__hint">zoom in to see the cadastral fabric</span>
		{:else if fabricCount !== null}
			<span class="kyng-editor-panel__hint">{fabricCount} parcels in view</span>
		{/if}
	</header>

	{#if errorMessage}
		<p class="kyng-editor-error">{errorMessage}</p>
	{/if}

	{#if !session}
		<!-- 1. Pick the areas whose shared border moves -->
		<p class="kyng-editor-step">Select the areas whose shared border you want to move:</p>
		<div class="kyng-editor-arealist">
			{#each areas as area (area.id)}
				<label class="kyng-editor-arealist__item">
					<input
						type="checkbox"
						checked={selectedAreaIds.includes(area.id)}
						onchange={() => toggleAreaSelection(area.id)}
					/>
					<span class="kyng-editor-swatch" style:background={colorFor(area.id)}></span>
					{area.name}
				</label>
			{/each}
		</div>
		<form method="POST" action="?/startSession" use:enhance={actionHandler('start')}>
			<input type="hidden" name="kyngIds" value={selectedAreaIds.join(',')} />
			<button
				type="submit"
				class="kyng-editor-btn kyng-editor-btn--primary"
				disabled={selectedAreaIds.length < 2 || busy}
			>
				Start edit session ({selectedAreaIds.length} areas)
			</button>
		</form>
	{:else}
		<!-- 2. Active session workflow -->
		<div class="kyng-editor-session">
			<div class="kyng-editor-session__areas">
				{#each sessionAreas as area (area.id)}
					<span class="kyng-editor-chip">
						<span class="kyng-editor-swatch" style:background={colorFor(area.id)}></span>
						{area.name}
					</span>
				{/each}
			</div>
			<span class="kyng-editor-session__status kyng-editor-session__status--{session.status}">
				{session.status}
			</span>
		</div>

		<div class="kyng-editor-tools">
			{#if drawing}
				<button type="button" class="kyng-editor-btn" onclick={cancelDraw}>Cancel drawing</button>
			{:else}
				<button type="button" class="kyng-editor-btn" onclick={startDrawLine} disabled={busy}>
					Draw control line
				</button>
			{/if}
			<button
				type="button"
				class="kyng-editor-btn"
				onclick={clearLines}
				disabled={busy || !lineCount}
			>
				Clear lines ({lineCount})
			</button>
		</div>

		<form
			method="POST"
			action="?/propose"
			bind:this={proposeFormEl}
			use:enhance={actionHandler('propose')}
		>
			<input type="hidden" name="sessionId" value={session.session_id} />
			<input type="hidden" name="controlLines" value={controlLinesJson} />
			<input type="hidden" name="regionAssignments" value={regionAssignmentsJson} />
			<button
				type="button"
				class="kyng-editor-btn kyng-editor-btn--primary"
				disabled={busy || !lineCount}
				onclick={submitPropose}
			>
				{busy ? 'Working…' : proposal ? 'Re-propose' : 'Propose boundary'}
			</button>
		</form>

		{#if proposal}
			<div class="kyng-editor-result">
				{#if proposal.moved.length}
					<p class="kyng-editor-step">Moving:</p>
					<ul class="kyng-editor-list">
						{#each proposal.moved as m (m.from_kyng + m.to_kyng)}
							<li>
								{m.faces} parcels ({(m.area_m2 / 10000).toFixed(1)} ha):
								{m.from_kyng} → {m.to_kyng}
							</li>
						{/each}
					</ul>
				{:else}
					<p class="kyng-editor-step">
						No parcels change area yet — click a preview region to move it.
					</p>
				{/if}
				{#if proposal.properties_moved.length}
					<p class="kyng-editor-step">
						{proposal.properties_moved.length} registered propert{proposal.properties_moved
							.length === 1
							? 'y'
							: 'ies'} reassigned:
					</p>
					<ul class="kyng-editor-list">
						{#each proposal.properties_moved as p (p.property_id)}
							<li>{p.address}: {p.from_kyng} → {p.to_kyng}</li>
						{/each}
					</ul>
				{/if}
				{#each proposal.warnings as w (w)}
					<p class="kyng-editor-warning">{w}</p>
				{/each}
			</div>
		{/if}

		{#if session.validation}
			<div class="kyng-editor-result">
				{#each session.validation.issues as issue (issue)}
					<p class="kyng-editor-error">{issue}</p>
				{/each}
				{#each session.validation.warnings as w (w)}
					<p class="kyng-editor-warning">{w}</p>
				{/each}
			</div>
		{/if}

		<div class="kyng-editor-actions">
			<form method="POST" action="?/validate" use:enhance={actionHandler('validate')}>
				<input type="hidden" name="sessionId" value={session.session_id} />
				<button type="submit" class="kyng-editor-btn" disabled={busy || !proposal}>Validate</button>
			</form>
			<form
				method="POST"
				action="?/promote"
				use:enhance={actionHandler('promote')}
				onsubmit={(e) => {
					if (
						!confirm(
							'Apply the new boundaries? This updates live KYNG areas and property assignments.'
						)
					) {
						e.preventDefault();
					}
				}}
			>
				<input type="hidden" name="sessionId" value={session.session_id} />
				<button
					type="submit"
					class="kyng-editor-btn kyng-editor-btn--primary"
					disabled={busy || session.status !== 'validated'}
				>
					Promote
				</button>
			</form>
			<form
				method="POST"
				action="?/discard"
				use:enhance={actionHandler('discard')}
				onsubmit={(e) => {
					if (!confirm('Discard this edit session and its proposal?')) e.preventDefault();
				}}
			>
				<input type="hidden" name="sessionId" value={session.session_id} />
				<button type="submit" class="kyng-editor-btn kyng-editor-btn--danger" disabled={busy}>
					Discard
				</button>
			</form>
		</div>
	{/if}
</div>

<style>
	.kyng-editor-status {
		position: absolute;
		top: 0.75rem;
		left: 50%;
		transform: translateX(-50%);
		z-index: 1100;
		max-width: 70%;
		background: var(--color-surface-900);
		color: var(--color-surface-50);
		padding: 4px 10px;
		border-radius: 4px;
		font-size: 0.8rem;
		opacity: 0.92;
	}
	.kyng-editor-panel {
		position: absolute;
		top: 0.75rem;
		right: 0.75rem;
		width: 300px;
		max-height: calc(100% - 1.5rem);
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
		font-size: 0.85rem;
	}
	:global(.dark) .kyng-editor-panel {
		background: var(--color-surface-800);
		color: var(--color-surface-50);
	}
	.kyng-editor-panel__header {
		display: flex;
		justify-content: space-between;
		align-items: baseline;
		gap: 8px;
		font-weight: 600;
	}
	.kyng-editor-panel__hint {
		font-size: 0.7rem;
		font-weight: 400;
		opacity: 0.7;
		text-align: right;
	}
	.kyng-editor-step {
		margin: 0;
		font-size: 0.8rem;
	}
	.kyng-editor-arealist {
		display: flex;
		flex-direction: column;
		gap: 2px;
		max-height: 40vh;
		overflow-y: auto;
		border: 1px solid color-mix(in srgb, var(--color-surface-700) 25%, transparent);
		border-radius: 6px;
		padding: 6px;
	}
	.kyng-editor-arealist__item {
		display: flex;
		align-items: center;
		gap: 6px;
		font-size: 0.8rem;
		cursor: pointer;
	}
	.kyng-editor-swatch {
		display: inline-block;
		width: 10px;
		height: 10px;
		border-radius: 2px;
		border: 1px solid rgba(0, 0, 0, 0.4);
		flex: 0 0 10px;
	}
	.kyng-editor-session {
		display: flex;
		justify-content: space-between;
		align-items: flex-start;
		gap: 8px;
	}
	.kyng-editor-session__areas {
		display: flex;
		flex-wrap: wrap;
		gap: 4px;
	}
	.kyng-editor-chip {
		display: inline-flex;
		align-items: center;
		gap: 4px;
		background: var(--color-surface-200);
		border-radius: 999px;
		padding: 2px 8px;
		font-size: 0.75rem;
	}
	:global(.dark) .kyng-editor-chip {
		background: var(--color-surface-700);
	}
	.kyng-editor-session__status {
		font-size: 0.7rem;
		font-weight: 700;
		text-transform: uppercase;
		padding: 2px 6px;
		border-radius: 4px;
		background: var(--color-surface-300);
	}
	.kyng-editor-session__status--validated {
		background: #bbf7d0;
		color: #14532d;
	}
	.kyng-editor-tools,
	.kyng-editor-actions {
		display: flex;
		flex-wrap: wrap;
		gap: 6px;
	}
	.kyng-editor-btn {
		padding: 6px 12px;
		border-radius: 5px;
		font-size: 0.82rem;
		background: var(--color-surface-200);
		color: var(--color-surface-900);
	}
	:global(.dark) .kyng-editor-btn {
		background: var(--color-surface-700);
		color: var(--color-surface-50);
	}
	.kyng-editor-btn--primary,
	:global(.dark) .kyng-editor-btn--primary {
		background: #2563eb;
		color: #fff;
	}
	.kyng-editor-btn--danger,
	:global(.dark) .kyng-editor-btn--danger {
		background: #dc2626;
		color: #fff;
	}
	.kyng-editor-btn:disabled {
		opacity: 0.55;
	}
	.kyng-editor-result {
		border-top: 1px solid color-mix(in srgb, var(--color-surface-700) 25%, transparent);
		padding-top: 8px;
		display: flex;
		flex-direction: column;
		gap: 4px;
	}
	.kyng-editor-list {
		margin: 0;
		padding-left: 1.1rem;
		font-size: 0.78rem;
		max-height: 60px;
		overflow-y: auto;
	}
	.kyng-editor-error {
		color: #ef4444;
		font-size: 0.8rem;
		margin: 0;
	}
	.kyng-editor-warning {
		color: #b45309;
		font-size: 0.78rem;
		margin: 0;
	}
	:global(.dark) .kyng-editor-warning {
		color: #fbbf24;
	}
</style>
