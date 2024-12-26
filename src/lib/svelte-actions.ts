import { toTitleCase } from '$lib/utility';

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
