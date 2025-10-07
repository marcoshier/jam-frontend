<script>

    import { onMount } from 'svelte';
	import { projects, projectsById } from '$lib/stores/projects.js';
	import { posts } from '$lib/stores/posts.js';
	import { InitAnim, cycleImages, fadeInLeft, fadeInRight } from '$lib/draw/anim.js';
	import { InitUI, cleanupUI, hoveredId, hoveredType } from '$lib/stores/ui';
	import { InitMedia, isComplete, progress } from '$lib/stores/media.js';
	import { InitCanvas } from '$lib/draw/canvas.js';
	import { InitFrames } from '$lib/stores/frames.js';
    import { Frame } from '$lib/components/Frame.svelte';
	import { draw } from '$lib/draw/draw.js';
	import Loader from '$lib/components/Loader.svelte';
	import { get } from 'svelte/store';

    let { data } = $props();

    $effect(() => {
        if($hoveredType == "p") {
            fadeInLeft()
        } else {
            fadeInRight()
        }
    })

    const projectTitle = $derived(
        $hoveredType == "p" 
        ? $projectsById.get($hoveredId)?.title 
        : "PROJECTS"
    );

    const start = () => {
        cycleImages();
    }
    
    onMount(async () => {
        projects.set(data.projects);
        posts.set(data.posts)

        InitCanvas();
        InitFrames(data);
        InitUI();
        InitAnim();

        draw();

        await InitMedia(data);

        start();

        return () => {
            cleanupUI();
        }
    });
</script>

<div id="jam-app">
    <canvas id="jam-app-cnv"></canvas>
    
    <div id="section-container">
        <section id="projects-view" class="view">
            <h1>{projectTitle}</h1>
        </section>

        <section id="blog-view" class="view">
            <h1>POSTS</h1>
        </section>
    </div>
</div>

<Loader/>

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