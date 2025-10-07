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

export const InitCanvas = () => {
    canvas = document.getElementById('jam-app-cnv');
    ctx = canvas.getContext('2d');
    contentScale = window.devicePixelRatio || 1;
    
    sharpen();
}