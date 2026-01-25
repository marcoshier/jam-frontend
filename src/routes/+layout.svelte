<script>
    import { onMount } from 'svelte';
    import { page } from '$app/state';
	import { projects } from '$lib/stores/projects';
	import { posts } from '$lib/stores/posts';
	import { selectedId } from '$lib/stores/ui';
    import { deviceSet, InitDevice } from '$lib/stores/device.js';
    import Sections from '$lib/components/Sections.svelte';
    import Header from '$lib/components/Header.svelte';
    import Loader from '$lib/components/Loader.svelte';
	import Canvas from '$lib/components/Canvas.svelte';
    import '../app.css';
	import gsap from 'gsap';
	import FPSCounter from '$lib/components/debug/FPSCounter.svelte';
	import { InitMedia } from '$lib/stores/media';

    let { children, data } = $props();
    
    onMount(async () => {
        console.log("Layout onMount - initializing stores with data");

        projects.set(data.projects);
        posts.set(data.posts);

        const currentId = page.params.id;

		if(currentId) {
			selectedId.set(currentId);
		}

        InitDevice();
    });
</script>


<div id="jam-app">
    {#if $deviceSet}            
        <Canvas data={data} />
        <Sections />
        {@render children()}
        
        <Header />
    {/if}
</div>

<Loader />
<FPSCounter />