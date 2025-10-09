import { get } from "svelte/store";
import { animationState } from "./anim.svelte";
import { canvas, ctx, withClip } from "./canvas";
import { postFrames, projectFrames, sortedProjectFrames } from '$lib/stores/frames';
import { imageFit } from "./image";
import { progress, projectImages } from "$lib/stores/media";
import { hoveredId, hoveredType } from "$lib/stores/ui";

const drawImageFrame = (frame) => {
    ctx.globalAlpha = (hoveredType === "p" ? animationState.lop : animationState.rop);
    
    const hid = get(hoveredId)
    const images = get(projectImages).get(hid);
                
    if(images && images.length > 0) {
        const image = images[0];
        imageFit(ctx, image, frame.smoothPos.x, frame.smoothPos.y, frame.width, frame.height);
    }
}

const drawProjectFrames = (state) => {
    const frames = get(projectFrames)

    frames.forEach(frame => {
        frame.update();
    });

    frames.forEach((frame, index) => {
        frame.draw(ctx, state);
    });
}

const drawPostFrames = (state) => {
    get(postFrames).forEach(frame => {
        frame.update();
    });

    get(postFrames).forEach(rect => {
        rect.draw(ctx, state);
    });
}

export const draw = () => {
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    if(animationState.lop > 0.0) {
        withClip(drawProjectFrames, 0, 0, window.innerWidth / 2, window.innerHeight);
    }
    if(animationState.rop > 0.0) {
        withClip(drawPostFrames, window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight);
    }

    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(window.innerWidth / 2, 0);
    ctx.lineTo(window.innerWidth / 2, window.innerHeight * (get(progress) / 100.0));
    ctx.stroke();


    requestAnimationFrame(draw);
}