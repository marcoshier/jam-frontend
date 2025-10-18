import { get } from "svelte/store";
import { animationState } from "./anim.svelte";
import { canvas, ctx, withClip } from "./canvas";
import { postFrames, postFramesById, projectFrames, projectFramesById, sortedProjectFrames } from '$lib/stores/frames';
import { imageFit } from "./image";
import { progress, projectImages } from "$lib/stores/media";
import { hoveredId, hoveredType, selectedId } from "$lib/stores/ui";
import { page } from "$app/state";

const drawProjectFrames = (state) => {
    const frames = get(projectFrames);

    if(frames && frames[0].instant == true) {

        const selected = get(selectedId);
        const framesById = get(projectFramesById);
        const frame = framesById.get(selected)
        frame.update();
        frame.draw(ctx, state);
        return;
    }

    frames.forEach(frame => {
        frame.update();
    });

    frames.forEach(frame => {
        frame.draw(ctx, state);
    });
}

const drawPostFrames = (state) => {
    const frames = get(postFrames);

    if(frames && frames[0].instant == true) {
        const selected = get(selectedId);
        const framesById = get(postFramesById);
        const frame = framesById.get(selected)
        frame.update();
        frame.draw(ctx, state);
        return;
    }

    frames.forEach(frame => {
        frame.update();
    });

    frames.forEach(frame => {
        frame.draw(ctx, state);
    });
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

    if(instantProjects || animationState.lop > 0.0) {
        withClip(drawProjectFrames, 0, 0, window.innerWidth / 2, window.innerHeight);
    }
    if(instantPosts || animationState.rop > 0.0) {
        withClip(drawPostFrames, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
    }

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(window.innerWidth / 2, 0);
    ctx.lineTo(window.innerWidth / 2, window.innerHeight * (get(progress) / 100.0));
    ctx.stroke();


    animationFrameId = requestAnimationFrame(draw);
}