<script lang="ts">
	import { onMount } from 'svelte';

	type Props = {
		onInView: () => void;
	};

	let { onInView }: Props = $props();

	let observer: IntersectionObserver;
	let element: HTMLElement;

	let callbackTriggered = $state(false);

	onMount(() => {
		observer = new IntersectionObserver(async ([entry]) => {
			if (entry.isIntersecting) {
				if (callbackTriggered) return;

				callbackTriggered = true;
				await onInView();
			} else {
				callbackTriggered = false;
			}
		});

		if (element) {
			observer.observe(element);
		}

		return () => {
			if (observer && element) {
				observer.unobserve(element);
			}
		};
	});
</script>

<div bind:this={element}></div>
