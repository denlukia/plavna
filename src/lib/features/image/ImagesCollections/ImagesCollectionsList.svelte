<script lang="ts">
	import type { SuperValidated } from 'sveltekit-superforms';
	import type { ArticleSelect } from '$lib/features/article/parsers';
	import type { ImageProviderUpdate } from '$lib/features/user/parsers';

	import type { ImagesCollection } from '../parsers';
	import ImageCollection from './ImageCollection.svelte';
	import ImageProviderForm from './ImageProviderForm.svelte';

	export let providerForm: SuperValidated<ImageProviderUpdate>;
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
		<ImageCollection collection={collections.common} isAccountCommon />
	</div>

	<div>
		Article images:
		<ImageCollection collection={collections.article} {articleId} />
	</div>
</fieldset>
