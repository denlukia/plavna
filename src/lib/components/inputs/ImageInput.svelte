<script lang="ts">
	export let name: string;
	export let errors: string | string[] | undefined;
</script>

<input type="file" {name} />
{errors}
