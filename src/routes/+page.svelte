<script>
	import { Rectangle } from '$lib/components/Rectangle.svelte';
    import { onMount } from 'svelte';
    import { InitRectangles, postRectangles, projectRectangles } from '$lib/stores/rectangles';
    import { get } from 'svelte/store';
	import { InitUI } from '$lib/stores/ui';
	import { projects } from '$lib/stores/projects.js';
	import { posts } from '$lib/stores/posts.js';

    let { data } = $props();

    let canvas;
    let ui;
    let ctx;

    let contentScale = 1.25;
    
    onMount(() => {
        projects.set(data.projects);
        posts.set(data.posts)

        canvas = document.getElementById('jam-app-cnv');
        ctx = canvas.getContext('2d');
        contentScale = window.devicePixelRatio || 1;

        InitRectangles(data);
        InitUI(canvas);

        function sharpen() {
            ctx.imageSmoothingEnabled = false;
            canvas.width = window.innerWidth * contentScale;
            canvas.height = window.innerHeight * contentScale;

            ctx.scale(contentScale, contentScale);
        }

        function withClip(content, x, y, w, h) {
            ctx.save();
            ctx.beginPath();
            ctx.rect(x, y, w, h);
            ctx.clip();
            content(ctx);
            ctx.restore();
        }

        function drawProjectRectangles() {
            get(projectRectangles).forEach(rect => {
                rect.update();
            });

            get(projectRectangles).forEach(rect => {
                rect.draw(ctx);
            });
        }

        function drawPostRectangles() {
            get(postRectangles).forEach(rect => {
                rect.update();
            });

            get(postRectangles).forEach(rect => {
                rect.draw(ctx);
            });
        }

        function draw() {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            withClip(drawProjectRectangles, 0, 0, window.innerWidth / 2, window.innerHeight);
            withClip(drawPostRectangles, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);

            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(window.innerWidth / 2, 0);
            ctx.lineTo(window.innerWidth / 2, window.innerHeight);
            ctx.stroke();

            requestAnimationFrame(draw);
        }
        
        sharpen();
        draw();
    });
</script>

<div id="jam-app">
    <canvas id="jam-app-cnv"></canvas>
</div>