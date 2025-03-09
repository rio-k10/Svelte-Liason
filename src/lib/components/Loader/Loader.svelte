<script>
  export let size = 8;
</script>

<div class='flex justify-center items-center' role='status' data-testid='loader'>
  <div
    class='border-4 border-blue-600 border-t-transparent rounded-full animate-spin'
    style='width: {size}rem; height: {size}rem;'
  ></div>
  <span class='sr-only'>Loading...</span>
</div>