<script>
	import { animationState } from '$lib/draw/anim.svelte';
	import { Noise1D } from '$lib/math/noise';
	import { mod } from '$lib/math/number';
	import { mobileFrames } from '$lib/stores/frames';
	import { postsById } from '$lib/stores/posts';
	import { projectsById } from '$lib/stores/projects';
	import { scrolling, hoveredId, mobileItemHeight, scrollYmobile, scrollYmobileAcc, scrollZmobile, noiseCharge } from '$lib/stores/ui';
	import { get } from 'svelte/store';

    const { overridePostTitle, overrideOpacity } = $props();

    const titles = $derived.by(() => {
        return $mobileFrames.map(frame => $projectsById.get(frame.id)?.title || $postsById.get(frame.id)?.title || "Untitled");
    });

    const noise = new Noise1D();
    noise.setAmplitude(0.5);
    noise.setScale(0.25);

    const nVisible = 3;
    const snapThreshold = 0.15;

    let snapStartTime = $state(0);
    let snapDuration = 1000;
    let animTime = $state(0);


    $effect(() => {
        if (!$scrolling) {
            snapStartTime = performance.now();
        }
    });


    $effect(() => {
        let rafId;
        function tick() {
            animTime = performance.now() * 0.001; // Convert to seconds
            rafId = requestAnimationFrame(tick);
        }
        tick();
        return () => cancelAnimationFrame(rafId);
    });

    const elapsed = performance.now() - snapStartTime;
    const progress = Math.min(1, elapsed / snapDuration);
    const eased = 1 - Math.pow(1 - progress, 3);
        
    const displayItems = $derived.by(() => {
        const result = [];
        const mih = $mobileItemHeight;
        
        const totalScroll = $scrollYmobileAcc + $scrollYmobile;
        const scrollInItems = -totalScroll / mih;
        const centerItemFloat = scrollInItems;

        const nearestSnapPoint = Math.round(centerItemFloat);
        const distanceToSnap = nearestSnapPoint - centerItemFloat;
        const absDistance = Math.abs(distanceToSnap);

        let snapOffset = 0;
        if (absDistance < snapThreshold) {
            if ($scrolling) {
                snapOffset = distanceToSnap;
            } else {
                // Reference snapStartTime to make it reactive
                const elapsed = performance.now() - snapStartTime;
                const progress = Math.min(1, elapsed / snapDuration);
                const eased = 1 - Math.pow(1 - progress, 3);
                snapOffset = distanceToSnap * eased;
                
                // Trigger re-render until animation completes
                if (progress < 1) {
                    requestAnimationFrame(() => {
                        snapStartTime = snapStartTime; // Force update
                    });
                }
            }
        }
        
        for (let offset = -nVisible; offset <= nVisible; offset++) {
            // Position relative to the continuous scroll center
            const itemPosition = $hoveredId + offset;
            const visualOffset = itemPosition - centerItemFloat - snapOffset;
            
            const index = mod(itemPosition, titles.length);
            const distance = Math.abs(visualOffset);
            
            result.push({
                text: titles[index],
                index: index,
                key: `${index}-${offset}`,
                offset: visualOffset,
                offsetX: 0, // noise.getVal(animTime + index * 0.5) * $noiseCharge //{(item.offsetX - 0.25) * 120}
                type: get(mobileFrames)[index]?.type || "",
                scale: Math.max(0.5, 1 - distance * 0.15),
                opacity: Math.max(0.3, 1 - distance * 0.2),
                y: visualOffset * mih
            });
        }
        
        return result;
    });
</script>

<div 
    class="scrubber-container"
    style:pointer-events={ overrideOpacity === 0 ? 'none' : 'all' }
>
    <div class="scrubber-items">
        {#each displayItems as item (item.key)}
            <div 
                class="scrubber-item"
                class:center={Math.abs(item.offset) < 0.1}
                style="
                    background: rgba(255, 255, 255, {Math.pow(item.opacity, 2) * 0.9});
                    transform: translateX(0px) translateY({item.y}px) scale({item.scale});
                    opacity: {item.opacity * (overrideOpacity ?? animationState.loaderT)};
                    font-size: {item.scale * 24}px;
                "
            >
                {item.text}
                <br />
                <i>
                    {#if item.type == "p"}
                        Project
                    {:else if item.type == "b"}
                        POST
                    {/if} 
                </i>
            </div>
        {/each}
    </div>
</div>

<style>
    .scrubber-container {
        position: fixed;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 70%;
        height: 90vh;
        display: flex;
        align-items: center;
        justify-content: center;
        pointer-events: all;
        user-select: none;
        -webkit-user-select: none;
        touch-action: none;
        -webkit-touch-callout: none;
    }
    
    .scrubber-items {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
    
    .scrubber-item {
        position: absolute;
        color: red;
        font-family: 'Schflooze';
        font-weight: 500;
        border-radius: 20px;
        padding: 2px 18px;
        font-size: 28px;
        white-space: nowrap;
        font-weight: 600;
        color: #000;
        pointer-events: none;
        will-change: transform, opacity;
    }

    .scrubber-item i {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        font-size: 0.5em;
        text-transform: uppercase;
        font-style: normal;
        font-family: monospace;
        padding: 2px;
        text-align: center;
        color: black;
        font-weight: 400;
        mix-blend-mode: exclusion;
    }
    
    .scrubber-item.center {
        font-weight: 700;
    }

</style>