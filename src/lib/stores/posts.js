import { derived, writable } from "svelte/store";

export const posts = writable([]);

export const postsById = derived(posts, ($posts) => {
    const map = new Map();
    $posts.forEach(post => {
        map.set(post.id, post);
    });
    return map;
});