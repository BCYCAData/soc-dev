<script lang="ts">
	import Breadcrumbs from '$components/page/navigation/Breadcrumbs.svelte';
	import ProtectedAppShell from '$components/page/ProtectedAppShell.svelte';
	import ProfileSideMenu from '$components/page/navigation/sidemenu/ProfileSideMenu.svelte';
	import { profileSidebarPathLables } from '$lib/menu-items';
	import type { PageData } from './$types';
	import type { PropertyProfile } from '$lib/form.types';

	interface Props {
		data: PageData;
		children?: import('svelte').Snippet;
	}

	let { data, children }: Props = $props();

	const propertyProfiles: PropertyProfile[] = $derived(
		Array.isArray(data.userProfile.property_profile)
			? data.userProfile.property_profile
			: [data.userProfile.property_profile]
	);

	const communityProfiles = $derived(data.communityProfiles);
</script>

<ProtectedAppShell sidebarTitle="Profile Menu">
	{#snippet breadcrumbs()}
		<Breadcrumbs pathLables={profileSidebarPathLables} properties={propertyProfiles} />
	{/snippet}

	{#snippet sidebar(isSidebarCollapsed)}
		<ProfileSideMenu
			{isSidebarCollapsed}
			communityText="Community"
			properties={propertyProfiles}
			{communityProfiles}
		/>
	{/snippet}

	{#snippet sidebarFooter()}
		<p class="ml-2">
			Please make sure you click every heading in the menu on the left <br />
			<b>and</b>
			check your answers to all the questions.
		</p>
		<p class="ml-2">
			Remember this is <b>your</b>
			data. To help keep
			<b>you</b>
			prepared.
		</p>
	{/snippet}

	{@render children?.()}
</ProtectedAppShell>
