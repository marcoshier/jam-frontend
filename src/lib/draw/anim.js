import gsap from 'gsap';
import { repetitions } from '$lib/stores/frames';
import { mod } from '$lib/math/number';

export let cycleImagesTl;

export const animationState = {
    lop: 0.0,
    rop: 0.0,

    loaderT: 1.0,

    previewFramesZs: [],
    currentIdx: 0,
    imageT: 0.0
}

const cycleImageIdx = () => {
    animationState.currentIdx = mod(animationState.currentIdx + 1, repetitions)
}

export const cycleImages = () => {
    cycleImagesTl
    .to(animationState, {
        imageT: 0.0,
        duration: 0.5
    })
    .to(animationState, {
        imageT: 1.0,
        duration: 0.75,
    })
    .to(animationState, {
        imageT: 1.0,
        duration: 1.5,
    })
    .to(animationState, {
        imageT: 0.0,
        duration: 0.75,
        onComplete: () => cycleImageIdx()
    })
}

export const fadeInLeft = () => {
    gsap.to(animationState, {
        lop: 1.0,
        duration: 1.0
    })
    gsap.to(animationState, {
        rop: 0.0,
        duration: 1.0
    })
}

export const fadeInRight = () => {
    gsap.to(animationState, {
        rop: 1.0,
        duration: 1.0
    })
    gsap.to(animationState, {
        lop: 0.0,
        duration: 1.0
    })
}

export const InitAnim = () => {
     cycleImagesTl = gsap.timeline({
        repeat: -1
    });
}