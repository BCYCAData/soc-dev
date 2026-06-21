import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';
const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

export default ts.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node
			}
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],

		languageOptions: {
			parserOptions: {
				parser: ts.parser
			}
		}
	},
	{
		// TypeScript performs its own undefined-symbol analysis (and handles ambient
		// globals/type namespaces like Leaflet's `L` and `GeoJSON`). The core
		// `no-undef` rule produces false positives here, so typescript-eslint
		// recommends disabling it for TS-typed files.
		files: ['**/*.ts', '**/*.tsx', '**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		rules: {
			'no-undef': 'off',
			// Allow underscore-prefixed names as intentional unused placeholders
			// (e.g. `.map((_, i) => …)`, `catch (_e)`), per typescript-eslint convention.
			'@typescript-eslint/no-unused-vars': [
				'error',
				{
					argsIgnorePattern: '^_',
					varsIgnorePattern: '^_',
					caughtErrorsIgnorePattern: '^_'
				}
			]
		}
	}
);
