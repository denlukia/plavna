<script lang="ts">
	import { page } from '$app/stores';
	import AnimatedPage from '$lib/design/components/AnimatedPage/AnimatedPage.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
</script>

<AnimatedPage key={$page.status}>
	<Typography size="heading-1">{$page.status}</Typography>
</AnimatedPage>
