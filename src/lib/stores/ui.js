import { writable, get } from "svelte/store";
import { projectFrames, sortedProjectFrames, postFrames, sortedPostframes, projectFramesById, postFramesById } from "./frames";
import { mod } from "$lib/math/number";
import { Vector2 } from "$lib/math/vector2";
import { animationState, fadeInSelected } from "$lib/draw/anim.svelte";
import { transitionTo } from "./transition";

export let scrollZprojects = writable(0);
export let scrollZposts = writable(0);
export let scrollYprojects = writable(0);
export let scrollYposts = writable(0);

export let mousePos = writable(new Vector2(0, 0));

export let hoveredId = writable(-1);
export let hoveredType = writable("");

export let selectedId = writable(-1);
export let selectedType = writable("");

export const scrolling = writable(false);
let scrollTimeout;

export const handleScroll = (e) => {
    scrolling.set(true);
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        scrolling.set(false);
    }, 150);

    if(get(selectedId) === -1) {
        const ht = get(hoveredType);

        const t = e.deltaY * 0.001;
        const rects = ht === "b" ? get(postFrames) : get(projectFrames);
        const nRects = rects.length;
        
        if(ht === "p") {
            scrollZprojects.update(n => mod(n + t, nRects)); 
        } else {
            scrollZposts.update(n => mod(n + t, nRects)); 
        }
        
        for(let rect of rects) {
            if(ht === "p") {
                rect.scroll = get(scrollZprojects);
            } else {
                rect.scroll = get(scrollZposts); 
            }
        }
    } else {
        const type = get(selectedType);
        const frames = type == "p" ? get(projectFramesById) : get(postFramesById)
        const frame = frames.get(get(selectedId));

        if (frame) {
            if(get(mousePos).x < window.innerWidth / 2.0) {
                if(type == "p") {
                    scrollYprojects.update(n => Math.max(0, n + e.deltaY));
                } else {
                    scrollYposts.update(n => Math.max(0, n + e.deltaY));
                }
            }

            frame.yOffset = Math.max(0, frame.yOffset + e.deltaY);
        }
    }

    
}

export const handleMouseMove = (e) => {
    if(!animationState.isFadeInComplete)
        return

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

export const handleClick = async (e) => {
    const x = e.clientX;
    const y = e.clientY;

    const frames = get(hoveredType) === "b" ? get(sortedPostframes) : get(sortedProjectFrames);

    for(let i = frames.length - 1; i >= 0; i--) {
        const frame = frames[i];
        if(frame.contains(x, y)) {
            hoveredId.set(frame.id)
            selectedId.set(frame.id);
            selectedType.set(get(hoveredType))
            frame.selected = true;
            fadeInSelected();

            const type = get(hoveredType) === "b" ? 'post' : 'project';
            const route = `/${type}/${frame.id}`;

            await transitionTo(route);
            break;
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
    clearTimeout(scrollTimeout);
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