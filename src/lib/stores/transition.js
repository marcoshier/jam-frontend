import { writable, get } from 'svelte/store';
import { gsap } from 'gsap';
import { CustomEase } from 'gsap/CustomEase';
import { goto } from '$app/navigation';

gsap.registerPlugin(CustomEase);

export const transitionPhase = writable('idle');
export const selectionT = writable(0.0);
export const skipFadeIn = writable(false);

const animationProxy = {
    selectionT: 0.0,
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
        selectionT: 1.0,
        duration: 0.8,
        ease: CustomEase.create("custom", "M0,0 C1.073,0 0.542,1 1,1"),
        onUpdate: () => {
            selectionT.set(animationProxy.selectionT);
        }
    });

    transitionPhase.set('navigating');
    await goto(route);

    transitionPhase.set('fadeIn');
};

export const instantIn = () => {
        animationProxy.selectionT = 1.0;
        animationProxy.contentT = 1.0;
        selectionT.set(1.0);
        transitionPhase.set('idle');
        skipFadeIn.set(false);
        return;
}

export const fadeInContent = async () => {
    if (get(skipFadeIn)) {
        instantIn()
        return
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