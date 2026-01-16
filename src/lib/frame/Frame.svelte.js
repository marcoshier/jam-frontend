import { page } from "$app/state";
import { animationState } from "$lib/draw/anim.svelte";
import { imageFit } from "$lib/draw/image";
import { map } from "$lib/math/map";
import { mix, mod } from "$lib/math/number";
import { screenOrigin, Vector2 } from "$lib/math/vector2";
import { postFrames, projectFrames } from "$lib/stores/frames";
import { projectImages } from "$lib/stores/media";
import { hoveredId, hoveredType, mousePos, scrolling, selectedId } from "$lib/stores/ui";
import gsap from "gsap";
import { get } from 'svelte/store';

export class Frame {
    constructor(idx, id, z, type) {       
        this.id = id;
        this.idx = idx;

        this.pos = new Vector2(0, 0);
        this.smoothPos = new Vector2(0, 0); 

        this.width = 0;
        this.height = 0;

        this.z = z;
        
        this.zOffset = $state(this.z);
        this.yOffset = 0;

        this.type = type;
        this.scroll = 0;

        this.hovered = false;
        this.selected = false;
        this.instant = false;

        this.init();
    }

    center = $derived(this.smoothPos.plus(new Vector2(this.width / 2, this.height / 2)));

    init() {
        if(page.url.pathname.startsWith('/project/')) {
            this.instant = true;
        }
    }

    contains(mouseX, mouseY) {
        const pos = this.smoothPos;
        return mouseX >= pos.x && 
               mouseX <= pos.x + this.width &&
               mouseY >= pos.y && 
               mouseY <= pos.y + this.height;
    }
    
    calculateWidth() {
        const rects = this.type === "b" ? get(postFrames) : get(projectFrames);
        const nRects = rects.length;
        if (nRects === 0) return;
        
        this.zOffset = mod(this.z + this.scroll, nRects);
        
        this.width = (window.innerWidth / 2) * Math.pow(0.9, this.zOffset);
        this.width = Math.min(this.width, window.innerWidth / 2);
        this.width = mix(this.width, window.innerWidth / 2.0, animationState.selectionT);
    }

    update() {

        if(this.instant) {
            const pos = new Vector2(0, 0);
            this.pos = pos;
            this.smoothPos = pos;
            this.width = window.innerWidth / 2;
            this.height = window.innerHeight;
            
            const rects = this.type === "b" ? get(postFrames) : get(projectFrames);
            const nRects = rects.length;
            this.zOffset = mod(this.z + this.scroll, nRects);
            return;
        }

        const oldZOffset = this.zOffset;
        this.calculateWidth();
        
        const offset = (window.innerWidth / 2 - this.width) / 2;
        const height = window.innerHeight - (2 * offset);

        const toff = this.type === "b" ? window.innerWidth / 2.0 : 0;

        let newPos = this.pos;

        if(get(hoveredType) === this.type) {
            const mouse = get(mousePos);
            const mouseX =  Math.max(toff, Math.min(mouse.x, toff + window.innerWidth / 2));
            const mouseY = mouse.y;

            const maxX = window.innerWidth / 2 - this.width;
            const mPosX = map(mouseX, toff, window.innerWidth / 2 + toff, maxX + toff, toff, true);

            const maxY = window.innerHeight - height;
            const mPosY = map(mouseY, 0, window.innerHeight, maxY, 0, true);

            newPos.x = mPosX
            newPos.y = mPosY
        } else {
            newPos.x = (this.type === "p" ? 0.0 : window.innerWidth / 2.0) + offset;
            newPos.y = offset;
        }

        this.pos = newPos;
        this.pos = this.pos.mix(screenOrigin, animationState.selectionT);

        this.height = height;
        this.height = mix(this.height, window.innerHeight, animationState.selectionT);

        const rects = this.type === "b" ? get(postFrames) : get(projectFrames);
        const nRects = rects.length;
        const zDiff = Math.abs(this.zOffset - oldZOffset);
        
        if (this.smoothPos.x === 0 && this.smoothPos.y === 0) {
            this.smoothPos = this.pos.copy();
        } else if (zDiff > nRects / 2) {
            this.smoothPos = this.pos.copy();
        } else {
            this.smoothPos = this.smoothPos.mix(this.pos, 0.1);
        }

        this.smoothPos.clamp(toff, 0, toff + window.innerWidth / 2.0, window.innerHeight);
    }

    drawImage(ctx, image, pos, alpha) {
            ctx.globalAlpha = alpha;
            imageFit(ctx, image, pos.x, pos.y, this.width, this.height);
    } 

    draw(ctx) {
        ctx.save();

        let instant = false;
        let pos = new Vector2(0, 0);
        let alpha = 0.0;

        const images = get(projectImages).get(this.id); // TODO replace with cover image

        if(this.instant) {

            alpha = 1.0;
            pos.y = Math.min(0, -this.yOffset); // TODO i dont like position being set in draw
            
            if(images && images.length > 0 && this.id === get(selectedId)) {
                const image = images[0];
                this.drawImage(ctx, image, pos, alpha);
            }

        } else {

            pos = this.smoothPos;

            if(animationState.selectionT == 1.0) {
                pos.y = Math.min(0, -this.yOffset);
            }

            if(animationState.isFadeInComplete) {
                alpha = (this.type === "p" ? animationState.lop : animationState.rop) * animationState.loaderT;
            } else {
                alpha = 0.0;
            }

            ctx.beginPath();
            ctx.rect(pos.x, pos.y, this.width, this.height);

            const rects = this.type === "b" ? get(postFrames) : get(projectFrames);
            const nextRect = rects.find(r => r.zOffset === this.zOffset + 1);
            
            if (nextRect) {
                const nextPos = nextRect.smoothPos;
                ctx.rect(nextPos.x, nextPos.y, nextRect.width, nextRect.height);
                ctx.clip('evenodd'); 
            }
            
            this.hovered = get(hoveredType) === this.type && get(hoveredId) === this.id;

            const isLast = !nextRect;
            const isScrolling = get(scrolling);

            const shouldDrawImage = false; //isLast || (!isScrolling && this.hovered);

            if(shouldDrawImage && images && images.length > 0) {
                const image = images[0];
                this.drawImage(ctx, image, pos, alpha);
            }

            ctx.globalAlpha = alpha;
            ctx.strokeStyle = this.id == 0 ? '#ff0000' : '#000000';
            ctx.lineWidth = 1;
            ctx.strokeRect(pos.x, pos.y, this.width, this.height);
            
        }

        ctx.restore();



    }
}