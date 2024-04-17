<script lang="ts">
	import type { Snippet } from 'svelte';

	import { createPressWatcher } from '../(helpers)/createPressWatcher.svelte';
	import Effects from '../(helpers)/Effects.svelte';
	import ArrowDown from '../(icons)/ArrowDown.svelte';
	import IconWrapper from '../(icons)/IconWrapper.svelte';

	type Props = {
		isInInput?: boolean;
		children: Snippet;
		isLabel?: boolean;
		isActive?: boolean;
	};
	let { isInInput = false, isActive = false, children }: Props = $props();

	const watcher = createPressWatcher();
</script>

<span
	class={`
		main-wrapper 
		${isInInput ? 'type-in-input' : 'type-default'}`}
	class:global-button-in-input={isInInput}
	class:pressed={isActive || watcher.pressed}
	onpointerdown={watcher.onpointerdown}
	onpointerup={watcher.onpointerup}
>
	<Effects>
		<span
			class={`
					dropdown
					global-disable-default-outline 	
					global-text-bold
					global-text-${isInInput ? 'small-short' : 'body-short'}
					global-reset-select`}
		>
			{@render children()}
		</span>
		<span class="arrow-wrapper">
			<IconWrapper size={isInInput ? 'small' : 'body'}>
				<ArrowDown />
			</IconWrapper>
		</span>
	</Effects>
</span>

<style>
	/* General */
	.main-wrapper {
		position: relative;
		display: inline-block;
		background: var(--color-dropdown-bg);
		color: var(--color-dropdown-text);
		box-shadow: var(--shadow-dropdown);
		border-radius: var(--size-dropdown-border-radius);
		transition: var(--transition-select);

		--layers-border-radius: var(--size-dropdown-border-radius);
		--color-layer-flashlight-pointer: var(--color-dropdown-layer-flashlight-hover);
	}
	.main-wrapper:hover {
		box-shadow: var(--shadow-dropdown-hover);
		transform: var(--transform-dropdown-hover);
	}
	.main-wrapper:active,
	.main-wrapper.pressed {
		box-shadow: var(--shadow-dropdown-active);
		transform: var(--transform-dropdown-active);
	}

	.arrow-wrapper {
		pointer-events: none;
		position: absolute;
		top: 0;
		display: flex;
		align-items: center;
		justify-content: center;
		height: 100%;
	}

	.dropdown {
		display: inline-block;
		padding: 0;
	}

	/* Type Specific */
	.type-default .arrow-wrapper {
		width: var(--size-dropdown-arrow-width);
		right: var(--size-dropdown-arrow-padding-right);
	}

	.type-in-input .arrow-wrapper {
		width: var(--size-dropdown-in-input-arrow-width);
		right: var(--size-dropdown-in-input-padding-right);
	}
</style>
