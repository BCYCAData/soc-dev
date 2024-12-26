<script lang="ts">
	const videos = [
		{
			id: 'Q6CCR6gBUkU',
			title: 'Strengthen Our Community Project Overview',
			width: 560,
			height: 315
		},
		{
			id: 'ukXYzMK6zk4',
			title: 'Additional Project Information',
			width: 560,
			height: 315
		}
	];

	const contactInfo = {
		name: 'Helen',
		phone: '0424515963'
	};
</script>

<section class="landing-container">
	<div class="content-wrapper">
		<div class="main-content">
			<header class="page-header">
				<h1 class="main-title">Strengthen OUR Community</h1>
				<p class="header-text">
					This project, funded by the Bushfire Community Recovery Resilience Fund, is a response to
					the community's feedback following the 2019 bushfires.
				</p>
			</header>

			<article class="cta-section">
				<p class="cta-text">
					As a community we share the same environment. We want our community to feel prepared for
					future challenges and be armed with knowledge that helps us to tackle whatever natural
					disaster comes our way.
				</p>
				<p class="cta-highlight">
					Above all, we want our community to feel prepared, safe and connected.
				</p>
				<strong><em class="cta-emphasis">Will you join us?</em></strong>

				<div class="cta-button-container">
					<a href="/auth/signup" class="cta-button"> Tap here to find out if you qualify </a>
				</div>

				<p class="contact-heading">Want more information?</p>
				<address class="contact-info">
					Call {contactInfo.name} <a href="tel:{contactInfo.phone}">{contactInfo.phone}</a>
				</address>
			</article>

			<section class="video-section">
				<h2 class="sr-only">Informational Videos</h2>
				<div class="video-container">
					{#each videos as video}
						<iframe
							width={video.width}
							height={video.height}
							src="https://www.youtube.com/embed/{video.id}"
							title={video.title}
							allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
							allowfullscreen
							loading="lazy"
							aria-label="YouTube video: {video.title}"
						></iframe>
					{/each}
				</div>
			</section>
		</div>
	</div>

	<footer class="page-footer">
		<div class="footer-content">
			<picture>
				<source srcset="/images/ag.webp" type="image/webp" />
				<img
					class="footer-logo"
					src="/images/ag.png"
					alt="Australian Government logo"
					width="auto"
					height="40"
					loading="lazy"
				/>
			</picture>

			<p class="footer-text">
				This is a Bushfire Community Recovery &amp; Resilience Fund project through the joint
				Commonwealth/State Disaster Recovery Funding Arrangements
			</p>

			<picture>
				<source srcset="/images/nswg.webp" type="image/webp" />
				<img
					class="footer-logo-right"
					src="/images/nswg.jpg"
					alt="NSW Government logo"
					loading="lazy"
				/>
			</picture>
		</div>
	</footer>
</section>

<style lang="postcss">
	.landing-container {
		@apply flex min-h-full flex-col;
	}

	.content-wrapper {
		@apply flex-grow overflow-y-auto;
	}

	.main-content {
		@apply mx-auto flex max-w-5xl flex-grow flex-col items-center justify-between;
	}

	.page-header {
		@apply w-full text-center;
	}

	.main-title {
		@apply h1 hidden text-primary-600 sm:mt-4 sm:block;
	}

	.header-text {
		@apply mb-0 mt-3 text-gray-900;
	}

	.cta-section {
		@apply w-full text-center;
	}

	.cta-text,
	.cta-highlight {
		@apply mb-0 mt-1;
	}

	.cta-emphasis {
		@apply mb-0 mt-1 text-error-700;
	}

	.cta-button-container {
		@apply my-4;
	}

	.cta-button {
		@apply max-w-80 cursor-pointer rounded-xl bg-secondary-500 p-2 font-semibold text-secondary-50 no-underline hover:underline;
	}

	.contact-heading {
		@apply mt-1 text-sm font-semibold md:text-base;
	}

	.contact-info {
		@apply mt-0 text-sm font-semibold md:text-base;
	}

	.video-section {
		@apply mt-4;
	}

	.video-container {
		@apply flex flex-col items-center justify-center gap-4 md:flex-row;
	}

	.page-footer {
		@apply mt-auto;
	}

	.footer-content {
		@apply flex items-center justify-between px-2 md:px-24;
	}

	.footer-logo,
	.footer-logo-right {
		@apply mb-2 h-10;
	}

	.footer-text {
		@apply max-w-md p-0 text-center text-[0.6rem] leading-3 md:text-sm;
	}
</style>
