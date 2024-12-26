import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [sveltekit()],
	css: {
		postcss: './postcss.config.js',
		devSourcemap: true
	},
	optimizeDeps: {
		include: ['leaflet', '@geoman-io/leaflet-geoman-free']
	}
});
