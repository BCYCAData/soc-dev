<script lang="ts">
	export let id: string;
	export let label: string;
	export let showPassword: boolean;
	export let password: string;
	export let error: string | undefined = undefined;
	export let touched: boolean = false;

	$: hasError = touched && !!error;
	$: errorId = `${id}-error`;
</script>

<div class="flex justify-between">
	<label class="pt-2 text-xs font-bold text-orange-900 uppercase" for={id}>
		{label}
	</label>
	<button
		type="button"
		class="text-scale-6 text-surface-950 mr-3 font-normal"
		on:mouseenter={() => (showPassword = true)}
		on:mouseleave={() => (showPassword = false)}
	>
		{showPassword ? '👁️' : '👁️'}
	</button>
</div>

<input
	{id}
	class="form-input mb-4 w-full rounded border! py-3"
	class:border-secondary-700!={!hasError}
	class:border-error-500!={hasError}
	type={showPassword ? 'text' : 'password'}
	name={id}
	required
	placeholder={label}
	autocomplete="new-password"
	value={password}
	aria-invalid={hasError}
	aria-describedby={hasError ? errorId : undefined}
	on:input
/>
{#if hasError}
	<span id={errorId} class="text-error-500 mb-2 block text-sm" role="alert">
		{error}
	</span>
{/if}
