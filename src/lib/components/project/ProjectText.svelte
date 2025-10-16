<script>
    import { projectsById } from "$lib/stores/projects";
    import { selectedId } from "$lib/stores/ui";
    
    const currentProject = $derived($projectsById.get($selectedId));
</script>

<div class="project-text-container">
    <div class="path-container">
        <h6>PROJECT</h6>
    </div>
</div>


<style>
    .project-text-container {
        height: 100%;
        width: 100%;
        padding: 60px;
        box-sizing: border-box;
    }

    .path-container {
        height: 30px;
    }

    .path-container h6 {
        color: grey;
        font-family: monospace;
        font-size: 11px;
        font-weight: 400;
        letter-spacing: 1px;
    }
</style>