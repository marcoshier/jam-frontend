<script>
	import { isComplete, progress } from "$lib/stores/media";
</script>

{#if !get(isComplete)}
    <div class="loader-container">
        <p>{Math.round(get(progress))}%</p>
    </div>
{/if}

<style>
    .loader-container {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: gainsboro;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 9999;
    }

    .loader-container p {
        font-family: 'Inter';
        font-size: 1rem;
    }
</style>