// src/context/SearchContext.ts
import { writable } from 'svelte/store';

// Create a writable store for the search term
export const searchTerm = writable<string>('');
