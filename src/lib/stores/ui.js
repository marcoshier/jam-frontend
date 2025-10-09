import { writable, get } from "svelte/store";
import { projectFrames, sortedProjectFrames, postFrames, sortedPostframes } from "./frames";
import { mod } from "$lib/math/number";
import { Vector2 } from "$lib/math/vector2";
import { animationState, fadeInSelected } from "$lib/draw/anim.svelte";

export let scrollYprojects = writable(0);
export let scrollYposts = writable(0);

export let mousePos = writable(new Vector2(0, 0));

export let hoveredId = writable(-1);
export let hoveredType = writable("t");

export let selectedId = writable(-1);

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

    if(get(selectedId) != -1) return

    if(x > window.innerWidth / 2.0) {
        hoveredType.set("b")
    } else {
        hoveredType.set("p")
    }

    const frames = get(hoveredType) === "b" ? get(sortedPostframes) : get(sortedProjectFrames);

    for(let i = frames.length - 1; i >= 0; i--) {
        const frame = frames[i];
        if(frame.contains(x, y)) {
            hoveredId.set(frame.id);

            break
        }
    }

    const previewFrames = frames.filter((f) => f.id === get(hoveredId))
    animationState.previewFramesZs = previewFrames.map((f) => f.z);
}

export const handleClick = (e) => {
    const x = e.clientX;
    const y = e.clientY;

    const frames = get(hoveredType) === "b" ? get(sortedPostframes) : get(sortedProjectFrames);

    for(let i = frames.length - 1; i >= 0; i--) {
        const frame = frames[i];
        if(frame.contains(x, y)) {
            hoveredId.set(frame.id)
            selectedId.set(frame.id);
            frame.selected = true;
            fadeInSelected();

            break
        }
    }
}

export const resetSelection = () => {
    const frames =  get(hoveredType) ? get(projectFrames) : get(postFrames);
    for(let frame of frames) {
        frame.selected = false;
    }
}

export const cleanupUI = () => {
    window.removeEventListener('wheel', handleScroll)
    window.removeEventListener('wheel', handleMouseMove);
    window.removeEventListener('mousemove', handleMouseMove)
    window.removeEventListener('click', handleClick);
}

export const setupListeners = () => {
    window.addEventListener('wheel', handleScroll);
    window.addEventListener('wheel', handleMouseMove);
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
}

export const InitUI = () => {
    setupListeners();
}