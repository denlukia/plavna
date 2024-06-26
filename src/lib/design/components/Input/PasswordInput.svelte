<script lang="ts">
	import { tweened } from 'svelte/motion';
	import IconWrapper from '$lib/design/components/IconWrapper/IconWrapper.svelte';
	import Eye from '$lib/design/icons/Eye.svelte';

	import Button from '../Button/Button.svelte';
	import Input from './Input.svelte';
	import type { InputOrTextareaProps, InputProps } from './types';

	const eyeClosedFrame = 0;
	const eyeOpenedFrame = 7;
	const pswdIconCurrentFrame = tweened(eyeOpenedFrame, {
		duration: 250
	});

	let { type, ...attributes }: InputProps = $props();

	let animateOnTypeChange = $state(false);

	let pswdVisible = $state(false);

	$effect(() => {
		if (pswdVisible) {
			pswdIconCurrentFrame.set(eyeClosedFrame);
		} else {
			pswdIconCurrentFrame.set(eyeOpenedFrame);
		}
	});

	function togglePswdVisibility() {
		animateOnTypeChange = true;
		pswdVisible = !pswdVisible;
		animateOnTypeChange = false;
	}
</script>

{#snippet leading()}
	<IconWrapper currentFrame={$pswdIconCurrentFrame} frames={8} frameSize={20} size="small">
		<Eye />
	</IconWrapper>
{/snippet}

{#snippet trailing()}
	<Button type="button" isInInput onclick={togglePswdVisibility} {leading} />
{/snippet}

<Input type={pswdVisible ? 'text' : 'password'} {trailing} {...attributes} animateOnTypeChange />
