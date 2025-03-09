<script lang="ts">
	import { setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	const searchTerm: Writable<string> = writable('');
	setContext('searchTerm', searchTerm);
</script>

<slot />
