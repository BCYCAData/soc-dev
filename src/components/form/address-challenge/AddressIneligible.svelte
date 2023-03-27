<script lang="ts">
	import type { AddressPointData } from '$lib/types';

	export let addressPointData: AddressPointData;

	$: searchaddress = `${addressPointData.searchaddress[0]} ${addressPointData.searchaddress[1]} ${addressPointData.searchaddress[3]}`;
</script>

<div class="bg-red-100 mt-1 rounded-lg">
	<h1 class="text-2xl text-center">
		Unfortunately {searchaddress}
	</h1>
	<h1 class="text-2xl text-center">
		is not part of any of the communities we are engaging with at the moment.
	</h1>
</div>
<div class="flex flex-col items-center max-w-xl mx-auto justify-center">
	<div class="text-center bg-orange-50 p-6 sm:ml-0 rounded shadow-md text-gray-900 w-5/6 sm:w-full">
		<p class="font-semibold text-gray-800">If you would like more information please call</p>
		<p class="font-semibold text-gray-800">
			<span class="text-lg text-orange-600">Helen</span>
			<span>on</span>
			<span>0424 515 963</span>
		</p>
		<p class="text-lg text-gray-800">or</p>
		<p class="font-semibold text-gray-800">
			<span class="text-lg text-orange-600">Christine</span>
			<span>on</span>
			<span>0488 288 661</span>
		</p>
	</div>
</div>
