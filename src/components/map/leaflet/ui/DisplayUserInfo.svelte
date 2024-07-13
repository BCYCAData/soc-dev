<script lang="ts">
	import { userInfo } from '$stores/leaflet';
</script>

<!-- Display the user info -->
<div class="flex flex-col rounded-lg bg-orange-600">
	<h2>User Info:</h2>
	<p>{$userInfo.address}</p>
	<p>{$userInfo.details}</p>
</div>
