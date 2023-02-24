<script lang="ts">
	import TabWrapper from '$components/tabs/TabWrapper.svelte';
	import TabHead from '$components/tabs/TabHead.svelte';
	import TabHeadItem from '$components/tabs/TabHeadItem.svelte';
	import TabContentItem from '$components/tabs/TabContentItem.svelte';

	import type { PageData } from './$types';

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
	export let data: PageData;
	$: ({ bcycaInformationAdminData } = data);
</script>

<svelte:head>
	<title>BCYCA Admin-Information</title>
</svelte:head>
<TabWrapper>
	<TabHead>
		<TabHeadItem id={'1'} on:click={handleTabClick('1')} {activeTabValue}>Fire Season</TabHeadItem>
		<TabHeadItem id={'2'} on:click={handleTabClick('2')} {activeTabValue}
			>Lighting Fires</TabHeadItem
		>
		<TabHeadItem id={'3'} on:click={handleTabClick('3')} {activeTabValue}>Fire: Pets</TabHeadItem>
		<TabHeadItem id={'4'} on:click={handleTabClick('4')} {activeTabValue}
			>Fire: Livestock</TabHeadItem
		>
		<TabHeadItem id={'5'} on:click={handleTabClick('5')} {activeTabValue}>BCYCA</TabHeadItem>
		<TabHeadItem id={'6'} on:click={handleTabClick('6')} {activeTabValue}
			>Be Active Locally</TabHeadItem
		>
		<TabHeadItem id={'7'} on:click={handleTabClick('7')} {activeTabValue}>SOC Project</TabHeadItem>
	</TabHead>

	<TabContentItem id={'1'} contentDivClass="p-4 bg-primary-300 rounded-b-lg" {activeTabValue}>
		<h1>Pre fire season checklist</h1>
		<!-- <div class="table-container" id="SendRFSPlan">
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
		</div> -->
	</TabContentItem>
	<TabContentItem id={'2'} contentDivClass="p-4 bg-primary-300 rounded-b-lg" {activeTabValue}>
		<h1>Lighting fires - facts and responsibilities'</h1>
		<!-- <div class="table-container">
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
		</div> -->
	</TabContentItem>
	<TabContentItem id={'3'} contentDivClass="p-4 bg-primary-300 rounded-b-lg" {activeTabValue}>
		<h1>Fire ready - pets and animals</h1>
	</TabContentItem>
	<TabContentItem id={'4'} contentDivClass="p-4 bg-primary-300 rounded-b-lg" {activeTabValue}>
		<h1>Fire ready - livestock & large animals</h1>
	</TabContentItem>
	<TabContentItem id={'5'} contentDivClass="p-4 bg-primary-300 rounded-b-lg" {activeTabValue}>
		<h1>BCYCA leaflet</h1>
	</TabContentItem>
	<TabContentItem id={'6'} contentDivClass="p-4 bg-primary-300 rounded-b-lg" {activeTabValue}>
		<h1>How to be more active locally</h1>
	</TabContentItem>
	<TabContentItem id={'7'} contentDivClass="p-4 bg-primary-300 rounded-b-lg" {activeTabValue}>
		<h1>Strengthen Our Community Project Report</h1>
	</TabContentItem>
</TabWrapper>
