<script lang="ts">
	import Translation from '$lib/components/Translation.svelte';
	import Button from '$lib/design-system/components/Button.svelte';
</script>

<div class="button-wrapper">
	<Button href="./login/github" dataSvelteKitReload>
		<Translation key="login.sign_in_with_github" />
	</Button>
</div>

<style>
	.button-wrapper {
		margin-top: 100px;
		display: flex;
		justify-content: center;
	}
</style>
