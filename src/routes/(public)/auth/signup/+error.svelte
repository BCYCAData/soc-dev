<script lang="ts">
	import { resolve } from '$app/paths';
	import { page } from '$app/state';
	import AuthErrorMessage from '$components/form/auth/AuthErrorMessage.svelte';
</script>

<svelte:head>
	<title>{page.status}: Sign Up Problem</title>
</svelte:head>

<div class="mx-auto flex max-w-md flex-col items-center justify-center">
	<div class="bg-secondary-100 text-surface-950 w-5/6 rounded p-6 shadow-md sm:ml-0 sm:w-full">
		<h1 class="h1 mb-4 text-center text-2xl">We hit a snag</h1>
		<AuthErrorMessage
			errorMessage={page.error?.message || 'Something went wrong while creating your account.'}
		/>
		<p class="mt-4 text-sm">
			Please try signing up again. If the problem continues, contact us and we'll help you get
			registered.
		</p>
		<a
			href={resolve('/auth/signup')}
			class="bg-secondary-500 text-secondary-50 hover:bg-secondary-700 mt-6 block w-full rounded-full py-2 text-center focus:outline-none"
		>
			Back to Sign Up
		</a>
	</div>
</div>
