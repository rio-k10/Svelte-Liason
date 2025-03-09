<script>
	export let post;
	export let onDelete;
</script>

<li class="flex items-center justify-between rounded border bg-white p-4 shadow-md">
	<div>
		<h3 class="font-semibold text-blue-600">{post.title}</h3>
		<p class="text-sm text-gray-600">{post.body}</p>
	</div>
	<button
		on:click={() => onDelete(post.id)}
		role="button"
		class="rounded bg-red-500 px-4 py-2 text-white transition hover:bg-red-600"
	>
		Remove
	</button>
</li>
