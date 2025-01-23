<script lang="ts">
	import PasswordInput from '$components/form/auth/PasswordInput.svelte';
	import PasswordValidationList from '$components/form/auth/PasswordValidationList.svelte';
	import StrengthIndicator from '$components/form/auth/StrengthIndicator.svelte';
	import { PASSWORD_VALIDATIONS } from '$lib/constants';

	interface Props {
		validPassword: boolean;
	}

	// @ts-ignore
	let { validPassword = $bindable() }: Props = $props();

	let strength = $state(0);
	let validations = $state<boolean[]>([]);
	let showPassword = $state(false);
	let password = $state('');
	let confirmPassword = $state('');

	let isPasswordValid = $derived(strength === PASSWORD_VALIDATIONS.length);

	$effect(() => {
		validPassword = isPasswordValid;
	});

	function handlePasswordInput(e: Event) {
		password = (e.target as HTMLInputElement).value;
		updateValidations();
	}

	function handleConfirmPasswordInput(e: Event) {
		confirmPassword = (e.target as HTMLInputElement).value;
		updateValidations();
	}

	function updateValidations() {
		validations = [
			password.length > 8,
			/[A-Z]/.test(password),
			/[0-9]/.test(password),
			/[?~!@#%^&*()\\_+=,:;|]/.test(password),
			password === confirmPassword
		];
		strength = validations.filter(Boolean).length;
	}
</script>

<div class="password-container">
	<div class="password-form">
		<PasswordInput
			id="password"
			label="Password:"
			{showPassword}
			{password}
			on:input={handlePasswordInput}
		/>

		<PasswordInput
			id="confirmPassword"
			label="Confirm Password:"
			{showPassword}
			password={confirmPassword}
			on:input={handleConfirmPasswordInput}
		/>

		<StrengthIndicator {strength} />
		<PasswordValidationList {validations} />
	</div>
</div>

<style lang="postcss">
	.password-container {
		@apply flex flex-1 flex-col items-center justify-center px-3;
	}

	.password-form {
		@apply w-full rounded px-3 text-surface-950 shadow-md;
	}
</style>
