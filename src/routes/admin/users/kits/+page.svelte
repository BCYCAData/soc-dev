<script lang="ts">
	import TabWrapper from '$components/tabs/TabWrapper.svelte';
	import TabHead from '$components/tabs/TabHead.svelte';
	import TabHeadItem from '$components/tabs/TabHeadItem.svelte';
	import TabContentItem from '$components/tabs/TabContentItem.svelte';
	let activeTabValue = '1';
	const handleTabClick = (tabValue: string) => () => {
		activeTabValue = tabValue;
	};
</script>

<svelte:head>
	<title>Users Admin-Kits</title>
</svelte:head>

<!-- <TabWrapper>
	<TabHead>
		<TabHeadItem id={'1'} on:click={handleTabClick('1')}>Send RFS Plan</TabHeadItem>
		<TabHeadItem id={'2'} on:click={handleTabClick('2')}>Review Answers</TabHeadItem>
	</TabHead>
	<TabContentItem id={'1'} {activeTabValue}>Send RFS Plan</TabContentItem>
	<TabContentItem id={'2'} {activeTabValue}>Review SurveyAnswers</TabContentItem>
</TabWrapper> -->
