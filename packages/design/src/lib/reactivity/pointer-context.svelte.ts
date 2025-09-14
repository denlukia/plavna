import { getContext, setContext } from 'svelte';

export type Pointer = { x: number; y: number } | null;

const pointerContextName = 'pointer-context';
const pointerState = $state<{ current: Pointer }>({ current: null });

export function createPointerContext() {
	return setContext(pointerContextName, pointerState);
}

export function updatePointerFromWindowMessages() {
	const listener = (e: MessageEvent) => {
		if (e.data.key === 'pointer') {
			const pointer: Pointer = JSON.parse(e.data.value);
			pointerState.current = pointer;
		}
	};
	window.addEventListener('message', listener);

	return () => window.removeEventListener('message', listener);
}

export function updatePointerFromParam(pointer: Pointer) {
	pointerState.current = pointer;
}

export function getPointerContext() {
	return getContext<typeof pointerState | undefined>(pointerContextName);
}
