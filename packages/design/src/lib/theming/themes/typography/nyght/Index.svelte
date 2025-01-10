<script>
	import ThemeStyleToHead from '../../../components/ThemeStyleToHead.svelte';
	import Fonts from './fonts.css?inline';
	import Typography from './typography.css?inline';
</script>

<ThemeStyleToHead css={Fonts} />
<ThemeStyleToHead css={Typography} type="typography" id="nyght" />
