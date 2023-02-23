<script lang="ts">
	import type { PageData } from './$types';

	export let data: PageData;

	let vetted: string[] = [];

	const handleClick = (e: Event & { currentTarget: EventTarget & HTMLInputElement }) => {
		if (e.currentTarget.checked) {
			vetted = [...vetted, e.currentTarget.name];
		} else {
			vetted = vetted.filter((value) => value !== e.currentTarget.name);
		}
	};

	$: ({ usersAdminNewUsersData } = data);
	$: vetted;
</script>

<svelte:head>
	<title>Users Admin-NewUsers</title>
</svelte:head>

<div class="table-container">
	<table class="table table-hover">
		<thead>
			<tr>
				<th>Email</th>
				<th>Name</th>
				<th>Address</th>
				<th>Phone</th>
				<th>Mobile</th>
				<th>Unanswered</th>
				<th>Accepted</th>
			</tr>
		</thead>
		<tbody>
			<!--  -->
			{#each usersAdminNewUsersData as row}
				<tr>
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
								handleClick(e);
							}}
						/></td
					>
				</tr>
			{/each}
		</tbody>
	</table>
</div>

<pre>{vetted.join()}</pre>
