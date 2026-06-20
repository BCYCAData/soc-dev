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
	esbuild: {
		// Strip debug logging from production bundles (client + server): minification
		// in `vite build` drops these side-effect-free `pure` calls. console.warn and
		// console.error are intentionally kept for real error logging, and dev builds
		// (unminified) keep all console output.
		pure: ['console.log', 'console.debug', 'console.info']
	},
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
