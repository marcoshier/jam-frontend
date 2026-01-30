<script>
    import { onMount } from 'svelte';
    import { InitUI, cleanupUI, hoveredType } from '$lib/stores/ui';
    import { InitFrames } from '$lib/stores/frames';
    import { InitMedia, isComplete } from '$lib/stores/media';
	import { fadeInLeft, fadeInRight, InitAnim } from '$lib/draw/anim.svelte';
	import { draw } from '$lib/draw/draw';
	import { cleanupCanvas, InitCanvas } from '$lib/draw/canvas';

    let { data } = $props();

	$effect(() => {
		if($isComplete && $hoveredType == "p") {
			fadeInLeft()
		} else {
			fadeInRight()
		}
    })

    onMount(async () => {
        InitCanvas();
        InitFrames(data);
        InitUI();
        InitAnim();

        draw();
        
        await InitMedia(data);

        if (import.meta.hot) {
            import.meta.hot.dispose(() => {
                cleanupCanvas();
                cleanupUI();
            });
        }

        return () => {
            cleanupCanvas();
            cleanupUI();
        }
    })
</script>

<canvas id="jam-app-cnv"></canvas>