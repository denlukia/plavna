<script lang="ts">
	import { tweened } from 'svelte/motion';
	import Eye from '$lib/design/icons/Eye.svelte';
	import IconWrapper from '$lib/design/icons/IconWrapper.svelte';

	import ButtonInInput from './ButtonInInput.svelte';
	import Input from './Input.svelte';
	import type { InputProps } from './types';

	const eyeClosedFrame = 0;
	const eyeOpenedFrame = 7;
	const pswdIconCurrentFrame = tweened(eyeOpenedFrame, {
		duration: 250
	});

	let { type, ...other }: InputProps = $props();

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

<Input type={pswdVisible ? 'text' : 'password'} {...other} animateOnTypeChange>
	{#snippet trailing()}
		<ButtonInInput onclick={togglePswdVisibility}>
			<IconWrapper currentFrame={$pswdIconCurrentFrame} frames={8} frameSize={20}>
				<Eye />
			</IconWrapper>
		</ButtonInInput>
	{/snippet}
</Input>
