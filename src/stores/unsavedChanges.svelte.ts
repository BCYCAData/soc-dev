import { SvelteSet } from 'svelte/reactivity';

/**
 * Process-wide registry of forms that currently hold unsaved changes.
 *
 * Consumed by `SessionTimeoutWarning` so a forced session logout (idle / absolute cap)
 * doesn't silently discard a user's in-progress work: when the session lapses with unsaved
 * changes present, the warning holds a "session ended" state instead of redirecting
 * immediately. See docs/session-management-policy.md.
 *
 * Forms opt in either reactively (via {@link UnsavedChangesRegistry.acquire}) or with the
 * one-line `use:trackFormChanges` action in `$lib/svelte-actions`.
 */
class UnsavedChangesRegistry {
	#dirty = new SvelteSet<symbol>();

	/** Reactive — true while any registered form reports unsaved changes. */
	get hasUnsaved(): boolean {
		return this.#dirty.size > 0;
	}

	/** Low-level: flag a token dirty or clean. */
	set(token: symbol, dirty: boolean): void {
		if (dirty) this.#dirty.add(token);
		else this.#dirty.delete(token);
	}

	/**
	 * Acquire a tracker for a single form instance. Drive `set(dirty)` from the form's dirty
	 * state and call `release()` on teardown. Typical component usage:
	 *
	 * ```ts
	 * const tracker = unsavedChanges.acquire();
	 * $effect(() => {
	 *   tracker.set(isDirty);
	 *   return tracker.release;
	 * });
	 * ```
	 */
	acquire(): { set: (dirty: boolean) => void; release: () => void } {
		const token = Symbol();
		return {
			set: (dirty: boolean) => this.set(token, dirty),
			release: () => this.#dirty.delete(token)
		};
	}
}

export const unsavedChanges = new UnsavedChangesRegistry();
