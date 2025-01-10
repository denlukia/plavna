<script lang="ts">
	import { Button } from '@plavna/design/components';
	import { onMount } from 'svelte';
	import { superForm } from 'sveltekit-superforms';
	import Translation from '$lib/i18n/Translation.svelte';

	import LanguagedImageInput from '../ImageInput/LanguagedImageInput.svelte';
	import type { ImageCollectionItem } from '../validators';

	type Props = {
		image: ImageCollectionItem;
	};

	let { image: imageProp }: Props = $props();

	let { form: superValidated, meta } = imageProp;
	let { errors, enhance, form } = superForm(superValidated);
	let image = $state(meta);

	let showUpdateButton = $state(true);
	let hideCopyCode = $state(true);

	onMount(() => {
		showUpdateButton = false;
		hideCopyCode = false;
	});

	function copyCode() {
		const imageMd = `![Image description](${image.id})`;
		navigator.clipboard.writeText(imageMd);
	}
</script>

<div class="input-wrapper">
	<form
		class="form"
		method="post"
		action="?/update_image"
		enctype="multipart/form-data"
		use:enhance
	>
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

	<div class="action-wrapper copy-code" class:hide={hideCopyCode}>
		<Button size="small" onclick={copyCode}>
			<Translation key="article_editor.images.copy_code" />
		</Button>
	</div>
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
		display: flex;
	}
	.action-wrapper.copy-code {
		right: var(--size-m);
	}
	.action-wrapper.deletion {
		left: var(--size-m);
	}
	.action-wrapper.updating {
		right: var(--size-m);
		animation: fade-in 500ms 3s backwards;
	}

	.copy-code.hide {
		animation: fade-out 500ms 3s forwards;
	}

	@keyframes fade-in {
		0% {
			opacity: 0;
		}
		100% {
			opacity: 1;
		}
	}

	@keyframes fade-out {
		0% {
			opacity: 1;
		}
		100% {
			opacity: 0;
			display: none;
		}
	}
</style>
