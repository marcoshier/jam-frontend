import { dev } from "$app/environment";
import { get, writable } from "svelte/store";

export const isMobile = writable(false);
export const deviceSet = writable(false);


export const handleResize = () => {
    deviceSet.set(false);
}

export const InitDevice = () => {
    if(window && window.innerWidth <= 768) {
        isMobile.set(true);
    }
    deviceSet.set(true);
}
