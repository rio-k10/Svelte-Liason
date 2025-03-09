import { describe, it, expect, vi } from 'vitest';
import '@testing-library/jest-dom/vitest';
import { render, fireEvent } from '@testing-library/svelte';
import PostItem from './PostItem.svelte';

describe('PostItem Component', () => {
	const mockPost = {
		id: 1,
		title: 'Test Title',
		body: 'Test Body'
	};

	const mockOnDelete = vi.fn(); // Mock function for onDelete

	describe('Rendering', () => {
		it('should render the post title and body', () => {
			const { getByText } = render(PostItem, { post: mockPost, onDelete: mockOnDelete });

			// Check if the title and body are rendered
			expect(getByText('Test Title')).toBeInTheDocument();
			expect(getByText('Test Body')).toBeInTheDocument();
		});

		it('should render the "Remove" button', () => {
			const { getByRole } = render(PostItem, { post: mockPost, onDelete: mockOnDelete });

			// Check if the "Remove" button is rendered
			const removeButton = getByRole('button', { name: /remove/i });
			expect(removeButton).toBeInTheDocument();
		});
	});
	describe('Functionality', () => {
		it('should call onDelete with the post id when the "Remove" button is clicked', async () => {
			const { getByRole } = render(PostItem, { post: mockPost, onDelete: mockOnDelete });

			// Click the "Remove" button
			const removeButton = getByRole('button', { name: /remove/i });
			await fireEvent.click(removeButton);

			// Check if onDelete was called with the correct post id
			expect(mockOnDelete).toHaveBeenCalledWith(mockPost.id);
		});
	});
});
