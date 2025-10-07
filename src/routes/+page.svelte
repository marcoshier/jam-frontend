<script>
	import { Rectangle } from '$lib/components/Rectangle.svelte';
    import { onMount } from 'svelte';
    import { InitRectangles, postRectangles, projectRectangles, repetitions } from '$lib/stores/rectangles';
    import { get } from 'svelte/store';
	import { cleanupUI, hoveredType, InitUI } from '$lib/stores/ui';
	import { projects } from '$lib/stores/projects.js';
	import { posts } from '$lib/stores/posts.js';
	import gsap from 'gsap';
	import { mod } from '$lib/math/number.js';

    let { data } = $props();

    let canvas;
    let ui;
    let ctx;

    let contentScale = 1.25;

    const state = {
        lop: 0.0,
        rop: 0.0,

        imageIndices: [],
        currentIdx: 0,
        imageT: 0.0
    }

    const cycleImagesTl = gsap.timeline({
        repeat: -1
    })

    function cycleImages() {
        cycleImagesTl.to(state, {
            imageT: 1.0,
            duration: 2.0,
        })
        .to(state, {
            imageT: 1.0,
            duration: 2.0,
        })
        .to(state, {
            imageT: 0.0,
            duration: 2.0,
            onComplete: () => {
                state.imageT = mod(state.imageT + 1, repetitions)
            }
        })
    }

    function fadeInLeft() {
        gsap.to(state, {
            lop: 1.0,
            duration: 1.0
        })
        gsap.to(state, {
            rop: 0.0,
            duration: 1.0
        })
    }

    function fadeInRight() {
        gsap.to(state, {
            rop: 1.0,
            duration: 1.0
        })
        gsap.to(state, {
            lop: 0.0,
            duration: 1.0
        })
    }

    $effect(() => {
        if($hoveredType == "p") {
            fadeInLeft()
        } else {
            fadeInRight()
        }
    })
    
    onMount(() => {
        projects.set(data.projects);
        posts.set(data.posts)

        canvas = document.getElementById('jam-app-cnv');
        ctx = canvas.getContext('2d');
        contentScale = window.devicePixelRatio || 1;

        InitRectangles(data);
        InitUI();

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
                rect.draw(ctx, state);
            });
        }

        function drawPostRectangles() {
            get(postRectangles).forEach(rect => {
                rect.update();
            });

            get(postRectangles).forEach(rect => {
                rect.draw(ctx, state);
            });
        }

        function drawCoverImage() {
            for(let index of state.imageIndices) {
                // TODO get Images of project
                // could store it / take it in the rect
            }
        }

        function draw() {
            ctx.fillStyle = '#FFFFFF';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            if(state.lop > 0.0) {
                withClip(drawProjectRectangles, 0, 0, window.innerWidth / 2, window.innerHeight);
            }
            if(state.rop > 0.0) {
                withClip(drawPostRectangles, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
            }

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

        return () => {
            cleanupUI();
        }
    });
</script>

<div id="jam-app">
    <canvas id="jam-app-cnv"></canvas>
    
    <div id="section-container">
        <section id="projects-view" class="view">
            <h1>PROJECTS</h1>
        </section>

        <section id="blog-view" class="view">
            <h1>POSTS</h1>
        </section>
    </div>
    
</div>

<style scoped>
    #section-container {
        position: absolute;
        top: 0;
        left: 0;
        margin: 0;
        padding: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: row;
        align-content: center;
    }

    .view {
        width: 50%;
        height: 100%;
        align-content: center;
    }

    .view h1 {
        width: 100%;
        text-align: center;
        font-family: 'Inter';
        font-size: 1.85rem;
        font-weight: 400;
        color: black;
    }
</style>