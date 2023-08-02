<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';

	import PostEditor from '$lib/components/pages/PostEdit.svelte';

	export let data;
</script>

<PostEditor {data} />
