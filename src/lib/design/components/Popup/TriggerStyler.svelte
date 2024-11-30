<script lang="ts">
	import type { Snippet } from 'svelte';

	import ArrowDown from '../../icons/ArrowDown.svelte';
	import ActiveElementFX from '../ActiveElementFX/ActiveElementFX.svelte';
	import IconWrapper from '../IconWrapper/IconWrapper.svelte';

	type Props = {
		isInInput?: boolean;
		children: Snippet;
		isLabel?: boolean;
		active?: boolean;
	};
	let { isInInput = false, active = false, children }: Props = $props();
</script>

<span
	class="
		dropdown-trigger
		{isInInput ? 'type-in-input' : 'type-default'}"
	class:active
>
	<ActiveElementFX>
		<span
			class="
					dropdown
					global-disable-default-outline
					global-text-strong
					global-text-functional-{isInInput ? 'small-short' : 'body-short'}
					global-reset-select"
		>
			{@render children()}
		</span>
		<span class="arrow-wrapper global-reset-line-height">
			<IconWrapper size={isInInput ? 'small' : 'body'}>
				<ArrowDown />
			</IconWrapper>
		</span>
	</ActiveElementFX>
</span>

<style>
	/* General */
	.dropdown-trigger {
		position: relative;
		display: inline-block;
		color: var(--color-dropdown-text);
		box-shadow: var(--shadow-dropdown);
		transition: var(--transition-select);

		--layers-border-radius: var(--size-dropdown-border-radius);
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
	.type-default {
		background: var(--color-dropdown-bg);
		border-radius: var(--size-dropdown-border-radius);

		--color-layer-flashlight-pointer: var(--color-dropdown-layer-flashlight-hover);
		--layers-border-radius: var(--size-dropdown-border-radius);
	}
	.type-default:hover {
		box-shadow: var(--shadow-dropdown-hover);
		transform: var(--transform-dropdown-hover);
	}
	.type-default:active,
	.type-default.active {
		box-shadow: var(--shadow-dropdown-active);
		transform: var(--transform-dropdown-active);
	}

	.type-in-input {
		background: var(--color-button-in-input-bg);
		border-radius: var(--size-button-in-input-border-radius);
		box-shadow: var(--shadow-button-in-input);

		--color-layer-flashlight-pointer: var(--color-button-in-input-layer-flashlight-hover);
		--layers-border-radius: var(--size-button-in-input-border-radius);
	}
	.type-in-input:hover {
		box-shadow: var(--shadow-button-in-input-hover);
		transform: var(--transform-button-in-input-hover);
	}
	.type-in-input:active,
	.type-in-input.active {
		box-shadow: var(--shadow-button-in-input-pressed);
		transform: var(--transform-button-in-input-pressed);
	}

	.type-default .arrow-wrapper {
		/* width: var(--size-dropdown-arrow-width); */
		right: var(--size-dropdown-arrow-padding-right);
	}

	.type-in-input .arrow-wrapper {
		/* width: var(--size-dropdown-in-input-arrow-width); */
		right: var(--size-dropdown-in-input-arrow-padding-right);
	}
</style>
