<script>
	import { animationState } from "$lib/draw/anim.svelte";
</script>

<header style:opacity={animationState.headerT}>
    <div id="logo">Jeroen Meijer</div>
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
        font-family: 'Schflooze';
        font-weight: 500;
        font-size: 17px;
    }

    header #menu {
        padding: 0 20px;
        color: black;
        font-family: 'Schflooze';
        font-weight: 400;
        font-size: 15px;
    }

    @media only screen and (max-width: 600px) {
        header {
            height: 59px;
        }

        header #logo {
            top: 0;
            padding: 9px 21px;
        }

        header #menu {
            padding: 0 15px;
        }
    }
</style>