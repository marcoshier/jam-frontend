import { Rectangle } from '$lib/components/Rectangle.svelte';
import { derived, get, writable } from 'svelte/store';

export const projectRectangles = writable([]);
export const sortedProjectRectangles = derived(
  projectRectangles, 
  ($projectRectangles) => {
    return [...$projectRectangles].sort((a, b) => a.zOffset - b.zOffset);
  }
);

export const postRectangles = writable([]);
export const sortedPostRectangles = derived(
  postRectangles, 
  ($postRectangles) => {
    return [...$postRectangles].sort((a, b) => a.zOffset - b.zOffset);
  }
);

const createRectangles = (type, list) => {
    let rectangles = [];
    let acc = 0;

    for (let i = 1; i < 4; i++) {
        for (let pid = 0; pid < list.length; pid++) {
            const project = list[pid];
            const r = new Rectangle(project.id, acc, type);

            rectangles.push(r);
            acc++;
        }
    }

    return rectangles
}

export const InitRectangles = (data) => {

    let prects = createRectangles("p", data.projects);
    let brects = createRectangles("b", data.posts); 

    for(let prect of prects) {
        prect.update();
    }

    for(let brect of brects) {
        brect.update();
    }

    projectRectangles.set(prects);
    postRectangles.set(brects);
    
}