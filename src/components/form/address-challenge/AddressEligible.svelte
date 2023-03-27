<script lang="ts">
	import type { AddressPointData } from '$lib/types';

	export let addressPointData: AddressPointData;

	$: searchaddress = `${addressPointData.searchaddress[0]} ${addressPointData.searchaddress[1]} ${addressPointData.searchaddress[3]}`;
	$: validaddress = `${addressPointData.validaddress[0]} ${addressPointData.validaddress[1]} ${addressPointData.validaddress[3]}`;
</script>

<div class="bg-green-100 mt-1 rounded-lg">
	<h1 class="text-xl text-center">
		{searchaddress}
	</h1>
	{#if searchaddress !== validaddress}
		<h1 class="text-xl text-center">( {addressPointData.validaddress} )</h1>
	{/if}
	<h1 class="text-xl text-center">
		is part of the
		<span class="font-semibold">{addressPointData.communityname}</span>
		community.
	</h1>
</div>

<div class="flex flex-col items-center max-w-xl mx-auto justify-center">
	<div class="text-center bg-orange-50 p-6 sm:ml-0 rounded shadow-md text-gray-900 w-5/6 sm:w-full">
		<p class="font-semibold text-center m-1">Thanks for your interest in our project</p>
		<p class="font-semibold text-center">
			We are not currently engaging with the {addressPointData.communityname} community. But we will
			be soon.
		</p>
		<p class="font-semibold text-gray-800">
			If you would like information on future rollouts please call
		</p>
		<p class="font-semibold text-gray-800">
			<span class="text-lg text-orange-600">Sue</span>
			<span>on</span>
			<span>0492 802 129</span>
		</p>
	</div>
</div>
