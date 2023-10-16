<script lang="ts">
	export let name: string;
	export let error: string[] | undefined;
</script>

<div class="image-input">
	{name}
	<input type="file" {name} />
	{error}
</div>

<style>
</style>
