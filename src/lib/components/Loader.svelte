<script>
	import { animationState } from "$lib/draw/anim.svelte";
	import { isComplete, progress } from "$lib/stores/media";
	import gsap from "gsap";
	import { get } from "svelte/store";
	import Sections from "./Sections.svelte";
	import TitleLeft from "./home/TitleLeft.svelte";
	import TitleRight from "./home/TitleRight.svelte";
</script>

{#if !animationState.isTransitionComplete}
    <div class="loader-container" style:opacity="{animationState.loaderT}">
        <TitleLeft overrideProjectTitle={"JEROEN"} opacity = {animationState.loaderT * animationState.tlop}></TitleLeft>
        <TitleRight overridePostTitle={"MEIJER"} opacity = {animationState.loaderT * animationState.trop}></TitleRight>
    </div>
{/if}

<style>
    .loader-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: transparent;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }
</style>