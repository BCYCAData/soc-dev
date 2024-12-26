<script lang="ts">
	import { PUBLIC_CONTACT_EMAIL } from '$env/static/public';

	interface Props {
		streetaddress: string;
		suburb: string;
	}

	let { streetaddress, suburb }: Props = $props();

	const searchAddress = `${streetaddress}, ${suburb}`;
	const encodedRef = encodeURIComponent(`SOC Address not eligible: '${searchAddress}'`);
	let subjectUrl = $derived(`mailto:${PUBLIC_CONTACT_EMAIL}?subject=${encodedRef}`);
</script>

<div class="ineligible-container">
	<div class="alert-box" aria-live="polite" role="alert">
		<p class="alert-title">
			Unfortunately {searchAddress}
		</p>
		<p class="alert-message">
			is not part of any of the communities we are engaging with at the moment.
		</p>
		<p class="alert-info">If you would like more information:</p>
	</div>

	<div class="contact-container">
		<a class="contact-button" href={subjectUrl} rel="noopener noreferrer">
			Tap here to send us an email
		</a>
	</div>
</div>

<style lang="postcss">
	.ineligible-container {
		@apply text-center;
	}

	.alert-box {
		@apply mt-1 rounded-lg bg-error-50;
	}

	.alert-title {
		@apply m-1 text-center text-lg font-semibold;
	}

	.alert-message {
		@apply m-1 text-center;
	}

	.alert-info {
		@apply text-center;
	}

	.contact-container {
		@apply mt-5;
	}

	.contact-button {
		@apply mt-5 inline-block max-w-80 cursor-pointer rounded-xl bg-secondary-500 p-2 font-medium text-secondary-50 hover:bg-secondary-700 hover:underline sm:max-w-96 md:max-w-full;
	}
</style>
