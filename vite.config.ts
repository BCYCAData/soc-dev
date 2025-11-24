import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	server: {
		watch: {
			usePolling: true,
			interval: 1000
		}
	},
	plugins: [tailwindcss(), sveltekit()],
	build: {
		sourcemap: true
	},
	css: {
		devSourcemap: true
	},
	optimizeDeps: {
		include: ['leaflet']
	}
});
