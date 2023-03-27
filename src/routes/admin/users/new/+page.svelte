<script lang="ts">
	import TabWrapper from '$components/tabs/TabWrapper.svelte';
	import TabHead from '$components/tabs/TabHead.svelte';
	import TabHeadItem from '$components/tabs/TabHeadItem.svelte';
	import TabContentItem from '$components/tabs/TabContentItem.svelte';

	import type { PageData } from './$types';

	export let data: PageData;

	let vetted: string[] = [];
	let activeTabValue = '1';

	const handleTabClick = (tabValue: string) => () => {
		activeTabValue = tabValue;
	};
	const handleCheckClick = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		if (e.currentTarget.checked) {
			vetted = [...vetted, e.currentTarget.name];
		} else {
			vetted = vetted.filter((value) => value !== e.currentTarget.name);
		}
	};

	$: ({ usersAdminNewUsersData, usersSendRFSPlanData } = data);
	$: vetted;
</script>

<svelte:head>
	<title>Users Admin-NewUsers</title>
</svelte:head>

<TabWrapper>
	<TabHead>
		<TabHeadItem
			id={'1'}
			on:click={handleTabClick('1')}
			on:keypress={handleTabClick('1')}
			{activeTabValue}>Send RFS Plan</TabHeadItem
		>
		<TabHeadItem
			id={'2'}
			on:click={handleTabClick('2')}
			on:keypress={handleTabClick('2')}
			{activeTabValue}>Review Answers</TabHeadItem
		>
	</TabHead>
	<TabContentItem id={'1'} contentDivClass="p-4 bg-primary-300 rounded-b-lg" {activeTabValue}>
		<div class="table-container" id="SendRFSPlan">
			<table class="table table-hover">
				<thead>
					<tr class="bg-orange-400">
						<th class="text-center">Email</th>
						<th class="text-center">Name</th>
						<th class="text-center">Address</th>
						<th class="text-center">Created At</th>
						<th class="text-center">Sent</th>
					</tr>
				</thead>
				<tbody>
					<!--  -->
					{#each usersSendRFSPlanData as row}
						<tr class="bg-orange-50">
							<td>{row.email}</td>
							<td>{row.name}</td>
							<td>{row.address}</td>
							<td>{row.created_at}</td>
							<td style="text-align: center"
								><input
									type="checkbox"
									name={row.email}
									on:change={(e) => {
										handleCheckClick(e);
									}}
								/></td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div></TabContentItem
	>
	<TabContentItem id={'2'} contentDivClass="p-4 bg-primary-300 rounded-b-lg" {activeTabValue}
		><div class="table-container">
			<table class="table table-hover" id="ReviewNewUsers">
				<thead>
					<tr class="bg-orange-400">
						<th class="text-center">Email</th>
						<th class="text-center">Name</th>
						<th class="text-center">Address</th>
						<th class="text-center">Phone</th>
						<th class="text-center">Mobile</th>
						<th class="text-center">Unanswered</th>
						<th class="text-center">Accepted</th>
					</tr>
				</thead>
				<tbody>
					<!--  -->
					{#each usersAdminNewUsersData as row}
						<tr class="bg-orange-50">
							<td>{row.email}</td>
							<td>{row.name}</td>
							<td>{row.property_address}</td>
							<td>{row.landline}</td>
							<td>{row.mobile}</td>
							<td>{row.unanswered}</td>
							<td style="text-align: center"
								><input
									type="checkbox"
									name={row.email}
									on:change={(e) => {
										handleCheckClick(e);
									}}
								/></td
							>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</TabContentItem>
</TabWrapper>
