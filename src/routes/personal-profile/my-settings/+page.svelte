<svelte:head>
	<title>My Settings</title>
</svelte:head>

<div class="mx-auto max-w-4xl px-6">
	<h1 class="mb-6 text-3xl font-bold text-orange-700">My Account Settings</h1>
	<div class="mb-8 grid gap-6">
		<section class="rounded-lg bg-white p-6 shadow">
			<h2 class="mb-4 text-xl font-semibold">Quick Actions</h2>
			<div class="grid auto-rows-auto grid-cols-2 gap-4">
				<a
					href="/auth/redirect/changeemail"
					class="flex items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
				>
					Change My Email Address
				</a>
				<a
					href="/auth/redirect/resetpassword"
					class="flex items-center justify-center rounded bg-orange-500 p-4 text-center text-white transition hover:bg-orange-600"
				>
					Change My Password
				</a>
			</div>
		</section>

		<section class="rounded-lg bg-white p-6 shadow">
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
		</section>
	</div>
</div>
