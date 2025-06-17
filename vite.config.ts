import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	optimizeDeps: {
		include: ['sveaflet'] // 
	},
	ssr: {
		noExternal: ['sveaflet'] // 
	},
	server: {
		hmr: { overlay: false },
		host: '0.0.0.0', // Listen on all network interfaces
		port: 5173, // Default port; change if needed
		strictPort: true, // Fail if the port is already in use
		fs: {
			// Allow serving files from one level up to the project root
			// and specific paths within node_modules if necessary
			allow: ['..',
				'../../node_modules/.pnpm/sveaflet@0.1.4_@algolia+client-search@5.24.0_leaflet@1.9.4_search-insights@2.17.3_svelte@5.28.2/node_modules/sveaflet'
			]
		}


	},
	resolve: {
		alias: {
			// Alias for the entire src directory
			$src: path.resolve('./src'),
			// Alias specifically for src/api
			$api: path.resolve('./src/api'),
		},
	}
});
