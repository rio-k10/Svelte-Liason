import { describe, it, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render } from '@testing-library/svelte';
import Loader from './Loader.svelte';

describe('Loader Component', () => {
	describe('Rendering', () => {
		it('should render the loader with default size', () => {
			const { getByTestId } = render(Loader);
			const loader = getByTestId('loader');

			expect(loader).toBeInTheDocument();

			const spinner = loader.firstChild as HTMLElement;
			expect(spinner).toHaveStyle('width: 8rem; height: 8rem;');
		});

		it('should render the loader with custom size', () => {
			const customSize = 12;
			const { getByTestId } = render(Loader, { size: customSize });
			const loader = getByTestId('loader');
			expect(loader).toBeInTheDocument();
			const spinner = loader.firstChild as HTMLElement;
			expect(spinner).toHaveStyle(`width: ${customSize}rem; height: ${customSize}rem;`);
		});
	});

	it('should have the correct accessibility attributes', () => {
		const { getByTestId, getByText } = render(Loader);
		const loader = getByTestId('loader');
		expect(loader).toHaveAttribute('role', 'status');

		const srOnlyText = getByText('Loading...');
		expect(srOnlyText).toHaveClass('sr-only');
	});
});
