<script lang="ts">
	const coordinatorRoles = [
		'Connect with the people in your area.',
		'Explain what KYNGs are and why they are important - sharing information (two-way flow), supporting each other in an emergency, providing information to emergency services.',
		'Collect and keep up to date contact info.',
		'Agree with group most suitable methods of passing information.',
		'Have a trial run of the agreed methods, make any changes.',
		'Ask people to complete their personal profile.',
		'Once a year ask people to review and update the info in their personal profile'
	];

	const keyPoints = [
		'Not everyone will want to be part of the program and that is fine.',
		'Everyone is responsible for their own safety.',
		'We are only sharing information, not offering advice.',
		'Keep yourself safe.'
	];
</script>

<svelte:head>
	<title>Know Your Neighbour Groups - Strengthen OUR Community</title>
	<meta
		name="description"
		content="Learn about our Know Your Neighbour Groups (KYNGs) and how they help strengthen community connections"
	/>
</svelte:head>

<section class="text-surface-950 grid grid-cols-1 gap-6">
	<header class="text-center">
		<h1>Strengthen Our Community - KYNGs</h1>
	</header>

	<div class="mx-auto max-w-3xl">
		<p class="mx-auto max-w-3xl">
			Our community led project, by supporting 'old principles' with technology (digital mapping),
			formalising geographic communities and providing opportunities to share and develop knowledge,
			ensures our community will be prepared for future challenges, more connected, and empowered to
			take action and rebound more quickly following an emergency. Relationships are key, they build
			community strength. We can make a difference by working together.
		</p>

		<h2 class="h2 my-2 text-center text-orange-600">
			Your Neighbours will always be your first responders!
		</h2>
	</div>

	<div class="space-y-6 px-4">
		<section class="kyng-description">
			<h3 class="h3 text-lg font-semibold">WHAT ARE KYNGS? - Know Your Neighbour Groups</h3>
			<p class="my-2">
				KYNGs are smaller groups within the community and live on adjoining roads. These groups
				focus on connections and strengthening two-way communication lines. In an emergency,
				messages to KYNG co-ordinators can be shared with their group and critical information
				shared with emergency services.
			</p>
			<p class="my-2">
				KYNG Co-ordinators will initially gather and share information, create connections and
				relationships. Who knows where else this can go?
			</p>
			<p class="my-2">
				One size doesn't suit all, so we will provide a very simple structure and allow the group
				itself to decide on the best methods of sharing information for them.
			</p>
		</section>

		<section>
			<h3>KYNG Co-ordinator Role</h3>
			<ol class="mt-0 list-inside list-disc space-y-1">
				{#each coordinatorRoles as role}
					<li>{role}</li>
				{/each}
			</ol>
		</section>
	</div>

	<footer class="text-primary-600 mx-auto space-y-2 pt-2 text-center font-semibold">
		{#each keyPoints as point}
			<strong>{point}</strong>
		{/each}
	</footer>
</section>
