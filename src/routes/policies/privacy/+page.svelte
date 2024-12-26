<script lang="ts">
	const sections = [
		{
			id: 'overview',
			title: '1. Overview',
			content: [
				"(a) As responsible data custodians we are committed to protecting your personal information, collected as part of 'Strengthen Our Community' (the Project).",
				'(b) This Privacy Policy outlines how we collect, use, store and disclose your personal information in accordance with the Australian Privacy Principles 2014 (APPs) established under the Privacy Act 1988 (the Act).',
				'(c) We take our security obligations seriously and your personal information is regarded as confidential and may be held in both hard copy and/or electronic versions. We will take all reasonable steps to safeguard your information so that it is not misused, lost, modified, accessed by unauthorised persons or disclosed without authorisation.'
			]
		},
		{
			id: 'collecting-information',
			title: '2. Collecting information',
			content: [
				'(a) The Project will only collect information that is necessary for one or more of our functions or activities.',
				'(b) The Project will advise individuals of the purpose for which their personal information is collected.',
				"(c) If the Project collects sensitive information (as defined under the Act), we will treat it with the utmost security and confidentiality. We will ensure that it is not collected for any purposes, other than those for which the Project has obtained the individual's consent, unless the law requires otherwise, or other exceptional circumstances prevail as described under the Act.",
				'(d) Where an individual chooses not to provide requested information, the Project will advise that individual of what consequence this non-disclosure may have. For example, withholding certain information may limit our ability to provide relevant offers or services to individuals.'
			]
		},
		{
			id: 'collecting-information',
			title: '2. Collecting information',
			content: [
				'(a) The Project will only collect information that is necessary for one or more of our functions or activities.',
				'(b) The Project will advise individuals of the purpose for which their personal information is collected.',
				"(c) If the Project collects sensitive information (as defined under the Act), we will treat it with the utmost security and confidentiality. We will ensure that it is not collected for any purposes, other than those for which the Project has obtained the individual's consent, unless the law requires otherwise, or other exceptional circumstances prevail as described under the Act.",
				'(d) Where an individual chooses not to provide requested information, the Project will advise that individual of what consequence this non-disclosure may have. For example, withholding certain information may limit our ability to provide relevant offers or services to individuals.'
			]
		},
		{
			id: 'disclosing-information',
			title: '3. Disclosing information',
			content: [
				'The Project will only disclose personal information in accordance with the Act.',
				'This means that personal information may be disclosed:',
				'• For the purposes for which we have advised that we are collecting it, and for related purposes that the individual would reasonably expect',
				'• Where we have the consent of the individual to do so',
				'• As required by law',
				'• Under other circumstances where permitted under the Act'
			]
		},
		{
			id: 'unauthorized-disclosure',
			title: '4. Unauthorised disclosure or access',
			content: [
				'As the Project is committed to protecting the privacy of individuals, we will view unauthorised disclosure of, or access to, personal information by our Project committee, as a serious breach of this policy.',
				'Appropriate action (which may include disciplinary or legal action) will be taken in such cases.'
			]
		},
		{
			id: 'access-to-informa',
			title: '5. Access to personal information',
			content: [
				'(a) You have a right to access your personal information, subject to exceptions allowed by law. Please provide us with a request in writing and we will endeavour to respond to you within 7 days of receiving your request.',
				'(b) Where we cannot provide you with access to all of your personal information, we will provide you with reasons why. We may also require your identity to be verified when you send in your request.',
				'(c) If at any time you believe that information we hold about you is incomplete,inaccurate, irrelevant, misleading or not up-to-date, please contact us and we will takereasonable steps to correct the information in accordance with the Act.'
			]
		},
		{
			id: 'security',
			title: '6. Security',
			content: [
				'(a) Our goal is to protect the personal information collected by the Project and its associations. Personal information will be managed confidentially and securely and destroyed appropriately when no longer required. We follow generally accepted security standards.',
				'(b) We will monitor and implement appropriate technical advances or management processes, to safeguard personal information.'
			]
		},
		{
			id: 'data-quality',
			title: '7. Data Quality',
			content: [
				'We will take all reasonable steps to ensure that the data we collect, use or disclose is accurate, complete and up to date, and has been obtained directly from individuals by way of the Personal Profile form.'
			]
		},
		{
			id: 'policy-availability',
			title: '8. Availability and review of Policy',
			content: [
				'The Project will make our privacy policy available upon request. This policy will be reviewed from time to time and any amendments will be incorporated into the updated policy.'
			]
		},
		{
			id: 'questions-concerns',
			title: '9. Questions, Concerns and Complaints',
			content: [
				'If you have any concerns or complaints regarding the way in which we have handled your	information, or have any questions about this Privacy Policy, or your personal information we hold, please contact us by clicking the box below and we will respond to you as soon as possible.'
			]
		}
	];
</script>

<svelte:head>
	<title>Privacy Policy - Strengthen OUR Community</title>
	<meta name="description" content="Privacy Policy for Strengthen OUR Community" />
</svelte:head>

<main class="privacy-container">
	<h1 class="main-title">Strengthen OUR Community</h1>

	<article class="privacy-content">
		<header class="privacy-header">
			<h2>Privacy Policy</h2>
			<p><time datetime="2022-07-01">Last updated: 1/7/22</time></p>
		</header>

		{#each sections as section}
			<section class="privacy-section" aria-labelledby={section.id}>
				<h3 id={section.id} class="section-title">{section.title}</h3>
				<div class="section-content">
					{#each section.content as paragraph}
						<p>{paragraph}</p>
					{/each}
				</div>
			</section>
		{/each}
	</article>
</main>

<style lang="postcss">
	.privacy-container {
		@apply mx-auto max-w-3xl text-surface-950;
	}

	.main-title {
		@apply hidden text-center font-bold text-primary-600 sm:mt-4 sm:block sm:text-4xl;
	}

	.privacy-content {
		@apply space-y-6;
	}

	.privacy-header {
		@apply space-y-2 text-center;

		h2 {
			@apply text-surface-950 sm:mt-4 sm:text-3xl;
		}

		time {
			@apply text-sm text-surface-600;
		}
	}

	.privacy-section {
		@apply space-y-4;
	}

	.section-title {
		@apply text-xl font-semibold text-orange-600;
	}

	.section-content {
		@apply mx-5 space-y-2;

		p {
			@apply text-surface-700;
		}
	}
</style>
