<script lang="ts">
	import type { AddressPointData } from '$lib/types';

	export let addressPointData: AddressPointData;

	const searchAddress = addressPointData.searchaddress;
</script>

<div class="bg-red-100 mt-1 rounded-lg">
	<p class="font-semibold text-center text-lg m-1">
		Unfortunately {searchAddress}
	</p>
	<p class="text-center m-1">
		is not part of any of the communities we are engaging with at the moment.
	</p>
</div>
<div class=" mt-3">
	<p class="font-semibold text-gray-800">If you would like more information please call</p>
	<p class="font-semibold text-gray-800">
		<span class="text-xl text-orange-600">Helen</span>
		<span>on</span>
		<span>0424 515 963</span>
	</p>
	<h3 class=" text-gray-800">or</h3>
	<p class="font-semibold text-gray-800">
		<span class="text-xl text-orange-600">Christine</span>
		<span>on</span>
		<span>0488 288 661</span>
	</p>
</div>
