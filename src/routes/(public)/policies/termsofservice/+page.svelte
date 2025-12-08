<script lang="ts">
	const sections = [
		{
			id: 'introduction',
			title: 'Introduction',
			content: [
				'Thanks for taking the time to read our Terms of Use regarding your use of the Strengthen Our Community website. These terms define your rights and responsibilities when using the website.',
				'The website is for use by households within the designated geographical area.'
			]
		},
		{
			id: 'definitions',
			title: 'Definitions',
			definitions: [
				{
					term: 'Services',
					description:
						'The information provided on the website, the collection and representation of the data you provide.'
				},
				{ term: 'The Website', description: 'The website [insert website details]' },
				{
					term: 'We / Us etc',
					description:
						'The Strengthen Our Community Project Team and Burrell Creek Youth and Community Association.'
				},
				{ term: 'You', description: 'The person who registered to use the website.' }
			]
		},
		{
			id: 'data-protection',
			title: 'Data Protection',
			content: [
				'Storage of the data collected through the Strengthen Our Community website is consistent with industry security standards. Data is backed up to allow for disaster recovery.'
			]
		},
		{
			id: 'accuracy',
			title: 'Accuracy of Content',
			content: [
				'We have taken proper care and precautions to ensure that the information we provide on this Website is accurate. However, we cannot guarantee, nor do we accept any legal liability arising from or connected to, the accuracy, reliability, currency or completeness of anything contained on this Website or on any linked site.'
			]
		},
		{
			id: 'use',
			title: 'Use',
			content: [
				'The Website is made available for your use on your acceptance and compliance with these terms and conditions.',
				'By using this Website, you are agreeing to these terms and conditions.',
				'You provide data to this website with the knowledge that it will be made available to emergency services for the duration of an emergency situation.',
				'You agree that you will use this website in accordance with all applicable local, state, national and international laws, rules and regulations.',
				'You agree that you will not use, nor will you allow or authorise any third party to use, the Website for any purpose that is unlawful, defamatory, harassing, abusive, fraudulent or obscene or in any other inappropriate way or in a way which conflicts with the Website or the Services.',
				'We reserve the right to refuse, or terminate, service to anyone at any time without notice or reason.'
			]
		},
		{
			id: 'passwords',
			title: 'Passwords and Logins',
			content: [
				'You are responsible for maintaining the confidentiality of your passwords and login details and for all activities carried out under your password and login.'
			]
		},
		{
			id: 'indemnification',
			title: 'Indemnification for Loss or Damage',
			content: [
				'You agree to indemnify Us and hold Us harmless from and against any and all liabilities or expenses arising from or in any way related to your use of this Website or information offered on this Website, including any liability or expense arising from all claims, losses, damages (actual and consequential), suits, judgments, litigation costs and solicitors fees of every kind and nature incurred by you or any third parties through you.'
			]
		},
		{
			id: 'intellectual-property',
			title: 'Intellectual Property and Copyrights',
			content: [
				'We hold the intellectual property rights and copyright to the content of this Website, including all uploaded files, layout design, data, graphics, articles, file content, codes, news, tutorials, videos, reviews, forum posts and databases contained on the Website or in connection with the Services. You must not use or replicate our copyright material other than as permitted by law. Specifically, you must not use or replicate our copyright material for commercial purposes unless expressly agreed to by Us, in which case we may require you to sign a Licence Agreement.',
				'If you wish to use content, images or other of our intellectual property, you should submit your request to us at the following email address: [insert email address]'
			]
		},
		{
			id: 'external-links',
			title: 'Links to External Websites',
			content: [
				'This Website may contain links that direct you outside of this Website. These links are provided for your convenience and are not an express or implied indication that we endorse or approve of the linked Website, its contents or any associated website, product or service. We accept no liability for loss or damage arising out of or in connection to your use of these sites.'
			]
		},
		{
			id: 'limitation-liability',
			title: 'Limitation of Liability',
			content: [
				'We take no responsibility for the accuracy of any of the content or statements contained on this Website or in relation to our Services. Statements made are by way of general comment only and you should satisfy yourself as to their accuracy. Further, all of our Services are provided without a warranty with the exception of any warranties provided by law. We are not liable for any damages whatsoever, incurred as a result of or relating to the use of the Website or our Services.'
			]
		},
		{
			id: 'information-collection',
			title: 'Information Collection',
			content: [
				'Use of information you have provided us with, or that we have collected and retained relating to your use of the Website and/or our Services, is governed by our Privacy Policy. By using this Website and the Services associated with this Website, you are agreeing to the Privacy Policy. To view our Privacy Policy and read more about why we collect personal information from you and how we use that information, click here.'
			]
		},
		{
			id: 'confidentiality',
			title: 'Confidentiality',
			content: [
				'All personal information you give us will be dealt with in a confidential manner in accordance with our Privacy Policy. However, due to circumstances outside of our control, we cannot guarantee that all aspects of your use of this Website will be confidential due to the potential ability of third parties to intercept and access such information.'
			]
		},
		{
			id: 'governing-law',
			title: 'Governing Law',
			content: [
				'These terms and conditions are governed by and construed in accordance with the laws of New South Wales, Australia. Any disputes concerning this website are to be resolved by the courts having jurisdiction in New South Wales. We retain the right to bring proceedings against you for breach of these Terms and Conditions, in your country of residence or any other appropriate country or jurisdiction.'
			]
		}
	];
</script>

<svelte:head>
	<title>Terms of Service - Strengthen OUR Community</title>
	<meta name="description" content="Terms of Service for Strengthen OUR Community" />
</svelte:head>

<main class="mx-auto max-w-3xl">
	<h1 class="main-title">Strengthen OUR Community</h1>

	<article class="text-surface-950">
		<header class="space-y-2 text-center">
			<h2 class="text-gray-950 sm:mt-4 sm:text-3xl">Terms of Use</h2>
			<p><time class="text-sm text-gray-600" datetime="2022-06">Last updated: June 2022</time></p>
		</header>

		{#each sections as section}
			<section class="mt-6 space-y-4" aria-labelledby={section.id}>
				<h3 id={section.id} class="text-primary-600 text-xl font-semibold">{section.title}</h3>

				{#if section.definitions}
					<dl class="mx-5 space-y-4">
						{#each section.definitions as { term, description }}
							<dt class="font-bold">{term}</dt>
							<dd class="text-surface-700 ml-4">{description}</dd>
						{/each}
					</dl>
				{:else}
					{#each section.content as paragraph}
						<p class="text-surface-700">{paragraph}</p>
					{/each}
				{/if}
			</section>
		{/each}
	</article>
</main>
