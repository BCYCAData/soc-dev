<script lang="ts">
	interface Props {
		message?: string;
		context?: 'admin' | 'kyng_coordinator' | 'permission' | 'session' | 'generic';
	}

	let { message = "You don't have permission to access this page", context = 'generic' }: Props =
		$props();

	const contextDetails = {
		admin: {
			icon: 'shield',
			reasons: [
				'This page requires administrator privileges',
				'Your account needs to be assigned the admin role',
				'Contact your system administrator for access'
			],
			actions: [
				{ label: 'Return to Dashboard', href: '/personal-profile', primary: true },
				{ label: 'Contact Support', href: '/contact', primary: false }
			]
		},
		kyng_coordinator: {
			icon: 'users',
			reasons: [
				'This page is restricted to KYNG coordinators',
				'You need coordinator privileges for your KYNG area',
				'Request coordinator access from an administrator'
			],
			actions: [
				{ label: 'Return to Dashboard', href: '/personal-profile', primary: true },
				{ label: 'View Your Profile', href: '/personal-profile', primary: false }
			]
		},
		permission: {
			icon: 'lock',
			reasons: [
				"Your account doesn't have the required permissions",
				'This feature may be restricted to certain roles',
				'Permissions can be granted by an administrator'
			],
			actions: [
				{ label: 'Return to Home', href: '/', primary: true },
				{ label: 'Request Access', href: '/contact', primary: false }
			]
		},
		session: {
			icon: 'clock',
			reasons: [
				'Your session may have expired',
				'You may have been signed out for security reasons',
				'Please sign in again to continue'
			],
			actions: [
				{ label: 'Sign In Again', href: '/auth/signin', primary: true },
				{ label: 'Return to Home', href: '/', primary: false }
			]
		},
		generic: {
			icon: 'alert',
			reasons: [
				'You may not have the required role or permissions',
				'This page may be restricted to certain users',
				'Your session may have expired'
			],
			actions: [
				{ label: 'Return to Home', href: '/', primary: true },
				{ label: 'Sign In', href: '/auth/signin', primary: false }
			]
		}
	};

	const details = $derived(contextDetails[context]);
</script>

