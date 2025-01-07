import { sveltekit } from '@sveltejs/kit/vite';

import { defineConfig, loadEnv } from 'vite';

const env = loadEnv('all', process.cwd(), '');

export default defineConfig({
	plugins: [sveltekit()],
});
