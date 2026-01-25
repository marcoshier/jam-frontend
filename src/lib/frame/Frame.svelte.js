import { page } from "$app/state";
import { animationState } from "$lib/draw/anim.svelte";
import { imageFit } from "$lib/draw/image";
import { map } from "$lib/math/map";
import { mix, mod } from "$lib/math/number";
import { screenOrigin, Vector2 } from "$lib/math/vector2";
import { isMobile } from "$lib/stores/device";
import { mobileFrames, postFrames, projectFrames } from "$lib/stores/frames";
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
        let rects = this.type === "b" ? get(postFrames) : get(projectFrames);

        if(get(isMobile)) {
            rects = get(mobileFrames);
        }

        const nRects = rects.length;
        if (nRects === 0) return;
        
        this.zOffset = mod(this.z + this.scroll, nRects);
        
        let widthRef = window.innerWidth / 2;

        if(get(isMobile)) {
            widthRef = window.innerWidth;
        }

        this.width = widthRef * Math.pow(0.9, this.zOffset);
        this.width = Math.min(this.width, widthRef);
        this.width = mix(this.width, widthRef, animationState.selectionT);
    }

    hoverMul = 0.0;

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
        
        let widthRef = window.innerWidth / 2;
        let blogOffset = window.innerWidth / 2.0;

        if(get(isMobile)) {
            widthRef = window.innerWidth;
            blogOffset = 0;
        }

        const offset = (widthRef - this.width) / 2;
        const height = window.innerHeight - (2 * offset);

        let toff = this.type === "b" ? blogOffset : 0;
        let newPos = this.pos;

        if(get(isMobile)) {
            newPos.x = window.innerWidth / 2 - this.width / 2;
            newPos.y = window.innerHeight / 2 - height / 2;

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

        } else {
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

            if(this.hovered) {
                this.hoverMul += 0.1;
            } else {
                this.hoverMul = 0.0;
            }
            this.hoverMul = Math.min(1.0, Math.max(0.0, this.hoverMul));

            
        }

        
    }

    drawImage(ctx, image, pos, alpha) {
        ctx.globalAlpha = alpha * this.hoverMul;
        imageFit(ctx, image, pos.x, pos.y, this.width, this.height);
    } 

    draw(ctx, overrideAlpha = 0.0) {
        
              
        
        ctx.save();

        let pos = new Vector2(0, 0);
        let alpha = 0.0;

        const images = get(projectImages).get(this.id);

        if(this.instant) {
            alpha = 1.0;
            pos.y = Math.min(0, -this.yOffset);
            
            if(images && images.length > 0 && this.id === get(selectedId)) {
                const image = images[0];
                this.drawImage(ctx, image, pos, alpha);
            }

        } else {
            pos = this.smoothPos;

            if(animationState.selectionT == 1.0) {
                pos.y = Math.min(0, -this.yOffset);
            }

            
            if(get(isMobile) && !this.instant) {
                alpha = animationState.loaderT; 
            } else if(animationState.isFadeInComplete) {
                alpha = (this.type === "p" ? animationState.lop : animationState.rop) * animationState.loaderT;
            } else {
                alpha = 0.0;
            }

            const rects = this.type === "b" ? get(postFrames) : get(projectFrames);
            const nextRect = rects.find(r => r.zOffset === this.zOffset + 1);
            
            this.hovered = get(hoveredType) === this.type && get(hoveredId) === this.id;
            const isLast = !nextRect;

            const shouldDrawImage = images && images.length > 0 && (isLast || this.hovered);

            if(shouldDrawImage) {
                if (this.hovered && nextRect) {
                    ctx.save();
                    ctx.beginPath();
                    ctx.rect(pos.x, pos.y, this.width, this.height);
                    const nextPos = nextRect.smoothPos;
                    ctx.rect(nextPos.x, nextPos.y, nextRect.width, nextRect.height);
                    ctx.clip('evenodd');
                }
                
                const repetition = Math.floor(this.zOffset / 1);
                const imageIdx = repetition % images.length;
                
                const image = images[imageIdx];
                this.drawImage(ctx, image, pos, alpha);
                
                if (this.hovered && nextRect) {
                    ctx.restore();
                }

                if(overrideAlpha > 0.0) {
                    this.drawImage(ctx, image, pos, overrideAlpha);
                }
            }

            ctx.globalAlpha = alpha;
            ctx.strokeStyle = this.id == 0 ? '#ff0000' : '#000000';
            ctx.lineWidth = 1;
            ctx.strokeRect(pos.x, pos.y, this.width, this.height);
        }

        ctx.restore();
    }
}