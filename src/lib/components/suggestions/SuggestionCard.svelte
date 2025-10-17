<script>
    import { projectImages } from "$lib/stores/media";
	import { transitionTo } from "$lib/stores/transition";

    let { suggestion } = $props();
    
    let cover = $state(null);

    const navigate = () => {
        transitionTo(`/project/${suggestion.id}`);
    }
    
    $effect(() => {
        const images = $projectImages.get(suggestion.id);

        if (images && images.length > 0) {
            cover = images[0]?.src || null;
        }
    });
</script>

<div 
    class="suggestion" 
    style:--bg-image={cover ? `url(${cover})` : 'none'}
    on:click={navigate}
>
    <h4>{suggestion.title}</h4>
    {#if suggestion.subtitle}
        <p>{suggestion.subtitle}</p>
    {/if}
</div>

<style>
    .suggestion {
        border: 1px solid #000;
        min-width: 300px;
        height: 200px;
        flex-shrink: 0;
        display: flex;
        flex-direction: column;
        padding: 20px;
        box-sizing: border-box;
        position: relative;
        overflow: hidden;
        cursor: pointer;
        background-color: white; /* Default background */
        background-size: cover;
        background-position: center;
        transition: background-image 0.3s ease;
    }

    /* Initially no background image */
    .suggestion {
        background-image: none;
    }

    /* Show background image on hover */
    .suggestion:hover {
        background-image: var(--bg-image);
        color: white;
    }

    .suggestion h4 {
        margin: 0 0 10px 0;
        font-family: 'Schflooze';
        transition: color 0.3s ease;
        position: relative;
        z-index: 1;
    }

    .suggestion p {
        margin: 0;
        font-size: 14px;
        color: #666;
        transition: color 0.3s ease;
        position: relative;
        z-index: 1;
    }

    .suggestion:hover h4,
    .suggestion:hover p {
        color: white;
    }
</style>