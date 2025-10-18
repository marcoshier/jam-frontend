<script>
    import { onMount } from 'svelte';
    import { page } from '$app/state';
	import { projects } from '$lib/stores/projects';
	import { posts } from '$lib/stores/posts';
	import { InitAnim, fadeInLeft, fadeInRight } from '$lib/draw/anim.svelte.js';
	import { InitUI, cleanupUI, hoveredType, selectedId } from '$lib/stores/ui';
	import { InitMedia, isComplete } from '$lib/stores/media.js';
	import { InitCanvas } from '$lib/draw/canvas.js';
	import { InitFrames } from '$lib/stores/frames.js';
	import { draw } from '$lib/draw/draw.js';
    import Sections from '$lib/components/Sections.svelte';
    import Header from '$lib/components/Header.svelte';
    import Loader from '$lib/components/Loader.svelte';
	import Canvas from '$lib/components/Canvas.svelte';
    import '../app.css';

    let { children, data } = $props();

	$effect(() => {
		if($isComplete && $hoveredType == "p") {
			fadeInLeft()
		} else {
			fadeInRight()
		}
    })
    
    onMount(async () => {
        projects.set(data.projects);
        posts.set(data.posts);

        const currentId = page.params.id;

		if(currentId) {
			selectedId.set(currentId);
		}

        InitCanvas();
        InitFrames(data);
        InitUI();
        InitAnim();

        draw();

        await InitMedia(data);

        return () => {
            cleanupCanvas();
            cleanupUI();
        }
    });
</script>


<div id="jam-app">
    <Canvas />
    <Sections />
    {@render children()}
	
    <Header />
</div>

<Loader />