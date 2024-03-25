<script>
	import Header from '$lib/(features)/layout/Header.svelte';

	export let data;
</script>

<Header user={data.user} />
<slot />
