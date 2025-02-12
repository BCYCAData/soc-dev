<script lang="ts">
	import { page } from '$app/state';
	import type { PropertyProfile } from '$lib/form.types';
	import type { PathConfig, Crumb } from '$lib/menu-items';
	import type { KYNGArea } from '$lib/types';

	interface Props {
		pathLables: Record<string, PathConfig>;
		properties?: PropertyProfile[];
		coordinatesKYNG?: KYNGArea[];
	}

	let { pathLables, properties = [], coordinatesKYNG = [] }: Props = $props();

	console.log('properties', properties);

	let crumbs: Crumb[] = $state([]);

	function isPropertyId(label: string): boolean {
		return properties.some((property) => property.id === label);
	}

	$effect(() => {
		const tokens = page.url.pathname.split('/').filter((t) => t !== '');
		let tokenPath = '';
		crumbs = tokens.map((t, index) => {
			tokenPath += '/' + t;
			let config = pathLables[t] || { label: t };

			// Check if token is a KYNG area ID
			const kyngArea = coordinatesKYNG.find((area) => area.kyngAreaId === t);
			if (kyngArea) {
				config = { ...config, label: kyngArea.kyngName };
			}

			if (isPropertyId(t)) {
				const property = properties.find((p) => p.id === t);
				const label = property ? property.property_address_street : 'Property';
				config = { label, icon: pathLables['my-property'].icon };
			}
			return {
				label: config.label,
				href: tokenPath,
				icon: config.icon,
				letter: config.letter || config.label[0].toUpperCase()
			};
		});
	});
</script>

<ul id="breadcrumb">
	{#each crumbs as c}
		<li>
			<a href={c.href}>
				{#if c.icon}
					<span> <c.icon size={16} letter={c.letter} /></span>
				{/if}
				<span>{c.label}</span>
			</a>
		</li>
	{/each}
</ul>

<style>
	* {
		margin: 0;
		padding: 0;
		font-size: 16px;
	}
	#breadcrumb {
		list-style: none;
		display: inline-block;
	}
	#breadcrumb li {
		float: left;
	}
	#breadcrumb li a {
		color: #fff;
		display: flex;
		align-items: center;
		justify-content: center;
		background: #f97316;
		text-decoration: none;
		position: relative;
		height: 30px;
		padding: 0 15px;
		margin-right: 10px;
		gap: 5px;
	}
	#breadcrumb li a span:first-child {
		display: flex;
		align-items: center;
		/* background-color: aqua; */
	}

	#breadcrumb li:nth-child(even) a {
		background-color: #fba74c;
	}
	#breadcrumb li:nth-child(even) a:before {
		border-color: #fba74c;
		border-left-color: transparent;
	}
	#breadcrumb li:nth-child(even) a:after {
		border-left-color: #fba74c;
	}
	#breadcrumb li:first-child a {
		padding-left: 15px;
	}
	#breadcrumb li:first-child a:before {
		border: none;
	}
	#breadcrumb li:last-child a {
		padding-right: 15px;
	}
	#breadcrumb li:last-child a:after {
		border: none;
	}
	#breadcrumb li a:before,
	#breadcrumb li a:after {
		content: '';
		position: absolute;
		top: 0;
		border: 0 solid #f97316;
		border-width: 15px 10px;
		width: 0;
		height: 0;
	}
	#breadcrumb li a:before {
		left: -20px;
		border-left-color: transparent;
	}
	#breadcrumb li a:after {
		left: 100%;
		border-color: transparent;
		border-left-color: #f97316;
	}
	#breadcrumb li a:hover {
		background-color: #bc1a8e;
	}
	#breadcrumb li a:hover:before {
		border-color: #bc1a8e;
		border-left-color: transparent;
	}
	#breadcrumb li a:hover:after {
		border-left-color: #bc1a8e;
	}
	#breadcrumb li a:active {
		background-color: #16a085;
	}
	#breadcrumb li a:active:before {
		border-color: #16a085;
		border-left-color: transparent;
	}
	#breadcrumb li a:active:after {
		border-left-color: #16a085;
	}
</style>
