<script>

    import { onMount } from 'svelte';
	import { projects, projectsById } from '$lib/stores/projects.js';
	import { posts } from '$lib/stores/posts.js';
	import { InitAnim, animationState, fadeIn, fadeInLeft, fadeInRight } from '$lib/draw/anim.svelte.js';
	import { InitUI, cleanupUI, hoveredId, hoveredType } from '$lib/stores/ui';
	import { InitMedia, isComplete, progress } from '$lib/stores/media.js';
	import { InitCanvas } from '$lib/draw/canvas.js';
	import { InitFrames } from '$lib/stores/frames.js';
    import { Frame } from '$lib/frame/Frame.svelte.js';
	import { draw } from '$lib/draw/draw.js';
	import Loader from '$lib/components/Loader.svelte';
	import { get } from 'svelte/store';
	import Sections from '$lib/components/Sections.svelte';
	import Header from '$lib/components/Header.svelte';

    let { data } = $props();

    $effect(() => {
        if($hoveredType == "p") {
            fadeInLeft()
        } else {
            fadeInRight()
        }

        if($isComplete) {
            start();
        }
    })

    const start = () => {
        fadeIn();
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


        return () => {
            cleanupUI();
        }
    });
</script>

<div id="jam-app">
    <canvas id="jam-app-cnv"></canvas>
    
    <Sections 
        opacityLeft={1.0 - animationState.loaderT}
        opacityRight={1.0 - animationState.loaderT}
    ></Sections>
    <Header></Header>
</div>
<Loader/>
