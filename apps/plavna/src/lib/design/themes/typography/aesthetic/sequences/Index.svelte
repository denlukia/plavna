<script>
	import StyleToHead from '$lib/design/components/ThemeInjector/CSSToHead.svelte';
	import FontPreloadToHead from '$lib/design/components/ThemeInjector/FontPreloadToHead.svelte';

	import InterItalicWoff2 from '../../fonts/Inter/InterVariable-Italic.woff2';
	import InterWoff2 from '../../fonts/Inter/InterVariable.woff2';
	import SourceSerifItalicWoff2 from '../../fonts/Source Serif 4/SourceSerif4Variable-Italic.otf.woff2';
	import SourceSerifRomanWoff2 from '../../fonts/Source Serif 4/SourceSerif4Variable-Roman.otf.woff2';
	import Fonts from './fonts.css?inline';
	import Typography from './typography.css?inline';
</script>

<FontPreloadToHead
	links={[InterItalicWoff2, InterWoff2, SourceSerifItalicWoff2, SourceSerifRomanWoff2]}
/>

<StyleToHead css={Fonts} />
<StyleToHead css={Typography} />
