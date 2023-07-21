<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import PostEditor from '$lib/components/PostEditor.svelte';

	export let data;
</script>

<PostEditor {data} />
