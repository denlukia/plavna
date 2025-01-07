<script lang="ts">
	import Button from '@plavna/design/components/Button/Button.svelte';
	import { superForm, type SuperValidated } from 'sveltekit-superforms';

	import Translation from '../i18n/Translation.svelte';
	import type { SectionDelete } from './validators';

	type Props = {
		formData: SuperValidated<SectionDelete>;
	};

	let { formData }: Props = $props();

	let { form, enhance } = superForm(formData);
</script>

<form action="?/delete_section" method="POST" use:enhance>
	<input name="section_id" type="hidden" bind:value={$form.section_id} />
	<Button kind="destructive">
		<Translation key="page_actor.section.delete" />
	</Button>
</form>
