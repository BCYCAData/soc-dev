<script lang="ts">
	import PasswordInput from '$components/form/auth/PasswordInput.svelte';
	import PasswordValidationList from '$components/form/auth/PasswordValidationList.svelte';
	import StrengthIndicator from '$components/form/auth/StrengthIndicator.svelte';
	import { PASSWORD_VALIDATIONS } from '$lib/constants';

	interface Props {
		password: string;
		validPassword: boolean;
	}

	// @ts-ignore
	let { password = $bindable(), validPassword = $bindable() }: Props = $props();

	let strength = $state(0);
	let validations = $state<boolean[]>([]);
	let showPassword = $state(false);
	// let password = $state('');
	let confirmPassword = $state('');

	let passwordTouched = $state(false);
	let confirmPasswordTouched = $state(false);

	let isPasswordValid = $derived(strength === PASSWORD_VALIDATIONS.length);

	$effect(() => {
		validPassword = isPasswordValid;
	});

	function handlePasswordInput(e: Event) {
		password = (e.target as HTMLInputElement).value;
		passwordTouched = true;
		updateValidations();
	}

	function handleConfirmPasswordInput(e: Event) {
		confirmPassword = (e.target as HTMLInputElement).value;
		confirmPasswordTouched = true;
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

	const passwordError = $derived(
		passwordTouched && !isPasswordValid && password.length > 0
			? 'Password does not meet all requirements'
			: undefined
	);

	const confirmPasswordError = $derived(
		confirmPasswordTouched && password !== confirmPassword ? 'Passwords do not match' : undefined
	);
</script>

<div class="flex flex-1 flex-col items-center justify-center px-3">
	<div class="text-surface-950 w-full rounded px-3 shadow-md">
		<PasswordInput
			id="password"
			label="Password:"
			{showPassword}
			{password}
			error={passwordError}
			touched={passwordTouched}
			on:input={handlePasswordInput}
		/>

		<PasswordInput
			id="confirmPassword"
			label="Confirm Password:"
			{showPassword}
			password={confirmPassword}
			error={confirmPasswordError}
			touched={confirmPasswordTouched}
			on:input={handleConfirmPasswordInput}
		/>

		<StrengthIndicator {strength} />
		<PasswordValidationList {validations} />
	</div>
</div>
