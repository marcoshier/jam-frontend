<script>
	import { projectImages } from "$lib/stores/media";
    import { projects, projectsById } from "$lib/stores/projects";
    import { selectedId, scrollYprojects } from "$lib/stores/ui";
    import { onMount } from "svelte";
    import { get } from "svelte/store";

    const currentProject = $derived($projectsById.get($selectedId));

</script>

<div class="project-gallery-container">
    {#if currentProject}
        <div class="project-gallery-scroll" style:margin-top={-($scrollYprojects + 1) + "px"}>
            {#each $projectImages.get(currentProject.id) as image}
                <div class="image-container">
                     <img src={image.src} alt="" />
                </div>
            {/each}
        </div>
    {/if}
</div>

<style>
    .project-gallery-container {
        position: absolute;
        height: auto;
        width: 50%;
        top: 0;
    }

    .project-gallery-scroll {
        position: absolute;
        top: 100%;
        width: 100%;
        font-family: 'Schflooze';
        box-sizing: border-box;
    }

    .image-container {
        width: 100%;
        height: auto;
        display: block;
    }

    .image-container:first-child {
        margin-top: 100vh;
    }

    .image-container img {
        width: 100%;
        height: 100%;
        display: block;
    }
</style>