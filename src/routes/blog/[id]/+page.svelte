<script>
	import { fadeInContent } from '$lib/stores/transition.js';
    import { onMount } from 'svelte';

    let { data } = $props();

    onMount(() => {
        fadeInContent();
    });
</script>

<svelte:head>
    <title>{data.post?.title || 'Post'}</title>
</svelte:head>
