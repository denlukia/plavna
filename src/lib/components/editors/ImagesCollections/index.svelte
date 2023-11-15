<script lang="ts">
	import ImageProviderForm from './ImageProviderForm.svelte';

	import type {
		ArticleSelect,
		ImageProviderUpdateZod,
		ImagesCollection
	} from '$lib/server/collections/types';
	import type { SuperValidated } from 'sveltekit-superforms';

	import ImageCollection from './ImageCollection.svelte';

	export let providerForm: SuperValidated<ImageProviderUpdateZod>;
	export let articleId: ArticleSelect['id'];
	export let collections: {
		common: ImagesCollection;
		article: ImagesCollection;
	};
</script>

<fieldset>
	<div>
		Image provider:
		<ImageProviderForm {providerForm} />
	</div>

	<div>
		Common images:
		<ImageCollection collection={collections.common} isAccountCommon/>
	</div>

	<div>
		Article images:
		<ImageCollection collection={collections.article} {articleId} />
	</div>
</fieldset>
