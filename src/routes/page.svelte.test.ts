import { describe, it, beforeEach, afterEach, vi, expect, type Mock } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/svelte';
import userEvent from '@testing-library/user-event';
import App from './+page.svelte';
import { writable } from 'svelte/store';

// Use vi.stubGlobal to mock fetch properly
vi.stubGlobal('fetch', vi.fn());

const mockPostsPage1 = [
	{ id: 1, title: 'Mock Title 1', body: 'Mock Body 1' },
	{ id: 2, title: 'Mock Title 2', body: 'Mock Body 2' }
];

const mockPostsPage2 = [
	{ id: 3, title: 'Mock Title 3', body: 'Mock Body 3' },
	{ id: 4, title: 'Mock Title 4', body: 'Mock Body 4' }
];
const mockFetch = fetch as Mock;

describe('App Component', () => {
	beforeEach(() => {
		mockFetch.mockImplementation(async (url: string) => {
			// Simulate a delay for the fetch
			await new Promise((resolve) => setTimeout(resolve, 100));

			if (url.includes('_page=1')) {
				return Promise.resolve({
					ok: true,
					json: async () => mockPostsPage1
				});
			}
			if (url.includes('_page=2')) {
				return Promise.resolve({
					ok: true,
					json: async () => mockPostsPage2
				});
			}
			return Promise.resolve({ ok: false });
		});
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	describe('Rendering', () => {
		it('should render the search input', async () => {
			render(App, { context: new Map([['searchTerm', writable('')]]) });
			expect(screen.getByPlaceholderText('Search posts...')).toBeInTheDocument();
		});

		it('should render the loader while fetching posts', async () => {
			render(App, { context: new Map([['searchTerm', writable('')]]) });
			expect(screen.getByTestId('loader')).toBeInTheDocument();
			await waitFor(() => expect(screen.queryByTestId('loader')).not.toBeInTheDocument());
		});

		it('should render posts after fetching', async () => {
			render(App, { context: new Map([['searchTerm', writable('')]]) });
			await waitFor(() => {
				expect(screen.getByText('Mock Title 1')).toBeInTheDocument();
				expect(screen.getByText('Mock Title 2')).toBeInTheDocument();
			});
		});
	});

	describe('Functionality', () => {
		it('should handle fetch failure gracefully', async () => {
			mockFetch.mockResolvedValueOnce({ ok: false });
			render(App, { context: new Map([['searchTerm', writable('')]]) });
			await waitFor(() =>
				expect(
					screen.getByText('Unable to load posts. Please try again later.')
				).toBeInTheDocument()
			);
		});

		it('should allow searching posts', async () => {
			render(App, { context: new Map([['searchTerm', writable('')]]) });
			await waitFor(() => {
				expect(screen.getByText('Mock Title 1')).toBeInTheDocument();
				expect(screen.getByText('Mock Title 2')).toBeInTheDocument();
			});

			const searchInput = screen.getByPlaceholderText('Search posts...');
			await userEvent.type(searchInput, 'Title 2');

			await waitFor(() => {
				expect(screen.queryByText('Mock Title 1')).not.toBeInTheDocument();
				expect(screen.getByText('Mock Title 2')).toBeInTheDocument();
			});
		});

		it('should allow removing posts', async () => {
			render(App, { context: new Map([['searchTerm', writable('')]]) });
			await waitFor(() => expect(screen.getByText('Mock Title 1')).toBeInTheDocument());

			const removeButton = screen.getAllByRole('button', { name: /remove/i })[0];
			await userEvent.click(removeButton);

			await waitFor(() => expect(screen.queryByText('Mock Title 1')).not.toBeInTheDocument());
		});

		it('should fetch more posts when scrolling to the bottom', async () => {
			render(App, { context: new Map([['searchTerm', writable('')]]) });
			await waitFor(() => {
				expect(screen.getByText('Mock Title 1')).toBeInTheDocument();
				expect(screen.getByText('Mock Title 2')).toBeInTheDocument();
			});

			const postListDiv = screen.getByTestId('post-list');
			await fireEvent.scroll(postListDiv, { target: { scrollTop: 1000 } });

			await waitFor(() => {
				expect(screen.getByText('Mock Title 3')).toBeInTheDocument();
				expect(screen.getByText('Mock Title 4')).toBeInTheDocument();
			});
		});
	});
});
