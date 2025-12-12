import { writable } from 'svelte/store';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface Toast {
	id: string;
	type: ToastType;
	message: string;
	duration?: number;
	dismissible?: boolean;
}

function createToastStore() {
	const { subscribe, update } = writable<Toast[]>([]);

	function add(toast: Omit<Toast, 'id'>): string {
		const id = `toast-${Date.now()}-${Math.random()}`;
		const duration = toast.duration ?? 5000;

		const newToast: Toast = {
			id,
			type: toast.type,
			message: toast.message,
			duration,
			dismissible: toast.dismissible ?? true
		};

		update((toasts) => [...toasts, newToast]);

		// Auto-dismiss after duration
		if (duration > 0 && duration !== Infinity) {
			setTimeout(() => {
				remove(id);
			}, duration);
		}

		return id;
	}

	function remove(id: string) {
		update((toasts) => toasts.filter((t) => t.id !== id));
	}

	function clear() {
		update(() => []);
	}

	return {
		subscribe,
		add,
		remove,
		clear,
		// Convenience methods
		success: (message: string, duration?: number) =>
			add({ type: 'success', message, duration }),
		error: (message: string, duration?: number) => add({ type: 'error', message, duration }),
		warning: (message: string, duration?: number) =>
			add({ type: 'warning', message, duration }),
		info: (message: string, duration?: number) => add({ type: 'info', message, duration })
	};
}

export const toastStore = createToastStore();

// Legacy export for backward compatibility
export const toast = toastStore;
