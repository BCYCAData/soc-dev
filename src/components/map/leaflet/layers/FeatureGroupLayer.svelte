<script lang="ts">
	// Extended LayerGroup that makes it easier to do the same thing to all its member layers:

	// bindPopup binds a popup to all of the layers at once (likewise with bindTooltip)
	// Events are propagated to the FeatureGroup, so if the group has an event handler, it will handle events from any of the layers. This includes mouse events and custom events.
	// Has layeradd and layerremove events
	// Usage example
	// L.featureGroup([marker1, marker2, polyline])
	//     .bindPopup('Hello world!')
	//     .on('click', function() { alert('Clicked on a member of the group!'); })
	//     .addTo(map);
</script>
