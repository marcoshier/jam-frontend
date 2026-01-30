import { writable, get, readable } from "svelte/store";
import { projectFrames, sortedProjectFrames, postFrames, sortedPostframes, projectFramesById, postFramesById, mobileFrames } from "./frames";
import { mod } from "$lib/math/number";
import { Vector2 } from "$lib/math/vector2";
import { animationState, fadeInSelected } from "$lib/draw/anim.svelte";
import { transitionTo } from "./transition";
import { isMobile } from "./device";
import { haptic } from 'ios-haptics'

export let scrollZprojects = writable(0);
export let scrollZposts = writable(0);
export let scrollZmobile = writable(0);

export let scrollYprojects = writable(0);
export let scrollYposts = writable(0);
export let scrollYmobile = writable(0);
export let scrollYmobileAcc = writable(0);

export const scrollYText = writable(0); 
export const maxScrollText = writable(0);

export let maxScrollProjects = writable(Infinity);
export let maxScrollPosts = writable(Infinity);

export let mousePos = writable(new Vector2(0, 0));

export let hoveredId = writable(-1);
export let hoveredType = writable("");

export let selectedId = writable(-1);
export let selectedType = writable("");

export const scrolling = writable(false);
export const touchStartY = writable(0);

export const mobileItemHeight = readable(70);

export let noiseCharge = writable(0);
let chargeDecayInterval = null;

let scrollTimeout;

export const handleScroll = (e) => {
    scrolling.set(true);
    
    clearTimeout(scrollTimeout);
    scrollTimeout = setTimeout(() => {
        scrolling.set(false);
    }, 150);

    let delta = e.deltaY;
    
    if (e.deltaMode === 1) {
        delta *= 40;
    } else if (e.deltaMode === 2) {
        delta *= 800;
    }
    
    const scrollSpeed = 0.0001;

    if(get(selectedId) === -1) {
        const ht = get(hoveredType);

        const t = delta * scrollSpeed;
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
    } 
    
    else {
        const type = get(selectedType);
        
        if (type == "p") {
            if (get(mousePos).x < window.innerWidth / 2.0) {
                const max = get(maxScrollProjects);
                scrollYprojects.update(n => Math.max(0, Math.min(n + e.deltaY, max)));
            } else {
                const max = get(maxScrollText); 
                scrollYText.update(n => Math.max(0, Math.min(n + e.deltaY, max)));
            }
        } 
        else {
            const max = get(maxScrollPosts);
            scrollYposts.update(n => Math.max(0, Math.min(n + e.deltaY, max)));
        }
        
        const frames = type == "p" ? get(projectFramesById) : get(postFramesById)
        const frame = frames.get(get(selectedId));

        if (frame) {
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

export const handleTouchStart = (e) => {
    e.preventDefault();
    scrolling.set(true);
    touchStartY.set(e.touches[0].clientY);
    scrollYmobile.set(0);
}

export const handleTouchMove = (e) => {
    e.preventDefault();
    if (!get(scrolling)) return;

    mousePos.set(new Vector2(window.innerWidth / 2.0, window.innerHeight / 2.0))


    const mih = get(mobileItemHeight);

    const items = get(mobileFrames);
    const nRects = items.length;
    
    const touchY = e.touches[0].clientY;
    const delta = touchY - get(touchStartY);

    scrollYmobile.set(delta);

    const totalScroll = get(scrollYmobileAcc) + delta;
    const scrollInItems = -totalScroll / mih;
    const newHoveredId = Math.round(scrollInItems);
    
    if (newHoveredId !== get(hoveredId)) {
        hoveredId.set(newHoveredId);
        
        haptic();
    }

    const currentZ = get(scrollZmobile);
    const smoothed = currentZ + (newHoveredId - currentZ) * 0.1;
    scrollZmobile.set(smoothed);

    for (let item of items) {   
        item.scroll = get(scrollZmobile);
    }

     noiseCharge.update(c => Math.min(1, c + 0.15));
    
    if (chargeDecayInterval) {
        clearInterval(chargeDecayInterval);
        chargeDecayInterval = null;
    }

}

export const handleTouchEnd = (e) => {
    e.preventDefault();
    scrolling.set(false);
    
    const finalScroll = get(scrollYmobileAcc) + get(scrollYmobile);
    scrollYmobileAcc.set(finalScroll);
    scrollYmobile.set(0);
    
    const mih = get(mobileItemHeight);
    const scrollInItems = -finalScroll / mih;
    const nearestItem = Math.round(scrollInItems);
    const targetScroll = -nearestItem * mih;
    
    animateScrollToTarget(finalScroll, targetScroll);

    chargeDecayInterval = setInterval(() => {
        noiseCharge.update(c => {
            const newCharge = Math.max(0, c - 0.05);
            if (newCharge === 0 && chargeDecayInterval) {
                clearInterval(chargeDecayInterval);
                chargeDecayInterval = null;
            }
            return newCharge;
        });
    }, 16);
}

function animateScrollToTarget(from, to) {
    const duration = 300; // ms
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - progress, 3);
        
        const current = from + (to - from) * eased;
        scrollYmobileAcc.set(current);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    requestAnimationFrame(animate);
}

export const resetSelection = () => {
    const frames =  get(hoveredType) ? get(projectFrames) : get(postFrames);
    for(let frame of frames) {
        frame.selected = false;
    }
}

export const cleanupUI = () => {
    if(get(isMobile)) {
        window.removeEventListener('touchmove', handleTouchMove)
       // window.removeEventListener('click', handleClick)
    } else {
        clearTimeout(scrollTimeout);
        window.removeEventListener('wheel', handleScroll)
        window.removeEventListener('wheel', handleMouseMove);
        window.removeEventListener('mousemove', handleMouseMove)
        window.removeEventListener('click', handleClick);
    }
}

export const setupListeners = () => {
    if(get(isMobile)) {
        window.addEventListener('touchstart', handleTouchStart);
        window.addEventListener('touchmove', handleTouchMove);
        window.addEventListener('touchend', handleTouchEnd);
       // window.addEventListener('click', handleClick)
    } else {
        window.addEventListener('wheel', handleScroll);
        window.addEventListener('wheel', handleMouseMove);
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('click', handleClick);
    }
}

export const InitUI = () => {

    const mih = get(mobileItemHeight);
    const scrollInItems = -get(scrollYmobileAcc) / mih;
    hoveredId.set(Math.round(scrollInItems));

    setupListeners();
}