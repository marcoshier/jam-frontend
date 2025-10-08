<script>
	import { animationState } from "$lib/draw/anim.svelte";
	import { postsById } from "$lib/stores/posts";
	import { projectsById } from "$lib/stores/projects";
	import { hoveredType, hoveredId } from "$lib/stores/ui";

    const { 
        overrideProjectTitle, 
        overridePostsTitle,
        opacityLeft,
        opacityRight
     } = $props();

    const postsTitle = $derived(
        overridePostsTitle ?? (
            $hoveredType == "b" 
                ? $postsById.get($hoveredId)?.title 
                : "POSTS"
        )
    )

    const projectTitle = $derived(
        overrideProjectTitle ?? (
            $hoveredType == "p" 
                ? $projectsById.get($hoveredId)?.title 
                : "PROJECTS"
        )
    )
</script>

<div id="section-container">
    <section id="projects-view" class="view" style:opacity={opacityLeft}>
        <h1>{projectTitle}</h1>
    </section>

    <section id="blog-view" class="view" style:opacity={opacityRight}>
        <h1>{postsTitle}</h1>
    </section>
</div>

<style scoped>
    #section-container {
        position: absolute;
        top: 0;
        left: 0;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-content: center;
    }

    .view {
        width: 50%;
        height: 100%;
        align-content: center;
    }

    .view h1 {
        width: 100%;
        text-align: center;
        font-family: 'Inter';
        font-size: 1.85rem;
        font-weight: 400;
        color: black;
    }
</style>