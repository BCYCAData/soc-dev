<script lang="ts">
	import Card from '$components/page/Card.svelte';
	import { resolve } from '$app/paths';
	import { invalidateAll } from '$app/navigation';
	import { usePermissions } from '$lib/permissions.svelte';
	import { PERMISSIONS } from '$lib/constants/permissions';
	import { toastStore } from '$stores/toaststore';

	import type { PageData } from './$types';

	interface Props {
		data: PageData;
	}

	let { data }: Props = $props();

	const { hasPermission, hasFeature } = usePermissions();

	let isDeciding = $state(false);

	async function decideRequest(requestId: number, decision: 'approve' | 'reject') {
		if (isDeciding) return;
		isDeciding = true;
		const body = new FormData();
		body.set('request_id', String(requestId));
		try {
			const response = await fetch(`?/${decision}`, { method: 'POST', body });
			if (response.ok) {
				toastStore.success(decision === 'approve' ? 'Request approved.' : 'Request rejected.');
				await invalidateAll();
			} else {
				toastStore.error('The request could not be updated. Please try again.');
			}
		} catch (err) {
			console.error('Error deciding community access request:', err);
			toastStore.error('The request could not be updated. Please check your connection.');
		} finally {
			isDeciding = false;
		}
	}
</script>

<svelte:head>
	<title>Community Administration</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-6">
	<h1 class="text-secondary-700 mb-6 text-3xl font-bold">Community Administration</h1>

	<div class="mb-8 grid gap-6">
		<Card>
			<h2 class="mb-4 text-xl font-semibold">Select a Community:</h2>
			<div class="grid grid-cols-3 gap-4">
				{#if hasPermission(PERMISSIONS.ADMIN_COMMUNITY_BCYCA)}
					<a href={resolve('/admin/community/bcyca')} class="btn preset-filled-secondary-500">
						BCYCA
					</a>
				{/if}

				{#if hasPermission(PERMISSIONS.ADMIN_COMMUNITY_TINONEE)}
					<a href={resolve('/admin/community/tinonee')} class="btn preset-filled-secondary-500">
						Tinonee
					</a>
				{/if}

				{#if hasPermission(PERMISSIONS.ADMIN_COMMUNITY_MONDROOK)}
					<a href={resolve('/admin/community/mondrook')} class="btn preset-filled-secondary-500">
						Mondrook
					</a>
				{/if}

				{#if hasPermission(PERMISSIONS.ADMIN_COMMUNITY_EXTERNAL)}
					<a
						href={resolve('/admin/community/external')}
						class="btn preset-filled-secondary-500 col-start-2"
					>
						External
					</a>
				{/if}
			</div>
		</Card>

		<Card>
			<h2 class="mb-4 text-xl font-semibold">Pending Access Requests</h2>
			{#if data.accessRequests.length === 0}
				<p class="opacity-80">There are no pending community access requests.</p>
			{:else}
				<ul class="divide-surface-200-800 divide-y">
					{#each data.accessRequests as request (request.id)}
						<li class="flex flex-wrap items-center justify-between gap-2 py-3">
							<div>
								<p class="font-semibold">{request.name}</p>
								<p class="text-sm opacity-80">
									Wants to connect with the {request.community} community — requested
									{new Date(request.created_at).toLocaleDateString()}
								</p>
							</div>
							<div class="flex gap-2">
								<button
									type="button"
									class="btn btn-sm preset-filled-primary-500"
									disabled={isDeciding}
									onclick={() => decideRequest(request.id, 'approve')}
								>
									Approve
								</button>
								<button
									type="button"
									class="btn btn-sm preset-tonal-surface"
									disabled={isDeciding}
									onclick={() => decideRequest(request.id, 'reject')}
								>
									Reject
								</button>
							</div>
						</li>
					{/each}
				</ul>
			{/if}
		</Card>

		<Card>
			<h2 class="mb-4 text-xl font-semibold">Guidelines</h2>
			<div class="prose">
				<ul class="list-disc pl-4">
					{#if hasFeature('events')}
						<li>Use the Events Manager to create and update community gatherings</li>
					{/if}
					{#if hasFeature('workshops')}
						<li>Workshop tools allow you to schedule and track community training sessions</li>
					{/if}
					{#if hasFeature('information')}
						<li>Manage the information sheets shared with community members</li>
					{/if}
					{#if hasFeature('communities')}
						<li>Community maps show registered properties within each community area</li>
					{/if}
				</ul>
			</div>
		</Card>
	</div>
</div>
