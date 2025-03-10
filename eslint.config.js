import prettier from 'eslint-config-prettier';
import js from '@eslint/js';
import { includeIgnoreFile } from '@eslint/compat';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import { fileURLToPath } from 'node:url';
import ts from 'typescript-eslint';
import svelteConfig from './svelte.config.js';
import cypress from 'eslint-plugin-cypress'; // Import Cypress plugin

const gitignorePath = fileURLToPath(new URL('./.gitignore', import.meta.url));

// Helper function to convert globals object to ESLint format
const toEslintGlobals = (globalsObj, access = 'readonly') => {
	return Object.fromEntries(Object.keys(globalsObj).map((key) => [key, access]));
};

export default ts.config(
	includeIgnoreFile(gitignorePath),
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs.recommended,
	prettier,
	...svelte.configs.prettier,
	{
		languageOptions: {
			globals: {
				...toEslintGlobals(globals.browser), // Convert browser globals
				...toEslintGlobals(globals.node) // Convert Node.js globals
			}
		}
	},
	{
		files: ['**/*.svelte', '**/*.svelte.ts', '**/*.svelte.js'],
		ignores: ['eslint.config.js', 'svelte.config.js'],
		languageOptions: {
			parserOptions: {
				projectService: true,
				extraFileExtensions: ['.svelte'],
				parser: ts.parser,
				svelteConfig
			}
		}
	},
	// Add Cypress-specific configuration
	{
		files: ['cypress/**/*.js', 'cypress/**/*.ts'], // Apply to Cypress files
		plugins: {
			cypress // Enable Cypress plugin
		},
		languageOptions: {
			globals: {
				...toEslintGlobals(cypress.environments.globals) // Add Cypress globals
			}
		},
		rules: {
			// Add any Cypress-specific rules here
			'cypress/no-unnecessary-waiting': 'error' // Example rule
		}
	}
);
