<script lang="ts">
	import type { Snippet } from 'svelte';

	import Effects from '../(helpers)/Effects.svelte';
	import { createPressWatcher } from '../(helpers)/PressWatcher.svelte';
	import ArrowDown from '../(icons)/ArrowDown.svelte';
	import IconWrapper from '../(icons)/IconWrapper.svelte';

	type Props = {
		isInInput?: boolean;
		children: Snippet;
		isLabel?: boolean;
		isActive?: boolean;
	};
	let { isInInput = false, isActive = false, children }: Props = $props();

	let watcher = createPressWatcher();
</script>

<span
	class={`
		main-wrapper 
		global-layer-flashlight-hover-trigger 
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
					global-reset-select
					global-reset-line-height`}
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
	}

	/* Type Specific */
	.type-default .arrow-wrapper {
		width: var(--size-dropdown-icon-width);
		right: var(--size-dropdown-padding-left);
	}

	.type-in-input .arrow-wrapper {
		width: var(--size-dropdown-in-input-icon-width);
		right: var(--size-dropdown-in-input-padding-left);
	}
</style>
