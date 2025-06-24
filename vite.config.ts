/**
 * @file Vite configuration for the Zungri Museum application
 * @purpose Configures Vite build tool with SvelteKit, Tailwind CSS, and Paraglide i18n
 * 
 * @dependencies
 * - @tailwindcss/vite: Tailwind CSS integration
 * - @sveltejs/kit/vite: SvelteKit integration
 * - @inlang/paraglide-vite: Paraglide i18n build plugin
 * - vite: Core build tool
 * 
 * @notes
 * - Paraglide generates files in src/lib/paraglide based on project.inlang
 * - Optimized for development with HMR and external dependencies
 * - Configured for museum-specific requirements (maps, leaflet)
 */

import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { paraglideVitePlugin } from '@inlang/paraglide-js';
import { defineConfig } from 'vite';
import path from 'path';

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		paraglideVitePlugin({
			project: './project.inlang',
			outdir: './src/lib/paraglide',
			strategy: ['url', 'cookie', 'baseLocale']
		})
	],
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