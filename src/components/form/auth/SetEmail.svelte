<script lang="ts">
	import { EMAIL_REGEX } from '$lib/constants';

	interface Props {
		email: string;
		validEmail: boolean;
	}

	let { email = $bindable(), validEmail = $bindable() }: Props = $props();
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

	const hasError = $derived(touched && !validEmail);
</script>

<div class="flex flex-1 flex-col items-center justify-center px-3">
	<div class="text-surface-950 w-full rounded px-3 shadow-md">
		<label class="py-2 text-xs font-bold text-orange-900 uppercase" for="email">Email:</label>
		<input
			id="email"
			type="email"
			class="email-input border-secondary-700 mb-4 w-full rounded border px-3 py-3"
			class:invalid={hasError}
			class:border-error-500={hasError}
			name="email"
			required
			placeholder="Email"
			autocomplete="email"
			aria-invalid={hasError}
			aria-describedby={hasError ? 'email-error' : undefined}
			bind:value={email}
			oninput={handleInput}
		/>
		{#if hasError}
			<span id="email-error" class="text-error-500 text-sm" role="alert">
				Please enter a valid email address
			</span>
		{/if}
	</div>
</div>
