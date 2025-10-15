<script>
    import { onMount } from 'svelte';
    import { page } from '$app/state';
	import { projects } from '$lib/stores/projects';
	import { posts } from '$lib/stores/posts';
	import { InitAnim, fadeIn, fadeInLeft, fadeInRight } from '$lib/draw/anim.svelte.js';
	import { InitUI, cleanupUI, hoveredType } from '$lib/stores/ui';
	import { InitMedia, isComplete } from '$lib/stores/media.js';
	import { InitCanvas } from '$lib/draw/canvas.js';
	import { InitFrames } from '$lib/stores/frames.js';
	import { draw } from '$lib/draw/draw.js';
    import favicon from '$lib/assets/favicon.svg';
    import Canvas from '$lib/components/Canvas.svelte';
    import Sections from '$lib/components/Sections.svelte';
    import Header from '$lib/components/Header.svelte';
    import Loader from '$lib/components/Loader.svelte';
    import '../app.css';

    let { children, data } = $props();

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

    let isHomePage = $derived(page.url.pathname === '/');
</script>

<svelte:head>
    <link rel="icon" href={favicon} />
</svelte:head>

<div id="jam-app">
    <Canvas />
    <Sections />
    <Header />
    
    {@render children()}
</div>

<Loader />