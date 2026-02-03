import { get } from "svelte/store";
import { animationState } from "./anim.svelte";
import { canvas, ctx, withClip } from "./canvas";
import { mobileFrames, postFrames, postFramesById, projectFrames, projectFramesById, sortedProjectFrames } from '$lib/stores/frames';
import { imageFit } from "./image";
import { progress, projectImages, smoothProgress } from "$lib/stores/media";
import { hoveredId, hoveredType, selectedId } from "$lib/stores/ui";
import { page } from "$app/state";
import { isMobile } from "$lib/stores/device";
import gsap from "gsap";

const drawProjectFrames = (ctx) => {
    const frames = get(projectFrames);

    if(!get(isMobile) && frames && frames[0] && frames[0].instant == true) {
        const selected = get(selectedId);
        const framesById = get(projectFramesById);

        const frameArray = framesById.get(selected);
        if (!frameArray || frameArray.length === 0) return;

        const frame = frameArray[0];
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

    const maxZOffset = Math.max(...frames.map(f => f.zOffset));
    const lastFrame = frames.find(f => f.zOffset === maxZOffset);
    
    if (lastFrame) {
        const hid = get(hoveredId);
        const ht = get(hoveredType);
        
        if (hid !== -1 && ht === "p") {
            const images = get(projectImages).get(hid); // cover images
            
            if (images && images.length > 0) {
                const image = images[0];
                const pos = lastFrame.smoothPos;
                const alpha = animationState.lop * animationState.loaderT;
                
                ctx.save();
                ctx.globalAlpha = alpha;
                imageFit(ctx, image, pos.x, pos.y, lastFrame.width, lastFrame.height);
                ctx.restore();
            }
        }
    }

}

const drawPostFrames = (ctx) => {
    const frames = get(postFrames);

    if(frames && frames[0] && frames[0].instant == true) {
        const selected = get(selectedId);
        const framesById = get(postFramesById);

        const frameArray = framesById.get(selected);
        if (!frameArray || frameArray.length === 0) return; // Add this check
        
        const frame = frameArray[0];
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
        frame.hoverMul = 1;
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

    if(animationState.imageT != 1.0) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'low';

        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        const instantProjects = page.url.pathname.startsWith('/project/');
        const instantPosts = page.url.pathname.startsWith('/post/');

        if (frameCount % 60 === 0) { // Log every 60 frames to avoid spam
            console.log('Draw state:', {
                imageT: animationState.imageT,
                selectionT: animationState.selectionT,
                lop: animationState.lop,
                rop: animationState.rop,
                instantProjects,
                instantPosts,
                pathname: page.url.pathname
            });
        }
        
        let projectId = null

        if(get(isMobile)) { 

            withClip(drawMobileFrames, {x: 0, y: 0, w: window.innerWidth, h: window.innerHeight});

        } else {

            if(instantProjects || animationState.lop > 0.0) {
                withClip(drawProjectFrames, {x: 0, y: 0, w: window.innerWidth / 2, h: window.innerHeight});

                if(get(selectedId) == -1) {
                    drawFrameCarousel(ctx, "p");
                }
            }
            

            if(instantPosts || animationState.rop > 0.0) {
                withClip(drawPostFrames, {x: window.innerWidth / 2, y: 0, w: window.innerWidth / 2, h: window.innerHeight}); 

                if(get(selectedId) == -1) {
                    drawFrameCarousel(ctx, "b");
                }
            }


            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(window.innerWidth / 2, 0);
            ctx.lineTo(window.innerWidth / 2, window.innerHeight * (smoothProgress.current / 100.0));
            ctx.stroke();

        }
    }

    
    animationFrameId = requestAnimationFrame(draw);

    
}

export const reset = (navigation) => {
    const wasOnProject = navigation.from?.url.pathname.startsWith('/project/');
    const wasOnPost = navigation.from?.url.pathname.startsWith('/post/');
    const isNowHome = navigation.to?.url.pathname === '/';
    
    if (navigation.type === 'popstate' && isNowHome && (wasOnProject || wasOnPost)) {
        
        selectedId.set(-1);
        
        // Reset instant flag and force update
        get(projectFrames).forEach(frame => {
            frame.instant = false;
            frame.update();
        });
        get(postFrames).forEach(frame => {
            frame.instant = false;
            frame.update();
        });
        get(mobileFrames).forEach(frame => {
            frame.instant = false;
            frame.update();
        });
        
        gsap.to(animationState, {
            selectionT: 0,
            imageT: 0,
            duration: 1.0,
            ease: "power2.inOut",
            onUpdate: () => {
                console.log('Animation update:', {
                    selectionT: animationState.selectionT,
                    imageT: animationState.imageT
                });
            },
            onComplete: () => {
                console.log('Animation complete');
            }
        });
        
        if (wasOnProject) {
            console.log('Animating lop to 1.0');
            gsap.to(animationState, {
                lop: 1.0,
                duration: 1.0
            });
        } else if (wasOnPost) {
            console.log('Animating rop to 1.0');
            gsap.to(animationState, {
                rop: 1.0,
                duration: 1.0
            });
        }
        
        animationState.loaderT = 1;
        animationState.postFadeInT = 1;
        animationState.isFadeInComplete = true;
        
        // Always restart draw loop
        console.log('Restarting draw loop, current animationFrameId:', animationFrameId);
        if (animationFrameId !== null) {
            cancelAnimationFrame(animationFrameId);
            animationFrameId = null;
        }

        draw();
    } else {
        console.log('Reset conditions not met');
    }
}