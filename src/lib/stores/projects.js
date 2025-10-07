import { derived, writable } from "svelte/store";

export const projects = writable([]);

export const projectsById = derived(projects, ($projects) => {
    const map = new Map();
    $projects.forEach(project => {
        map.set(project.id, project);
    });
    return map;
});