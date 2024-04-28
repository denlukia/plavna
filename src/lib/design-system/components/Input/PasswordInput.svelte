<script lang="ts">
	import { expoOut } from 'svelte/easing';
	import type { HTMLInputAttributes } from 'svelte/elements';
	import { type EasingFunction, type FlyParams } from 'svelte/transition';

	import { fly, getFlyConf } from '../../transitions/fly';
	import Layers from '../ActiveElementFX/Layers.svelte';

	// import { customFly } from './customFly';

	type Props = HTMLInputAttributes & {
		pswdVisible: boolean;
	};
	let { pswdVisible, type, value = $bindable(), ...attributes }: Props = $props();
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

		if (selectionStart !== null || selectionEnd !== null) {
			targetRef.focus();

			targetRef.selectionStart = selectionStart;
			targetRef.selectionEnd = selectionEnd;
		}
	});
</script>

<!-- We explicitly set wisible cause parent Layers sets hidden -->
<Layers>
	{#if pswdVisible}
		<input
			in:fly={getFlyConf(expoOut, 'top')}
			out:fly={getFlyConf(expoOut, 'top')}
			bind:value
			bind:this={textInputRef}
			type="text"
			spellcheck="false"
			{...attributes}
			class="global-reset-input global-text-body"
		/>
	{:else}
		<input
			in:fly={getFlyConf(expoOut, 'bottom')}
			out:fly={getFlyConf(expoOut, 'bottom')}
			bind:value
			bind:this={pswdInputRef}
			type="password"
			spellcheck="false"
			{...attributes}
			class="global-reset-input global-text-body"
		/>
	{/if}
</Layers>

<style>
	input::placeholder {
		color: var(--color-input-placeholder);
	}
</style>
