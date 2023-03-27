<script lang="ts">
	import AuthErrorMessage from '$components/error/AuthErrorMessage.svelte';

	export let validEmail: boolean;

	let email = '';

	$: validEmail = validateEmail(email);

	function validateEmail(email: string) {
		let emailRegEx =
			/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		return emailRegEx.test(String(email).toLowerCase());
	}
	let errorMessage = '';
</script>

<div class="px-3 flex-1 flex flex-col items-center justify-center">
	<div class="px-3 rounded shadow-md text-gray-900 w-full">
		<label class="uppercase text-orange-900 text-xs py-2 font-bold" for="email"> Email: </label>
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
	</div>
</div>
