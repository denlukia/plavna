<script>
	import { crossfadeStates } from '$lib/stores/crossfade';
	import './reset.css';

	console.log('------ Reset crossfade States ----------');
	crossfadeStates.set({});
</script>

<slot />
