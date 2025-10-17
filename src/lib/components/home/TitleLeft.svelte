<script>
	import { animationState } from "$lib/draw/anim.svelte";
	import { projectsById } from "$lib/stores/projects";
	import { hoveredType, hoveredId } from "$lib/stores/ui";
	import { onMount } from "svelte";

    const { overrideProjectTitle, overrideOpacity } = $props();

    const projectTitle = $derived(
        overrideProjectTitle ?? (
            $hoveredType == "p" 
                ? $projectsById.get($hoveredId)?.title 
                : "PROJECTS"
        )
    )
</script>

<h1 class="center-title" style:opacity={ overrideOpacity ?? animationState.loaderT * (1.0 - animationState.selectionT) }>
    {projectTitle}
</h1>

<style>
    :global(.center-title) {
        text-align: center;
        font-family: 'Schflooze';
        font-size: 1.85rem;
        font-weight: 400;
        color: black;
        display: block;
        background: white;
        border-radius: 10px;
        margin: 0 auto;
        padding: 0 15px;
        width: fit-content;
        cursor: pointer;
    }
</style>