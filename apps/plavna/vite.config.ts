import { sentryVitePlugin } from '@sentry/vite-plugin';
import { sveltekit } from '@sveltejs/kit/vite';
import { svelteInspector } from '@sveltejs/vite-plugin-svelte-inspector';
import { defineConfig, loadEnv } from 'vite';

const env = loadEnv('all', process.cwd(), '');

export default defineConfig({
	ssr: { noExternal: ['three', '@jill64/sentry-sveltekit-edge'] },
	plugins: [
		svelteInspector(),
		sveltekit(),
		sentryVitePlugin({
			org: 'plavna',
			project: 'javascript-sveltekit',
			authToken: env.SENTRY_AUTH_TOKEN
		})
	],
	server: { host: env.HOST, port: parseInt(env.PORT), strictPort: true, fs: { strict: false } },
	build: {
		sourcemap: true,
		commonjsOptions: { include: [/@plavna\/design/, /@plavna\/image-uploader/, /node_modules/] }
	}
});
