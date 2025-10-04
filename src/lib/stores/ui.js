import { writable, get } from "svelte/store";

export let scrollYprojects = writable(0);
export let scrollYposts = writable(0);

export const handleScroll = (e) => {
    scrollYprojects.update(n => n + e.deltaY * 0.1);
    console.log(get(scrollYprojects));
}

export const setupListeners = () => {
    window.addEventListener('wheel', handleScroll);
}

export const InitUI = () => {
    console.log("ui init");
    setupListeners();
}