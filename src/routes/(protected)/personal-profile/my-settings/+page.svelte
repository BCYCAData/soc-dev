<script lang="ts">
	import Card from '$components/page/Card.svelte';
	import QuickActionsGrid from '$components/page/QuickActionsGrid.svelte';
	import QuickActionTile from '$components/page/QuickActionTile.svelte';
	import { resolve } from '$app/paths';
</script>

<svelte:head>
	<title>My Settings</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-6">
	<h1 class="text-secondary-700 mb-6 text-3xl font-bold">My Account Settings</h1>
	<div class="mb-8 grid gap-6">
		<Card>
			<h2 class="mb-4 text-xl font-semibold">Quick Actions</h2>
			<QuickActionsGrid>
				<QuickActionTile href={resolve('/auth/redirect/changeemail')}>
					Change My Email Address
				</QuickActionTile>
				<QuickActionTile href={resolve('/auth/redirect/resetpassword')}>
					Change My Password
				</QuickActionTile>
			</QuickActionsGrid>
		</Card>

		<Card>
			<h2 class="mb-4 text-xl font-semibold">Guidelines</h2>
			<div class="prose">
				<span class="flex-auto">
					<dt class="font-bold">Change My Email Address</dt>
					<dd class="text-sm opacity-90">
						You can change the email address associated with your account. Be sure to use an email
						address that you have access to. You will need to verify the new email address before it
						can be used.
						<strong class="text-warning-400">Be very careful because this cannot be undone.</strong>
					</dd>
				</span>
				<span class="flex-auto">
					<dt class="font-bold">Change My Password</dt>
					<dd class="text-sm opacity-90">
						You can change the password associated with your account. Be sure to use a strong
						password that you can remember. You will be logged out and will need to log in with the
						new password.
						<strong class="text-warning-400">Be very careful because this cannot be undone.</strong>
					</dd>
				</span>
			</div>
		</Card>
	</div>
</div>
