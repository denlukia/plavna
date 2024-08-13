<script lang="ts">
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import Button from '$lib/design/components/Button/Button.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';

	import LanguagedImageInput from '../ImageInput/LanguagedImageInput.svelte';
	import type { ImageCollectionItem } from '../parsers';

	type Props = {
		image: ImageCollectionItem;
	};

	let { image: imageProp }: Props = $props();

	let { form: superValidated, meta } = imageProp;
	let { errors, enhance, form } = superForm(superValidated);
	let image = $state(meta);

	let showUpdateButton = $state(true);
	let showCopyCode = $state(false);

	onMount(() => {
		showUpdateButton = false;
		showCopyCode = true;
	});
</script>

<div class="input-wrapper">
	<form class="form" method="post" action="?/update_image" use:enhance>
		<LanguagedImageInput name="image" bind:image clientUpload />
		<input name="id" type="hidden" bind:value={$form.id} />
		{#if showUpdateButton}
			<div class="action-wrapper updating">
				<Button size="small"><Translation key="article_editor.images.update_translation" /></Button>
			</div>
		{/if}
	</form>

	<form class="form" method="post" action="?/delete_image" use:enhance>
		<input name="id" type="hidden" bind:value={$form.id} />
		<div class="action-wrapper deletion">
			<Button kind="destructive" size="small">
				<Translation key="article_editor.images.delete_whole" />
			</Button>
		</div>
	</form>
	{#if showCopyCode}
		<div class="action-wrapper copy-code">
			<Button size="small">
				<Translation key="article_editor.images.copy_code" />
			</Button>
		</div>
	{/if}
</div>

<style>
	.input-wrapper {
		position: relative;
	}
	.form {
		position: relative;
	}
	.action-wrapper {
		position: absolute;
		bottom: calc(var(--size-m-to-l) * -1);
	}
	.action-wrapper.copy-code {
		right: var(--size-m);
		animation: fade-in 500ms backwards;
	}
	.action-wrapper.deletion {
		left: var(--size-m);
	}
	.action-wrapper.updating {
		right: var(--size-m);
		animation: fade-in 500ms 3s backwards;
	}

	@keyframes fade-in {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}
</style>
