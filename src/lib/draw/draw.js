import { get } from "svelte/store";
import { animationState } from "./anim.svelte";
import { canvas, ctx, withClip } from "./canvas";
import { mobileFrames, postFrames, postFramesById, projectFrames, projectFramesById, sortedProjectFrames } from '$lib/stores/frames';
import { imageFit } from "./image";
import { progress, projectImages, smoothProgress } from "$lib/stores/media";
import { hoveredId, hoveredType, selectedId } from "$lib/stores/ui";
import { page } from "$app/state";
import { isMobile } from "$lib/stores/device";

const drawProjectFrames = (ctx) => {
    const frames = get(projectFrames);

    if(!get(isMobile) && frames && frames[0] && frames[0].instant == true) {
        const selected = get(selectedId);
        const framesById = get(projectFramesById);

        const frame = framesById.get(selected)[0];
        frame.update();
        frame.draw(ctx);
        return;
    }

    frames.forEach(frame => {
        frame.hoverMul = 1;
        frame.update();
    });

    frames.forEach(frame => {
        frame.draw(ctx);
    });

    

}

const drawPostFrames = (ctx) => {
    const frames = get(postFrames);

    if(frames && frames[0] && frames[0].instant == true) {
        const selected = get(selectedId);
        const framesById = get(postFramesById);

        const frame = framesById.get(selected)[0]
        frame.update();
        frame.draw(ctx);
        return;
    }

    frames.forEach(frame => {
        frame.update();
    });

    frames.forEach(frame => {
        frame.draw(ctx);
    });
}

const drawMobileFrames = (ctx) => {
    const frames = get(mobileFrames);

     frames.forEach(frame => {
        frame.update();
    });

    frames.forEach(frame => {
        frame.draw(ctx);
    });
}

const drawFrameCarousel = (ctx, type) => {
    const framesById = type === "p" ? get(projectFramesById) : get(postFramesById);
    const hovered = get(hoveredId);
    if(hovered !== -1) {
        const frames = framesById.get(hovered);
        if(frames && frames.length > 0) {
            for(let i = frames.length - 1; i >= 0; i--) {
                const t = performance.now() * 0.00085;
                const t0 = Math.cos(t + (i / frames.length) * Math.PI * 2);
                const oa = t0 * 1.5 - 0.5;

                frames[i].draw(ctx, Math.max(0, oa));
            }
        }

    }
}

let frameCount = 0;
export let animationFrameId = null;

export const draw = () => {

    frameCount++;

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'low';

    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const instantProjects = page.url.pathname.startsWith('/project/');
    const instantPosts = page.url.pathname.startsWith('/post/');

    let projectId = null

    if(get(isMobile)) { 

        withClip(drawMobileFrames, {x: 0, y: 0, w: window.innerWidth, h: window.innerHeight});

    } else {

        if(instantProjects || animationState.lop > 0.0) {
            withClip(drawProjectFrames, {x: 0, y: 0, w: window.innerWidth / 2, h: window.innerHeight});
            drawFrameCarousel(ctx, "p");
        }
        

        if(instantPosts || animationState.rop > 0.0) {
            withClip(drawPostFrames, {x: window.innerWidth / 2, y: 0, w: window.innerWidth / 2, h: window.innerHeight}); 
            drawFrameCarousel(ctx, "b");
        }


        ctx.strokeStyle = '#000000';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(window.innerWidth / 2, 0);
        ctx.lineTo(window.innerWidth / 2, window.innerHeight * (smoothProgress.current / 100.0));
        ctx.stroke();

    }

    animationFrameId = requestAnimationFrame(draw);
}