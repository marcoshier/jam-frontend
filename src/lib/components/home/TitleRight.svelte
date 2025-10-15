<script>
	import { postsById } from "$lib/stores/posts";
	import { hoveredType, hoveredId } from "$lib/stores/ui";

    const { overridePostTitle, opacity } = $props();

    const postTitle = $derived(
        overridePostTitle ?? (
            $hoveredType == "b" 
                ? $postsById.get($hoveredId)?.title 
                : "POSTS"
        )
    )
</script>


<h1 class="center-title">{postTitle}</h1>