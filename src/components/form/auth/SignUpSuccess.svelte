<script lang="ts">
	export let redirectType: string;
	export let haveSurvey: boolean;
</script>

<section class="flex flex-col items-center text-center mt-5 sm:mt-1 mx-auto h-full max-w-3xl">
	<h1 class="unstyled title-font font-bold hidden sm:block sm:text-4xl sm:mt-4 text-primary-600">
		Thank you for joining our Strengthen Our Community Project.
	</h1>
	<div class="bg-green-100 rounded-lg mt-2 text-gray-900 items-center w-full">
		{#if haveSurvey}
			<p class="text-base mt-3 mb-0 sm:text-lg ">
				Please step through our project survey again and ensure you answers are still valid and
				answer the new questions we have added. <b>
					Don't forget to save your answers at step 12.
				</b>
			</p>
		{/if}
		<p class="text-base mt-3 mb-0 sm:text-lg ">
			We hope that the questions in our project survey prompt you to review your preparedness for
			fire and flood. By completing our project survey you are helping to protect our community.
		</p>

		<p class="text-base mt-3 mb-0 sm:text-lg ">
			You are the only person who will see your information.
		</p>
		<p class="text-base mt-3 mb-0 sm:text-lg ">
			We will never sell your data, it will only ever be shared with emergency services in an
			emergency situation. <strong
				>No one will see any of your personal information without your permission.</strong
			>
		</p>
		<p class="text-base mt-3 mb-0 sm:text-lg ">
			If you have any questions don’t hesitate to contact either
		</p>
		<p class="text-base mt-3 mb-0 sm:text-lg ">Helen 0424 515 963 or Christine 0488 288 661</p>
		<form action="/api/auth/updateuser" method="POST">
			<input type="hidden" id="mode" name="mode" value={redirectType} />
			<button
				type="submit"
				class="w-full text-center rounded-full py-2 my-4 bg-orange-500 text-stone-100 hover:bg-orange-700 focus:outline-none disabled:opacity-25"
			>
				Complete the Survey
			</button>
		</form>
	</div>
</section>
