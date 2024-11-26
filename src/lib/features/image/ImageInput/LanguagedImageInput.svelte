<script lang="ts">
	import { supportedLangs } from '@denlukia/plavna-common/constants';
	import type { SupportedLang } from '@denlukia/plavna-common/types';
	import { page } from '$app/stores';
	import Layers from '$lib/design/components/ActiveElementFX/Layers.svelte';
	import Select from '$lib/design/components/Popup/Select.svelte';
	import { fly, getFlyConf } from '$lib/design/transitions/fly';
	import Translation from '$lib/features/i18n/Translation.svelte';
	import { getSystemTranslation } from '$lib/features/i18n/utils';

	import { getLanguagedName } from '../utils';
	import type { ImageSelect } from '../validators';
	import ImageInput from './ImageInput.svelte';

	type Props = {
		name: string;
		image: ImageSelect | null;
		processing?: boolean;
		clientUpload?: boolean;
	};

	let {
		name: nonprefixedName,
		image = $bindable(),
		processing = $bindable(false),
		clientUpload = false
	}: Props = $props();

	let lang: SupportedLang | null = $state(null);
	let name = $derived(getLanguagedName(nonprefixedName, lang));

	let translation = $state(
		image?.path_translation_key
			? $page.data.imageInputsTranslations?.[image.path_translation_key] || null
			: null
	);

	let mainLangText = $derived(
		getSystemTranslation('article_editor.images.main', $page.data.systemTranslations)
	);
</script>

<div class="languaged-image-input">
	<Layers overflow="visible">
		{#key lang}
			<div
				class="animation-wrapper"
				in:fly|local={getFlyConf('bottom')}
				out:fly|local={getFlyConf('top')}
			>
				<ImageInput bind:image bind:translation {name} {clientUpload} {processing} {lang} />
			</div>
		{/key}
	</Layers>
	<div class="select-positioner">
		<Select bind:value={lang} isInInput>
			<option value={null}>{mainLangText}</option>
			{#each supportedLangs as lang}
				<option value={lang}>{lang.toUpperCase()}</option>
			{/each}
		</Select>
	</div>
</div>

<style>
	.languaged-image-input {
		position: relative;
	}
	.select-positioner {
		position: absolute;
		top: 0;
		right: 0;
		padding: var(--size-input-to-button-padding);
	}
</style>
