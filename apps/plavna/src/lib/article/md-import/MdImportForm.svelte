<script lang="ts">
	import {
		Button,
		FormWrapper,
		Input,
		Label,
		Labeled,
		Link,
		Spacer,
		Spinner,
		Typography
	} from '@plavna/design/components';
	import { page } from '$app/stores';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import { generatePath } from '$lib/common/links';
	import Errors from '$lib/errors/Errors.svelte';
	import Translation from '$lib/i18n/Translation.svelte';
	import { getSystemTranslation } from '$lib/i18n/utils';

	import type { MdImportForm } from './validators';

	type Props = {
		superValidated: SuperValidated<MdImportForm>;
		hasGithubToken: boolean;
		close: () => void;
		onImported: () => void;
	};

	let { superValidated, hasGithubToken, close, onImported }: Props = $props();

	let { form, errors, enhance, submitting } = superForm(superValidated, {
		resetForm: false,
		invalidateAll: false,
		onUpdate: (event) => {
			if (event.result.type === 'success') {
				close();
				onImported();
			}
		}
	});

	let settingsHref = $derived(generatePath('/[lang]/[username]/settings', $page.params));
</script>

<FormWrapper>
	<form method="POST" action="?/import_md" use:enhance>
		<div class="global-text-align-center">
			<Typography size="heading-2">
				<Translation key="article_editor.md_import.form_title" />
			</Typography>
		</div>
		<Labeled as="label">
			<Label><Translation key="article_editor.md_import.url_label" /></Label>
			<Input
				type="text"
				name="url"
				bind:value={$form.url}
				placeholder={getSystemTranslation(
					'article_editor.md_import.url_placeholder',
					$page.data.systemTranslations
				)}
			/>
			<Errors errors={$errors.url} />
			<Label tone="additional">
				<Translation key="article_editor.md_import.url_hint" />
			</Label>
		</Labeled>
		<Spacer />
		<Button disabled={$submitting}>
			{#snippet leading()}
				{#if $submitting}
					<Spinner />
				{/if}
			{/snippet}
			<Translation key="article_editor.md_import.submit" />
		</Button>
	</form>

	<div class="global-text-align-center">
		<Typography size="small">
			<Link href={settingsHref}>
				<Translation
					key={hasGithubToken
						? 'article_editor.md_import.edit_github'
						: 'article_editor.md_import.setup_github'}
				/>
			</Link>
		</Typography>
	</div>
</FormWrapper>
