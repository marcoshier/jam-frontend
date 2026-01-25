import { Frame } from '$lib/frame/Frame.svelte';
import { derived, get, writable } from 'svelte/store';
import { isMobile } from './device';
import { shuffle } from 'lodash-es';

export const repetitions = 2

export const projectFrames = writable([]);
export const sortedProjectFrames = derived(
  projectFrames, 
  ($projectFrames) => {
    return [...$projectFrames].sort((a, b) => a.zOffset - b.zOffset);
  }
);

export const projectFramesById = derived(
  projectFrames,
  ($projectFrames) => {
    const map = new Map();
    $projectFrames.forEach(frame => {
      if (!map.has(frame.id)) {
        map.set(frame.id, []);
      }
      map.get(frame.id).push(frame);
    });
    return map;
  }
);


export const postFrames = writable([]);
export const sortedPostframes = derived(
  postFrames, 
  ($postFrames) => {
    return [...$postFrames].sort((a, b) => a.zOffset - b.zOffset);
  }
);

export const postFramesById = derived(
  postFrames,
  ($postFrames) => {
    const map = new Map();
    $postFrames.forEach(frame => {
      if (!map.has(frame.id)) {
        map.set(frame.id, []);
      }
      map.get(frame.id).push(frame);
    });
    return map;
  }
);


export const mobileFrames = writable([]);

export const mobileFramesById = derived(
  mobileFrames,
  ($mobileFrames) => {
    const map = new Map();
    $mobileFrames.forEach(frame => {
      if (!map.has(frame.id)) {
        map.set(frame.id, []);
      }
      map.get(frame.id).push(frame);
    });
    return map;
  }
);

export const sortedMobileFrames = derived(
  mobileFrames, 
  ($mobileFrames) => {
    return [...$mobileFrames].sort((a, b) => a.zOffset - b.zOffset);
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

    return frames;
}

const createMobileFrames = (list, typeMap) => {
    let frames = [];
    let acc = 0;
    for (let i = 1; i < repetitions + 1; i++) {
        for (let pidx = 0; pidx < list.length; pidx++) {
            const item = list[pidx];
            const type = typeMap.get(item.id);
            const f = new Frame(pidx, item.id, acc, type);
            frames.push(f);
            acc++;
        }
    }

    return frames;
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

    if(get(isMobile)) {
      const typeMap = new Map(); // replace with server side typing
      
      data.projects.forEach(project => {
        typeMap.set(project.id, 'p');
      });
      
      data.posts.forEach(post => {
        typeMap.set(post.id, 'b');
      });
      
      const combined = [...data.projects, ...data.posts];
      const shuffled = shuffle(combined);

      const mframes = createMobileFrames(shuffled, typeMap);

      mframes.forEach((frame, idx) => {
        frame.z = idx;
        frame.zOffset = idx;
      });

      mobileFrames.set(mframes);
    }
    
}