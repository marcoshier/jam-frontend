<script>
	import { animationState } from "$lib/draw/anim.svelte";
	import { projectImages } from "$lib/stores/media";
	import { projects, projectsById } from "$lib/stores/projects";
	import { selectedId } from "$lib/stores/ui";
	import { get } from "svelte/store";

	const currentProject = $derived($projectsById.get($selectedId));
</script>

<div class="gallery-section">
	{#if currentProject}
		<div class="gallery-scroll">
			{#each $projectImages.get(currentProject.id) || [] as image}
				<div class="gallery-image">
					<img src={image.src} alt="" />
				</div>
			{/each}
		</div>
	{/if}
</div>

<style>
	.gallery-section {
		width: 100%;
		height: 100vh;
		position: relative;
		overflow: hidden;
		flex-shrink: 0;
        animation: slideIn 1.0s  cubic-bezier(0.16, 1, 0.3, 1) forwards;
	}

    @keyframes slideIn {
       from {
        height: 100vh;
       }
       to {
        height: 40vh;
       }
    }

	.gallery-scroll {
		display: flex;
		height: 100%;
		overflow-x: auto;
		overflow-y: hidden;
		scroll-snap-type: x mandatory;
		-webkit-overflow-scrolling: touch;
		scrollbar-width: none;
	}

	.gallery-scroll::-webkit-scrollbar {
		display: none;
	}

	.gallery-image {
		min-width: 100vw;
		height: 100vh;
		scroll-snap-align: start;
		flex-shrink: 0;
	}

	.gallery-image img {
		width: 100%;
		height: 100%;
		object-fit: cover;
		object-position: center;
	}
</style>