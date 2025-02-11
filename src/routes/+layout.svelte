<script lang="ts">
	import { onMount } from 'svelte';
	import { invalidate, beforeNavigate, afterNavigate } from '$app/navigation';
	import { getLoading } from '$stores/loadingstore';

	import Spinner from '$components/page/Spinner.svelte';
	import Footer from '$components/page/Footer.svelte';
	import Navbar from '$components/page/navigation/Navbar.svelte';

	import '../app.postcss';

	import type { LayoutData } from './$types';

	interface Props {
		data: LayoutData;
		children: any;
	}

	let { data, children }: Props = $props();

	let showSpinner = $state(false);
	let loadTimeout = $state<number | null>(null);

	beforeNavigate(() => {
		if (!loadTimeout) {
			loadTimeout = window.setTimeout(() => (showSpinner = true), 150);
		}
	});

	afterNavigate(() => {
		showSpinner = false;
		if (loadTimeout) {
			clearTimeout(loadTimeout);
			loadTimeout = null;
		}
	});
	let { session, supabase } = data;

	function initDarkMode() {
		const prefersDarkScheme = window.matchMedia('(prefers-color-scheme: dark)');

		function updateDarkMode(e?: MediaQueryListEvent) {
			const isDarkMode = e ? e.matches : prefersDarkScheme.matches;
			document.documentElement.classList.toggle('dark', isDarkMode);
		}
		updateDarkMode();
		prefersDarkScheme.addEventListener('change', updateDarkMode);
		return () => {
			prefersDarkScheme.removeEventListener('change', updateDarkMode);
		};
	}

	onMount(() => {
		const darkModeCleanup = initDarkMode();

		const { data: authData } = supabase.auth.onAuthStateChange((_: any, newSession: any) => {
			if (newSession?.expires_at !== session?.expires_at) {
				invalidate('supabase:auth');
			}
		});

		return () => {
			darkModeCleanup();
			authData.subscription.unsubscribe();
		};
	});
</script>

{#if showSpinner}
	<div class="fixed inset-0 flex items-center justify-center bg-black/20">
		<Spinner size="100" ballTopLeft="#006400" ballTopRight="#FF3E00" />
	</div>
{/if}
<div class="app-container flex h-screen flex-col">
	<Navbar />
	<main class="flex-1 overflow-y-auto">
		{#if getLoading()}
			<div class="fixed inset-0 flex items-center justify-center bg-black/20">
				<Spinner />
			</div>
		{:else}
			{@render children?.()}
		{/if}
	</main>
	<Footer />
</div>

<style lang="postcss">
	:global(html, body) {
		@apply m-0 h-full p-0;
	}
</style>
