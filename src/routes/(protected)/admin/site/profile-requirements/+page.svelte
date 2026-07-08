<script lang="ts">
	import Card from '$components/page/Card.svelte';
	import { untrack } from 'svelte';
	import { enhance } from '$app/forms';
	import type { PageProps } from './$types';

	let { data, form }: PageProps = $props();

	// Selected required keys; bound to the checkboxes so it drives both the live
	// count and the values submitted under name="required". Seeded once from the
	// loaded config (untrack makes the one-time read explicit — the user's in-progress
	// selection should survive a save's data reload, not be overwritten by it).
	let checked = $state<string[]>(untrack(() => [...data.requiredKeys]));
	let saving = $state(false);

	// Group the catalog by section, preserving catalog order.
	const sections = $derived.by(() => {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity -- rebuilt wholesale inside $derived
		const map = new Map<string, typeof data.catalog>();
		for (const field of data.catalog) {
			const list = map.get(field.section) ?? [];
			list.push(field);
			map.set(field.section, list);
		}
		return [...map.entries()];
	});

	function toggleSection(keys: string[], on: boolean) {
		// eslint-disable-next-line svelte/prefer-svelte-reactivity -- transient local copy
		const set = new Set(checked);
		for (const key of keys) {
			if (on) set.add(key);
			else set.delete(key);
		}
		checked = [...set];
	}
</script>

<svelte:head>
	<title>Profile Completion Requirements</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-6">
	<h1 class="text-secondary-700 mb-2 text-3xl font-bold">Profile Completion Requirements</h1>
	<p class="mb-6 text-sm opacity-90">
		Choose which personal-profile questions a user must answer for their profile to count as
		complete. Incomplete users are gently reminded to finish their profile when they sign in.
		Community questions only count for users in that community; agent questions only count for
		rented properties.
	</p>

	<form
		method="POST"
		action="?/saveRequirements"
		use:enhance={() => {
			saving = true;
			return async ({ update }) => {
				await update({ reset: false });
				saving = false;
			};
		}}
	>
		<div
			class="bg-surface-50-950 sticky top-2 z-10 mb-6 flex items-center justify-between rounded-lg p-4 shadow"
		>
			<span class="font-semibold"
				>{checked.length} question{checked.length === 1 ? '' : 's'} required</span
			>
			<button type="submit" class="btn preset-filled-primary-500" disabled={saving}>
				{saving ? 'Saving…' : 'Save requirements'}
			</button>
		</div>

		{#if form?.message}
			<div
				class="mb-6 rounded-lg p-3 text-sm {form.success
					? 'preset-filled-success-500'
					: 'preset-filled-error-500'}"
				role="status"
			>
				{form.message}
			</div>
		{/if}

		<div class="grid gap-6">
			{#each sections as [section, fields] (section)}
				{@const sectionKeys = fields.map((f) => f.key)}
				{@const allOn = sectionKeys.every((k) => checked.includes(k))}
				<Card>
					<div class="mb-3 flex items-center justify-between">
						<h2 class="text-xl font-semibold">{section}</h2>
						<button
							type="button"
							class="btn btn-sm preset-tonal-secondary"
							onclick={() => toggleSection(sectionKeys, !allOn)}
						>
							{allOn ? 'Clear all' : 'Select all'}
						</button>
					</div>
					<div class="grid gap-2 sm:grid-cols-2">
						{#each fields as field (field.key)}
							<label class="flex items-center gap-3">
								<input
									type="checkbox"
									class="checkbox"
									name="required"
									value={field.key}
									bind:group={checked}
								/>
								<span>{field.label}</span>
							</label>
						{/each}
					</div>
				</Card>
			{/each}
		</div>
	</form>
</div>
