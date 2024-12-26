<script lang="ts">
	import { page } from '$app/stores';

	let permissions = $derived(
		typeof $page.data.permissions === 'string' ? $page.data.permissions.split(',') : []
	);

	function hasPermission(path: string): boolean {
		const permissionKey = path.split('/').pop()?.replace('/', '');
		return permissions.some((p) => p.includes(permissionKey || ''));
	}

	function hasFeaturePermission(feature: string): boolean {
		return permissions.some((p) => p.includes(feature));
	}
</script>

<svelte:head>
	<title>Administrators</title>
</svelte:head>

<div>
	<h1>This will contain information about how to use the contained pages</h1>
</div>
