<script lang="ts">
	import { fly, type EasingFunction, type FlyParams } from 'svelte/transition';
	import Layers from '../Layers.svelte';
	import { cubicIn, cubicInOut, cubicOut } from 'svelte/easing';

	type Props = {
		autocomplete: AutoFill;
		pswdVisible: boolean;
		value?: string;
	};
	let { pswdVisible, value, autocomplete } = $props<Props>();
	let selectionStart: number | null = null;
	let selectionEnd: number | null = null;

	let textInputRef: HTMLInputElement | null = $state(null);
	let pswdInputRef: HTMLInputElement | null = $state(null);

	$effect.pre(() => {
		let readingRef = pswdVisible ? pswdInputRef : textInputRef;
		if (!readingRef) return;

		selectionStart = readingRef.selectionStart;
		selectionEnd = readingRef.selectionEnd;
	});

	$effect(() => {
		let targetRef = pswdVisible ? textInputRef : pswdInputRef;
		if (!targetRef) return;

		targetRef.focus();
		if (selectionStart !== null) {
			targetRef.selectionStart = selectionStart;
		}
		if (selectionEnd !== null) {
			targetRef.selectionEnd = selectionEnd;
		}
	});

	const flyConf: (easing: EasingFunction, y: number) => FlyParams = (easing, y) => ({
		duration: 400,
		easing,
		y,
		opacity: 0
	});
</script>

<Layers>
	{#if pswdVisible}
		<input
			in:fly={flyConf(cubicOut, -7)}
			out:fly={flyConf(cubicIn, -7)}
			bind:value
			bind:this={textInputRef}
			type="text"
			spellcheck="false"
			{autocomplete}
			class="global-input-reset global-text-body"
		/>
	{:else}
		<input
			in:fly={flyConf(cubicOut, 7)}
			out:fly={flyConf(cubicIn, 7)}
			bind:value
			bind:this={pswdInputRef}
			type="password"
			spellcheck="false"
			{autocomplete}
			class="global-input-reset global-text-body"
		/>
	{/if}
</Layers>
