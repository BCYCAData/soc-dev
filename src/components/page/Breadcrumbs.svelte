<script lang="ts">
	import { page } from '$app/stores';
	import type { Crumb } from '$lib/types';

	export let pathLables: any;

	let crumbs: Crumb[];
	$: {
		const tokens = $page.url.pathname.split('/').filter((t) => t !== '');
		let tokenPath = '';
		crumbs = tokens.map((t) => {
			tokenPath += '/' + t;
			return {
				label: pathLables[t][0],
				href: tokenPath
			};
		});
	}
</script>

<ul id="breadcrumb">
	{#each crumbs as c, i}
		{#if i == crumbs.length - 1}
			<li>
				<a class="flex items-center" href={c.href}>
					<span>{c.label}</span>
				</a>
			</li>
		{:else}
			<li>
				<a class="flex items-center" href={c.href}>
					<span>{c.label}</span>
				</a>
			</li>
		{/if}
	{/each}
</ul>

<style>
	* {
		margin: 0;
		padding: 0;
		/* font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; */
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
		display: block;
		background: #f97316;
		text-decoration: none;
		position: relative;
		height: 30px;
		line-height: 30px;
		padding: 0 10px 0 5px;
		text-align: center;
		margin-right: 23px;
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
