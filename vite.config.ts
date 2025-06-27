/**
 * @file Vite configuration for the Zungri Museum application
 * @purpose Configures Vite build tool with SvelteKit, Tailwind CSS, Paraglide i18n, and FastAPI proxy
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
 * - Proxy configuration for FastAPI backend communication
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
		include: ['sveaflet']
	},

	ssr: {
		noExternal: ['sveaflet']
	},

	server: {
		hmr: { overlay: false },
		host: '0.0.0.0', // Listen on all network interfaces
		port: 5173, // Default port; change if needed
		strictPort: true, // Fail if the port is already in use

		// Fixed proxy configuration for FastAPI backend
		proxy: {
			// Match all API routes including /api/v1/
			'^/api/': {
				target: process.env.VITE_BACKEND_URL || 'http://localhost:8000',
				changeOrigin: true,
				secure: false, // Set to true if using HTTPS in production
				ws: true, // Enable WebSocket proxying if needed
				// Don't rewrite the path - keep /api/v1/ intact
				rewrite: undefined,
				configure: (proxy, options) => {
					proxy.on('error', (err, req, res) => {
						console.error('❌ Proxy error:', err.message);
						console.error('   Request URL:', req.url);
						console.error('   Target:', options.target);
					});

					proxy.on('proxyReq', (proxyReq, req, res) => {
						console.log('🔄 Proxying request:', req.method, req.url);
						console.log('   → Target:', `${options.target}${req.url}`);
					});

					proxy.on('proxyRes', (proxyRes, req, res) => {
						const status = proxyRes.statusCode;
						const statusIcon = status >= 200 && status < 300 ? '✅' :
							status >= 400 ? '❌' : '⚠️';
						console.log(`${statusIcon} Proxy response: ${status} for ${req.url}`);
					});

					// Handle proxy timeout
					proxy.on('proxyReqWs', (proxyReq, req, socket, options, head) => {
						console.log('🔄 WebSocket proxy request:', req.url);
					});
				}
			}
		},

		fs: {
			// Allow serving files from one level up to the project root
			// and specific paths within node_modules if necessary
			allow: [
				'..',
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
		}
	},

	// Environment variable configuration
	define: {
		// Make sure environment variables are available at build time
		__BACKEND_URL__: JSON.stringify(process.env.VITE_BACKEND_URL || 'http://localhost:8000'),
	},

	// Build configuration for production
	build: {
		// Ensure environment variables are included in build
		rollupOptions: {
			external: [],
			output: {
				manualChunks: {
					// Split vendor chunks for better caching
					vendor: ['svelte'],
					api: ['$api/apiClient']
				}
			}
		}
	}
});