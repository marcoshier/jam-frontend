import gsap from 'gsap';
import { repetitions } from '$lib/stores/frames';
import { mod } from '$lib/math/number';

export let cycleImagesTl;

export const animationState = $state({
    lop: 0.0,
    rop: 0.0,
    tlop: 0.0,
    trop: 0.0,

    isTransitionComplete: false,
    loaderT: 1.0,

    previewFramesZs: [],
    currentIdx: 0,
    imageT: 0.0
});

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

export const fadeInLeft = (duration, delay) => {
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


const fadeOutLoader = () => {
    
}

export const fadeIn = () => {
    console.log("fading in")
    gsap.to(animationState, {
        tlop: 1.0,
        duration: 0.65
    })
    gsap.to(animationState, {
        trop: 1.0,
        duration: 0.65,
        delay: 0.3
    })
    gsap.to(animationState, {
        tlop: 0.0,
        duration: 0.65,
        delay: 1.5
    })
    gsap.to(animationState, {
        trop: 0.0,
        duration: 0.65,
        delay: 1.8,
        onComplete: () => {
           gsap.to(animationState, {
                delay: 0.65,
                loaderT: 0.0,
                duration: 1.5,
                onComplete: () => {animationState.isTransitionComplete = true}
            })
        }
    })
}

export const InitAnim = () => {
     cycleImagesTl = gsap.timeline({
        repeat: -1
    });
}