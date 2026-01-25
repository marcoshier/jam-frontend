<script>

    import { page } from '$app/state';
    import { animationState } from '$lib/draw/anim.svelte.js';
	import { contentT } from '$lib/stores/transition';
	import { get } from 'svelte/store';
	import About from './About.svelte';
	import AboutBio from './about/AboutBio.svelte';
	import AboutPhoto from './about/AboutPhoto.svelte';
	import PostGallery from './blog/PostGallery.svelte';
	import PostText from './blog/PostText.svelte';
	import TitleLeft from './home/TitleLeft.svelte';
	import TitleRight from './home/TitleRight.svelte';
	import ProjectGallery from './project/ProjectGallery.svelte';
	import ProjectText from './project/ProjectText.svelte';
	import { isMobile } from '$lib/stores/device';
	import TitleMobile from './home/TitleMobile.svelte';

    export const routeComponents = {
        '/': {
            left: TitleLeft,
            right: TitleRight
        },
        '/project/[id]': {
            left: ProjectGallery,
            right: ProjectText
        },
        '/blog/[id]': {
            left: PostGallery,
            right: PostText
        },
        '/about': {
            left: AboutPhoto,
            right: AboutBio
        }
    };

    const getRouteComponents = (pathname) => {
        if (routeComponents[pathname]) {
            return routeComponents[pathname];
        }

        for (const [pattern, components] of Object.entries(routeComponents)) {
            const regex = new RegExp(
                '^' + pattern.replace(/\[.*?\]/g, '[^/]+') + '$'
            );
            if (regex.test(pathname)) {
                return components;
            }
        }

        return { left: null, right: null };
    }

    let components = $derived(getRouteComponents(page.url.pathname));
    let { left, right } = $derived(components);
    
</script>



<div id="section-container">
    {#if $isMobile}
        <div id="full" class="view">
            <!--ContnetMobile-->
            <TitleMobile></TitleMobile>
        </div>
    {:else}
        <div id="left" class="view">
            {#if components.left}
                {@const LeftComponent = components.left}
                <LeftComponent />
            {/if}
        </div>
        
        <div id="right" class="view">
            {#if components.right}
                {@const RightComponent = components.right}
                <RightComponent />
            {/if}
        </div>
    {/if}
</div>

<style>
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

    #left, #right {
        width: 50%;
    }

    #full {
        width: 100%;
    }

    .view {
        height: 100%;
        align-content: center;
    }
</style>