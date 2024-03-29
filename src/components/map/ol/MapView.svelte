<script lang="ts">
	import View from 'ol/View';

	export let centre = [152.2985, -31.9514];
	export let zoom = 6;
	export let rotation = 0;

	const mapView = new View({
		center: centre,
		zoom: zoom,
		rotation: rotation
	});
</script>
