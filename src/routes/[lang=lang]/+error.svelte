<script lang="ts">
	import { page } from '$app/stores';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
</script>

<Typography size="heading-1">{$page.status}</Typography>
