<script lang="ts">
	import { onMount } from 'svelte';
	import { beforeNavigate, afterNavigate } from '$app/navigation';
	import { getLoading } from '$stores/loadingstore';
	import Toasts from '$components/page/Toasts.svelte';
	import SessionTimeoutWarning from '$components/page/SessionTimeoutWarning.svelte';
	import Spinner from '$components/page/Spinner.svelte';
	import Footer from '$components/page/Footer.svelte';
	import Navbar from '$components/page/navigation/Navbar.svelte';

	import '../app.css';

	import type { LayoutData } from './$types';
	import { initSession } from '$stores/auth';

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
	$effect(() => {
		// Update store when server data changes
		initSession(data.session);
	});

	onMount(() => {
		return initDarkMode();
	});

	function handleSkipToMain(event: Event) {
		event.preventDefault();
		const mainContent = document.getElementById('main-content');
		if (mainContent) {
			mainContent.focus();
			mainContent.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}
	}
</script>

<a href="#main-content" class="skip-link" onclick={handleSkipToMain}>Skip to main content</a>

<Toasts />
<SessionTimeoutWarning />
{#if showSpinner}
	<div class="fixed inset-0 flex items-center justify-center">
		<Spinner />
	</div>
{/if}
<div class="app-container flex h-screen flex-col">
	<Navbar />
	<main id="main-content" class="flex-1 overflow-y-auto" tabindex="-1">
		{#if getLoading()}
			<div class="fixed inset-0 flex items-center justify-center">
				<Spinner />
			</div>
		{:else}
			{@render children?.()}
		{/if}
	</main>
	<Footer />
</div>
