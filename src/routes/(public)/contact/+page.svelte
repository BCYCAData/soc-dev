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
<main class="flex min-h-full flex-col">
	<section class="container mx-auto flex h-full max-w-3xl flex-col items-center">
		{#if reference?.startsWith('SOC Address not found:')}
			<header class="text-center">
				<h1 class="mt-5">{reference}</h1>
			</header>
			<div class="mt-5">
				<a
					href={mailtoUrl}
					class="bg-secondary-500 text-secondary-50 mt-5 inline-block rounded-xl p-2 font-medium hover:underline"
				>
					Tap here to send us an email
				</a>
			</div>
		{:else}
			<div class="text-center">
				<h3 class="h3">If you want to be more involved,<br />please call</h3>
				<div class="mt-5 space-y-4">
					{#each contacts as contact}
						<div class="h3 flex flex-col items-center gap-2">
							<span class=" font-bold text-orange-600">{contact.name}</span>
							<span>on</span>
							<span class="font-medium">{contact.phone}</span>
						</div>
						{#if contact !== contacts[contacts.length - 1]}
							<h3>or</h3>
						{/if}
					{/each}
				</div>

				<a
					href={mailtoUrl}
					class="bg-secondary-500 text-secondary-50 mt-5 inline-block rounded-xl p-2 font-medium hover:underline"
					aria-label="Send us an email about the SOC address not found"
				>
					Tap here to send us an email
				</a>
			</div>
		{/if}
	</section>
	<footer class="mt-auto">
		<div class="flex items-center justify-between px-2 md:px-24">
			<picture>
				<source srcset="/images/ag.webp" type="image/webp" />
				<img
					class="mb-2 h-10"
					src="/images/ag.png"
					alt="Australian Government logo"
					width="120"
					height="40"
					loading="lazy"
					decoding="async"
				/>
			</picture>

			<small class="text-center md:text-sm">
				This is a Bushfire Community Recovery &amp; Resilience Fund project through the joint
				Commonwealth/State Disaster Recovery Funding Arrangements
			</small>

			<picture>
				<source srcset="/images/nswg.webp" type="image/webp" />
				<img
					class="mb-2 h-10"
					src="/images/nswg.png"
					alt="NSW Government logo"
					width="40"
					height="40"
					loading="lazy"
					decoding="async"
				/>
			</picture>
		</div>
	</footer>
</main>
