<script>
	import { animationState } from '$lib/draw/anim.svelte';
	import { mod } from '$lib/math/number';
	import { mobileFrames } from '$lib/stores/frames';
	import { postsById } from '$lib/stores/posts';
	import { projectsById } from '$lib/stores/projects';
	import { scrolling, hoveredId, mobileItemHeight, scrollYmobile, scrollYmobileAcc, scrollZmobile } from '$lib/stores/ui';
	import { get } from 'svelte/store';

    const { overridePostTitle, overrideOpacity } = $props();

    const titles = $derived.by(() => {
        return $mobileFrames.map(frame => $projectsById.get(frame.id)?.title || $postsById.get(frame.id)?.title || "Untitled");
    });
    
    const nVisible = 5;
    const snapThreshold = 0.15;

    let snapStartTime = $state(0);
    let snapDuration = 1000;

    $effect(() => {
        if (!$scrolling) {
            snapStartTime = performance.now();
        }
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
                    transform: translateY({item.y}px) scale({item.scale});
                    opacity: {item.opacity};
                    font-size: {item.scale * 24}px;
                "
            >
                {item.text}
            </div>
        {/each}
    </div>
    
    <div class="center-line"></div>
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
        font-size: 28px;
        white-space: nowrap;
        font-weight: 600;
        color: #000;
        pointer-events: none;
        will-change: transform, opacity;
    }
    
    .scrubber-item.center {
        font-weight: 700;
    }

    .center-line {
        position: absolute;
        width: 80%;
        height: 2px;
        background: rgba(0, 0, 0, 0.1);
        pointer-events: none;
    }
</style>