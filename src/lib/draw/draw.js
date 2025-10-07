import { get } from "svelte/store";
import { animationState } from "./anim";
import { canvas, ctx, withClip } from "./canvas";
import { postFrames, projectFrames, sortedProjectFrames } from '$lib/stores/frames';
import { imageFit } from "./image";
import { projectImages } from "$lib/stores/media";

const drawImageFrame = (frame) => {
    ctx.globalAlpha = animationState.imageT;
    
    const images = get(projectImages).get(frame.id);
                
    if(images && images.length > 0) {
        const image = images[0];
        imageFit(ctx, image, frame.smoothPos.x, frame.smoothPos.y, frame.width, frame.height);
    }
}

const drawProjectFrames = (state) => {
    get(projectFrames).forEach(frame => {
        frame.update();
    });

    get(projectFrames).forEach((frame, index) => {
        frame.draw(ctx, state);
    });

    let targetZ = animationState.previewFramesZs[animationState.currentIdx];
    let targetFrame = get(sortedProjectFrames)[targetZ];

    if(targetFrame != null && targetFrame !== undefined) {
        drawImageFrame(targetFrame);
    }
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
    ctx.lineTo(window.innerWidth / 2, window.innerHeight);
    ctx.stroke();


    requestAnimationFrame(draw);
}