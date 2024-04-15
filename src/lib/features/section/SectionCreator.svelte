<script lang="ts">
	import { superForm } from 'sveltekit-superforms';
	import type { SuperValidated } from 'sveltekit-superforms';

	import TranslationInput from '../i18n/TranslationInput.svelte';
	import type { SectionInsert } from './parsers';

	type Props = {
		formData: SuperValidated<SectionInsert>;
	};

	let { formData }: Props = $props();

	let { form, enhance } = superForm(formData);
</script>

<form use:enhance action="?/create_section" method="POST">
	<TranslationInput {form} />
	<button type="submit">Create Section</button>
</form>
