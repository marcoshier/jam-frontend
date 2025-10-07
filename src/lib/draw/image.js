/**
 * Draws an image with "cover" fit (like CSS background-size: cover)
 * @param {CanvasRenderingContext2D} ctx - Canvas context
 * @param {HTMLImageElement} image - Image to draw
 * @param {number} x - Destination x position
 * @param {number} y - Destination y position
 * @param {number} width - Destination width
 * @param {number} height - Destination height
 */

export function imageFit(ctx, image, x, y, width, height) {
    const imgAspect = image.width / image.height;
    const rectAspect = width / height;
    
    let sx, sy, sWidth, sHeight;
    
    if (imgAspect > rectAspect) {
        sHeight = image.height;
        sWidth = image.height * rectAspect;
        sx = (image.width - sWidth) / 2;
        sy = 0;
    } else {
        sWidth = image.width;
        sHeight = image.width / rectAspect;
        sx = 0;
        sy = (image.height - sHeight) / 2;
    }
    
    ctx.drawImage(
        image,
        sx, sy, sWidth, sHeight,
        x, y, width, height 
    );
}