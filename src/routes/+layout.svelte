<script lang="ts">
	import { onMount } from 'svelte';

	import Footer from '$components/page/Footer.svelte';
	import Navbar from '$components/page/navigation/Navbar.svelte';

	import '../app.postcss';

	import type { LayoutData } from './$types';
	import { invalidate } from '$app/navigation';

	interface Props {
		data: LayoutData;
		children: any;
	}

	let { data, children }: Props = $props();
	// let { children }: Props = $props();

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

<div class="app-container flex h-screen flex-col">
	<Navbar />
	<main class="flex-1 overflow-y-auto">
		{@render children?.()}
	</main>
	<Footer />
</div>

<style lang="postcss">
	:global(html, body) {
		@apply m-0 h-full p-0;
	}
</style>
