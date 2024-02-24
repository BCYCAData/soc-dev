<script lang="ts">
	import { getDrawerStore } from '@skeletonlabs/skeleton';

	const drawerStore = getDrawerStore();

	function drawerClose(): void {
		drawerStore.close();
	}
</script>

<nav class="bg-primary-400 list-nav p-4">
	<ul>
		<li><a href="/" class="btn" on:click={drawerClose}>Home</a></li>
		<li><a href="/about" class="btn" on:click={drawerClose}>About</a></li>
		<li><a href="/contact" class="btn" on:click={drawerClose}>Contact Us</a></li>
		<li>
			<a href="/policies/termsofservice" class="btn" on:click={drawerClose}>Terms of Service</a>
		</li>
		<li><a href="/policies/privacy" class="btn" on:click={drawerClose}>Privacy Policy</a></li>
		<li><a href="/auth/validateaddress" class="btn" on:click={drawerClose}>Sign Up</a></li>
		<li><a href="/auth/signin" class="btn" on:click={drawerClose}>Sign In</a></li>
		<li><a href="/auth/signout" class="btn" on:click={drawerClose}>Sign Out</a></li>
		<li><a href="/profile" class="btn" on:click={drawerClose}>Profile</a></li>
		<li><a href="/admin" class="btn" on:click={drawerClose}>Administration</a></li>
	</ul>
</nav>
