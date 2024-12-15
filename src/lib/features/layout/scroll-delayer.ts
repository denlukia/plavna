import { PAGE_INRO_DELAY_MS, PAGE_OUTROING_ATTRIBUTE_NAME } from '$lib/collections/config';

export function patchScrollToDelayed() {
	const originalScrollTo = window.scrollTo;

	let promise: null | Promise<unknown> = null;
	let resolve: null | ((value: unknown) => void) = null;
	let timeoutId: null | ReturnType<typeof setTimeout> = null;

	const stopObserving = observeBodyAttributeChange(PAGE_OUTROING_ATTRIBUTE_NAME, (newValue) => {
		if (newValue === 'true') {
			({ promise, resolve } = Promise.withResolvers());
			if (timeoutId) {
				clearTimeout(timeoutId);
			}
			timeoutId = setTimeout(() => {
				resolve?.(true);
			}, PAGE_INRO_DELAY_MS);
		}
	});

	function patchedScrollTo(x: number, y: number): void;
	function patchedScrollTo(x: ScrollToOptions | undefined): void;
	function patchedScrollTo(arg1: number | ScrollToOptions | undefined, arg2?: number) {
		if (typeof arg1 === 'number' && typeof arg2 === 'number') {
			promise?.then(() => {
				originalScrollTo(arg1, arg2);
			});
		} else if (typeof arg1 === 'object') {
			promise?.then(() => {
				originalScrollTo(arg1);
			});
		}
	}

	function unpatchScrollTo() {
		stopObserving?.();
		window.scrollTo = originalScrollTo;
	}
	window.scrollTo = patchedScrollTo;

	return unpatchScrollTo;
}

function observeBodyAttributeChange(
	attribute: string,
	callback: (newValue: string | null) => void
) {
	const targetNode = document.body;

	if (!targetNode) {
		console.error('document.body is not available.');
		return;
	}

	// Create a MutationObserver
	const observer = new MutationObserver((mutationsList) => {
		for (const mutation of mutationsList) {
			if (mutation.type === 'attributes' && mutation.attributeName === attribute) {
				const newValue = targetNode.getAttribute(attribute);
				callback(newValue);
			}
		}
	});

	// Configure the observer to watch for attribute changes
	observer.observe(targetNode, {
		attributes: true, // Watch for attribute changes
		attributeFilter: [attribute] // Only watch the specified attribute
	});

	// Return a function to disconnect the observer when no longer needed
	return () => observer.disconnect();
}
