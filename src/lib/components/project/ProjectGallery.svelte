<script>
	import { animationState } from "$lib/draw/anim.svelte";
	import { projectImages } from "$lib/stores/media";
	import { projects, projectsById } from "$lib/stores/projects";
	import { selectedId, scrollYprojects } from "$lib/stores/ui";
	import { onMount } from "svelte";
	import { get } from "svelte/store";

	const currentProject = $derived($projectsById.get($selectedId));
</script>

<div class="project-gallery-container" style:opacity="{animationState.imageT}">
	{#if currentProject}
		<div class="project-gallery-scroll">
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
		height: 100vh;
		width: 100%;
		top: 0;
		overflow: hidden; 
	}

	.project-gallery-scroll {
		position: absolute;
		width: 100%;
		font-family: 'Schflooze';
		box-sizing: border-box;
	}

	.image-container {
		width: 100%;
		display: block;
		overflow: hidden;
	}

	.image-container img {
		width: 100%;
		height: auto;
		display: block;
	}

	.image-container:first-child {
		height: 100vh;
	}

	.image-container:first-child img {
		height: 100% !important;
		object-fit: cover;
		object-position: 50% 50%;
	}
</style>