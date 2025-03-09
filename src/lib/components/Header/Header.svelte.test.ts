import { describe, it, vi, expect } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent } from '@testing-library/svelte';
import Header from '$lib/components/Header/Header.svelte';
import { writable, get } from 'svelte/store';

describe('Header Component', () => {
	it('should render the search input', () => {
		render(Header, { context: new Map([['searchTerm', writable('')]]) });
		expect(screen.getByPlaceholderText('Search posts...')).toBeInTheDocument();
	});

	it('should update the searchTerm context when typing in the input', async () => {
		const searchTerm = writable('');
		render(Header, { context: new Map([['searchTerm', searchTerm]]) });

		const input = screen.getByPlaceholderText('Search posts...');
		await fireEvent.input(input, { target: { value: 'test search' } });

		expect(get(searchTerm)).toBe('test search');
	});

	it('should log an error if searchTerm context is not available', async () => {
		const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

		render(Header, { context: new Map() }); // No searchTerm context provided

		const input = screen.getByPlaceholderText('Search posts...');
		await fireEvent.input(input, { target: { value: 'test search' } });

		expect(consoleErrorSpy).toHaveBeenCalledWith('searchTerm context is not available.');

		consoleErrorSpy.mockRestore();
	});
});
