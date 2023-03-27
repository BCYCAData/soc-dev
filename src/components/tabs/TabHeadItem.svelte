<script lang="ts">
	import classNames from 'classnames';
	export let id: string;
	export let activeTabValue: string;
	type classOptions = {
		[key: string]: string;
	};
	const inactiveClasses: classOptions = {
		default:
			'inline-block px-4 pt-4 pb-2 text-base font-medium text-center text-primary-900 bg-stone-300 rounded-t-lg active',
		underline: 'inline-block p-4 text-primary-600 rounded-t-lg border-b-2 border-primary-600 active'
	};
	const activeClasses: classOptions = {
		default:
			'inline-block py-4 px-4 text-base font-medium text-center text-gray-700 bg-primary-300 rounded-t-lg',
		underline: 'inline-block p-4 rounded-t-lg border-b-2 border-transparent'
	};
	const liClasses: classOptions = {
		default: 'mr-2',
		underline: 'mr-2'
	};
	export let tabStyle: 'default' | 'underline' = 'default';
</script>

<li class={liClasses[tabStyle]} role="presentation">
	<button
		on:click
		class={classNames(activeTabValue === id ? activeClasses[tabStyle] : inactiveClasses[tabStyle])}
		id="{id}-tabhead"
		type="button"
		role="tab"
	>
		<slot />
	</button>
</li>
