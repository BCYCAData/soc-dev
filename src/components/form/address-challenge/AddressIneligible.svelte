<script lang="ts">
	import { PUBLIC_CONTACT_EMAIL } from '$env/static/public';
	import MailtoButton from '$components/page/MailtoButton.svelte';

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

	<MailtoButton href={subjectUrl} />
</div>
