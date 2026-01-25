import gsap from "gsap";
import { animationFrameId } from "./draw";

export let canvas;
export let ctx;
export let contentScale = 1.25;

export const sharpen = () => {
    const dpr = window.devicePixelRatio;
    const rect = canvas.getBoundingClientRect();

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;

    ctx.scale(dpr, dpr);

    canvas.style.width = `${rect.width}px`;
    canvas.style.height = `${rect.height}px`;
}

export const withClip = (content, { x, y, w, h }) => {
    
    ctx.save();
  //  ctx.beginPath();
  //  ctx.rect(x, y, w, h);
  //  ctx.clip();
    content(ctx);
    ctx.restore();
    
}

export const cleanupCanvas = () => {
    if (animationFrameId) {
        cancelAnimationFrame(animationFrameId);
    }

    if (ctx && canvas) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

export const InitCanvas = () => {
    canvas = document.getElementById('jam-app-cnv');
    ctx = canvas.getContext('2d', { alpha: false });
    contentScale = window.devicePixelRatio || 1;
    
    sharpen();
}