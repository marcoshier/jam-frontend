<script>
	import { animationState } from "$lib/draw/anim.svelte";
	import { projectImages } from "$lib/stores/media";
	import { projects, projectsById } from "$lib/stores/projects";
	import { selectedId, scrollYprojects } from "$lib/stores/ui";
	import { onMount } from "svelte";
	import { get } from "svelte/store";

	const currentProject = $derived($projectsById.get($selectedId));
	
	let containerRef;
	let scrollContainerRef;
	let maxScroll = $state(0);

	$effect(() => {
		if (scrollContainerRef && containerRef) {
			// Calculate max scroll: total content height - viewport height
			const contentHeight = scrollContainerRef.scrollHeight;
			const viewportHeight = containerRef.clientHeight;
			maxScroll = Math.max(0, contentHeight - viewportHeight);
		}
	});

	// Clamp scrollYprojects to maxScroll
	$effect(() => {
		if ($scrollYprojects > maxScroll) {
			scrollYprojects.set(maxScroll);
		}
	});
</script>

<div class="project-gallery-container" style:opacity="{animationState.imageT}" bind:this={containerRef}>
	{#if currentProject}
		<div class="project-gallery-scroll" style:margin-top={-($scrollYprojects + 1) + "px"} bind:this={scrollContainerRef}>
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
		height: 100vh; /* Set explicit height for viewport */
		width: 50%;
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