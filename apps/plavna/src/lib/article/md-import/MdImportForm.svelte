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

	import type { MdImportWarning } from './images';
	import type { MdImportForm } from './validators';

	type Props = {
		superValidated: SuperValidated<MdImportForm>;
		hasGithubToken: boolean;
		close: () => void;
		onImported: () => void;
	};

	let { superValidated, hasGithubToken, close, onImported }: Props = $props();

	let warnings = $state([] as MdImportWarning[]);

	let { form, errors, enhance, submitting } = superForm(superValidated, {
		resetForm: false,
		invalidateAll: false,
		onUpdate: (event) => {
			if (event.result.type === 'success') {
				const nextWarnings = (event.result.data?.warnings ?? []) as MdImportWarning[];
				warnings = nextWarnings;
				onImported();
				if (!nextWarnings.length) {
					close();
				}
			}
		}
	});

	function shiftStep(delta: number) {
		form.update((values) => {
			const next = Math.min(3, Math.max(-3, (values.heading_shift ?? 0) + delta));
			return { ...values, heading_shift: next };
		});
	}

	let shiftDisplay = $derived(
		$form.heading_shift > 0 ? `+${$form.heading_shift}` : `${$form.heading_shift ?? 0}`
	);

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
		<Labeled as="label">
			<Label><Translation key="article_editor.md_import.heading_shift" /></Label>
			<div class="shift-row">
				<Button type="button" size="small" onclick={() => shiftStep(-1)}>−</Button>
				<Typography size="body-short">{shiftDisplay}</Typography>
				<Button type="button" size="small" onclick={() => shiftStep(1)}>+</Button>
				<input type="hidden" name="heading_shift" bind:value={$form.heading_shift} />
			</div>
			<Errors errors={$errors.heading_shift} />
			<Label tone="additional">
				<Translation key="article_editor.md_import.heading_shift_hint" />
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

	{#if warnings.length}
		{#each warnings as warning (warning.file + warning.key)}
			<Label tone="danger">
				<Translation key={warning.key} /> ({warning.file})
			</Label>
		{/each}
	{/if}

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

<style>
	.shift-row {
		display: flex;
		align-items: center;
		gap: var(--size-m);
	}
</style>
