<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';

	const searchTerm = getContext<Writable<string>>('searchTerm');

	let inputValue: string = '';

	function handleInput(event: Event) {
		const input = event.target as HTMLInputElement;
		inputValue = input.value;
		if (searchTerm) {
			searchTerm.set(inputValue);
		} else {
			console.error('searchTerm context is not available.');
		}
	}
</script>

<div class="flex justify-center p-4">
	<input
		type="text"
		bind:value={inputValue}
		on:input={handleInput}
		placeholder="Search posts..."
		class="w-full max-w-md rounded border px-4 py-2 shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
	/>
</div>
