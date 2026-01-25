<script>
	import { animationState } from '$lib/draw/anim.svelte';
	import { mobileFrames } from '$lib/stores/frames';
    import { haptic } from 'ios-haptics'


    const { overridePostTitle, overrideOpacity } = $props();

    let items = $state([
        'Item 1', 'Item 2', 'Item 3', 'Item 4', 'Item 5',
        'Item 6', 'Item 7', 'Item 8', 'Item 9', 'Item 10'
    ]);
    
    let selectedIndex = $state(0);
    let isDragging = false;
    let startY = 0;
    let currentY = $state(0);
    
    const itemHeight = 70;
    const visibleRange = 5;
    
    const displayItems = $derived.by(() => {
        const result = [];
        
        for (let offset = -visibleRange; offset <= visibleRange; offset++) {
            const index = (selectedIndex + offset + items.length) % items.length;
            const distance = Math.abs(offset);
            
            result.push({
                text: items[index],
                index: index,
                offset: offset,
                scale: Math.max(0.5, 1 - distance * 0.15),
                opacity: Math.max(0.3, 1 - distance * 0.2),
                y: offset * itemHeight
            });
        }
        
        return result;
    });
    
    function handleTouchStart(e) {
        e.preventDefault();
        isDragging = true;
        startY = e.touches[0].clientY;
        currentY = 0;
        console.log('Touch start');
    }
    
    function handleTouchMove(e) {
        e.preventDefault();
        if (!isDragging) return;
        
        const touchY = e.touches[0].clientY;
        const delta = touchY - startY;
        currentY = delta;
        
        const itemsMoved = Math.round(-delta / itemHeight);
        const newIndex = (selectedIndex + itemsMoved + items.length) % items.length;
        
        console.log('Delta:', delta, 'ItemsMoved:', itemsMoved, 'Old:', selectedIndex, 'New:', newIndex);
        
        if (newIndex !== selectedIndex) {
            selectedIndex = newIndex;
            startY = touchY;
            currentY = 0;
            
            haptic();
        }
    }
    //  style:opacity={ overrideOpacity ?? animationState.loaderT * (1.0 - animationState.selectionT) }
    function handleTouchEnd(e) {
        e.preventDefault();
        isDragging = false;
        currentY = 0;
    }
</script>

<div 
    class="scrubber-container"
    ontouchstart={handleTouchStart}
    ontouchmove={handleTouchMove}
    ontouchend={handleTouchEnd}
    style:pointer-events={ overrideOpacity === 0 ? 'none' : 'all' }
  
>
    <div class="scrubber-items" style="transform: translateY({currentY}px)">
        {#each displayItems as item}
            <div 
                class="scrubber-item"
                class:center={item.offset === 0}
                style="
                    transform: translateY({item.y}px) scale({item.scale});
                    opacity: {item.opacity};
                    font-size: {item.scale * 24}px;
                "
            >
                {$mobileFrames[0]?.id}
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
        transition: transform 0.1s ease-out;
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
        transition: all 0.2s ease;
        pointer-events: none;
    }
    
    .scrubber-item.center {
        font-weight: 700;
    }

</style>