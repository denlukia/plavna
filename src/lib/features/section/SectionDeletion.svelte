<script lang="ts">
	import { superForm, type SuperValidated } from 'sveltekit-superforms';
	import Button from '$lib/design-system/components/Button.svelte';

	import Translation from '../i18n/Translation.svelte';
	import type { SectionDelete } from './parsers';

	type Props = {
		form: SuperValidated<SectionDelete>;
	};
	let { form: formData }: Props = $props();

	let { form, enhance } = superForm(formData);
</script>

<form class="global-reset-line-height" action="?/delete_section" method="POST" use:enhance>
	<input name="section_id" type="hidden" bind:value={$form.section_id} />
	<Button type="destructive" size="small"><Translation key="page.section.delete" /></Button>
</form>
