<script lang="ts">
	import { getContext } from 'svelte';
	import type L from 'leaflet';
	import {
		featureTemplates,
		setActiveTemplate,
		setEditingMode
	} from '$lib/leaflet/spatialutilities.svelte';
	import type { FeatureTemplate } from '$lib/leaflet/spatial';

	// Extend the PM interface inline
	interface GeomanPM {
		addControls: (options: any) => void;
		removeControls: () => void;
		enableDraw: (shape: string) => void;
		Toolbar: {
			createCustomControl: (options: {
				name: string;
				block: string;
				title: string;
				onClick: () => void;
				toggle: boolean;
				className: string;
			}) => void;
			getButtons: () => Record<string, any>;
			setBlockPosition: (block: string, position: number) => void;
		};
	}

	interface LeafletContext {
		getLeafletMap: () => L.Map;
	}

	const { getLeafletMap } = getContext<LeafletContext>('leafletContext');
	const map = getLeafletMap();

	// Type assertion for the pm property
	const pm = (map as any).pm as GeomanPM;

	function createCustomControls(templates: Record<string, FeatureTemplate>) {
		const controls: Record<string, any> = {};

		Object.values(templates).forEach((template) => {
			const controlName = `add-${template.name.toLowerCase().replace(/\s+/g, '-')}`;
			controls[controlName] = {
				name: controlName,
				block: template.category,
				title: `Add ${template.name}`,
				onClick: () => {
					setActiveTemplate(template);
					setEditingMode('create');

					switch (template.geometry_type) {
						case 'point':
							pm.enableDraw('Marker');
							break;
						case 'line':
							pm.enableDraw('Line');
							break;
						case 'polygon':
							pm.enableDraw('Polygon');
							break;
					}
				},
				className: `custom-geoman-${template.geometry_type}-icon`
			};
		});

		return controls;
	}

	$effect(() => {
		if (map?.pm) {
			const customControls = createCustomControls(featureTemplates);
			pm.addControls(customControls);

			pm.Toolbar.setBlockPosition('asset', 0);
			pm.Toolbar.setBlockPosition('operational', 1);
			pm.Toolbar.setBlockPosition('hazard', 2);
		}
	});
</script>
