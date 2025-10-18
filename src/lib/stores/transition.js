import { writable, get } from 'svelte/store';
import { gsap } from 'gsap';
import { goto } from '$app/navigation';


export const transitionPhase = writable('idle');
export const contentT = writable(1.0);
export const skipFadeIn = writable(false);

const animationProxy = {
    contentT: 1.0
};

export const transitionTo = async (route, skipTransition = false) => {
    if (skipTransition) {
        skipFadeIn.set(true);
        await goto(route);
        return;
    }

    transitionPhase.set('fadeOut');
    
    await gsap.to(animationProxy, {
        contentT: 0.0,
        duration: 0.8,
        ease: CustomEase.create("custom", "M0,0 C1.073,0 0.542,1 1,1"),
        onUpdate: () => {
            contentT.set(animationProxy.contentT);
        }
    });

    transitionPhase.set('navigating');
    await goto(route);

    transitionPhase.set('fadeIn');
};

export const fadeInContent = async () => {
    if (get(skipFadeIn)) {
        animationProxy.contentT = 1.0;
        contentT.set(1.0);
        transitionPhase.set('idle');
        skipFadeIn.set(false);
        return;
    }

    await gsap.to(animationProxy, {
        contentT: 1.0,
        duration: 1.2,
        ease: 'power2.out',
        onUpdate: () => {
            contentT.set(animationProxy.contentT);
        }
    });
    
    transitionPhase.set('idle');
};