<script lang="ts">
	type Props = {
		size?: 's' | 'm' | 'l';
		type?: 'horizontal' | 'vertical';
	};

	let { size = 'm', type = 'horizontal' }: Props = $props();
</script>

<span class="spacer {size} {type}"></span>

<style>
	.horizontal {
		display: inline-block;
	}
	.vertical {
		display: block;
	}
	.s {
		width: var(--size-s);
		height: var(--size-s);
	}
	.m {
		width: var(--size-m);
		height: var(--size-m);
	}
	.l {
		width: var(--size-l);
		height: var(--size-l);
	}
</style>
