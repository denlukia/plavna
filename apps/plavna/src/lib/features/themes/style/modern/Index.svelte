<script>
	import StyleToHead from '@plavna/design/components/ThemeInjector/CSSToHead.svelte';

	import FX from './fx.css?inline';
	import Sizes from './sizes.css?inline';
</script>

<StyleToHead css={Sizes} />
<StyleToHead css={FX} />
