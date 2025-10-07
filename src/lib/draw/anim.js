import gsap from 'gsap';
import { repetitions } from '$lib/stores/rectangles';
import { cycleImageIdx, state } from './state';

export let cycleImagesTl;

export const cycleImages = () => {
    cycleImagesTl.to(state, {
        imageT: 1.0,
        duration: 2.0,
    })
    .to(state, {
        imageT: 1.0,
        duration: 2.0,
    })
    .to(state, {
        imageT: 0.0,
        duration: 2.0,
        onComplete: () => cycleImageIdx()
    })
}

export const fadeInLeft = () => {
    gsap.to(state, {
        lop: 1.0,
        duration: 1.0
    })
    gsap.to(state, {
        rop: 0.0,
        duration: 1.0
    })
}

export const fadeInRight = () => {
    gsap.to(state, {
        rop: 1.0,
        duration: 1.0
    })
    gsap.to(state, {
        lop: 0.0,
        duration: 1.0
    })
}

export const InitAnim = () => {
     cycleImagesTl = gsap.timeline({
        repeat: -1
    });
}