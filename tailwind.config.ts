import type { Config } from 'tailwindcss'

/**
 * @file Tailwind CSS configuration for South Italian Museum
 * @description Defines a culturally-inspired design system reflecting Southern Italian heritage
 * 
 * Design Philosophy:
 * - Colors inspired by Mediterranean landscapes, ancient architecture, and regional art
 * - Typography that balances modern readability with Italian design elegance
 * - Spacing and proportions that reflect classical Italian architectural principles
 * 
 * Cultural References:
 * - Terracotta: Traditional pottery and roof tiles of Southern Italy
 * - Stone colors: Lecce stone, travertine, and limestone common in the region
 * - Mediterranean blues: The deep blues of the Ionian and Tyrrhenian seas
 * - Olive tones: The ancient olive groves of Puglia and Calabria
 * 
 * @dependencies
 * - @tailwindcss/forms: Enhanced form styling
 * - @tailwindcss/typography: Rich prose content styling
 * - @tailwindcss/aspect-ratio: For artwork and exhibition image ratios
 * 
 * @notes
 * - Optimized for museum exhibitions, artifact displays, and cultural content
 * - Includes custom animations for interactive museum elements
 * - Responsive breakpoints consider both desktop kiosks and mobile visitors
 */

const config: Config = {
    content: [
        './src/**/*.{html,js,svelte,ts}',
        './node_modules/@project-name/ui/**/*.{js,ts,svelte}',
        './src/lib/components/**/*.{svelte,ts}',
        './src/routes/**/*.{svelte,ts}'
    ],

    theme: {
        extend: {
            colors: {
                // Primary palette inspired by Southern Italian heritage
                primary: {
                    50: '#eff6ff',
                    100: '#dbeafe',
                    200: '#bfdbfe',
                    300: '#93c5fd',
                    400: '#60a5fa',
                    500: '#2563eb', // Deep Mediterranean blue
                    600: '#1d4ed8',
                    700: '#1e40af',
                    800: '#1e3a8a',
                    900: '#1e3a8a',
                    950: '#172554'
                },

                // Secondary - Warm stone tones
                secondary: {
                    50: '#faf8f5',
                    100: '#f2ede4',
                    200: '#e6d7c3',
                    300: '#d4bc96',
                    400: '#c19b69',
                    500: '#a0806b', // Lecce stone
                    600: '#8b6f5b',
                    700: '#735c4c',
                    800: '#5f4d42',
                    900: '#4f4038',
                    950: '#2a221c'
                },

                // Accent - Tuscan gold
                accent: {
                    50: '#fffbeb',
                    100: '#fef3c7',
                    200: '#fde68a',
                    300: '#fcd34d',
                    400: '#fbbf24',
                    500: '#d69e2e', // Tuscan gold
                    600: '#b45309',
                    700: '#92400e',
                    800: '#78350f',
                    900: '#451a03',
                    950: '#292524'
                },

                // Terracotta - Traditional Italian pottery
                terracotta: {
                    50: '#fef7f0',
                    100: '#feecdc',
                    200: '#fcd9bd',
                    300: '#fdba8c',
                    400: '#ff8a4c',
                    500: '#cd853f', // Classic terracotta
                    600: '#c2410c',
                    700: '#9a3412',
                    800: '#7c2d12',
                    900: '#431407',
                    950: '#292524'
                },

                // Olive - Ancient groves of the South
                olive: {
                    50: '#f7f8f3',
                    100: '#eef0e5',
                    200: '#dde2cc',
                    300: '#c4d0a8',
                    400: '#a8ba7f',
                    500: '#6b7c32', // Olive green
                    600: '#5a6b2a',
                    700: '#4a5623',
                    800: '#3d471f',
                    900: '#343c1e',
                    950: '#1a200e'
                },

                // Supporting colors
                cream: {
                    50: '#fefdf9',
                    100: '#fef5e7', // Warm cream
                    200: '#fde8c8',
                    300: '#fbd38d',
                    400: '#f6ad55',
                    500: '#ed8936',
                    600: '#dd6b20',
                    700: '#c05621',
                    800: '#9c4221',
                    900: '#7b341e',
                    950: '#42180f'
                },

                // Neutral grays with warm undertones
                neutral: {
                    50: '#fafaf9',
                    100: '#f5f5f4',
                    200: '#e7e5e4',
                    300: '#d6d3d1',
                    400: '#a8a29e',
                    500: '#78716c',
                    600: '#57534e',
                    700: '#44403c',
                    800: '#292524',
                    900: '#1c1917',
                    950: '#0c0a09'
                },

                // Status colors with Italian flair
                success: '#22c55e',
                warning: '#f59e0b',
                error: '#ef4444',
                info: '#3b82f6',

                // Background variants
                background: {
                    DEFAULT: '#fefdf9', // Warm white
                    secondary: '#f8f7f4', // Subtle warm gray
                    dark: '#2d3748' // Sophisticated dark
                }
            },

            fontFamily: {
                // Elegant serif for headings - inspired by Italian typography
                heading: ['Playfair Display', 'Crimson Text', 'Georgia', 'serif'],
                // Clean sans-serif for body text with Italian character
                body: ['Inter', 'Open Sans', 'Helvetica Neue', 'sans-serif'],
                // Monospace for code and technical content
                mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
                // Special display font for museum titles
                display: ['Cinzel', 'Playfair Display', 'serif']
            },

            fontSize: {
                // Enhanced typography scale for museum content
                'xs': ['0.75rem', { lineHeight: '1rem' }],
                'sm': ['0.875rem', { lineHeight: '1.25rem' }],
                'base': ['1rem', { lineHeight: '1.5rem' }],
                'lg': ['1.125rem', { lineHeight: '1.75rem' }],
                'xl': ['1.25rem', { lineHeight: '1.75rem' }],
                '2xl': ['1.5rem', { lineHeight: '2rem' }],
                '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
                '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
                '5xl': ['3rem', { lineHeight: '1.2' }],
                '6xl': ['3.75rem', { lineHeight: '1.1' }],
                '7xl': ['4.5rem', { lineHeight: '1.1' }],
                '8xl': ['6rem', { lineHeight: '1' }],
                '9xl': ['8rem', { lineHeight: '1' }],
                // Custom sizes for museum displays
                'exhibit': ['2.5rem', { lineHeight: '1.2' }],
                'artifact': ['1.375rem', { lineHeight: '1.6' }]
            },

            spacing: {
                // Additional spacing values for museum layouts
                '18': '4.5rem',
                '22': '5.5rem',
                '26': '6.5rem',
                '30': '7.5rem',
                '34': '8.5rem',
                '38': '9.5rem',
                // Museum-specific spacing
                'card': '1.5rem',
                'section': '3rem',
                'exhibit': '4rem'
            },

            borderRadius: {
                // Organic, Mediterranean-inspired border radius
                'soft': '0.375rem',
                'medium': '0.75rem',
                'large': '1rem',
                'xl': '1.25rem',
                '2xl': '1.5rem',
                // Custom museum element radius
                'artifact': '0.5rem',
                'card': '0.75rem'
            },

            boxShadow: {
                // Soft, warm shadows inspired by Mediterranean light
                'soft': '0 2px 4px 0 rgba(0, 0, 0, 0.05)',
                'medium': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                'large': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                'warm': '0 4px 14px 0 rgba(205, 133, 63, 0.15)',
                'exhibit': '0 8px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -5px rgba(0, 0, 0, 0.04)'
            },

            animation: {
                // Gentle animations for museum interactions
                'fade-in': 'fadeIn 0.5s ease-in-out',
                'slide-up': 'slideUp 0.4s ease-out',
                'scale-in': 'scaleIn 0.3s ease-out',
                'float': 'float 3s ease-in-out infinite',
                'pulse-soft': 'pulseSoft 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            },

            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' }
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' }
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' }
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-5px)' }
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.8' }
                }
            },

            backdropBlur: {
                xs: '2px'
            },

            // Museum-specific breakpoints
            screens: {
                'xs': '475px',
                'kiosk': '1280px', // For museum kiosk displays
                'wall': '1920px'   // For wall-mounted displays
            }
        },
    },

    plugins: [
        require('@tailwindcss/forms')({
            strategy: 'class'
        }),
        require('@tailwindcss/typography')({
            target: 'modern'
        }),
        require('@tailwindcss/aspect-ratio')
    ],

    // Optimize for production
    future: {
        hoverOnlyWhenSupported: true,
    }
}

export default config