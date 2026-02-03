<script>
    import { projects, projectsById } from "$lib/stores/projects";
    import { selectedId, scrollYprojects, maxScrollProjects, scrollYText, maxScrollText } from "$lib/stores/ui";
	import { onMount } from "svelte";
    import { convertLexicalToHTML } from '@payloadcms/richtext-lexical/html';
	import { get } from "svelte/store";
	import SuggestionCard from "../suggestions/SuggestionCard.svelte";
	import { sumOf } from "$lib/math/number";

    
    const currentProject = $derived($projectsById.get($selectedId));

    let suggestions = $state([]);
    let containerRef;


    const description = $derived(
        currentProject?.description 
            ? convertLexicalToHTML({ data: currentProject.description })
            : ""
    );

    const collaborators = $derived(
        currentProject?.collaborators 
            ? currentProject.collaborators
            : ""
    );

    const hardware = $derived(
        currentProject?.hardware
            ? currentProject.hardware 
            : ""
    );

    const getRandomProjects = () => {
        const otherProjects = $projects.filter(p => p.id !== $selectedId);
        const shuffled = [...otherProjects].sort(() => Math.random() - 0.5);
        
        return shuffled.slice(0, 3);
    }

    onMount(() => {
        suggestions = getRandomProjects();
    });

    $effect(() => {
        if ($selectedId && $projects.length > 0) {
            suggestions = getRandomProjects();
        }

        if(window && currentProject) {
            setTimeout(() => {
                if (containerRef) {
                    const contentHeight = containerRef.scrollHeight;
                    const maxScroll = Math.max(0, contentHeight - window.innerHeight);
                    
                    // Update the TEXT specific max scroll
                    maxScrollText.set(maxScroll); 
                }
            }, 100);
        }
    });
</script>

{#if currentProject}
<div class="project-text-container">
   <div class="project-text-container-scroll" 
     bind:this={containerRef}
     style:transform="translate3d(0, -{$scrollYText}px, 0)" 
>
            <div class="tags-container">
                <h6>PROJECT</h6>
                <h6>{currentProject.year}</h6>
                <h6>INSTALLATION</h6>
            </div>
            <div class="title-container">
                <h1>{currentProject.title}</h1>
            </div>
            <div class="subtitle-container">
                <h2>{currentProject.subtitle}</h2>
            </div>
            <div class="description-container">
                {@html description}
            </div>
            {#if collaborators != ""}
                <div class="collaborators-container">
                    <h6>COLLABORATORS</h6>
                    <h4>{collaborators}</h4>
                </div>
            {/if}
            <div class="hardware-container">
                <h6>HARDWARE</h6>
                <h4>{hardware}</h4>
            </div>
            <div class="suggestion-container">
                <h6>SUGGESTIONS</h6>
                <div class="suggestions-scroll">
                    {#each suggestions as suggestion}
                        <SuggestionCard {suggestion} />
                    {/each}
                </div>
            </div>
        </div>
    </div>
{/if}


<style>
    .project-text-container {
        background: white;
        position: relative;
        height: 100vh; /* changed from min-height so it acts as a viewport */
        width: 100%;
        overflow: hidden; /* Disable native scroll, let JS handle the movement */
    }

    .project-text-container-scroll {
        position: absolute;
        width: 100%;
        padding: 60px;
        font-family: 'Schflooze';
        box-sizing: border-box;
    }

    .tags-container h6 {
        padding-bottom: 20px;
        padding-right: 80px;
    }

    .project-text-container h6 {
        color: grey;
        font-family: monospace;
        font-size: 16px;
        font-weight: 400;
        letter-spacing: 1px;
    }

    .title-container h1 {
        color: black;
        font-weight: 500;
        font-size: 44px;
        margin-top: 70px;
    }

    .subtitle-container h2 {
        color: black;
        font-family: 'Schflooze';
        margin-top: 0px;
        font-weight: 400;
        font-size: 21px;
    }

    .tags-container {
        height: 100px;
        margin-top: 40px;
        height: 20px;
        display: flex;
        width: 50%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
    }

    .description-container {
        margin-top: 170px;
    }

    .description-container :global(h1) {
        font-size: 2.5rem;
        font-weight: 700;
        margin: 1.5rem 0 1rem;
        color: black;
    }

    .description-container :global(h2) {
        font-size: 2rem;
        font-weight: 600;
        margin: 1.25rem 0 0.75rem;
    }

    .description-container :global(h3) {
        font-size: 1.5rem;
        font-weight: 600;
        margin: 1rem 0 0.5rem;
    }

    .description-container :global(p) {
        margin: 0.75rem 0;
        font-size: 23px;
        line-height: 1.4;
        font-family: 'Schflooze', sans-serif;
    }

    .description-container :global(strong) {
        font-weight: 600;
    }

    .description-container :global(em) {
        font-style: italic;
    }

    .description-container :global(ul),
    .description-container :global(ol) {
        margin: 1rem 0;
        padding-left: 2rem;
    }

    .description-container :global(li) {
        margin: 0.5rem 0;
    }

    .description-container :global(a) {
        color: #0066cc;
        text-decoration: underline;
    }

    .description-container :global(a:hover) {
        color: #0052a3;
    }

    .description-container :global(blockquote) {
        border-left: 2px solid #ddd;
        padding-left: 3rem;
        margin: 7rem 0 1.5rem 0;
        font-family: monospace;
        font-size: 3rem;
        color: #979797;
        font-style: italic;
    }

    .description-container :global(code) {
        background: #f4f4f4;
        padding: 0.2rem 0.4rem;
        border-radius: 3px;
        font-family: 'Courier New', monospace;
        font-size: 0.9em;
    }

    .description-container :global(pre) {
        background: #f4f4f4;
        padding: 1rem;
        border-radius: 5px;
        overflow-x: auto;
    }

    .description-container :global(img) {
        max-width: 100%;
        height: auto;
        margin: 1rem 0;
        border-radius: 8px;
    }

    .collaborators-container {
        margin-top: 80px;
    }

    .hardware-container {
        margin-top: 60px;
    }

    .collaborators-container h4, .hardware-container h4 {
        font-weight: 400;
        font-size: 16px;
        line-height: 1.45;
    }

    .suggestion-container {
        margin-top: 100px;
        padding-bottom: 80px;
    }

    .suggestions-scroll {
        display: flex;
        gap: 20px;
        overflow-x: auto;
        padding: 20px 0;
        scrollbar-width: none;
    }
</style>