<script>
	import { Rectangle } from '$lib/components/Rectangle.svelte';
    import { onMount } from 'svelte';
    import { projectRectangles } from '$lib/stores/rectangles';
    import { get } from 'svelte/store';
	import { InitUI } from '$lib/stores/ui';

    let { data } = $props();

    let canvas;
    let ui;
    let ctx;

    let contentScale = 1.25;
    
    onMount(() => {
        canvas = document.getElementById('jam-app-cnv');
        ctx = canvas.getContext('2d');
        contentScale = window.devicePixelRatio || 1;

        let rectangles = [];

        let acc = 0;
        for (let i = 1; i < 5; i++) {
            for (let pid = 0; pid < data.projects.length; pid++) {
                const project = data.projects[pid];
                const r = new Rectangle(project.id, acc);

                if (r.width < 10) break;

                rectangles.push(r);
                acc++;
            }
        }

        projectRectangles.set(rectangles)

        InitUI();

        function sharpen() {
            ctx.imageSmoothingEnabled = false;
            canvas.width = window.innerWidth * contentScale;
            canvas.height = window.innerHeight * contentScale;

            ctx.scale(contentScale, contentScale);
        }

        function draw() {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            rectangles.forEach(rect => {
                rect.draw(ctx);
            });

            requestAnimationFrame(draw);
        }
        
        sharpen();
        draw();
    });
</script>

<div id="jam-app">
    <canvas id="jam-app-cnv"></canvas>
</div>