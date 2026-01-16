<script>
    import { onMount } from 'svelte';
    
    let fps = $state(0);
    let lastTime = performance.now();
    let frameCount = 0;
    
    function updateFPS() {
        const now = performance.now();
        const delta = now - lastTime;
        
        frameCount++;
        
        // Update FPS display every 10 frames for smoother reading
        if (frameCount % 10 === 0) {
            fps = Math.round(1000 / delta);
        }
        
        lastTime = now;
        requestAnimationFrame(updateFPS);
    }
    
    onMount(() => {
        updateFPS();
    });
</script>

<div class="fps-counter">
    {fps} FPS
</div>

<style>
    .fps-counter {
        position: fixed;
        top: 20px;
        right: 20px;
        background: rgba(0, 0, 0, 0.8);
        color: #00ff00;
        padding: 10px 15px;
        font-family: monospace;
        font-size: 18px;
        font-weight: bold;
        border-radius: 4px;
        z-index: 9999;
        pointer-events: none;
    }
</style>