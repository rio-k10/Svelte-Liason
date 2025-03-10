// import path from 'node:path';
// import { fileURLToPath } from 'node:url';

import { defineWorkspace } from 'vitest/config';

// const dirname =
// 	typeof __dirname !== 'undefined' ? __dirname : path.dirname(fileURLToPath(import.meta.url));

// More info at: https://storybook.js.org/docs/writing-tests/test-addon
export default defineWorkspace([
	'vite.config.ts',
	{
		extends: 'vite.config.ts',
		plugins: [
			// The plugin will run tests for the stories defined in your Storybook config
			// See options at: https://storybook.js.org/docs/writing-tests/test-addon#storybooktest
		],
		test: {}
	}
]);
