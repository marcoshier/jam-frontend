import { canvas, ctx, drawPostRectangles, drawProjectRectangles, withClip } from "./canvas";
import { state } from "./state";

export const draw = () => {
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