import type { CustomThemeConfig } from '@skeletonlabs/tw-plugin';

export const soc_theme: CustomThemeConfig = {
	name: 'soc_theme',
	properties: {
		/* =~= Theme Styles =~= */
		"--theme-border-base": "1px",
		// "--theme-font-family-base": 'system-ui',
		"--theme-font-family-base": "'Inter', 'Poppins', 'system-ui', 'ui-sans-serif', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'NotoSans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', 'Arial'",
		"--theme-font-family-heading": "'Inter', 'Poppins', 'system-ui', 'ui-sans-serif', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Helvetica Neue', 'Arial', 'NotoSans', 'sans-serif', 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji', 'Arial'",
		// 	"--theme-font-family-base": "Poppins, Inter, ui-sans-serif, system-ui, -apple-system,
		// BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans- serif,
		// 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol', 'Noto Color Emoji'",
		/* "--theme-font-family-base" : "'Poppins'", */
		"--theme-font-color-base": "var(--color- surface - 900) ",
		"--theme-font-color-dark": "var(--color - surface - 50) ",
		"--theme-rounded-base": "8px",
		"--theme-rounded-container": "8px",
		/* =~= Theme On-X Colors =~= */
		"--on-primary": "#000",
		"--on-secondary": "#fff",
		"--on-tertiary": "#000",
		"--on-success": "0 0 0",
		"--on-warning": "#fff",
		"--on-error": "0 0 0",
		"--on-surface": "#fff",
		/* =~= Theme Colors | Tailwind =~= */
		/* orange | #f97316 */
		"--color-primary-50": "255 247 237", /* ⬅ #fff7ed */
		"--color-primary-100": "255 237 213", /* ⬅ #ffedd5 */
		"--color-primary-200": "254 215 170", /* ⬅ #fed7aa */
		"--color-primary-300": "253 186 116", /* ⬅ #fdba74 */
		"--color-primary-400": "251 146 60", /* ⬅ #fb923c */
		"--color-primary-500": "249 115 22", /* ⬅ #f97316 */
		"--color-primary-600": "234 88 12", /* ⬅ #ea580c */
		"--color-primary-700": "194 65 12", /* ⬅ #c2410c */
		"--color-primary-800": "154 52 18", /* ⬅ #9a3412 */
		"--color-primary-900": "124 45 18", /* ⬅ #7c2d12 */
		/* amber | #f59e0b */
		"--color-secondary-50": "255 251 235", /* ⬅ #fffbeb */
		"--color-secondary-100": "254 243 199", /* ⬅ #fef3c7 */
		"--color-secondary-200": "253 230 138", /* ⬅ #fde68a */
		"--color-secondary-300": "252 211 77", /* ⬅ #fcd34d */
		"--color-secondary-400": "251 191 36", /* ⬅ #fbbf24 */
		"--color-secondary-500": "245 158 11", /* ⬅ #f59e0b */
		"--color-secondary-600": "217 119 6", /* ⬅ #d97706 */
		"--color-secondary-700": "180 83 9", /* ⬅ #b45309 */
		"--color-secondary-800": "146 64 14", /* ⬅ #92400e */
		"--color-secondary-900": "120 53 15", /* ⬅ #78350f */
		/* sky | #0ea5e9 */
		"--color-tertiary-50": "240 249 255", /* ⬅ #f0f9ff */
		"--color-tertiary-100": "224 242 254", /* ⬅ #e0f2fe */
		"--color-tertiary-200": "186 230 253", /* ⬅ #bae6fd */
		"--color-tertiary-300": "125 211 252", /* ⬅ #7dd3fc */
		"--color-tertiary-400": "56 189 248", /* ⬅ #38bdf8 */
		"--color-tertiary-500": "14 165 233", /* ⬅ #0ea5e9 */
		"--color-tertiary-600": "2 132 199", /* ⬅ #0284c7 */
		"--color-tertiary-700": "3 105 161", /* ⬅ #0369a1 */
		"--color-tertiary-800": "7 89 133", /* ⬅ #075985 */
		"--color-tertiary-900": "12 74 110", /* ⬅ #0c4a6e */
		/* green | #09ec23 */
		"--color-success-50": "218 252 222", // #dafcde
		"--color-success-100": "206 251 211", // #cefbd3
		"--color-success-200": "194 250 200", // #c2fac8
		"--color-success-300": "157 247 167", // #9df7a7
		"--color-success-400": "83 242 101", // #53f265
		"--color-success-500": "9 236 35", // #09ec23
		"--color-success-600": "8 212 32", // #08d420
		"--color-success-700": "7 177 26", // #07b11a
		"--color-success-800": "5 142 21", // #058e15
		"--color-success-900": "4 116 17", // #047411
		/* red | #ef4444 */
		"--color-error-50": "254 242 242", /* ⬅ #fef2f2 */
		"--color-error-100": "254 226 226", /* ⬅ #fee2e2 */
		"--color-error-200": "254 202 202", /* ⬅ #fecaca */
		"--color-error-300": "252 165 165", /* ⬅ #fca5a5 */
		"--color-error-400": "248 113 113", /* ⬅ #f87171 */
		"--color-error-500": "239 68 68", /* ⬅ #ef4444 */
		"--color-error-600": "220 38 38", /* ⬅ #dc2626 */
		"--color-error-700": "185 28 28", /* ⬅ #b91c1c */
		"--color-error-800": "153 27 27", /* ⬅ #991b1b */
		"--color-error-900": "127 29 29", /* ⬅ #7f1d1d */
		/* purple | #b505f5 */
		"--color-warning-50": "244 218 254", // #f4dafe
		"--color-warning-100": "240 205 253", // #f0cdfd
		"--color-warning-200": "237 193 253", // #edc1fd
		"--color-warning-300": "225 155 251", // #e19bfb
		"--color-warning-400": "203 80 248", // #cb50f8
		"--color-warning-500": "181 5 245", // #b505f5
		"--color-warning-600": "163 5 221", // #a305dd
		"--color-warning-700": "136 4 184", // #8804b8
		"--color-warning-800": "109 3 147", // #6d0393
		"--color-warning-900": "89 2 120", // #590278
		/* stone | #78716c */
		"--color-surface-50": "250 250 249", /* ⬅ #fafaf9 */
		"--color-surface-100": "245 245 244", /* ⬅ #f5f5f4 */
		"--color-surface-200": "231 229 228", /* ⬅ #e7e5e4 */
		"--color-surface-300": "214 211 209", /* ⬅ #d6d3d1 */
		"--color-surface-400": "168 162 158", /* ⬅ #a8a29e */
		"--color-surface-500": "120 113 108", /* ⬅ #78716c */
		"--color-surface-600": "87 83 78", /* ⬅ #57534e */
		"--color-surface-700": "68 64 60", /* ⬅ #44403c */
		"--color-surface-800": "41 37 36", /* ⬅ #292524 */
		"--color-surface-900": "28 25 23", /* ⬅ #1c1917 */
		// }
		// [type = 'checkbox']" : "not(.unstyled)" : "is(" : "not(.input - group *)),
		// 	[type = 'radio']" : "not(.unstyled)" : "is(" : "not(.input - group *)) {
		// 	@apply rounded text - primary - 600 focus" : "ring - primary - 500 checked" : "ring - primary - 500 checked" : "shadow - xl w - 5 h - 5 cursor - pointer,
		// }
		// [type = 'radio']" : "not(.unstyled)" : "is(" : "not(.input - group *)) {
		// 	@apply rounded - token,
		// }
	}
}