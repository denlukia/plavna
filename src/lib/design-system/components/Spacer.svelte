<script lang="ts">
	type Props = {
		size?: 's' | 'm' | 'l';
	};

	let { size = 'm' }: Props = $props();
</script>

<span class="spacer {size}" />

<style>
	.spacer {
		display: inline-block;
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
