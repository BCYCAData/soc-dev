<script lang="ts">
	import { page } from '$app/state';
	import { resolve } from '$app/paths';
	import { enhance } from '$app/forms';
	import { Eye, EyeOff } from 'lucide-svelte';
	import AuthErrorMessage from '$components/form/auth/AuthErrorMessage.svelte';
	import Spinner from '$components/page/Spinner.svelte';
	import type { ActionData } from './$types';

	interface Props {
		form: ActionData;
	}
	let { form }: Props = $props();
	let email = $state();
	let password = $state();
	let errorMessage = $derived(form?.message ?? '');
	let showPassword = $state(false);
	let isSubmitting = $state(false);

	// Informational notices for users redirected here after a sign-out. `reason` is set by
	// the session-lifetime enforcement (hooks.server.ts) and the timeout warning;
	// `message` is set by the email-change flow. Not an error — shown as a neutral notice.
	const SIGNIN_NOTICES: Record<string, string> = {
		expired:
			'Your session reached its maximum length, so you were signed out. Please sign in again.',
		idle: 'You were signed out after a period of inactivity. Please sign in again.',
		'session-refresh-failed': "We couldn't keep your session active. Please sign in again.",
		email_changed:
			'Your email address has been updated. Please sign in with your new email address.',
		email_confirmed: 'Your email address has been confirmed. Please sign in.'
	};
	let notice = $derived(
		SIGNIN_NOTICES[page.url.searchParams.get('reason') ?? ''] ??
			SIGNIN_NOTICES[page.url.searchParams.get('message') ?? ''] ??
			''
	);
</script>

<svelte:head>
	<title>Sign In</title>
</svelte:head>

<div class="mx-auto flex max-w-md flex-col items-center justify-center">
	<div class="bg-secondary-100 text-surface-950 w-5/6 rounded p-6 shadow-md sm:ml-0 sm:w-full">
		<h1 class="h1 mb-4 text-center text-2xl">Welcome Back</h1>
		{#if notice !== ''}
			<div
				class="bg-warning-50 text-warning-700 mb-4 flex w-full items-center rounded-lg py-3"
				role="status"
				aria-live="polite"
			>
				<svg
					class="m-2 h-4 w-4 shrink-0 fill-current"
					aria-hidden="true"
					focusable="false"
					xmlns="http://www.w3.org/2000/svg"
					viewBox="0 0 512 512"
				>
					<path
						fill="currentColor"
						d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm0 110c23.196 0 42 18.804 42 42s-18.804 42-42 42-42-18.804-42-42 18.804-42 42-42zm56 254c0 6.627-5.373 12-12 12h-88c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h12v-64h-12c-6.627 0-12-5.373-12-12v-24c0-6.627 5.373-12 12-12h64c6.627 0 12 5.373 12 12v100h12c6.627 0 12 5.373 12 12v24z"
					/>
				</svg>
				<span class="text-sm font-medium">{notice}</span>
			</div>
		{/if}
		<form
			action="?/signin"
			method="POST"
			use:enhance={() => {
				isSubmitting = true;
				return async ({ update }) => {
					await update();
					isSubmitting = false;
				};
			}}
		>
			<input
				id="email"
				type="email"
				class="form-input border-secondary-700! mb-4 w-full rounded border! py-3"
				name="email"
				required={true}
				placeholder="Email"
				autocomplete="email"
				bind:value={email}
			/>
			<div class="relative mb-4">
				<input
					id="password"
					type={showPassword ? 'text' : 'password'}
					class="form-input border-secondary-700! w-full rounded border! py-3"
					name="password"
					required={true}
					placeholder="Password"
					autocomplete="current-password"
					bind:value={password}
				/>
				<button
					type="button"
					class="text-surface-950 absolute top-1/2 right-3 -translate-y-1/2"
					aria-label={showPassword ? 'Hide password' : 'Show password'}
					aria-pressed={showPassword}
					onclick={() => (showPassword = !showPassword)}
				>
					{#if showPassword}
						<EyeOff class="h-5 w-5" aria-hidden="true" />
					{:else}
						<Eye class="h-5 w-5" aria-hidden="true" />
					{/if}
				</button>
			</div>
			<div class="mb-4 text-center">
				<a
					href={resolve('/auth/requestresetpassword')}
					class="text-secondary-900 font-semibold hover:underline"
				>
					&gt&gt&gt Forgot Your Password ? &lt&lt&lt
				</a>
			</div>
			{#if errorMessage !== ''}
				<AuthErrorMessage {errorMessage} />
			{/if}
			<button
				type="submit"
				disabled={isSubmitting}
				aria-busy={isSubmitting}
				class="text-scale-6 bg-secondary-500 text-secondary-50 hover:bg-secondary-700 w-full rounded-full py-2 text-center focus:outline-none"
			>
				{#if isSubmitting}
					<Spinner size="16" /> Signing in...
				{:else}
					Sign In
				{/if}
			</button>
		</form>
	</div>
	<div class="text-surface-950-50 mt-6 flex items-center justify-center gap-2">
		Not registered?
		<a
			href={resolve('/auth/signup')}
			class="bg-secondary-500 text-secondary-50 hover:bg-secondary-700 my-1 rounded-full px-5 py-1 text-center focus:outline-none"
		>
			Create an Account
		</a>
	</div>
</div>
