<script lang="ts">
	import { Switch } from '@skeletonlabs/skeleton-svelte';
	import { Moon, Sun } from 'lucide-svelte';
	import { mode } from '$stores/mode.svelte';
</script>

<Switch
	name="dark-mode"
	checked={mode.isDark}
	onCheckedChange={() => mode.toggle()}
	controlActive="bg-surface-700"
	labelClasses="sr-only"
>
	{#snippet inactiveChild()}
		<Sun class="size-4" />
	{/snippet}
	{#snippet activeChild()}
		<Moon class="size-4" />
	{/snippet}
	Toggle dark mode
</Switch>
