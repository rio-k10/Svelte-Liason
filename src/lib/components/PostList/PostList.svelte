<script lang="ts">
	import { onMount, onDestroy, getContext } from 'svelte';
	import Loader from '../Loader/Loader.svelte';
	import PostItem from '../PostItem/PostItem.svelte';
	import type { Writable } from 'svelte/store';
	import type { Post } from '$lib/types/App';

	const searchTerm = getContext<Writable<string>>('searchTerm');

	export let posts: Post[] = [];
	export let setPosts: (posts: Post[]) => void;
	export let loadMorePosts: () => void;
	export let loading: boolean;

	$: filteredPosts = posts.filter((post) =>
		post.title.toLowerCase().includes($searchTerm.toLowerCase())
	);

	const handleDelete = (id: number) => {
		setPosts(posts.filter((post) => post.id !== id));
	};

	let listRef: HTMLDivElement | null = null;

	const handleScroll = () => {
		if (listRef) {
			const { scrollTop, scrollHeight, clientHeight } = listRef;
			const isPageBottom = scrollTop + clientHeight >= scrollHeight - 10;
			const canLoadMore = isPageBottom && !loading && (!$searchTerm || filteredPosts.length > 0);
			if (canLoadMore) {
				loadMorePosts();
			}
		}
	};

	onMount(() => {
		if (listRef) {
			listRef.addEventListener('scroll', handleScroll);
		}
	});

	onDestroy(() => {
		if (listRef) {
			listRef.removeEventListener('scroll', handleScroll);
		}
	});
</script>

<div bind:this={listRef} data-testid="post-list" class="h-full space-y-4 overflow-y-auto p-4">
	<ul class="grid gap-4">
		{#each filteredPosts as post (post.id)}
			<PostItem {post} onDelete={handleDelete} />
		{/each}
	</ul>

	{#if loading}
		<div class="fixed bottom-0 left-0 w-full bg-transparent pb-7">
			<Loader />
		</div>
	{/if}

	{#if !loading && filteredPosts.length === 0}
		<div class="flex h-full items-center justify-center">
			<p class="text-gray-500">No posts found.</p>
		</div>
	{/if}
</div>
