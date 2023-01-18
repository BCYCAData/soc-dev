/** @type {import('tailwindcss').Config} */
module.exports = {
	darkMode: 'class',
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		require('path').join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')
	],
	theme: {
		extend: {
			fontFamily: {
				Poppins: ['Poppins, sans-serif']
			}
		}
	},
	plugins: [
		require('@tailwindcss/forms')({
			// strategy: 'base', // only generate global styles
			strategy: 'class' // only generate classes
		}),
		require('@tailwindcss/typography'),
		require('@tailwindcss/line-clamp'),
		require('@skeletonlabs/skeleton/tailwind/skeleton.cjs')
	]
};
