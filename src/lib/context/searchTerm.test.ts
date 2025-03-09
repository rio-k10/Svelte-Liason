import { describe, it, expect } from 'vitest';
import { searchTerm } from './searchTerm';

describe('SearchContext', () => {
	it('should initialize with an empty string', () => {
		let currentValue: string = '';
		const unsubscribe = searchTerm.subscribe((value) => {
			currentValue = value;
		});

		expect(currentValue).toBe('');
		unsubscribe(); // Clean up the subscription
	});

	it('should update the search term', () => {
		let currentValue: string = '';
		const unsubscribe = searchTerm.subscribe((value) => {
			currentValue = value;
		});

		searchTerm.set('test search');
		expect(currentValue).toBe('test search');
		unsubscribe();
	});

	it('should update the search term using update', () => {
		let currentValue: string = '';
		const unsubscribe = searchTerm.subscribe((value) => {
			currentValue = value;
		});

		searchTerm.update(() => 'updated search');
		expect(currentValue).toBe('updated search');
		unsubscribe();
	});
});
