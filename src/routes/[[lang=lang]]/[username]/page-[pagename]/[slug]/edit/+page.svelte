<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import PostEditor from '$lib/components/pages/PostEditor.svelte';

	export let data;
</script>

<PostEditor {data} />
