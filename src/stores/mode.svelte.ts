import { browser } from '$app/environment';

export type Mode = 'light' | 'dark';

const STORAGE_KEY = 'mode';

function systemMode(): Mode {
	if (!browser) return 'light';
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function storedMode(): Mode | null {
	if (!browser) return null;
	const value = localStorage.getItem(STORAGE_KEY);
	return value === 'light' || value === 'dark' ? value : null;
}

/**
 * Controls light/dark mode using Tailwind's selector strategy (the `.dark`
 * class on `<html>`, see the `@custom-variant dark` rule in `app.css`).
 *
 * On first visit the mode follows the operating system preference and keeps
 * tracking it live. Once the user toggles explicitly that choice is persisted
 * to `localStorage` and the system preference is no longer followed.
 */
class ModeController {
	#mode = $state<Mode>('light');
	#explicit = false;

	get mode(): Mode {
		return this.#mode;
	}

	get isDark(): boolean {
		return this.#mode === 'dark';
	}

	#apply(mode: Mode) {
		this.#mode = mode;
		if (browser) document.documentElement.classList.toggle('dark', mode === 'dark');
	}

	set(mode: Mode) {
		this.#explicit = true;
		if (browser) localStorage.setItem(STORAGE_KEY, mode);
		this.#apply(mode);
	}

	toggle() {
		this.set(this.#mode === 'dark' ? 'light' : 'dark');
	}

	/**
	 * Initialise from storage (or system preference) and follow live system
	 * changes while the user has not made an explicit choice. Returns a cleanup
	 * function for `onMount`.
	 */
	init(): () => void {
		if (!browser) return () => {};

		const stored = storedMode();
		this.#explicit = stored !== null;
		this.#apply(stored ?? systemMode());

		const media = window.matchMedia('(prefers-color-scheme: dark)');
		const onChange = (event: MediaQueryListEvent) => {
			if (!this.#explicit) this.#apply(event.matches ? 'dark' : 'light');
		};
		media.addEventListener('change', onChange);
		return () => media.removeEventListener('change', onChange);
	}
}

export const mode = new ModeController();
