<script lang="ts">
	import { PUBLIC_CONTACT_EMAIL } from '$env/static/public';

	interface Props {
		streetaddress: string;
		suburb: string;
	}

	let { streetaddress, suburb }: Props = $props();

	let searchAddress = $derived(`${streetaddress}, ${suburb}`);
	let encodedRef = $derived(encodeURIComponent(`SOC Address not eligible: '${searchAddress}'`));
	let subjectUrl = $derived(`mailto:${PUBLIC_CONTACT_EMAIL}?subject=${encodedRef}`);
</script>

<div class="text-center">
	<div class="bg-error-50 mt-1 rounded-lg" aria-live="polite" role="alert">
		<p class="m-1 text-center text-lg font-semibold">
			Unfortunately {searchAddress}
		</p>
		<p class="m-1 text-center">
			is not part of any of the communities we are engaging with at the moment.
		</p>
		<p class="text-center">If you would like more information:</p>
	</div>

	<div class="mt-5">
		<a
			class="bg-secondary-500 text-secondary-50 hover:bg-secondary-700 mt-5 inline-block max-w-80 cursor-pointer rounded-xl p-2 font-medium hover:underline sm:max-w-96 md:max-w-full"
			href={subjectUrl}
			rel="noopener noreferrer"
		>
			Tap here to send us an email
		</a>
	</div>
</div>
