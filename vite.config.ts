import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

const env = loadEnv('all', process.cwd(), '');

export default defineConfig({
	plugins: [sveltekit()],
	server: { host: env.HOST, port: parseInt(env.PORT), strictPort: true }
});
