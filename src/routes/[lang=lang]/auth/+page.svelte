<script lang="ts">
	import Button from '$lib/design/components/Button.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';
</script>

<div class="button-wrapper">
	<Button href="./auth/github" dataSvelteKitReload>
		<Translation key="login.sign_in_with_github" />
	</Button>
</div>

<style>
	.button-wrapper {
		padding-top: 100px;
		display: flex;
		justify-content: center;
	}
</style>
