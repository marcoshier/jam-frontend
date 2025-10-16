import gsap from 'gsap';
import { postFrames, projectFrames, repetitions } from '$lib/stores/frames';
import { mod } from '$lib/math/number';
import { hoveredType, resetSelection } from '$lib/stores/ui';
import { CustomEase } from 'gsap/all';
import { isComplete, progress } from '$lib/stores/media';
import { get } from 'svelte/store';

export const animationState = $state({
    lop: 0.0,
    rop: 0.0,

    isFadeInComplete: false,
    postFadeInT: 0.0,

    loaderT: 0.0,
    nameTLeft: 0.0,
    nameTRight: 0.0,

    imageT: 0.0,
    selectionT: 0.0
});

export const fadeInSelected = () => {
    gsap.to(animationState, {
        selectionT: 1.0,
        duration: 2.0,
        ease: CustomEase.create("custom", "M0,0 C1.073,0 0.542,1 1,1 "),
    })
}

export const fadeOutSelected = () => {
    gsap.to(animationState, {
        selectionT: 1.0,
        duration: 1.0,
        onComplete: resetSelection
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

const fadeInContent = () => {
    gsap.to(animationState, {
        loaderT: 1.0,
        duration: 0.65,
        delay: 0
    })
    gsap.to(animationState, {
        nameTLeft: 0.0,
        duration: 0.65,
        delay: 0
    })
    gsap.to(animationState, {
        nameTRight: 0.0,
        duration: 0.65,
        delay: 0
    })
    gsap.to({}, { 
        duration: 0.5,
        onComplete: () => { animationState.isFadeInComplete = true }
    })
    gsap.to(animationState, {
        postFadeInT: 1.0,
        duration: 0.65
    })
}

const introCycle = () => {
    console.log("cycling intro")

    const tl = gsap.timeline({
        onComplete: () => {
            if(get(isComplete)) {
                fadeInContent();
            } else {
                introCycle()
            }
        }
    })

    tl.set(animationState, { nameTLeft: 1.0 })
    .to(animationState, { 
        nameTLeft: 0.0, 
        duration: 2
    })
    
    .set(animationState, { nameTRight: 1.0 }, "-=1")
    .to(animationState, { 
        nameTRight: 0.0, 
        duration: 2
    }, "-=1")
    
    .to({}, { duration: 0.2 });
}

export const InitAnim = () => {
    introCycle();
}