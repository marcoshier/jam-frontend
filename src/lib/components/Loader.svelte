<script>
	import { animationState } from "$lib/draw/anim.svelte";
	import { isComplete, progress } from "$lib/stores/media";
	import gsap from "gsap";
	import { get } from "svelte/store";
	import Sections from "./Sections.svelte";
	import TitleLeft from "./home/TitleLeft.svelte";
	import TitleRight from "./home/TitleRight.svelte";
</script>

{#if !animationState.isFadeInComplete}
    <div class="loader-container" style:opacity="{1.0 - animationState.loaderT}">
        <TitleLeft overrideProjectTitle={"JEROEN"} overrideOpacity = {animationState.nameTLeft}></TitleLeft>
        <TitleRight overridePostTitle={"MEIJER"} overrideOpacity = {animationState.nameTRight}></TitleRight>
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