<script lang="ts">
	import { getThemeClass } from '../themes';

	type Props = {
		css: string;
		type?: 'color' | 'style' | 'typography';
		id?: string;
	};

	let { css, type, id }: Props = $props();

	let finalCss = $derived(type && id ? css.replace(':root', `.${getThemeClass(type, id)}`) : css);
</script>

<svelte:head>
	{@html `<style>${finalCss}</style>`}
</svelte:head>
