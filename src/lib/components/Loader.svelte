<script>
	import { animationState } from "$lib/draw/anim";
	import { isComplete, progress } from "$lib/stores/media";
	import gsap from "gsap";
	import { get } from "svelte/store";

    let isTransitionComplete = $state(false);
    let loaderTRef = $state(1.0);

    $effect(() => {
        if($isComplete) {
            gsap.to(animationState, {
                delay: 0.65,
                loaderT: 0.0,
                duration: 1.5,
                onUpdate: () => loaderTRef = animationState.loaderT,
                onComplete: () => isTransitionComplete = true
            })
        }
    })
</script>

{#if !isTransitionComplete}
    <div class="loader-container" style:opacity="{loaderTRef}">
        <p>{Math.round($progress)}%</p>
    </div>
{/if}

<style>
    .loader-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: gainsboro;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }

    .loader-container p {
        font-family: 'Inter';
        font-size: 1rem;
    }
</style>