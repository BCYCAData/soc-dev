<script lang="ts">
	import { EMAIL_REGEX } from '$lib/constants';

	interface Props {
		validEmail: boolean;
	}

	let { validEmail = $bindable() }: Props = $props();
	let email = $state('');
	let touched = $state(false);

	function validateEmail(email: string): boolean {
		return EMAIL_REGEX.test(email.toLowerCase());
	}

	$effect(() => {
		validEmail = validateEmail(email);
	});

	function handleInput() {
		touched = true;
	}
</script>

<div class="email-container">
	<div class="email-form">
		<label class="email-label" for="email">Email:</label>
		<input
			id="email"
			type="email"
			class="email-input"
			class:invalid={touched && !validEmail}
			name="email"
			required
			placeholder="Email"
			autocomplete="email"
			bind:value={email}
			oninput={handleInput}
		/>
		{#if touched && !validEmail}
			<span class="error-message">Please enter a valid email address</span>
		{/if}
	</div>
</div>

<style lang="postcss">
	.email-container {
		@apply flex flex-1 flex-col items-center justify-center px-3;
	}

	.email-form {
		@apply w-full rounded px-3 text-surface-950 shadow-md;
	}

	.email-label {
		@apply py-2 text-xs font-bold uppercase text-orange-900;
	}

	.email-input {
		@apply mb-4 w-full rounded border border-secondary-700 px-3 py-3;

		&.invalid {
			@apply border-error-500;
		}
	}

	.error-message {
		@apply text-sm text-error-500;
	}
</style>
