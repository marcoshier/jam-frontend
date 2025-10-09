import gsap from 'gsap';
import { postFrames, projectFrames, repetitions } from '$lib/stores/frames';
import { mod } from '$lib/math/number';
import { hoveredType, resetSelection } from '$lib/stores/ui';
import { CustomEase } from 'gsap/all';

export const animationState = $state({
    lop: 0.0,
    rop: 0.0,
    tlop: 0.0,
    trop: 0.0,

    isTransitionComplete: false,
    loaderT: 1.0,

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

}