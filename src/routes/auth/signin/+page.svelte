<script lang="ts">
	import AddressChallenge from '$components/form/address-challenge/AddressChallenge.svelte';
	import AuthErrorMessage from '$components/form/AuthErrorMessage.svelte';

	import type { ModalSettings, ModalComponent } from '@skeletonlabs/skeleton';
	import { modalStore } from '@skeletonlabs/skeleton';

	function triggerCustomModal(): void {
		const modalComponent: ModalComponent = {
			// Pass a reference to your custom component
			ref: AddressChallenge
			// Add your props as key/value pairs !!!! ONLY FOR BUILT IN ALERTS !!!!
			// props: { regionHeader: '!text-2xl !font-bold !text-blue-500' }
			// Provide default slot content as a template literal
			// slot: '<p>Skeleton</p>'
		};
		const d: ModalSettings = {
			type: 'component',
			component: modalComponent,
			// title: 'Address Check',
			modalClasses: '!overflow-y-auto !max-h-full !relative'

			// NOTE: title, body, response, etc are supported!
		};
		modalStore.trigger(d);
	}

	let email: string;
	let password: string;
	export let form;
	let errorMessage = form?.error ?? '';
</script>

<svelte:head>
	<title>Sign In</title>
</svelte:head>

<div class="flex flex-col items-center max-w-md mx-auto justify-center">
	<div class="bg-orange-100 p-6 sm:ml-0 rounded shadow-md text-gray-900 w-5/6 sm:w-full">
		<h1 class="text-2xl text-center mb-4">Welcome Back</h1>
		<form action="?/signin" method="POST">
			<input
				id="email"
				type="email"
				class="form-input !border !border-orange-700 w-full py-3 rounded mb-4"
				name="email"
				required={true}
				placeholder="Email"
				autocomplete="email"
				bind:value={email}
			/>
			<input
				id="password"
				type="password"
				class="form-input !border !border-orange-700 w-full py-3 rounded mb-4"
				name="password"
				required={true}
				placeholder="Password"
				autocomplete="current-password"
				bind:value={password}
			/>
			<div class="text-center mb-4">
				<a href="/auth/requestresetpassword" class="font-semibold text-orange-900 hover:underline">
					&gt&gt&gt Forgot Your Password ? &lt&lt&lt
				</a>
			</div>
			{#if errorMessage !== ''}
				<AuthErrorMessage message={errorMessage} />
			{/if}
			<button
				type="submit"
				class="w-full text-center text-xl rounded-full py-2 bg-orange-500 text-stone-100 hover:bg-orange-700 focus:outline-none"
			>
				Sign In
			</button>
		</form>
	</div>
	<div class="text-gray-900 mt-6">
		Not registered?
		<button
			class="text-center py-1 px-5 rounded-full bg-orange-500 text-stone-100 hover:bg-orange-700 focus:outline-none my-1"
			on:click={() => triggerCustomModal()}
		>
			Create an Account
		</button>
	</div>
</div>
