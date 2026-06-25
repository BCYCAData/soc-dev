import { toTitleCase } from '$lib/utility';
import { unsavedChanges } from '$stores/unsavedChanges.svelte';

export function setUpperCase(node: HTMLInputElement) {
	function handleInput(event: Event) {
		const inputValue = (event.target as HTMLInputElement).value.toUpperCase();
		node.value = inputValue;
	}

	node.addEventListener('input', handleInput);

	return {
		destroy() {
			node.removeEventListener('input', handleInput);
		}
	};
}
export function setTitleCase(node: HTMLInputElement) {
	function handleInput(event: Event) {
		const inputValue = toTitleCase((event.target as HTMLInputElement).value);
		node.value = inputValue;
	}

	node.addEventListener('input', handleInput);

	return {
		destroy() {
			node.removeEventListener('input', handleInput);
		}
	};
}

/**
 * One-line opt-in to the unsaved-changes guard for any `<form>`:
 *
 * ```svelte
 * <form use:trackFormChanges> … </form>
 * ```
 *
 * Snapshots the form's field values on mount and flags it dirty in {@link unsavedChanges}
 * whenever they diverge; clears on submit/reset. The `SessionTimeoutWarning` reads the
 * registry to avoid discarding work on a forced logout. For forms that already track their
 * own dirty `$state`, prefer `unsavedChanges.acquire()` instead.
 */
export function trackFormChanges(node: HTMLFormElement) {
	const tracker = unsavedChanges.acquire();

	function snapshot(): string {
		const parts: string[] = [];
		for (const [key, value] of new FormData(node).entries()) {
			parts.push(`${key}=${typeof value === 'string' ? value : '[file]'}`);
		}
		return parts.join('&');
	}

	let initial = snapshot();

	function refresh() {
		tracker.set(snapshot() !== initial);
	}

	function reset() {
		initial = snapshot();
		tracker.set(false);
	}

	node.addEventListener('input', refresh);
	node.addEventListener('change', refresh);
	node.addEventListener('submit', reset);
	node.addEventListener('reset', reset);

	return {
		destroy() {
			node.removeEventListener('input', refresh);
			node.removeEventListener('change', refresh);
			node.removeEventListener('submit', reset);
			node.removeEventListener('reset', reset);
			tracker.release();
		}
	};
}
