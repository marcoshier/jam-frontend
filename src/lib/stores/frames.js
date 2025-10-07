import { Frame } from '$lib/components/Frame.svelte';
import { derived, get, writable } from 'svelte/store';

export const repetitions = 3

export const projectFrames = writable([]);
export const sortedProjectFrames = derived(
  projectFrames, 
  ($projectFrames) => {
    return [...$projectFrames].sort((a, b) => a.zOffset - b.zOffset);
  }
);

export const postFrames = writable([]);
export const sortedPostframes = derived(
  postFrames, 
  ($postFrames) => {
    return [...$postFrames].sort((a, b) => a.zOffset - b.zOffset);
  }
);

const createFrames = (type, list) => {
    let frames = [];
    let acc = 0;

    for (let i = 1; i < repetitions + 1; i++) {
        for (let pidx = 0; pidx < list.length; pidx++) {
            const project = list[pidx];
            const f = new Frame(pidx, project.id, acc, type);

            frames.push(f);
            acc++;
        }
    }

    return frames
}

export const InitFrames = (data) => {

    let pframes = createFrames("p", data.projects);
    let bframes = createFrames("b", data.posts); 

    for(let prect of pframes) {
        prect.update();
    }

    for(let brect of bframes) {
        brect.update();
    }

    projectFrames.set(pframes);
    postFrames.set(bframes);
    
}