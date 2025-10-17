<script>
	import { animationState } from "$lib/draw/anim.svelte";
</script>

<header style:opacity={animationState.headerT}>
    <div id="logo">JEROEN MEIJER</div>
    <div id="menu">

    </div>
</header>

<style>
    header {
        position: fixed;
        top: 0;
        left: 0;
        margin: 0;
        padding: 0;
        background: transparent;
        display: flex;
        justify-content: space-between;
        align-items: center;
        height: 70px;
        width: 100%;
        z-index: 999;
    }

    header #logo {
        padding: 0 30px;
        color: black;
        font-family: 'Inter';
        font-weight: 500;
        font-size: 17px;
        letter-spacing: 4px;
        text-transform: lowercase;
    }

    header #menu {
        padding: 0 20px;
        color: black;
        font-family: 'Inter';
        font-weight: 400;
        font-size: 15px;
    }
</style>