<div class="error-container">
	<div class="error-content">
		<!-- Icon -->
		<div class="error-icon" aria-hidden="true">
			{#if details.icon === 'shield'}
				<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
					/>
				</svg>
			{:else if details.icon === 'users'}
				<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
					/>
				</svg>
			{:else if details.icon === 'lock'}
				<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
					/>
				</svg>
			{:else if details.icon === 'clock'}
				<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
					/>
				</svg>
			{:else}
				<svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="2"
						d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
					/>
				</svg>
			{/if}
		</div>

		<!-- Error Code and Title -->
		<div class="error-header">
			<h1 class="error-code">403</h1>
			<h2 class="error-title">Access Denied</h2>
		</div>

		<!-- Error Message -->
		<p class="error-message">{message}</p>

		<!-- Possible Reasons -->
		<div class="error-reasons">
			<h3 class="reasons-title">This could be because:</h3>
			<ul class="reasons-list">
				{#each details.reasons as reason}
					<li>{reason}</li>
				{/each}
			</ul>
		</div>

		<!-- Recovery Actions -->
		<div class="error-actions">
			{#each details.actions as action}
				<a
					href={action.href}
					class="action-button"
					class:primary={action.primary}
					class:secondary={!action.primary}
				>
					{action.label}
				</a>
			{/each}
		</div>

		<!-- Additional Help -->
		<div class="error-help">
			<p class="help-text">
				Need help? Contact your system administrator or
				<a href="/contact" class="help-link">get in touch with support</a>.
			</p>
		</div>
	</div>
</div>

<style>
	.error-container {
		display: flex;
		align-items: center;
		justify-content: center;
		min-height: 100vh;
		padding: 2rem;
		background: var(--color-surface-50);
	}

	:global(.dark) .error-container {
		background: var(--color-surface-950);
	}

	.error-content {
		max-width: 600px;
		width: 100%;
		text-align: center;
	}

	.error-icon {
		display: flex;
		justify-content: center;
		margin-bottom: 2rem;
	}

	.icon {
		width: 5rem;
		height: 5rem;
		color: var(--color-primary-500);
	}

	:global(.dark) .icon {
		color: var(--color-primary-400);
	}

	.error-header {
		margin-bottom: 1.5rem;
	}

	.error-code {
		font-family: var(--heading-font-family, 'Raleway', sans-serif);
		font-size: 4rem;
		font-weight: 700;
		line-height: 1;
		color: var(--color-primary-600);
		margin: 0 0 0.5rem 0;
	}

	:global(.dark) .error-code {
		color: var(--color-primary-400);
	}

	.error-title {
		font-family: var(--heading-font-family, 'Raleway', sans-serif);
		font-size: 2rem;
		font-weight: 600;
		color: var(--color-surface-900);
		margin: 0;
	}

	:global(.dark) .error-title {
		color: var(--color-surface-100);
	}

	.error-message {
		font-family: var(--base-font-family, 'Open Sans', sans-serif);
		font-size: 1.125rem;
		color: var(--color-surface-700);
		margin: 0 0 2rem 0;
		line-height: 1.6;
	}

	:global(.dark) .error-message {
		color: var(--color-surface-300);
	}

	.error-reasons {
		background: var(--color-surface-100);
		border: var(--default-border-width, 1px) solid var(--color-surface-200);
		border-radius: var(--radius-container, 0.75rem);
		padding: 1.5rem;
		margin-bottom: 2rem;
		text-align: left;
	}

	:global(.dark) .error-reasons {
		background: var(--color-surface-800);
		border-color: var(--color-surface-700);
	}

	.reasons-title {
		font-family: var(--base-font-family, 'Open Sans', sans-serif);
		font-size: 1rem;
		font-weight: 600;
		color: var(--color-surface-900);
		margin: 0 0 1rem 0;
	}

	:global(.dark) .reasons-title {
		color: var(--color-surface-100);
	}

	.reasons-list {
		margin: 0;
		padding-left: 1.5rem;
		list-style: disc;
	}

	.reasons-list li {
		font-family: var(--base-font-family, 'Open Sans', sans-serif);
		color: var(--color-surface-700);
		margin-bottom: 0.5rem;
		line-height: 1.5;
	}

	:global(.dark) .reasons-list li {
		color: var(--color-surface-300);
	}

	.reasons-list li:last-child {
		margin-bottom: 0;
	}

	.error-actions {
		display: flex;
		gap: 1rem;
		justify-content: center;
		flex-wrap: wrap;
		margin-bottom: 2rem;
	}

	.action-button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		padding: 0.75rem 1.5rem;
		font-family: var(--base-font-family, 'Open Sans', sans-serif);
		font-size: 1rem;
		font-weight: 500;
		text-decoration: none;
		border-radius: var(--radius-base, 0.375rem);
		transition: all 0.15s ease;
		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	}

	.action-button.primary {
		color: var(--color-primary-contrast-dark);
		background-color: var(--color-primary-600);
		border: none;
	}

	.action-button.primary:hover {
		background-color: var(--color-primary-700);
		box-shadow: 0 2px 4px 0 rgb(0 0 0 / 0.1);
		transform: translateY(-1px);
	}

	.action-button.secondary {
		color: var(--color-surface-700);
		background-color: var(--color-surface-100);
		border: var(--default-border-width, 1px) solid var(--color-surface-300);
	}

	:global(.dark) .action-button.secondary {
		color: var(--color-surface-200);
		background-color: var(--color-surface-700);
		border-color: var(--color-surface-600);
	}

	.action-button.secondary:hover {
		background-color: var(--color-surface-200);
		border-color: var(--color-surface-400);
		box-shadow: 0 2px 4px 0 rgb(0 0 0 / 0.1);
		transform: translateY(-1px);
	}

	:global(.dark) .action-button.secondary:hover {
		background-color: var(--color-surface-600);
		border-color: var(--color-surface-500);
	}

	.action-button:active {
		transform: translateY(0);
		box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
	}

	.action-button:focus {
		outline: var(--default-ring-width, 2px) solid transparent;
		outline-offset: 2px;
		box-shadow: 0 0 0 3px var(--color-primary-500);
	}

	.error-help {
		padding-top: 2rem;
		border-top: var(--default-border-width, 1px) solid var(--color-surface-200);
	}

	:global(.dark) .error-help {
		border-color: var(--color-surface-700);
	}

	.help-text {
		font-family: var(--base-font-family, 'Open Sans', sans-serif);
		font-size: 0.875rem;
		color: var(--color-surface-600);
		margin: 0;
	}

	:global(.dark) .help-text {
		color: var(--color-surface-400);
	}

	.help-link {
		color: var(--color-primary-600);
		text-decoration: underline;
		transition: color 0.15s ease;
	}

	:global(.dark) .help-link {
		color: var(--color-primary-400);
	}

	.help-link:hover {
		color: var(--color-primary-700);
	}

	:global(.dark) .help-link:hover {
		color: var(--color-primary-300);
	}

	/* Responsive adjustments */
	@media (max-width: 640px) {
		.error-container {
			padding: 1.5rem;
		}

		.icon {
			width: 4rem;
			height: 4rem;
		}

		.error-code {
			font-size: 3rem;
		}

		.error-title {
			font-size: 1.5rem;
		}

		.error-message {
			font-size: 1rem;
		}

		.error-reasons {
			padding: 1rem;
		}

		.error-actions {
			flex-direction: column;
			width: 100%;
		}

		.action-button {
			width: 100%;
		}
	}
</style>
