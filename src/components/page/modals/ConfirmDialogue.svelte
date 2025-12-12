<script lang="ts">
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

	const variantClasses = {
		danger: 'bg-red-600 hover:bg-red-700',
		warning: 'bg-orange-600 hover:bg-orange-700',
		info: 'bg-blue-600 hover:bg-blue-700'
	};

	function handleBackdropClick() {
		onCancel();
	}

	function handleKeydown(e: KeyboardEvent) {
		if (e.key === 'Escape') {
			onCancel();
		}
	}
</script>

{#if open}
	<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
	<div
		role="dialog"
		aria-modal="true"
		aria-labelledby="dialog-title"
		tabindex="-1"
		class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
		onclick={handleBackdropClick}
		onkeydown={handleKeydown}
	>
		<div
			role="document"
			class="mx-4 w-full max-w-md rounded-lg bg-white p-6 shadow-xl"
			onclick={(e) => e.stopPropagation()}
			onkeydown={(e) => e.stopPropagation()}
		>
			<h2 id="dialog-title" class="mb-4 text-xl font-bold">{title}</h2>
			<p class="mb-6 text-gray-700">{message}</p>
			<div class="flex justify-end gap-3">
				<button
					type="button"
					class="rounded-md bg-gray-200 px-4 py-2 hover:bg-gray-300"
					onclick={() => onCancel()}
				>
					{cancelText}
				</button>
				<button
					type="button"
					class="rounded-md px-4 py-2 text-white {variantClasses[variant]}"
					onclick={() => {
						onConfirm();
						open = false;
					}}
				>
					{confirmText}
				</button>
			</div>
		</div>
	</div>
{/if}
