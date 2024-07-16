import { sveltekit } from '@sveltejs/kit/vite';
import { svelteInspector } from '@sveltejs/vite-plugin-svelte-inspector';
import { defineConfig, loadEnv } from 'vite';

const env = loadEnv('all', process.cwd(), '');

export default defineConfig({
	ssr: { noExternal: ['three'] },
	plugins: [sveltekit(), svelteInspector()],
	server: { host: env.HOST, port: parseInt(env.PORT), strictPort: true }
});
