<script lang="ts">
	import AnimatedPage from '@plavna/design/components/AnimatedPage/AnimatedPage.svelte';
	import Typography from '@plavna/design/components/Typography/Typography.svelte';
	import { page } from '$app/stores';
</script>

<AnimatedPage key={$page.status}>
	<Typography size="heading-1">{$page.status}</Typography>
</AnimatedPage>
