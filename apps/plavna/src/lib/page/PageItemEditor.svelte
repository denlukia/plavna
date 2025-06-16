<script lang="ts">
	import {
		Button,
		Input,
		Label,
		Labeled,
		RadioButton,
		Spacer,
		Typography
	} from '@plavna/design/components';
	import { allThemes } from '@plavna/design/theming/basics';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';

	import Errors from '../errors/Errors.svelte';
	import Translation from '../i18n/Translation.svelte';
	import type { PageCreateForm, PageUpdateForm } from './validators';

	type Props = {
		formObj: SuperValidated<PageCreateForm> | SuperValidated<PageUpdateForm>;
		onSuccessfullUpdate?: () => void;
	};

	let { formObj, onSuccessfullUpdate }: Props = $props();

	const { form, errors, enhance } = superForm(formObj, {
		resetForm: false,
		onUpdate: (e) => {
			if (e.result.type === 'success') {
				onSuccessfullUpdate?.();
			}
		}
	});

	const mapping = [
		['typography_markdown_theme', 'typographyMarkdown'],
		['color_theme', 'color']
		// ['style_theme', 'style']
	] as const;

	function humanizeThemeName(theme: string) {
		return theme.replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
	}
</script>

<form class="page-editor" use:enhance method="POST">
	{#if $form.id}
		<input type="hidden" name="id" bind:value={$form.id} />
	{/if}

	<div class="input-group">
		<div class="align-center">
			<Typography size="headline-short">
				<Translation key="pages_list.themes" />
			</Typography>
		</div>

		<div class="theme-radiogroups">
			{#each mapping as [category, allThemesCategory]}
				<Labeled as="legend" kind="for-radiogroup" style="flex-basis: max-content;">
					<Label><Translation key="pages_list.{category}" /></Label>
					{#each allThemes[allThemesCategory] as theme}
						<Labeled kind="for-radioinput">
							<RadioButton name={category} value={theme} bind:group={$form[category]} />
							<Typography size="body-short">{humanizeThemeName(theme)}</Typography>
						</Labeled>
					{/each}
				</Labeled>
			{/each}
		</div>
	</div>

	<Labeled as="label">
		<Label><Translation key="pages_list.slug" /></Label>
		<Input name="slug" bind:value={$form.slug} aria-invalid={Boolean($errors.slug?.length)} />
		<Errors errors={$errors.slug} />
	</Labeled>

	<Spacer />

	{#if $form.id}
		<Button formaction="?/update">
			<Translation key="pages_list.update" />
		</Button>
	{:else}
		<Button formaction="?/create">
			<Translation key="pages_list.create" />
		</Button>
	{/if}
</form>

<style>
	.page-editor {
		display: flex;
		flex-direction: column;
		gap: var(--size-m);
	}
	.theme-radiogroups {
		display: flex;
		gap: var(--size-l);
		flex-wrap: wrap;
	}
	.align-center {
		text-align: center;
	}
</style>
