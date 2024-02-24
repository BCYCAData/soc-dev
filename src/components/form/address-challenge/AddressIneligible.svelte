<script lang="ts">
	export let streetaddress: string;
	export let suburb: string;

	const searchAddress = `${streetaddress}, ${suburb}`;
	const encodedRef = encodeURIComponent(`SOC Address not eligible: '${searchAddress}'`);
	$: subjectUrl = `mailto:bcyca17@gmail.com?subject=${encodedRef}`;
</script>

<div class="text-center">
	<div class="bg-red-100 mt-1 rounded-lg">
		<p class="font-semibold text-center text-lg m-1">
			Unfortunately {searchAddress}
		</p>
		<p class="text-center m-1">
			is not part of any of the communities we are engaging with at the moment.
		</p>
		<p>If you would like more information:</p>
	</div>

	<div class="mt-5">
		<a
			class="text-l cursor-pointer space-y-3 max-w-80 hover:underline mt-5 p-2 font-medium text-stone-100 bg-orange-500 rounded-xl"
			href={subjectUrl}>Tap here to send us an email</a
		>
	</div>
</div>
