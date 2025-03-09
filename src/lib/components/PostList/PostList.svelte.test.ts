import { describe, it, vi, expect, beforeEach } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, fireEvent, screen } from '@testing-library/svelte';
import { tick } from 'svelte';
import PostList from './PostList.svelte';
import { writable } from 'svelte/store';
import type { Post } from '$lib/types/App';

describe('PostList Component', () => {
	const mockPosts: Post[] = [
		{ id: 1, title: 'Test Title 1', body: 'Test Body 1' },
		{ id: 2, title: 'Test Title 2', body: 'Test Body 2' }
	];

	const mockSetPosts = vi.fn();
	const mockLoadMorePosts = vi.fn();
	const mockLoading = false;
	const mockSearchTerm = writable('');

	beforeEach(() => {
		mockSetPosts.mockClear();
		mockLoadMorePosts.mockClear();
	});

	it('should render the list of posts', () => {
		render(PostList, {
			props: {
				posts: mockPosts,
				setPosts: mockSetPosts,
				loadMorePosts: mockLoadMorePosts,
				loading: mockLoading
			},
			context: new Map([['searchTerm', mockSearchTerm]])
		});

		expect(screen.getByText('Test Title 1')).toBeInTheDocument();
		expect(screen.getByText('Test Body 1')).toBeInTheDocument();
		expect(screen.getByText('Test Title 2')).toBeInTheDocument();
		expect(screen.getByText('Test Body 2')).toBeInTheDocument();
	});

	it('should filter posts based on the search term', async () => {
		render(PostList, {
			props: {
				posts: mockPosts,
				setPosts: mockSetPosts,
				loadMorePosts: mockLoadMorePosts,
				loading: mockLoading
			},
			context: new Map([['searchTerm', mockSearchTerm]])
		});

		mockSearchTerm.set('Title 1');
		await tick();

		expect(screen.getByText('Test Title 1')).toBeInTheDocument();
		expect(screen.queryByText('Test Title 2')).not.toBeInTheDocument();
	});

	it('should call loadMorePosts when scrolling to the bottom', async () => {
		const { getByTestId } = render(PostList, {
			props: {
				posts: mockPosts,
				setPosts: mockSetPosts,
				loadMorePosts: mockLoadMorePosts,
				loading: mockLoading
			},
			context: new Map([['searchTerm', mockSearchTerm]])
		});

		const postListDiv = getByTestId('post-list');
		Object.defineProperty(postListDiv, 'scrollHeight', { value: 1000 });
		Object.defineProperty(postListDiv, 'scrollTop', { value: 900 });
		Object.defineProperty(postListDiv, 'clientHeight', { value: 100 });

		await fireEvent.scroll(postListDiv);

		expect(mockLoadMorePosts).toHaveBeenCalled();
	});

	it('should display the loader when loading is true', () => {
		render(PostList, {
			props: {
				posts: mockPosts,
				setPosts: mockSetPosts,
				loadMorePosts: mockLoadMorePosts,
				loading: true // Set loading to true
			},
			context: new Map([['searchTerm', mockSearchTerm]])
		});

		expect(screen.getByTestId('loader')).toBeInTheDocument();
	});

	it('should display "No posts found" when there are no filtered posts', async () => {
		render(PostList, {
			props: {
				posts: [],
				setPosts: mockSetPosts,
				loadMorePosts: mockLoadMorePosts,
				loading: mockLoading
			},
			context: new Map([['searchTerm', mockSearchTerm]])
		});

		mockSearchTerm.set('Non-existent Title');
		await tick();

		expect(screen.getByText('No posts found.')).toBeInTheDocument();
	});

	it('should call setPosts when a post is deleted', async () => {
		render(PostList, {
			props: {
				posts: mockPosts,
				setPosts: mockSetPosts,
				loadMorePosts: mockLoadMorePosts,
				loading: mockLoading
			},
			context: new Map([['searchTerm', mockSearchTerm]])
		});

		mockSearchTerm.set('');
		await tick();

		const removeButtons = screen.getAllByRole('button', { name: /remove/i });
		expect(removeButtons).toHaveLength(mockPosts.length);

		await fireEvent.click(removeButtons[0]);
		expect(mockSetPosts).toHaveBeenCalledWith([mockPosts[1]]);
	});
});
