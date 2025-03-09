<script lang="ts">
	import '../app.css';
	import { onMount } from 'svelte';
	import Loader from '$lib/components/Loader/Loader.svelte';
	import Header from '$lib/components/Header/Header.svelte';
	import { writable } from 'svelte/store';
	import PostList from '$lib/components/PostList/PostList.svelte';
	import type { Post } from '$lib/types/App';

	// Store definitions
	const posts = writable<Post[]>([]);
	let loading = false; // Track loading separately
	const error = writable<string | null>(null);
	const page = writable<number>(1);

	// Fetch posts function
	async function fetchPosts(pageNumber: number) {
		if (loading) return;
		loading = true;

		try {
			const response = await fetch(
				`https://jsonplaceholder.typicode.com/posts?_page=${pageNumber}`
			);
			if (!response.ok) throw new Error('Failed to fetch posts');

			const data: Post[] = await response.json();
			posts.update((prev) => [...prev, ...data]);
			error.set(null);
		} catch (err) {
			console.error(err);
			error.set('Unable to load posts. Please try again later.');
		} finally {
			loading = false;
		}
	}

	onMount(() => {
		fetchPosts(1);
	});

	async function loadMorePosts() {
		let currentPage = 0;
		page.subscribe((value) => (currentPage = value))();

		const nextPage = currentPage + 1;
		await fetchPosts(nextPage);

		page.set(nextPage); // Only update if fetch was successful
	}

	// Define setPosts function to update posts
	const setPosts = (newPosts: Post[]) => {
		posts.set(newPosts); // This will update the posts store
	};
</script>

<div class="flex h-screen flex-col bg-blue-50">
	<div class="sticky top-0 z-10 bg-white shadow-md">
		<Header />
	</div>
	<div class="flex-1 overflow-y-auto">
		{#if $error}
			<p class="h-full text-center text-red-500">{$error}</p>
		{/if}
		{#if loading && $posts.length === 0}
			<div class="flex h-full items-center justify-center">
				<Loader />
			</div>
		{:else}
			<PostList posts={$posts} {setPosts} {loadMorePosts} {loading} />
		{/if}
	</div>
</div>
