import { join } from 'path'
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin'
import { soc_theme } from './src/soc_theme';

import type { Config } from 'tailwindcss'

export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	theme: {
		extend: {},
	},
	plugins: [
		forms,
		typography,
		skeleton({
			themes: {
				custom: [
					soc_theme
				]
			}
		}),
	],
} satisfies Config;
