<script>
	import { projectsById } from "$lib/stores/projects";
	import { hoveredType, hoveredId } from "$lib/stores/ui";

    const { overrideProjectTitle, opacity } = $props();

    const projectTitle = $derived(
        overrideProjectTitle ?? (
            $hoveredType == "p" 
                ? $projectsById.get($hoveredId)?.title 
                : "PROJECTS"
        )
    )
</script>

<h1 class="center-title">{projectTitle}</h1>

<style>
    :global(.center-title) {
        width: 100%;
        text-align: center;
        font-family: 'Inter';
        font-size: 1.85rem;
        font-weight: 400;
        color: black;
    }
</style>