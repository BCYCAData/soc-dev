<script lang="ts">
	import { TabulatorFull as Tabulator } from 'tabulator-tables';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	// import 'tabulator-tables/dist/css/tabulator.css';
	import './tabulator.css';

	export let sendRFSPlanColumns: any[], usersSendRFSPlanData: any[];

	let tableComponent: HTMLElement;
	let table: Tabulator;

	function makeTable(sendRFSPlanColumns: any[], usersSendRFSPlanData: any[]) {
		console.log('makeTable');
		if (browser) {
			table = new Tabulator(tableComponent, {
				data: usersSendRFSPlanData,
				columns: sendRFSPlanColumns,
				layout: 'fitDataFill',
				responsiveLayout: 'hide',
				pagination: true,
				paginationSize: 20
			});
		}
	}

	onMount(() => {
		makeTable(sendRFSPlanColumns, usersSendRFSPlanData);
	});

	async function sendRFSPlanEmail() {
		// const selectedData = table.getSelectedData();
		// console.log('selectedData', selectedData);
		const selectedData = [
			{
				email: 'alankeown@southernphone.com.au',
				name: 'Freddy Flintock',
				address: '119 MULLIGANS LANE, BURRELL CREEK 2429',
				created_at: '2023-03-20'
			},
			{
				email: 'socdatadev@outlook.com',
				name: 'Freddy Flintock',
				address: '119 MULLIGANS LANE, BURRELL CREEK 2429',
				created_at: '2023-03-20'
			}
		];
		try {
			const response = await fetch('/api/emails/sendrfsplan', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json'
				},
				body: JSON.stringify(selectedData)
			});
			// Handle response from server here
		} catch (err) {
			console.error(err);
		}
	}
</script>

<div bind:this={tableComponent} />
<form on:submit|preventDefault={sendRFSPlanEmail}>
	<button
		type="submit"
		class="w-1/4 text-center text-base rounded-full mt-4 py-2 bg-orange-500 text-stone-100 hover:bg-orange-700 focus:outline-none"
	>
		Send Email to Selected
	</button>
</form>
<svelte:head>
	<script type="text/javascript" src="https://oss.sheetjs.com/sheetjs/xlsx.full.min.js"></script>
</svelte:head>
