import { mix, mod } from "$lib/math/number";
import { projectRectangles } from "$lib/stores/rectangles";
import { scrollYprojects } from "$lib/stores/ui";
import { get } from 'svelte/store';

export class Rectangle {
    constructor(id, z) {
        this.id = id;
        this.z = z;
        this.setup();
    }

    center = $derived(this.pos.plus({ x: this.width / 2, y: this.height / 2 }));

    calculateWidth() {
        const scroll = get(scrollYprojects);
        const zOffset = this.z + scroll;

        const nProjects = get(projectRectangles).length;

        this.z = mod(zOffset, nProjects);

        this.width = (window.innerWidth / 2) * Math.pow(0.9, zOffset);
        this.width /= 2;
        this.width = Math.min(this.width, window.innerWidth / 2);
    }

    setupRectangle() {
        this.calculateWidth();

        const offsetX = (window.innerWidth / 2 - this.width) / 2;
        const height = window.innerHeight - (2 * offsetX);

        this.pos = { x: offsetX, y: offsetX };
        this.height = height;
        this.color = '#ffffff';
        this.hoverColor = '#ffffff';
    }

    setup() {
        this.setupRectangle();
    }

    contains(mouseX, mouseY) {
        return mouseX >= this.pos.x && 
               mouseX <= this.pos.x + this.width &&
               mouseY >= this.pos.y && 
               mouseY <= this.pos.y + this.height;
    }

    draw(ctx) {
        this.setupRectangle();

        ctx.fillStyle = this.isHovered ? this.hoverColor : this.color;
        ctx.fillRect(this.pos.x, this.pos.y, this.width, this.height);
        
        ctx.strokeStyle = this.id == 0 ? '#ff0000' : '#000000';
        ctx.lineWidth = 1;
        ctx.strokeRect(this.pos.x, this.pos.y, this.width, this.height);
    }
}