<script lang="ts">
	import Card from '$components/page/Card.svelte';
	import QuickActionsGrid from '$components/page/QuickActionsGrid.svelte';
	import QuickActionTile from '$components/page/QuickActionTile.svelte';
	import { resolve } from '$app/paths';
	import type { PageData } from './$types';

	let { data } = $props<{ data: PageData }>();

	const kyngAreaId = $derived(data.currentArea?.kyngAreaId);
	const kyngName = $derived(data.currentArea.kyngName);
</script>

<svelte:head>
	<title>{kyngName} KYNG</title>
</svelte:head>

<div class="mx-auto max-w-4xl p-6">
	<h1 class="text-secondary-700 mb-6 text-3xl font-bold">{kyngName} KYNG</h1>

	<div class="mb-8 grid gap-6">
		<Card>
			<h2 class="mb-4 text-xl font-semibold">Quick Actions</h2>
			<QuickActionsGrid>
				<QuickActionTile
					href={resolve('/(protected)/kyng-coordinator/[kyng_area]/map', { kyng_area: kyngAreaId })}
				>
					{kyngName} KYNG Map
				</QuickActionTile>
				<QuickActionTile
					href={resolve('/(protected)/kyng-coordinator/[kyng_area]/unregistered-addresses', {
						kyng_area: kyngAreaId
					})}
				>
					{kyngName} Un-registered Addresses
				</QuickActionTile>
				<QuickActionTile
					href={resolve('/(protected)/kyng-coordinator/[kyng_area]/user-admin', {
						kyng_area: kyngAreaId
					})}
				>
					{kyngName} KYNG User Management
				</QuickActionTile>
			</QuickActionsGrid>
		</Card>

		<Card>
			<h2 class="mb-4 text-xl font-semibold">Guidelines</h2>
			<div class="prose">
				<ul class="list-disc pl-4">
					<li>See a map representing the current state of your KYNG group</li>
					<li>Identify Unregistered Addresses in your KYNG</li>
					<li>Reporting tools to help know the state of your KYNG group</li>
				</ul>
			</div>
		</Card>
	</div>
</div>
