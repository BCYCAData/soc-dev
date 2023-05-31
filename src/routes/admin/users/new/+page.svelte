<script lang="ts">
	import TabWrapper from '$components/tabs/TabWrapper.svelte';
	import TabHead from '$components/tabs/TabHead.svelte';
	import TabHeadItem from '$components/tabs/TabHeadItem.svelte';
	import TabContentItem from '$components/tabs/TabContentItem.svelte';
	import NewUsersTable from '$components/form/tables/NewUsersTable.svelte';

	import type { CellComponent } from 'tabulator-tables';

	export let data;

	let activeTabValue = 'review_answers';

	const handleTabClick = (tabValue: string) => () => {
		activeTabValue = tabValue;
	};

	$: ({ usersAdminNewUsersData } = data);

	let newUserColumns = [
		{ formatter: 'rownum', hozAlign: 'center', width: 40 },
		{
			formatter: 'rowSelection',
			titleFormatter: 'rowSelection',
			hozAlign: 'center',
			headerSort: false,
			cellClick: function (e: UIEvent, cell: CellComponent) {
				cell.getRow().toggleSelect();
			}
		},
		{ title: 'Email', field: 'email' },
		{ title: 'Name', field: 'name' },
		{ title: 'Address', field: 'property_address' },
		{ title: 'Landline', field: 'landline', contextPopup: 'Im a Popup' },
		{ title: 'Mobile', field: 'mobile' },
		{
			formatter: 'responsiveCollapse',
			width: 30,
			minWidth: 30,
			hozAlign: 'center',
			resizable: false,
			headerSort: false
		},
		{
			title: 'Unanswered',
			field: 'unanswered',
			tooltip: function (e: any, cell: CellComponent, onRendered: any) {
				//e - mouseover event
				//cell - cell component
				//onRendered - onRendered callback registration function
				var el = document.createElement('div');
				el.style.backgroundColor = 'red';
				el.innerText = cell.getValue(); //return cells "field - value";
				return el;
			}
		}
	];
</script>

<svelte:head>
	<title>Users Admin-NewUsers</title>
</svelte:head>

<TabWrapper>
	<TabHead>
		<TabHeadItem
			id={'review_answers'}
			on:click={handleTabClick('review_answers')}
			on:keypress={handleTabClick('review_answers')}
			{activeTabValue}>Review Answers</TabHeadItem
		>
	</TabHead>
	<TabContentItem
		id={'review_answers'}
		contentDivClass="p-4 bg-primary-300 rounded-b-lg"
		{activeTabValue}
	>
		<NewUsersTable {newUserColumns} {usersAdminNewUsersData} />
	</TabContentItem>
</TabWrapper>
