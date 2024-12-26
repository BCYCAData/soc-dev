<script lang="ts">
	import { page } from '$app/state';
	import { PUBLIC_CONTACT_EMAIL } from '$env/static/public';

	const reference: string = page.url.searchParams.get('subject') ?? '';
	const subjectText: string = `subject=${encodeURIComponent(reference)}`;
	const mailtoUrl = `mailto:${PUBLIC_CONTACT_EMAIL}?${subjectText}`;

	const contacts = [
		{ name: 'Helen', phone: '0424 515 963' },
		{ name: 'Christine', phone: '0488 288 661' }
	];
</script>

<svelte:head>
	<title>Contact Us</title>
</svelte:head>

<section class="contact-container">
	{#if reference?.startsWith('SOC Address not found:')}
		<header class="text-center">
			<h1 class="mt-5">{reference}</h1>
		</header>
		<div class="mt-5">
			<a href={mailtoUrl} class="contact-button"> Tap here to send us an email </a>
		</div>
	{:else}
		<div class="text-center">
			<h3>If you want to be more involved</h3>
			<h3>please call</h3>

			<div class="contact-list">
				{#each contacts as contact}
					<div class="contact-item">
						<span class="contact-name">{contact.name}</span>
						<span>on</span>
						<span class="contact-phone">{contact.phone}</span>
					</div>
					{#if contact !== contacts[contacts.length - 1]}
						<h3>or</h3>
					{/if}
				{/each}
			</div>

			<a
				href={mailtoUrl}
				class="contact-button"
				aria-label="Send us an email about the SOC address not found"
			>
				Tap here to send us an email
			</a>
		</div>
	{/if}
</section>

<style lang="postcss">
	.contact-container {
		@apply container mx-auto flex h-full max-w-3xl flex-col items-center;
	}

	.contact-list {
		@apply mt-5 space-y-4;
	}

	.contact-item {
		@apply flex flex-col items-center gap-2;
	}

	.contact-name {
		@apply text-xl font-bold text-orange-600;
	}

	.contact-phone {
		@apply font-medium;
	}

	.contact-button {
		@apply mt-5 inline-block rounded-xl bg-secondary-500 p-2 font-medium text-secondary-50 hover:underline;
	}
</style>
