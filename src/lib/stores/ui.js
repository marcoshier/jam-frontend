import { writable, get } from "svelte/store";
import { projectFrames, sortedProjectFrames, postFrames, sortedPostframes } from "./frames";
import { mod } from "$lib/math/number";
import { Vector2 } from "$lib/math/vector2";
import { animationState } from "$lib/draw/anim";

export let scrollYprojects = writable(0);
export let scrollYposts = writable(0);

export let mousePos = writable(new Vector2(0, 0));

export let hoveredId = writable(-1);
export let hoveredType = writable("t");

export const handleScroll = (e) => {
    const ht = get(hoveredType);

    const t = e.deltaY * 0.001;
    const rects = ht === "b" ? get(postFrames) : get(projectFrames);
    const nRects = rects.length;
    
    if(ht === "p") {
        scrollYprojects.update(n => mod(n + t, nRects)); 
    } else {
        scrollYposts.update(n => mod(n + t, nRects)); 
    }
    
    for(let rect of rects) {
        if(ht === "p") {
            rect.scroll = get(scrollYprojects);
        } else {
            rect.scroll = get(scrollYposts); 
        }
    }
}

export const handleMouseMove = (e) => {
    const x = e.clientX;
    const y = e.clientY;

    mousePos.update(v => v.set(x, y));

    if(x > window.innerWidth / 2.0) {
        hoveredType.set("b")
    } else {
        hoveredType.set("p")
    }

    const frames = get(hoveredType) === "b" ? get(sortedPostframes) : get(sortedProjectFrames);

    for(let i = frames.length - 1; i >= 0; i--) {
        const rect = frames[i];
        if(rect.contains(x, y)) {
            hoveredId.set(rect.id);

            break
        }
    }

    const previewFrames = frames.filter((f) => f.id === get(hoveredId))
    animationState.previewFramesZs = previewFrames.map((f) => f.z);
}

export const cleanupUI = () => {
    window.removeEventListener('wheel', handleScroll)
    window.removeEventListener('mousemove', handleMouseMove)
}

export const setupListeners = () => {
    window.addEventListener('wheel', handleScroll);
    window.addEventListener('wheel', handleMouseMove);
    window.addEventListener('mousemove', handleMouseMove);
}

export const InitUI = () => {
    setupListeners();
}