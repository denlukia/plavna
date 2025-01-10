<script lang="ts">
	import { AnimatedPage, Typography } from '@plavna/design/components';
	import { page } from '$app/stores';
	import { PAGE_INRO_DELAY_MS } from '$lib/common/config';
</script>

<AnimatedPage key={$page.status} introDelay={PAGE_INRO_DELAY_MS}>
	<Typography size="heading-1">{$page.status}</Typography>
</AnimatedPage>
