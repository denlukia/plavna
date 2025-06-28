<script>
	import FontPreloadToHead from '../../../components/FontPreloadToHead.svelte';
	import ThemeStyleToHead from '../../../components/ThemeStyleToHead.svelte';
	import SerifFontItalic from '../../fonts/EB Garamond/EBGaramond-Italic-VariableFont_wght.woff2';
	import SerifFont from '../../fonts/EB Garamond/EBGaramond-VariableFont_wght.woff2';
	import InterItalicWoff2 from '../../fonts/Inter/InterVariable-Italic.woff2';
	import InterWoff2 from '../../fonts/Inter/InterVariable.woff2';
	import Fonts from './fonts.css?inline';
	import Typography from './typography.css?inline';
</script>

<FontPreloadToHead links={[InterItalicWoff2, InterWoff2, SerifFontItalic, SerifFont]} />

<ThemeStyleToHead css={Fonts} />
<ThemeStyleToHead css={Typography} type="typography" id="sequences" />
