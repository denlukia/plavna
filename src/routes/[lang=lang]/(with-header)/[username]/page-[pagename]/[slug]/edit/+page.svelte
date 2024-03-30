<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import ArticleEditor from '$lib/components/pages/ArticleEdit.svelte';

	export let data;
</script>

<ArticleEditor {data} />
