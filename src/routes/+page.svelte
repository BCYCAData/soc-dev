<script lang="ts">
	import LiteYouTube from '$components/page/LiteYouTube.svelte';

	const videos = [
		{
			id: 'Q6CCR6gBUkU',
			title: 'Strengthening Our Community — Overview',
			width: 560,
			height: 315
		},
		{
			id: 'ukXYzMK6zk4',
			title: 'Preparing for Natural Disasters — Tips',
			width: 560,
			height: 315
		}
	];

	const contactInfo = {
		name: 'Helen',
		phone: '0424 515 963'
	};
</script>

<section class="flex min-h-full flex-col">
	<div class="text-primary-900 grow overflow-y-auto">
		<div class="mx-auto flex max-w-5xl grow flex-col items-center justify-between">
			<header class="w-full text-center">
				<h1 class="h1 p-2">Strengthen OUR Community</h1>
				<strong>
					<em class="preset-typo-body-2">
						This project, funded by the Bushfire Community Recovery Resilience Fund, is a response
						to the community's feedback following the 2019 bushfires.
					</em>
				</strong>
			</header>

			<article class="w-full text-center">
				<p>As a community we share the same environment.</p>
				<p>
					We want our community to feel prepared for future challenges and be armed with knowledge
					that helps us to tackle whatever natural disaster comes our way.
				</p>
				<p>Above all, we want our community to feel prepared, safe and connected.</p>
				<strong><em class="preset-typo-body-2">Will you join us?</em></strong>

				<div class="preset-typo-body-1">
					<a href="/auth/signup" class="anchor"> Tap here to find out if you qualify </a>
				</div>

				<strong><em class="preset-typo-body-2">Want more information?</em></strong>
				<address class="preset-typo-body-2">
					Call {contactInfo.name}: <a href="tel:{contactInfo.phone}">{contactInfo.phone}</a>
				</address>
			</article>

			<section class="mt-4">
				<h2 class="sr-only">Informational Videos</h2>
				<div class="flex flex-col items-center justify-center gap-4 md:flex-row">
					{#each videos as video}
						<LiteYouTube
							videoId={video.id}
							title={video.title}
							width={video.width}
							height={video.height}
						/>
					{/each}
				</div>
			</section>
		</div>
	</div>

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
</section>
