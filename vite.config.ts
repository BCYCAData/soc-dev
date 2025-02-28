import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	build: {
		sourcemap: true
	},
	css: {
		postcss: './postcss.config.js',
		devSourcemap: true
	},
	optimizeDeps: {
		include: ['leaflet']
	}
});
