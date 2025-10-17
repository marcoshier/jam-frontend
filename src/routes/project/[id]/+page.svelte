<script>
	import { fadeInContent } from '$lib/stores/transition.js';
    import { onMount } from 'svelte';

    onMount(() => {
        fadeInContent();
    });
</script>

<!-- <svelte:head>
    <title>{data.project?.title || 'Project'}</title>
</svelte:head> -->
