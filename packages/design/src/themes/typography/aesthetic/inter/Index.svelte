<script>
	import StyleToHead from '@plavna/design/components/ThemeInjector/CSSToHead.svelte';

	import Fonts from './fonts.css?inline';
	import Typography from './typography.css?inline';
</script>

<StyleToHead css={Fonts} />
<StyleToHead css={Typography} />
