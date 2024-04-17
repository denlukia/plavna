<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';
	import Button from '$lib/design-system/components/Button.svelte';

	import TranslationInput from '../i18n/TranslationInput.svelte';
	import type { SectionInsert } from './parsers';

	type Props = {
		creationForm: SuperValidated<SectionInsert>;
		oncancel: () => void;
	};

	let { creationForm, oncancel }: Props = $props();

	let { form, enhance } = superForm(creationForm);
</script>

<form use:enhance action="?/create_section" method="POST">
	<TranslationInput {form} />
	<button type="submit">Create Section</button>
</form>
<Button onclick={oncancel}>Cancel</Button>
