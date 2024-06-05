<script lang="ts">
	import type { SupportedLang } from '@denlukia/plavna-common/types';
	import { page } from '$app/stores';
	import { lexer, type Token, type TokensList } from 'marked';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import Button from '$lib/design/components/Button/Button.svelte';
	import InfoBlock from '$lib/design/components/InfoBlock/InfoBlock.svelte';
	import Input from '$lib/design/components/Input/Input.svelte';
	import Label from '$lib/design/components/Label/Label.svelte';
	import LabeledInput from '$lib/design/components/Label/LabeledInput.svelte';
	import Typography from '$lib/design/components/Typography/Typography.svelte';
	import Translation from '$lib/features/i18n/Translation.svelte';

	import { getSystemTranslation } from '../i18n/utils';
	import type { TagSelect } from '../tag/parsers';
	import type { SectionDelete, SectionInsert, SectionUpdate } from './parsers';
	import SectionDeletion from './SectionDeletion.svelte';

	type Props = {
		mainForm: SuperValidated<SectionInsert | SectionUpdate>;
		deletionForm?: SuperValidated<SectionDelete>;
		onCancel: () => void;
		onSuccessfullUpdate?: () => void;
	};

	let {
		mainForm: mainFormData,
		deletionForm: deletionFormData,
		onCancel,
		onSuccessfullUpdate
	}: Props = $props();

	let { form: translationForm, enhance } = superForm(mainFormData, {
		onUpdate: (e) => {
			if (e.result.type === 'success') {
				onSuccessfullUpdate?.();
			}
		}
	});

	let tags = $derived($page.data.tags || []);
	let tagsInText = $derived.by(() => {
		let lang = descriptionInput.currentLang;
		let text = $translationForm[lang];
		if (!text) {
			return [];
		}
		let tokens = lexer(text);

		return findAllTagsInTokens(tokens);
	});

	let descriptionInput = $state({
		currentLang: $page.params.lang as SupportedLang,
		selectionStart: 0,
		selectionEnd: 0
	});

	function findAllTagsInTokens(tokens: Token[]): TagSelect['id'][] {
		const tags: TagSelect['id'][] = [];
		for (let token of tokens) {
			const isLinkToken = token.type === 'link' && token.href.startsWith('tag:');
			if (isLinkToken) {
				tags.push(Number(token.href.split('tag:')[1]));
			}
			if ('tokens' in token && token.tokens) {
				tags.push(...findAllTagsInTokens(token.tokens));
			}
		}
		const deduped = Array.from(new Set(tags));
		return deduped;
	}

	function deleteTagsIfPresent(text: string, tagId: TagSelect['id']) {
		const mdLinkRegex = /(?:\[(.*?)\])\(tag:(\d*)\)/gm;

		const matches = text.matchAll(mdLinkRegex);

		for (let match of matches) {
			if (match[2] === tagId.toString()) {
				return text.replace(match[0], '');
			}
		}

		return text;
	}

	function switchTagInText(tagId: TagSelect['id']) {
		const lang = descriptionInput.currentLang;
		const text = $translationForm[lang] || '';

		const newText = deleteTagsIfPresent(text, tagId);

		if (newText !== text) {
			$translationForm[lang] = newText;
		} else {
			let textBefore = text.slice(0, descriptionInput.selectionStart);
			textBefore = textBefore.trimEnd();
			if (textBefore.length > 0) {
				textBefore += ' ';
			}

			let textAfter = text.slice(descriptionInput.selectionEnd);
			textAfter = textAfter.trimStart();
			if (textAfter.length > 0) {
				textAfter = ' ' + textAfter;
			}

			const tagTemplate = `[${getSystemTranslation('page_actor.section.tag_name', $page.data.systemTranslations)}](tag:${tagId})`;

			$translationForm[lang] = `${textBefore}${tagTemplate}${textAfter}`;
		}
	}
</script>

<div class="section-editor">
	<Typography size="heading-1">
		<Translation key="page_actor.section.editor_title" />
	</Typography>
	<form
		use:enhance
		action="?/{'section_id' in $translationForm ? 'update' : 'create'}_section"
		method="POST"
	>
		{#if 'section_id' in $translationForm}
			<input name="section_id" type="hidden" bind:value={$translationForm.section_id} />
		{/if}
		<div class="inputs">
			<LabeledInput style="width: 100%;">
				<Label><Translation key="page_actor.section.description" /></Label>
				<Input
					type="textarea"
					translationsForm={translationForm}
					bind:currentLang={descriptionInput.currentLang as SupportedLang}
					bind:selectionStart={descriptionInput.selectionStart}
					bind:selectionEnd={descriptionInput.selectionEnd}
					style="width: 100%;"
					rows={3}
				/>
			</LabeledInput>

			<LabeledInput style="width: 100%;">
				<Label><Translation key="page_actor.section.available_tags" /></Label>
				{#if tags.length > 0}
					<div class="tags-list">
						{#each tags as tag}
							<Button
								size="small"
								type="button"
								kind={tagsInText.includes(tag.id) ? 'primary' : 'secondary'}
								onclick={() => switchTagInText(tag.id)}
							>
								<Translation recordKey={tag.name_translation_key} />
								<span class="tag-id">
									ID:{tag.id}
								</span>
							</Button>
						{/each}
					</div>
				{:else}
					<div class="info-block-wrapper">
						<InfoBlock>
							<Translation key="page_actor.section.gotta_create_tags" />
						</InfoBlock>
					</div>
				{/if}
			</LabeledInput>
		</div>

		<div class="actions">
			<Button type="button" kind="secondary" onclick={onCancel}>
				<Translation key="page_actor.section.cancel" />
			</Button>
			<Button>
				<Translation
					key={`page_actor.section.${'section_id' in $translationForm ? 'update' : 'create'}`}
				/>
			</Button>
		</div>
	</form>
	{#if deletionFormData}
		<div class="deletion-form-wrapper">
			<SectionDeletion formData={deletionFormData} />
		</div>
	{/if}
</div>

<style>
	.section-editor {
		padding-inline: var(--size-section-editor-padding-inline);
		padding-top: var(--size-section-editor-padding-top);
		padding-bottom: var(--size-section-editor-padding-bottom);
		border-radius: var(--size-section-editor-border-radius);
		background: var(--color-section-editor-bg);
		position: relative;
	}

	.actions {
		display: flex;
		justify-content: flex-end;
		gap: var(--size-m);
		margin-top: var(--size-xl);
	}
	.deletion-form-wrapper {
		position: absolute;
		bottom: var(--size-section-editor-padding-bottom);
		left: var(--size-section-editor-padding-inline);
	}

	.inputs {
		margin-top: var(--size-l);
	}

	.tags-list {
		display: flex;
		margin-top: var(--size-s);
		gap: var(--size-s);
	}
	.info-block-wrapper {
		margin-top: var(--size-s);
	}

	.tag-id {
		margin-inline-start: var(--size-xs);
		opacity: 0.4;
	}
</style>
