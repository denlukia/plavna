<script lang="ts">
	import { AnimatedPage, Typography } from '@plavna/design/components';
	import { page } from '$app/stores';
</script>

<AnimatedPage key={$page.status}>
	<Typography size="heading-1">{$page.status}</Typography>
</AnimatedPage>
