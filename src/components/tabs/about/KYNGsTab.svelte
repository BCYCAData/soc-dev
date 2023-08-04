<svelte:head>
	<title>Know Your Neighbour Groups</title>
</svelte:head>

<section class="wrapper h-full grid text-gray-900">
	<div class="main-headlines text-center mx-auto">
		<h1 class="title-font font-bold hidden sm:block sm:text-4xl sm:mt-1 text-orange-600">
			Strengthen Our Community - KYNGs
		</h1>
		<!-- <p>
			The “Strengthen Our Community” project grew from community feedback following the 2019/20
			bushfires and is funded through the Bushfire Community Recovery Resilience Fund.
		</p>
		<h3 class="pt-1">The aim is simple - Prepare, Connect, Rebound</h3> -->
	</div>
	<div class="about-content mx-auto">
		<p class="mb-0 text-justify">
			Our community led project, by supporting 'old principles' with technology (digital mapping),
			formalising geographic communities and providing opportunities to share and develop knowledge,
			ensures our community will be prepared for future challenges, more connected, and empowered to
			take action and rebound more quickly following an emergency.
			<!-- </p>
		<p class="mb-0 mt-1"> -->
			Relationships are key, they build community strength. We can make a difference by working together.
		</p>
		<h2 class="my-2 text-center text-orange-600">
			Your Neighbours will always be your first responders!
		</h2>
	</div>
	<div class="main-list pl-4">
		<h3>WHAT ARE KYNGS? - Know Your Neighbour Groups</h3>
		<p class="my-2">
			KYNGs are smaller groups within the community and live on adjoining roads. These groups focus
			on connections and strengthening two-way communication lines. In an emergency, messages to
			KYNG co-ordinators can be shared with their group and critical information shared with
			emergency services.
		</p>
		<p class="my-2">
			KYNG Co-ordinators will initially gather and share information, create connections and
			relationships. Who knows where else this can go?
		</p>
		<p class="my-2">
			One size doesn’t suit all, so we will provide a very simple structure and allow the group
			itself to decide on the best methods of sharing information for them.
		</p>
		<!-- </div>
	<div class="main-list pl-4"> -->
		<h3>KYNG Co-ordinator Role</h3>
		<ol class="list-disc list-inside mt-0">
			<li class="m-1">Connect with the people in your area.</li>
			<li class="m-1">
				Explain what KYNGs are and why they are important - sharing information (two-way flow),
				supporting each other in an emergency, providing information to emergency services.
			</li>
			<li class="m-1">Collect and keep up to date contact info.</li>
			<li class="m-1">Agree with group most suitable methods of passing information.</li>
			<li class="m-1">Have a trial run of the agreed methods, make any changes.</li>
			<li class="m-1">Ask people to take part in the property survey.</li>
			<li class="m-1">
				Once a year ask people to review and update the info in their property survey
			</li>
		</ol>
	</div>
	<div class="final-content text-center mx-auto">
		<p>Not everyone will want to be part of the program and that is fine.</p>
		<h3>Everyone is responsible for their own safety.</h3>
		<h3>We are only sharing information, not offering advice.</h3>
		<h3>Keep yourself safe.</h3>
	</div>
</section>

<style>
	.main-headlines {
		grid-area: headlines;
	}
	.main-list {
		grid-area: list;
	}
	.about-content {
		grid-area: content-words;
	}
	.final-content {
		grid-area: final-words;
	}
	.wrapper {
		display: grid;
		/* grid-template-rows: 45px auto 1fr 2fr; */
		/* grid-auto-rows: min-content; */
		grid-template-columns: 0.5fr 2fr auto 2fr 0.5fr;
		grid-template-areas:
			'. headlines headlines headlines . '
			'. content-words content-words content-words . '
			'. list list list . '
			'. final-words final-words final-words .';
		grid-template-rows: auto auto auto 1fr;
	}
</style>
