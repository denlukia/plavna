<script lang="ts">
	import PostEditor from '../../../../../../lib/components/PostEditor.svelte';
	import { superForm } from 'sveltekit-superforms/client';

	import type { PageData } from './$types';

	export let data: PageData;
</script>

<PostEditor {data} />
