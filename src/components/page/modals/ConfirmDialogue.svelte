<script lang="ts">
	import { Modal } from '@skeletonlabs/skeleton-svelte';

	interface Props {
		open?: boolean;
		title?: string;
		message: string;
		confirmText?: string;
		cancelText?: string;
		onConfirm: () => void;
		onCancel: () => void;
		variant?: 'danger' | 'warning' | 'info';
	}

	let {
		open = $bindable(false),
		title = 'Confirm Action',
		message,
		confirmText = 'Confirm',
		cancelText = 'Cancel',
		onConfirm,
		onCancel,
		variant = 'warning'
	}: Props = $props();

	const confirmPreset = {
		danger: 'preset-filled-error-500',
		warning: 'preset-filled-warning-500',
		info: 'preset-filled-primary-500'
	} as const;

	function handleConfirm() {
		onConfirm();
		open = false;
	}

	function handleCancel() {
		onCancel();
		open = false;
	}

	// User-initiated dismissals (backdrop click, Escape) are treated as cancel.
	function handleOpenChange(details: { open: boolean }) {
		open = details.open;
		if (!details.open) {
			onCancel();
		}
	}
</script>

<Modal
	{open}
	onOpenChange={handleOpenChange}
	role="alertdialog"
	backdropBackground="bg-surface-950/50"
	contentBase="card bg-surface-50-950 w-full max-w-md space-y-4 p-6 shadow-xl"
>
	{#snippet content()}
		<h2 class="text-xl font-bold">{title}</h2>
		<p class="text-surface-700-300">{message}</p>
		<footer class="flex justify-end gap-3">
			<button type="button" class="btn preset-tonal-surface" onclick={handleCancel}>
				{cancelText}
			</button>
			<button type="button" class="btn {confirmPreset[variant]}" onclick={handleConfirm}>
				{confirmText}
			</button>
		</footer>
	{/snippet}
</Modal>
