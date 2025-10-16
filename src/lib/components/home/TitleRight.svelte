<script>
	import { animationState } from "$lib/draw/anim.svelte";
	import { postsById } from "$lib/stores/posts";
	import { hoveredType, hoveredId } from "$lib/stores/ui";

    const { overridePostTitle, overrideOpacity } = $props();

    const postTitle = $derived(
        overridePostTitle ?? (
            $hoveredType == "b" 
                ? $postsById.get($hoveredId)?.title 
                : "POSTS"
        )
    )
</script>


<h1 class="center-title" style:opacity={ overrideOpacity ?? animationState.loaderT }>{postTitle}</h1>