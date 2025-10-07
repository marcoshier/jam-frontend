import { postRectangles, projectRectangles } from '$lib/stores/rectangles';
import { get } from 'svelte/store';

export let canvas;
export let ctx;
export let contentScale = 1.25;

export const sharpen = () => {
    ctx.imageSmoothingEnabled = false;
    canvas.width = window.innerWidth * contentScale;
    canvas.height = window.innerHeight * contentScale;

    ctx.scale(contentScale, contentScale);
}

export const withClip = (content, x, y, w, h) => {
    ctx.save();
    ctx.beginPath();
    ctx.rect(x, y, w, h);
    ctx.clip();
    content(ctx);
    ctx.restore();
}

export const drawProjectRectangles = (state) => {
    get(projectRectangles).forEach(rect => {
        rect.update();
    });

    get(projectRectangles).forEach(rect => {
        rect.draw(ctx, state);
    });
}

export const drawPostRectangles = (state) => {
    get(postRectangles).forEach(rect => {
        rect.update();
    });

    get(postRectangles).forEach(rect => {
        rect.draw(ctx, state);
    });
}

export const InitCanvas = () => {
    canvas = document.getElementById('jam-app-cnv');
    ctx = canvas.getContext('2d');
    contentScale = window.devicePixelRatio || 1;
    
    sharpen();
}